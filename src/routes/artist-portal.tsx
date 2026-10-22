import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import { canOpenArtistPortal } from '@/lib/herd-profile';
import herdLogoUrl from '@/assets/herd-logo.png';

export const Route = createFileRoute('/artist-portal')({
  head: () => pageHead('Artist Portal', 'Your Herd artist account and access to the Herd artist dashboard.'),
  component: ArtistPortal,
});

function ArtistPortal() {
  const { me } = useMe();
  if (!me || !canOpenArtistPortal(me)) return <PhoneShell><div className="join join-center">
    <img src={herdLogoUrl} alt="Herd logo" className="join-logo" />
    <h1 className="join-title">Artist Portal</h1>
    <p className="join-sub">An artist account is required.</p>
    <Button asChild className="join-cta"><Link to={me ? '/you' : '/join'}>{me ? 'Back to profile' : 'Log in'}</Link></Button>
  </div></PhoneShell>;

  return <PhoneShell><div className="join">
    <Button asChild variant="ghost" size="icon" className="join-back" aria-label="Back to profile"><Link to="/you"><ArrowLeft /></Link></Button>
    <h1 className="join-title">Artist Portal</h1>
    <div className="you-head my-6">
      <span className="you-avatar shrink-0">{me.name.slice(0, 1).toUpperCase()}</span>
      <div className="min-w-0 break-words"><h2 className="text-xl font-bold">{me.name}</h2><p className="text-sm text-muted-foreground">{me.handle}</p></div>
    </div>
    <dl className="divide-y divide-border border-y border-border">
      <div className="py-4"><dt className="text-xs text-muted-foreground">Email</dt><dd className="text-sm mt-1 break-words">{me.email || 'Not added'}</dd></div>
      <div className="py-4"><dt className="text-xs text-muted-foreground">Genre</dt><dd className="text-sm mt-1">{me.genres.join(', ') || 'Not added'}</dd></div>
      <div className="py-4"><dt className="text-xs text-muted-foreground">Bio</dt><dd className="text-sm mt-1 break-words">{me.bio || 'Not added'}</dd></div>
    </dl>
    <h2 className="text-lg font-bold mt-7 mb-2">Artist dashboard</h2>
    <p className="text-sm text-muted-foreground">Sign in to your Herd artist account.</p>
    <Button asChild className="join-cta whitespace-normal"><a href="https://theherdmusic.com/artistdash" target="_blank" rel="noopener noreferrer">Open artist dashboard<ExternalLink /></a></Button>
  </div></PhoneShell>;
}