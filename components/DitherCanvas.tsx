'use client';

import { useEffect, useRef } from 'react';
import electricGaze from '@/lib/dither/presets/electric-gaze.json';
import inkGarden from '@/lib/dither/presets/ink-garden.json';
import { artworkSources, type ArtworkName } from '@/lib/dither/types';
import { backingScale, coverCrop, drawDitherPixels, MICRO, sampleCells, validatePreset, type SampleGrid } from '@/lib/dither/render';

const decodedImages = new Map<string, Promise<HTMLImageElement>>();
function loadImage(source: string) {
  let pending = decodedImages.get(source);
  if (!pending) {
    pending = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => image.decode().then(() => resolve(image), reject);
      image.onerror = () => reject(new Error('Artwork image unavailable'));
      image.src = source;
    });
    decodedImages.set(source, pending);
    pending.catch(() => decodedImages.delete(source));
  }
  return pending;
}

type CapableNavigator = Navigator & { deviceMemory?: number; connection?: EventTarget & { saveData?: boolean } };

export default function DitherCanvas({ name }: { name: ArtworkName }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, host = canvas?.parentElement;
    if (!canvas || !host) return;
    const preset = name === 'electric-gaze' ? electricGaze : inkGarden;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 600px)');
    const nav = navigator as CapableNavigator;
    let disposed = false, visible = false, image: HTMLImageElement | undefined;
    let frame = 0, timer: ReturnType<typeof setTimeout> | undefined, frames = 0;
    let previousTime = 0, elapsed = 0, lastPaint = 0;
    let grid: SampleGrid | undefined, buffer: ImageData | undefined;
    let width = 0, height = 0;
    const output = document.createElement('canvas');
    const outputContext = output.getContext('2d');
    const context = canvas.getContext('2d', { alpha: true });
    const sourceCanvas = document.createElement('canvas');
    const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
    const lowPower = () => Boolean(nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2));
    const pauseReason = () => motion.matches ? 'reduced-motion' : lowPower() ? 'low-power' : document.hidden ? 'document-hidden' : !visible ? 'outside-viewport' : '';
    const fail = () => {
      if (disposed) return;
      cancelAnimationFrame(frame); frame = 0;
      host.dataset.render = 'fallback'; host.dataset.running = 'false'; host.dataset.pauseReason = 'unavailable';
    };
    const paint = (time: number) => {
      if (!context || !outputContext || !buffer || !grid) return;
      drawDitherPixels(buffer.data, grid, preset, time);
      outputContext.putImageData(buffer, 0, 0);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = preset.styleBlend as GlobalCompositeOperation;
      context.imageSmoothingEnabled = false;
      // The last partially sampled cell is clipped, so the grid always stays 9 CSS px.
      context.drawImage(output, 0, 0, grid.columns * preset.cellSize, grid.rows * preset.cellSize);
      frames++;
      if (frames === 1 || frames % 24 === 0) host.dataset.frames = String(frames);
      host.dataset.render = 'ready';
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || pauseReason() || !grid) return;
      if (previousTime) elapsed += Math.min(now - previousTime, 100);
      previousTime = now;
      if (now - lastPaint >= 1000 / 24) {
        try { paint(elapsed / 1000); lastPaint = now; } catch { fail(); return; }
      }
      frame = requestAnimationFrame(tick);
    };
    const updateActivity = () => {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      const reason = pauseReason();
      host.dataset.pauseReason = reason;
      const running = !reason && !!grid && preset.animated;
      host.dataset.running = String(running);
      if (running) frame = requestAnimationFrame(tick);
      else if (grid) { try { paint(0); } catch { fail(); } }
    };
    const resize = () => {
      if (disposed || !image || !context || !sourceContext || !outputContext) return;
      try {
        width = Math.max(1, Math.round(host.clientWidth)); height = Math.max(1, Math.round(host.clientHeight));
        const scale = backingScale(width, height, window.devicePixelRatio || 1);
        canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
        context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        // Limit source readback for exceptionally large viewports while retaining 9 px output cells.
        const sampleScale = Math.min(1, Math.sqrt(2_500_000 / (width * height)));
        const cellSize = Math.max(1, Math.floor(preset.cellSize * sampleScale));
        const sampleWidth = Math.ceil(width * cellSize / preset.cellSize);
        const sampleHeight = Math.ceil(height * cellSize / preset.cellSize);
        sourceCanvas.width = sampleWidth; sourceCanvas.height = sampleHeight;
        const position = name === 'electric-gaze' ? (mobile.matches ? [.55, .5] : [.5, .46]) : (mobile.matches ? [.35, .5] : [.5, .5]);
        const crop = coverCrop(image.naturalWidth, image.naturalHeight, width, height, position[0], position[1]);
        sourceContext.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, sampleWidth, sampleHeight);
        grid = sampleCells(sourceContext.getImageData(0, 0, sampleWidth, sampleHeight).data, sampleWidth, sampleHeight, cellSize, preset);
        output.width = grid.columns * MICRO; output.height = grid.rows * MICRO;
        buffer = outputContext.createImageData(output.width, output.height);
        host.dataset.resolution = `${canvas.width}x${canvas.height}`;
        host.dataset.grid = `${grid.columns}x${grid.rows}`;
        paint(0); updateActivity();
      } catch { fail(); }
    };
    const scheduleResize = () => { clearTimeout(timer); timer = setTimeout(resize, 100); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateActivity(); });
    const resizeObserver = new ResizeObserver(scheduleResize);
    observer.observe(host); resizeObserver.observe(host);
    motion.addEventListener('change', updateActivity); mobile.addEventListener('change', scheduleResize);
    window.addEventListener('resize', scheduleResize);
    document.addEventListener('visibilitychange', updateActivity);
    nav.connection?.addEventListener('change', updateActivity);
    host.dataset.cellSize = String(preset.cellSize); host.dataset.animation = preset.animStyle;
    try {
      validatePreset(preset);
      if (!context || !sourceContext || !outputContext) { fail(); }
      else loadImage(artworkSources[name]).then(decoded => { if (!disposed) { image = decoded; resize(); } }, fail);
    } catch { fail(); }
    return () => {
      disposed = true; cancelAnimationFrame(frame); clearTimeout(timer);
      observer.disconnect(); resizeObserver.disconnect();
      motion.removeEventListener('change', updateActivity); mobile.removeEventListener('change', scheduleResize);
      window.removeEventListener('resize', scheduleResize);
      document.removeEventListener('visibilitychange', updateActivity);
      nav.connection?.removeEventListener('change', updateActivity);
      grid = undefined; buffer = undefined;
      output.width = output.height = sourceCanvas.width = sourceCanvas.height = 0;
    };
  }, [name]);
  return <canvas ref={ref} className="dither-canvas" aria-hidden="true" />;
}
