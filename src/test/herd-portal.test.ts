import { describe, expect, it } from 'vitest';
import { isValidReleaseDate } from '@/lib/herd-portal';

const today = new Date(2026, 9, 22);
describe('release date rule', () => {
  it('accepts a song released 5 months ago', () => expect(isValidReleaseDate('2026-05-22', today)).toBe(true));
  it('rejects a song released 7 months ago', () => expect(isValidReleaseDate('2026-03-22', today)).toBe(false));
  it('accepts an upcoming release date', () => expect(isValidReleaseDate('2027-01-10', today)).toBe(true));
});
