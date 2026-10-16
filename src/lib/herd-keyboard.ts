import { useEffect } from 'react';

// Keeps overlays (comments, search results) inside the visible screen while the
// on-screen keyboard is open. Writes --keyboard-inset on <html> so CSS can lift
// bottom-anchored panels above the keyboard instead of letting them slide out of
// view. Safe for SSR: window is only touched inside useEffect.
export function useKeyboardInset() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const root = document.documentElement;
    const read = () => {
      const inset = Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
      root.style.setProperty('--keyboard-inset', `${inset}px`);
    };
    read();
    viewport.addEventListener('resize', read);
    viewport.addEventListener('scroll', read);
    return () => {
      viewport.removeEventListener('resize', read);
      viewport.removeEventListener('scroll', read);
      root.style.setProperty('--keyboard-inset', '0px');
    };
  }, []);
}
