import { describe, expect, it } from 'vitest';
import { needsSignIn } from '@/lib/herd-entry';

describe('Sign-in is only asked for hearts, follows and comments', () => {
  it('asks a signed-out viewer to sign in to heart', () => {
    expect(needsSignIn('heart', false)).toBe(true);
  });
  it('lets a signed-in viewer comment freely', () => {
    expect(needsSignIn('comment', true)).toBe(false);
  });
});
