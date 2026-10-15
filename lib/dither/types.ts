import type electricGaze from './presets/electric-gaze.json';

// Keep the original editor schema intact, including its currently inactive fields.
export type DitherPreset = typeof electricGaze;
export type ArtworkName = 'electric-gaze' | 'ink-garden';

export const artworkSources: Record<ArtworkName, string> = {
  'electric-gaze': '/ascii-editor/demos/generated/ref-002.webp',
  'ink-garden': '/ascii-editor/demos/generated/ref-029.webp',
};
