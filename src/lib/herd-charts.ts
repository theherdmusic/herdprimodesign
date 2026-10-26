import { artists, getArtist, genres, songs } from '@/components/herd/data';

export const CHART_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Monthly archives are deterministic sample rankings, not historical listening data.
export function getChartRows(genre: string, month: number | null = null) {
  const rows = songs.map((song, i) => {
    const a = getArtist(i);
    const title = i < artists.length ? a.song : (genre === 'All' ? song : songs[(i + genres.indexOf(genre) * 3) % 25]);
    return { i, a, title, name: i < artists.length ? a.name : ['The Slow Days', 'June Wilder', 'Eastside Echo', 'Nova Lane'][i % 4] };
  });
  if (month === null) return rows;
  const offset = ((month % 12) + 12) % 12;
  return [...rows.slice(offset), ...rows.slice(0, offset)];
}

function parseHearts(h: string): number {
  const m = /^([\d.]+)\s*([KkMm]?)$/.exec(h.trim());
  if (!m) return 0;
  const mult = m[2].toUpperCase() === 'K' ? 1_000 : m[2].toUpperCase() === 'M' ? 1_000_000 : 1;
  return parseFloat(m[1]) * mult;
}

// Sample-data hearts drift slightly per month and rank so the genre leader changes month to month.
export function monthTopGenre(month: number): string {
  const rows = getChartRows('All', month);
  const totals = new Map<string, number>();
  rows.forEach((row, rank) => {
    const drift = 1 + (((row.i * 7 + month * 3 + rank) % 11) - 5) * 0.35;
    totals.set(row.a.genre, (totals.get(row.a.genre) ?? 0) + parseHearts(row.a.hearts) * drift);
  });
  let best = 'All';
  let bestTotal = -1;
  for (const [genre, total] of totals) if (total > bestTotal) { best = genre; bestTotal = total; }
  return best;
}