import { describe, expect, it } from 'vitest';
import { entryAfterOpening } from '@/lib/herd-entry';

describe('Entry screen after the opening film', () => {
  it('sends a signed-out visitor on the main screen to the welcome screen', () => {
    expect(entryAfterOpening('/', false)).toBe('/join');
  });
  it('keeps a signed-in visitor on the main screen', () => {
    expect(entryAfterOpening('/', true)).toBeNull();
  });
  it('leaves visitors who opened another tab where they are', () => {
    expect(entryAfterOpening('/charts', false)).toBeNull();
    expect(entryAfterOpening('/join', false)).toBeNull();
  });
});
