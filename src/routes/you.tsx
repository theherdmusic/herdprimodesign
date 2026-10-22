import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Pencil, Video } from 'lucide-react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import herdLogoUrl from '@/assets/herd-logo.png';
import { canOpenArtistPortal } from '@/lib/herd-profile';

export const Route = createFileRoute('/you')({ head: () => pageHead('Your profile', 'Edit your Herd profile and see the music videos you have posted.'), component: You });

function You() {
  const { me, setMe, videos } = useMe();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(''); const [bio, setBio] = useState('');
  if (!me) return <PhoneShell><div className="join join-center">
    <img src={herdLogoUrl} alt="Herd logo" className="join-logo" />
    <h1 className="join-title">Find your herd</h1>
    <p className="join-sub">Log in to follow artists and save your hearts.</p>
    <Button asChild className="join-cta"><Link to="/join">Log in</Link></Button>
  </div></PhoneShell>;
  const initials = me.name.slice(0, 1).toUpperCase();
  return <PhoneShell><div className="join">
    {canOpenArtistPortal(me) && <div className="flex justify-end mb-4"><Button asChild variant="outline" className="min-h-11"><Link to="/artist-portal">Artist Portal</Link></Button></div>}
    <div className="you-head"><span className="you-avatar shrink-0">{initials}</span><div className="min-w-0 break-words"><h1 className="text-xl font-bold">{me.name}</h1><p className="text-xs text-muted-foreground">{me.handle} · {me.role === 'fan' ? 'Fan' : 'Artist'}</p></div></div>
    {!editing ? <>
      <p className="text-sm my-4">{me.bio || <span className="text-muted-foreground">No bio yet.</span>}</p>
      {me.genres.length > 0 && <div className="chip-grid mb-4">{me.genres.map(g => <span key={g} className="genre-chip selected">{g}</span>)}</div>}
      <div className="flex gap-2"><Button variant="secondary" className="flex-1" onClick={() => { setName(me.name); setBio(me.bio); setEditing(true); }}><Pencil />Edit profile</Button><Button variant="ghost" onClick={() => setMe(null)}>Sign out</Button></div>
    </> : <form onSubmit={e => { e.preventDefault(); setMe({ ...me, name: name.trim() || me.name, bio }); setEditing(false); }}>
      <label className="field-label">Name</label><input className="form-field" aria-label="Name" value={name} onChange={e => setName(e.target.value)} />
      <label className="field-label">Bio</label><textarea className="form-field join-bio" aria-label="Bio" maxLength={150} value={bio} onChange={e => setBio(e.target.value)} />
      <div className="flex gap-2 mt-4"><Button type="submit" className="flex-1">Save</Button><Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button></div>
    </form>}
    <h2 className="text-sm font-semibold mt-7 mb-3">My videos</h2>
    {videos.length === 0 ? <div className="my-empty"><Video />No videos yet</div> :
      <div className="my-grid">{videos.map((v, i) => <div key={i} className="my-tile"><Video /><strong>{v.title}</strong><span>{v.genre}</span></div>)}</div>}
  </div></PhoneShell>;
}
