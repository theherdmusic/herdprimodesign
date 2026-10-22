import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { PhoneShell } from '@/components/herd/phone-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import { canOpenArtistPortal } from '@/lib/herd-profile';
import herdLogoUrl from '@/assets/herd-logo.png';

export const Route = createFileRoute('/artist-portal')({
  head: () => pageHead('Artist Portal', 'Your Herd artist portal: your page, uploads and checklist.'),
  component: ArtistPortalLayout,
});

function ArtistPortalLayout() {
  const { me } = useMe();
  if (!me || !canOpenArtistPortal(me)) return <PhoneShell><div className="join join-center">
    <img src={herdLogoUrl} alt="Herd logo" className="join-logo" />
    <h1 className="join-title">Artist Portal</h1>
    <p className="join-sub">An artist account is required.</p>
    <Button asChild className="join-cta"><Link to={me ? '/you' : '/join'}>{me ? 'Back to profile' : 'Log in'}</Link></Button>
  </div></PhoneShell>;
  return <PhoneShell><div className="join"><Outlet /></div></PhoneShell>;
}
