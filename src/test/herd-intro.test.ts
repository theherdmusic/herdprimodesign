import { describe, expect, it } from 'vitest';
import { INTRO_CLIP_COUNT, nextIntroStage } from '@/lib/herd-intro';

describe('opening sequence order', () => {
  it('opens with the single intro film only', () => {
    expect(INTRO_CLIP_COUNT).toBe(1);
  });

  it('ends the sequence as soon as that film finishes', () => {
    expect(nextIntroStage(0)).toBeNull();
  });
});
