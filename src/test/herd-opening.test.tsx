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
  it('plays again on every fresh load, even after it was watched', () => {
    const first = renderHook(useOpeningVideo, { wrapper: OpeningVideoProvider });
    act(() => first.result.current.finish());
    first.unmount();
    const reloaded = renderHook(useOpeningVideo, { wrapper: OpeningVideoProvider });
    expect(reloaded.result.current.active).toBe(true);
  });
});
