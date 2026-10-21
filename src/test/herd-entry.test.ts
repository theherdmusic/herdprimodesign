import { describe, expect, it } from 'vitest';
import { hasSeenOpening, markOpeningSeen, needsSignIn } from '@/lib/herd-entry';

const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); } }; };

describe('Opening film plays once per install', () => {
  it('plays on a fresh install', () => {
    expect(hasSeenOpening(mem())).toBe(false);
  });
  it('never plays again once seen', () => {
    const s = mem();
    markOpeningSeen(s);
    expect(hasSeenOpening(s)).toBe(true);
  });
});

describe('Sign-in is only asked for hearts, follows and comments', () => {
  it('asks a signed-out viewer to sign in to heart', () => {
    expect(needsSignIn('heart', false)).toBe(true);
  });
  it('lets a signed-in viewer comment freely', () => {
    expect(needsSignIn('comment', true)).toBe(false);
  });
});
