import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Check, ChevronRight, Circle, FolderOpen, Upload, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import { checklist } from '@/lib/herd-portal';

export const Route = createFileRoute('/artist-portal/')({
  head: () => pageHead('Artist Portal', 'Your Herd artist portal: your page, uploads and checklist.'),
  component: PortalHome,
});

function PortalHome() {
  const { me, page, uploads } = useMe();
  const items = checklist(me?.bio ?? '', page, uploads);
  const done = items.filter(i => i.done).length;
  const sections = [
    { to: '/artist-portal/your-page' as const, icon: UserRound, title: 'Your page', sub: 'Name, bio, socials, color' },
    { to: '/artist-portal/upload' as const, icon: Upload, title: 'Upload files', sub: 'Photos, artwork, audio, video' },
    { to: '/artist-portal/uploads' as const, icon: FolderOpen, title: `Your uploads (${uploads.length})`, sub: 'Everything you sent' },
  ];
  return <>
    <Button asChild variant="ghost" size="icon" className="join-back" aria-label="Back to profile"><Link to="/you"><ArrowLeft /></Link></Button>
    <h1 className="join-title">Artist Portal</h1>
    <p className="join-sub">Hi {me?.name}. Everything here feeds your artist profile.</p>
    <nav className="flex flex-col gap-2 mb-7">{sections.map(s => <Link key={s.to} to={s.to} className="flex items-center gap-3 min-h-16 px-4 rounded-xl border border-border bg-card">
      <s.icon className="size-5 text-primary shrink-0" /><div className="flex-1 min-w-0"><strong className="block text-sm">{s.title}</strong><span className="text-xs text-muted-foreground">{s.sub}</span></div><ChevronRight className="size-4 text-muted-foreground" />
    </Link>)}</nav>
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold uppercase tracking-wider mb-1">What we need from you</h2>
      <p className="text-xs text-muted-foreground mb-3">{done} of {items.length} done</p>
      <ul className="flex flex-col gap-2">{items.map(i => <li key={i.label} className="flex items-center gap-2 text-sm">{i.done ? <Check className="size-4 text-primary" /> : <Circle className="size-4 text-muted-foreground" />}<span className={i.done ? '' : 'text-muted-foreground'}>{i.label}</span></li>)}</ul>
      <p className="text-xs text-muted-foreground mt-3">Press photos must be real photos, not artwork. Songs can't be more than 6 months old. If a song isn't out yet, add its release date and keep it hidden until then.</p>
    </section>
  </>;
}
