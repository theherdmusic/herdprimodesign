import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';

export const Route = createFileRoute('/artist-portal/your-page')({
  head: () => pageHead('Your page · Artist Portal', 'Edit the artist name, tagline, bio and socials on your Herd profile.'),
  component: YourPage,
});

function YourPage() {
  const { me, setMe, page, setPage } = useMe();
  const [f, setF] = useState({ name: me?.name ?? '', genre: me?.genres[0] ?? '', bio: me?.bio ?? '', ...page });
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  if (!me) return null;
  const field = (k: keyof typeof f, label: string, req = false, placeholder = '') => <div key={k}>
    <label className="field-label" htmlFor={k}>{label}{req && <span className="text-primary"> *</span>}</label>
    <input id={k} className="form-field" placeholder={placeholder} value={f[k]} onChange={e => { setF({ ...f, [k]: e.target.value }); setMsg(''); }} />
  </div>;
  const save = () => {
    if (!f.name.trim() || !f.tagline.trim() || !f.genre.trim() || !f.hometown.trim() || !f.bio.trim()) { setMsg(''); return setErr('Fill in every field marked *.'); }
    setErr(''); setMe({ ...me, name: f.name.trim(), bio: f.bio, genres: [f.genre.trim()] });
    setPage({ tagline: f.tagline, hometown: f.hometown, website: f.website, instagram: f.instagram, tiktok: f.tiktok, youtube: f.youtube, spotify: f.spotify, color: f.color });
    setMsg('Saved.');
  };
  return <>
    <Button asChild variant="ghost" size="icon" className="join-back" aria-label="Back to portal"><Link to="/artist-portal"><ArrowLeft /></Link></Button>
    <h1 className="join-title">Your page</h1>
    <p className="join-sub">Everything here feeds your artist profile inside the HERD app.</p>
    {field('name', 'Artist name', true)}
    {field('tagline', 'Tagline', true, 'One line about you')}
    {field('genre', 'Genre', true)}
    {field('hometown', 'Hometown', true)}
    <label className="field-label" htmlFor="bio">Bio<span className="text-primary"> *</span></label>
    <textarea id="bio" className="form-field join-bio" value={f.bio} onChange={e => setF({ ...f, bio: e.target.value })} />
    <p className="text-xs text-muted-foreground mt-5">Optional — but please give us your socials. They help us feature you and tag you in the app.</p>
    {field('website', 'Website', false, 'https://')}
    {field('instagram', 'Instagram')}
    {field('tiktok', 'TikTok')}
    {field('youtube', 'YouTube')}
    {field('spotify', 'Spotify')}
    <label className="field-label" htmlFor="color">Highlight color</label>
    <div className="flex items-center gap-3"><input id="color" type="color" className="h-11 w-16 rounded-md border border-border bg-card" value={f.color} onChange={e => setF({ ...f, color: e.target.value })} /><span className="text-sm text-muted-foreground">{f.color.toUpperCase()}</span></div>
    {err && <p className="upload-message upload-error">{err}</p>}
    {msg && <p className="upload-message text-primary">{msg}</p>}
    <Button className="join-cta" onClick={save}>Save my page</Button>
  </>;
}
