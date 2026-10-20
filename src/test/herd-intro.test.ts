import { describe, expect, it } from 'vitest';
import { INTRO_CLIP_COUNT, nextIntroStage } from '@/lib/herd-intro';

describe('opening sequence order', () => {
  it('plays the second film after the sheep intro', () => {
    expect(nextIntroStage(0)).toBe(1);
  });

  it('ends the sequence after the last film', () => {
    expect(nextIntroStage(INTRO_CLIP_COUNT - 1)).toBeNull();
  });
});
