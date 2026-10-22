/** Artist portal rules copied from the Herd artist dashboard. */
export type UploadKind = 'photo-vertical' | 'photo-horizontal' | 'cover' | 'audio' | 'video';
export const UPLOAD_KINDS: { id: UploadKind; label: string; hint: string; accept: string }[] = [
  { id: 'photo-vertical', label: 'Press photo vertical', hint: 'A real photo, not artwork. Vertical.', accept: 'image/*' },
  { id: 'photo-horizontal', label: 'Press photo horizontal', hint: 'A real photo, not artwork. Horizontal.', accept: 'image/*' },
  { id: 'cover', label: 'Cover artwork', hint: 'Square artwork for your song.', accept: 'image/*' },
  { id: 'audio', label: 'Audio', hint: 'Your song file.', accept: 'audio/*' },
  { id: 'video', label: 'Vertical music video', hint: '9:16 music video, up to 1 minute.', accept: 'video/*' },
];
export type UploadSection = 'verticals' | 'horizontals' | 'artwork';
export const UPLOAD_SECTIONS: { id: UploadSection; title: string; sub: string; kinds: UploadKind[] }[] = [
  { id: 'verticals', title: 'Verticals', sub: 'Vertical music videos and press photos', kinds: ['video', 'photo-vertical'] },
  { id: 'horizontals', title: 'Horizontals', sub: 'Horizontal press photos', kinds: ['photo-horizontal'] },
  { id: 'artwork', title: 'Artwork', sub: 'Cover artwork for your songs', kinds: ['cover'] },
];
export const MAX_PORTAL_VIDEO_SECONDS = 60;
export const MAX_PORTAL_FILE_BYTES = 1024 ** 3;

/** Songs can't be more than 6 months old; future release dates are allowed. */
export function isValidReleaseDate(date: string, today = new Date()) {
  const d = new Date(date + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  return d >= cutoff;
}

export type ArtistPage = { tagline: string; hometown: string; website: string; instagram: string; tiktok: string; youtube: string; spotify: string; color: string };
export type PortalUpload = { kind: UploadKind; title: string; description: string; releaseDate: string; fileName: string };

export function checklist(bio: string, page: ArtistPage, uploads: PortalUpload[]) {
  const has = (k: UploadKind) => uploads.some(u => u.kind === k);
  return [
    { label: 'Bio', done: !!bio.trim() },
    { label: 'Press photo — vertical', done: has('photo-vertical') },
    { label: 'Press photo — horizontal', done: has('photo-horizontal') },
    { label: 'Social links', done: [page.website, page.instagram, page.tiktok, page.youtube, page.spotify].some(s => s.trim()) },
    { label: 'Cover artwork', done: has('cover') },
    { label: 'Audio', done: has('audio') },
    { label: 'Vertical music video', done: has('video') },
  ];
}
