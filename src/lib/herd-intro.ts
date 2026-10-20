// Browser-safe helper for the opening sequence order.
// The intro films play one after another before the app itself appears.

export const INTRO_CLIP_COUNT = 2;

/**
 * Which film should play after `stage` finishes.
 * Returns the next stage index, or null when the sequence is over.
 */
export function nextIntroStage(stage: number, total: number = INTRO_CLIP_COUNT): number | null {
  return stage + 1 < total ? stage + 1 : null;
}
