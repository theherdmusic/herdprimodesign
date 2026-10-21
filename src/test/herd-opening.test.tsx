import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { OpeningVideoProvider, useOpeningVideo } from '@/components/herd/opening-video';

describe('Opening video lifecycle', () => {
  beforeEach(() => localStorage.clear());
  it('plays on a fresh install', () => {
    const { result } = renderHook(useOpeningVideo, { wrapper: OpeningVideoProvider });
    expect(result.current.active).toBe(true);
  });
  it('stays dismissed across rerenders during navigation', () => {
    const { result, rerender } = renderHook(useOpeningVideo, { wrapper: OpeningVideoProvider });
    act(() => result.current.finish());
    rerender();
    expect(result.current.active).toBe(false);
  });
  it('does not play again after a refresh once seen', () => {
    const first = renderHook(useOpeningVideo, { wrapper: OpeningVideoProvider });
    act(() => first.result.current.finish());
    first.unmount();
    const refreshed = renderHook(useOpeningVideo, { wrapper: OpeningVideoProvider });
    expect(refreshed.result.current.active).toBe(false);
  });
});
