import { describe, expect, it } from 'vitest';
import { checklist, isValidReleaseDate, UPLOAD_SECTIONS } from '@/lib/herd-portal';

const today = new Date(2026, 9, 22);
describe('release date rule', () => {
  it('accepts a song released 5 months ago', () => expect(isValidReleaseDate('2026-05-22', today)).toBe(true));
  it('rejects a song released 7 months ago', () => expect(isValidReleaseDate('2026-03-22', today)).toBe(false));
  it('accepts an upcoming release date', () => expect(isValidReleaseDate('2027-01-10', today)).toBe(true));
});

describe('upload sections', () => {
  it('offers Upload only, with no Artwork or Horizontals', () => {
    expect(UPLOAD_SECTIONS.map(s => [s.id, s.title])).toEqual([['upload', 'Upload']]);
  });
  it('asks the checklist for a vertical press photo but never a horizontal one', () => {
    const page = { tagline: '', hometown: '', website: '', instagram: '', tiktok: '', youtube: '', spotify: '', color: '' };
    expect(checklist('bio', page, []).map(i => i.label)).toEqual([
      'Bio', 'Press photo — vertical', 'Social links', 'Cover artwork', 'Vertical music video',
    ]);
  });
});
