import { describe, it, expect } from 'vitest';
import { isOldEnough } from '@/lib/../components/herd/me';
const today = new Date(2026, 9, 12);
describe('sign-up age limit (13+)', () => {
  it('accepts someone turning 13 today', () => expect(isOldEnough('2013-10-12', today)).toBe(true));
  it('rejects someone turning 13 tomorrow', () => expect(isOldEnough('2013-10-13', today)).toBe(false));
});
