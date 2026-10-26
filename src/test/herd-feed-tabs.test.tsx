import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { routeTree } from '@/routeTree.gen';
import { artists } from '@/components/herd/data';
import { feedRankedIndexes } from '@/lib/herd-charts';

// jsdom has no media playback, so play() must resolve the way a browser's does.
HTMLMediaElement.prototype.play = function () {
  return Promise.resolve();
};
HTMLMediaElement.prototype.pause = function () {};

async function renderFeed() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

function tabLabels() {
  return Array.from(document.querySelectorAll('.feed-mode')).map((b) => b.textContent);
}

function tabByName(label: string) {
  return tabLabels().indexOf(label);
}

// Sample hearts are written like "12.8K"; read them the same way the app ranks.
function hearts(artist: (typeof artists)[number]) {
  const m = /^([\d.]+)\s*([KkMm]?)$/.exec(artist.hearts.trim());
  const mult = (m?.[2] ?? '').toUpperCase() === 'K' ? 1_000 : (m?.[2] ?? '').toUpperCase() === 'M' ? 1_000_000 : 1;
  return parseFloat(m?.[1] ?? '0') * mult;
}

describe('Feed tabs', () => {
  it('lists Discovery first, then TOP 100, then Following', async () => {
    await renderFeed();
    expect(tabLabels()).toEqual(['Discovery', 'TOP 100', 'Following']);
    expect(tabByName('Discovery')).toBe(0);
  });

  it('opens on Discovery', async () => {
    await renderFeed();
    expect(document.querySelector('.feed-mode.selected')?.textContent).toBe('Discovery');
  });

  it('moves the highlight to TOP 100 when it is tapped', async () => {
    await renderFeed();
    const top100 = Array.from(document.querySelectorAll('.feed-mode')).find((b) => b.textContent === 'TOP 100');
    fireEvent.click(top100!);
    expect(document.querySelector('.feed-mode.selected')?.textContent).toBe('TOP 100');
  });
});

describe('TOP 100 ranking', () => {
  it('orders every artist by hearts, highest first', () => {
    const ranked = feedRankedIndexes();
    expect([...ranked].sort((a, b) => a - b)).toEqual(artists.map((_, i) => i));
    const totals = ranked.map((i) => hearts(artists[i]!));
    expect(totals).toEqual([...totals].sort((a, b) => b - a));
  });
});
