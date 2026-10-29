import { describe, expect, it } from 'vitest';
import { CHART_MONTHS, getChartRows, monthTopGenre } from '@/lib/herd-charts';

describe('monthly Top 25 sample rankings', () => {
  it('offers all twelve calendar months', () => {
    expect(CHART_MONTHS).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  });
  it('returns exactly 25 unique ranked entries for every month', () => {
    for (let month = 0; month < 12; month++) {
      const rows = getChartRows('All', month);
      expect(rows).toHaveLength(25);
      expect(new Set(rows.map(row => row.i)).size).toBe(25);
    }
  });
  it('switches to the selected month without mixing ranks from another month', () => {
    expect(getChartRows('All', 0)[0]?.i).toBe(0);
    expect(getChartRows('All', 1)[0]?.i).toBe(1);
    expect(getChartRows('All', 11)[0]?.i).toBe(11);
    expect(getChartRows('All', 1).map(row => row.i)).not.toEqual(getChartRows('All', 0).map(row => row.i));
  });
});

describe('month top genre by hearts', () => {
  const rowGenres = (month: number) => new Set(getChartRows('All', month).map(row => row.a.genre));
  it('picks a genre that appears in that month\'s Top 25 for every month', () => {
    for (let month = 0; month < 12; month++) {
      expect(rowGenres(month).has(monthTopGenre(month))).toBe(true);
    }
  });
  it('does not repeat the same genre winner every month', () => {
    const winners = new Set(CHART_MONTHS.map((_, m) => monthTopGenre(m)));
    expect(winners.size).toBeGreaterThan(1);
  });
  it('keeps the winner stable for a given month', () => {
    expect(monthTopGenre(4)).toBe(monthTopGenre(4));
  });
});
import { chartMove as move2, formatHearts as fmt2 } from '@/lib/herd-charts';
describe('feed chart extras', () => {
  it('never reports zero movement', () => { for (let i = 0; i < 30; i++) expect(move2(i)).not.toBe(0); });
  it('adds one heart to 12.8K without changing the display', () => { expect(fmt2(12801)).toBe('12.8K'); expect(fmt2(999)).toBe('999'); });
});
