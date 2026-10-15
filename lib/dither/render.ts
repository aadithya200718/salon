import type { DitherPreset } from './types';

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const MICRO = 4;

export function coverCrop(sourceWidth: number, sourceHeight: number, width: number, height: number, x = .5, y = .5) {
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const sw = width / scale, sh = height / scale;
  return { sx: (sourceWidth - sw) * x, sy: (sourceHeight - sh) * y, sw, sh };
}

export function tone(value: number, curve: DitherPreset['toneCurve']) {
  if (!curve.length) return clamp(value);
  const points = [...curve].sort((a, b) => a.x - b.x);
  if (value <= points[0].x) return clamp(points[0].y);
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    if (value <= b.x) return clamp(a.y + (b.y - a.y) * ((value - a.x) / Math.max(.00001, b.x - a.x)));
  }
  return clamp(points[points.length - 1].y);
}

export function adjustColor(red: number, green: number, blue: number, preset: DitherPreset) {
  let r = red / 255, g = green / 255, b = blue / 255;
  const luma = .2126 * r + .7152 * g + .0722 * b;
  const saturation = preset.saturation / 100 * (1 - preset.grayscale / 100);
  r = luma + (r - luma) * saturation;
  g = luma + (g - luma) * saturation;
  b = luma + (b - luma) * saturation;
  const adjust = (channel: number) => tone(clamp((channel - .5) * preset.contrast / 100 + .5 + preset.brightness / 100), preset.toneCurve);
  r = adjust(r); g = adjust(g); b = adjust(b);
  // A named tint with zero opacity must never change the photograph's colors.
  if (preset.tintOpacity > 0) {
    const tint = parseInt(preset.tint.replace('#', ''), 16), amount = clamp(preset.tintOpacity / 100);
    const blend = (source: number, target: number) => source * (1 - amount) + (preset.overlayBlend === 'multiply' ? source * target : target) * amount;
    r = blend(r, ((tint >> 16) & 255) / 255); g = blend(g, ((tint >> 8) & 255) / 255); b = blend(b, (tint & 255) / 255);
  }
  if (preset.invert) { r = 1 - r; g = 1 - g; b = 1 - b; }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), luminance: .2126 * r + .7152 * g + .0722 * b };
}

export type SampleGrid = { columns: number; rows: number; colors: Uint8ClampedArray; luminance: Float32Array };

/** Pixel means are sampled once at resize, never inside the animation loop. */
export function sampleCells(pixels: Uint8ClampedArray, width: number, height: number, cellSize: number, preset: DitherPreset): SampleGrid {
  const columns = Math.ceil(width / cellSize), rows = Math.ceil(height / cellSize);
  const colors = new Uint8ClampedArray(columns * rows * 3), luminance = new Float32Array(columns * rows);
  for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < columns; cx++) {
    let r = 0, g = 0, b = 0, count = 0;
    for (let y = cy * cellSize; y < Math.min(height, (cy + 1) * cellSize); y++) for (let x = cx * cellSize; x < Math.min(width, (cx + 1) * cellSize); x++) {
      const offset = (y * width + x) * 4;
      r += pixels[offset]; g += pixels[offset + 1]; b += pixels[offset + 2]; count++;
    }
    const color = adjustColor(r / count, g / count, b / count, preset), index = cy * columns + cx;
    colors.set([color.r, color.g, color.b], index * 3); luminance[index] = color.luminance;
  }
  return { columns, rows, colors, luminance };
}

/** Gentle continuous variation: spatial shimmer versus a slow, uniform breathing pulse. */
export function animationOffset(preset: DitherPreset, seconds: number, x: number, y: number) {
  if (!preset.animated) return 0;
  const speed = preset.animSpeed.enabled ? preset.animSpeed.intensity / 100 : 1;
  const amplitude = (preset.animIntensity.enabled ? preset.animIntensity.intensity / 100 : 1) * .045;
  if (!amplitude) return 0;
  return amplitude * (preset.animStyle === 'pulse'
    ? Math.sin(seconds * speed * Math.PI / 3)
    : Math.sin(x * .29 + y * .19 + seconds * speed * .85) * Math.sin(y * .13 - seconds * speed * .45));
}

export function dotCoverage(luminance: number, density: number) {
  // Both light and dark source marks remain legible on a transparent background.
  return clamp(.48 + Math.abs(luminance - .5) * .82 + density / 500, .05, .98);
}

/** Reuses the same small ImageData buffer on every frame. No full resolution readback. */
export function drawDitherPixels(target: Uint8ClampedArray, grid: SampleGrid, preset: DitherPreset, seconds: number) {
  const pixelWidth = grid.columns * MICRO;
  for (let cy = 0; cy < grid.rows; cy++) for (let cx = 0; cx < grid.columns; cx++) {
    const index = cy * grid.columns + cx, rgb = index * 3;
    const covered = ((cx * 37 + cy * 17) % 100) < preset.coverage;
    const threshold = dotCoverage(grid.luminance[index], preset.density) + animationOffset(preset, seconds, cx, cy);
    for (let dy = 0; dy < MICRO; dy++) for (let dx = 0; dx < MICRO; dx++) {
      const offset = ((cy * MICRO + dy) * pixelWidth + cx * MICRO + dx) * 4;
      target[offset] = grid.colors[rgb]; target[offset + 1] = grid.colors[rgb + 1]; target[offset + 2] = grid.colors[rgb + 2];
      target[offset + 3] = covered && (BAYER[dy * MICRO + dx] + .5) / 16 < threshold ? 255 : 0;
    }
  }
}

export function backingScale(width: number, height: number, dpr: number) {
  return Math.min(Math.max(1, dpr), 1.5, Math.sqrt(2_500_000 / Math.max(1, width * height)));
}

export function validatePreset(preset: DitherPreset) {
  // This intentionally supports the supplied dither presets, not the editor's other modes.
  // Future enabled effects need their own implementation rather than silently approximating them.
  if (preset.renderMode !== 'dither' || preset.bgMode !== 'none' || preset.blurType !== 'off' || preset.lights.enabled || preset.mask.enabled || Object.values(preset.pfx).some(effect => effect.enabled)) throw new Error('Unsupported enabled dither feature');
}
