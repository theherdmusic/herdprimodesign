import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/components/herd/data';

const TITLES: Record<string, string> = { login: 'Log in', 'age-verification': 'Age verification', 'choose-path': 'Choose your path', 'your-details': 'Your details', genres: 'Pick genres', 'follow-artists': 'Follow artists', 'artist-setup': 'Artist setup' };

// The join layout renders the step UI from the URL; this leaf just claims the path.
export const Route = createFileRoute('/join/$step')({
  head: ({ params }) => pageHead(`${TITLES[params.step] ?? 'Join'} · Herd`, 'Join Herd to follow artists, heart songs and find your herd.'),
  component: () => null,
});
