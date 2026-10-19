/**
 * Where the app lands once the opening film is dismissed.
 *
 * A signed-out visitor who arrives on the main screen has just installed the
 * app, so they get the welcome/log-in screen first. Anyone who is already
 * signed in, or who opened a deep link to another tab, stays where they are.
 */
export function entryAfterOpening(pathname: string, signedIn: boolean): '/join' | null {
  return !signedIn && pathname === '/' ? '/join' : null;
}
