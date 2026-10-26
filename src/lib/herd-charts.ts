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