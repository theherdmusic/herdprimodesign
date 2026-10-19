import { createFileRoute } from '@tanstack/react-router';
import { ViewEntry } from '@/components/herd/view-entry';
import { pageHead } from '@/components/herd/data';
export const Route = createFileRoute('/artist')({ head: () => pageHead('Artist view', 'Post music videos and track your fans on Herd.'), component: () => <ViewEntry view="artist" /> });
