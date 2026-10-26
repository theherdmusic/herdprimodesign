import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { routeTree } from '@/routeTree.gen';
import * as PS from '@/components/herd/phone-shell';
import * as OV from '@/components/herd/opening-video';
import * as ME from '@/components/herd/me';
import * as FS from '@/components/herd/feed-screen';
const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ['/'] }), context: { queryClient: new QueryClient() } });
describe('diag', () => {
  it('lists undefined exports', () => {
    console.log('router.Provider', typeof (router as unknown as { Provider?: unknown }).Provider);
    console.log('RouterProvider', typeof RouterProvider);
    console.log('phone-shell', Object.keys(PS).map(k => `${k}:${typeof (PS as never)[k]}`).join(' '));
    console.log('opening-video', Object.keys(OV).map(k => `${k}:${typeof (OV as never)[k]}`).join(' '));
    console.log('me', Object.keys(ME).map(k => `${k}:${typeof (ME as never)[k]}`).join(' '));
    console.log('feed-screen', Object.keys(FS).map(k => `${k}:${typeof (FS as never)[k]}`).join(' '));
    expect(true).toBe(true);
  });
});
