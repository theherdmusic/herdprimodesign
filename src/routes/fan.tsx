import { createFileRoute } from '@tanstack/react-router';
import { ViewEntry } from '@/components/herd/view-entry';
import { pageHead } from '@/components/herd/data';
export const Route = createFileRoute('/fan')({ head: () => pageHead('Fan view', 'Discover, follow and react to independent artists on Herd.'), component: () => <ViewEntry view="fan" /> });
