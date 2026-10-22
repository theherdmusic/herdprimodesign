import { describe, expect, it } from 'vitest';
import { canOpenArtistPortal } from '@/lib/herd-profile';

describe('Artist Portal access', () => {
  it('does not give fans an artist portal', () => {
    expect(canOpenArtistPortal({ role: 'fan' })).toBe(false);
  });
  it('gives artists an artist portal', () => {
    expect(canOpenArtistPortal({ role: 'musician' })).toBe(true);
  });
  it('does not give signed-out visitors an artist portal', () => {
    expect(canOpenArtistPortal(null)).toBe(false);
  });
});