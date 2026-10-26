import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import { UPLOAD_KINDS } from '@/lib/herd-portal';

export const Route = createFileRoute('/artist-portal/uploads')({
  head: () => pageHead('Your uploads · Artist Portal', 'See every file you have sent to Herd.'),
  component: YourUploads,
});

function YourUploads() {
  const { uploads } = useMe();
  return <>
    <Button asChild variant="ghost" size="icon" className="join-back" aria-label="Back to portal"><Link to="/artist-portal"><ArrowLeft /></Link></Button>
    <h1 className="join-title">Your uploads ({uploads.length})</h1>
    {uploads.length === 0 ? <p className="join-sub">Nothing uploaded yet. Your files will show up here.</p> :
      <ul className="flex flex-col gap-2 mt-4">{uploads.map((u, i) => <li key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <FileUp className="size-5 text-primary shrink-0" />
        <div className="min-w-0 break-words"><strong className="block text-sm">{u.title}</strong><span className="text-xs text-muted-foreground">{UPLOAD_KINDS.find(k => k.id === u.kind)?.label}{u.releaseDate && ` · ${u.releaseDate}`} · {u.fileName}</span></div>
      </li>)}</ul>}
  </>;
}
