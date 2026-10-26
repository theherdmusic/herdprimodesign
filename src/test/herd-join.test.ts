import { describe, expect, it } from 'vitest';
import { validatePersonal, type PersonalInfo } from '@/lib/herd-join';

const FULL: PersonalInfo = { first: 'Mario', last: 'Castillo', address: '12 Herd Ln', city: 'Nashville', state: 'TN', zip: '37201', phone: '6155550123' };
const OK = (over: Partial<PersonalInfo> = {}, email = 'mario@example.com', captcha: [number, number] = [3, 4], answer = '7', name = 'Mario', label = 'name') =>
  validatePersonal(name, label, { ...FULL, ...over }, email, captcha, answer);

describe('sign-up personal details (fan and artist share these rules)', () => {
  it('accepts a complete form with the right captcha answer', () => {
    expect(OK()).toBe('');
  });

  it('rejects a missing display name with its own label', () => {
    expect(OK({}, 'mario@example.com', [3, 4], '7', '', 'artist name')).toBe('Add your artist name.');
    expect(OK({}, 'mario@example.com', [3, 4], '7', '', 'name')).toBe('Add your name.');
  });

  it('rejects a 4-digit ZIP', () => {
    expect(OK({ zip: '3721' })).toBe('Enter a valid ZIP code.');
  });

  it('rejects a 9-digit phone number', () => {
    expect(OK({ phone: '615555012' })).toBe('Enter a valid phone number.');
  });

  it('rejects a wrong captcha answer', () => {
    expect(OK({}, 'mario@example.com', [3, 4], '8')).toBe('Captcha answer is wrong. Try the new one.');
  });

  it('rejects an email with no domain', () => {
    expect(OK({}, 'mario@')).toBe('Enter a valid email.');
  });
});
