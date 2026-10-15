import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Exercise the actual pure rendering module without adding a test framework or app dependency.
const source = await readFile(new URL('../lib/dither/render.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const renderer = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const electric = JSON.parse(await readFile(new URL('../lib/dither/presets/electric-gaze.json', import.meta.url), 'utf8'));
const ink = JSON.parse(await readFile(new URL('../lib/dither/presets/ink-garden.json', import.meta.url), 'utf8'));

test('runtime presets are byte-identical to supplied originals and retain only the two intended differences', async () => {
  for (const name of ['electric-gaze', 'ink-garden']) assert.deepEqual(
    await readFile(new URL(`../lib/dither/presets/${name}.json`, import.meta.url)),
    await readFile(new URL(`../reference/dither/${name}.original.json`, import.meta.url)),
  );
  assert.equal(electric.animStyle, 'shimmer'); assert.equal(ink.animStyle, 'pulse');
  assert.equal(electric.mask.showOverlay, false); assert.equal(ink.mask.showOverlay, true);
  assert.deepEqual({ ...electric, animStyle: ink.animStyle, mask: ink.mask }, ink);
});

test('cover crop preserves aspect ratio and matches the mobile focal position', () => {
  const crop = renderer.coverCrop(1536, 864, 390, 844, .55, .5);
  assert.ok(Math.abs(crop.sw / crop.sh - 390 / 844) < .00001);
  assert.equal(crop.sh, 864); assert.equal(crop.sx, (1536 - crop.sw) * .55);
  assert.deepEqual(renderer.coverCrop(1536, 864, 1536, 864), { sx: 0, sy: 0, sw: 1536, sh: 864 });
});

test('pixel means use all pixels in partial edge cells, then apply supplied contrast', () => {
  const pixels = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255]);
  const grid = renderer.sampleCells(pixels, 3, 1, 2, electric);
  assert.equal(grid.columns, 2); assert.equal(grid.rows, 1);
  const average = renderer.adjustColor(127.5, 127.5, 0, electric);
  assert.deepEqual([...grid.colors.slice(0, 3)], [average.r, average.g, average.b]);
  assert.deepEqual([...grid.colors.slice(3)], [0, 0, 255]);
});

test('tone, saturation, contrast and inactive tint preserve expected colors', () => {
  assert.equal(renderer.tone(.5, electric.toneCurve), .5);
  assert.equal(renderer.tone(.5, [{ x: 0, y: 0 }, { x: .5, y: .8 }, { x: 1, y: 1 }]), .8);
  const neutral = { ...electric, contrast: 100 };
  const sourceColor = renderer.adjustColor(198, 80, 30, neutral);
  assert.deepEqual([sourceColor.r, sourceColor.g, sourceColor.b], [198, 80, 30]);
  assert.deepEqual(renderer.adjustColor(198, 80, 30, { ...neutral, tint: '#ff00ff' }), sourceColor);
  const gray = renderer.adjustColor(198, 80, 30, { ...neutral, saturation: 0 });
  assert.equal(gray.r, gray.g); assert.equal(gray.g, gray.b);
  const inverted = renderer.adjustColor(198, 80, 30, { ...neutral, invert: true });
  assert.deepEqual([inverted.r, inverted.g, inverted.b], [57, 175, 225]);
});

test('actual ordered dither leaves transparent gaps and density/coverage alter the pattern', () => {
  const grid = { columns: 1, rows: 1, colors: new Uint8ClampedArray([140, 100, 70]), luminance: new Float32Array([.5]) };
  const draw = preset => { const data = new Uint8ClampedArray(64); renderer.drawDitherPixels(data, grid, { ...preset, animated: false }, 0); return data; };
  const pattern = draw(electric), alpha = [...pattern].filter((_, i) => i % 4 === 3);
  assert.ok(alpha.includes(0)); assert.ok(alpha.includes(255));
  assert.notDeepEqual(draw({ ...electric, density: 100 }), pattern);
  assert.ok([...draw({ ...electric, coverage: 0 })].filter((_, i) => i % 4 === 3).every(value => value === 0));
  const painted = alpha.findIndex(value => value === 255) * 4;
  assert.deepEqual([...pattern.slice(painted, painted + 3)], [140, 100, 70]);
});

test('shimmer varies locally while pulse is uniform and both are restrained', () => {
  assert.notEqual(renderer.animationOffset(electric, 1, 2, 3), renderer.animationOffset(electric, 1, 20, 30));
  assert.equal(renderer.animationOffset(ink, 1, 2, 3), renderer.animationOffset(ink, 1, 20, 30));
  for (let time = 0; time < 20; time += .1) for (const preset of [electric, ink]) assert.ok(Math.abs(renderer.animationOffset(preset, time, 2, 3)) <= .02701);
  assert.equal(renderer.animationOffset({ ...electric, animated: false }, 1, 2, 3), 0);
  assert.equal(renderer.animationOffset({ ...electric, animIntensity: { enabled: true, intensity: 0 } }, 1, 2, 3), 0);
});

test('backing area stays bounded and inactive mask overlay does not activate a mask', () => {
  assert.ok(renderer.backingScale(1920, 1080, 3) ** 2 * 1920 * 1080 <= 2_500_001);
  assert.equal(renderer.backingScale(390, 844, 3), 1.5);
  renderer.validatePreset(electric); renderer.validatePreset(ink);
  assert.throws(() => renderer.validatePreset({ ...ink, mask: { ...ink.mask, enabled: true } }), /Unsupported/);
});
