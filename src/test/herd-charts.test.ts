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