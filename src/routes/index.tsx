import { createFileRoute } from '@tanstack/react-router';
import { FeedScreen } from '@/components/herd/feed-screen';
import { pageHead } from '@/components/herd/data';
export const Route = createFileRoute('/')({
  head:()=>pageHead('For you','Find your next favorite independent artist in the Herd music video feed.'),
  validateSearch:(s:Record<string,unknown>):{track?:number}=>({track:Math.max(0,Number(s['track'])||0)}),
  component:Index,
});
function Index() { const {track}=Route.useSearch(); return <FeedScreen initialTrack={track}/>; }
