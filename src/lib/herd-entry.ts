/**
 * The opening film plays once per install. After it is watched or skipped,
 * a flag in device storage keeps it from ever playing again on this device.
 */
export const OPENING_SEEN_KEY = 'herd-opening-seen';

type Store = Pick<Storage, 'getItem' | 'setItem'>;

export function hasSeenOpening(store: Store | null | undefined): boolean {
  try { return store?.getItem(OPENING_SEEN_KEY) === '1'; } catch { return false; }
}

export function markOpeningSeen(store: Store | null | undefined): void {
  try { store?.setItem(OPENING_SEEN_KEY, '1'); } catch { /* storage blocked */ }
}

/** Actions that need an account; watching and scrolling never do. */
export type GatedAction = 'heart' | 'follow' | 'comment';
export function needsSignIn(_action: GatedAction, signedIn: boolean): boolean {
  return !signedIn;
}
