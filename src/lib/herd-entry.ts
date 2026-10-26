/**
 * The opening film plays on every fresh load of the app; finishing or
 * skipping dismisses it for that visit only.
 */
export type GatedAction = 'heart' | 'follow' | 'comment';
export function needsSignIn(_action: GatedAction, signedIn: boolean): boolean {
  return !signedIn;
}
