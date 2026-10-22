import type { Me } from '@/components/herd/me';

/** Prototype role gating; production access must be verified server-side. */
export function canOpenArtistPortal(me: Pick<Me, 'role'> | null) {
  return me?.role === 'musician';
}