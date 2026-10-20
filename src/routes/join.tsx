import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, Check, Headphones, Mic2 } from 'lucide-react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { Button } from '@/components/ui/button';
import { artists, pageHead } from '@/components/herd/data';
import { GENRES, isOldEnough, useMe } from '@/components/herd/me';
import herdLogoUrl from '@/assets/herd-logo.png';

export const Route = createFileRoute('/join')({ head: () => pageHead('Welcome to Herd', 'Log in to Herd to follow artists, heart songs and find your herd.'), component: Join });

type Step = 'welcome' | 'login' | 'birthday' | 'path' | 'genres' | 'follow' | 'musician';

function Join() {
  const nav = useNavigate(); const { setMe } = useMe();
  const [step, setStep] = useState<Step>('welcome'); const [history, setHistory] = useState<Step[]>([]);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [birthday, setBirthday] = useState('');
  const [error, setError] = useState(''); const [genres, setGenres] = useState<string[]>([]); const [follows, setFollows] = useState<string[]>([]);
  const [name, setName] = useState(''); const [bio, setBio] = useState('');
  const go = (s: Step) => { setError(''); setHistory(h => [...h, step]); setStep(s); };
  const back = () => { setError(''); setHistory(h => { const p = h[h.length - 1]; if (p) setStep(p); return h.slice(0, -1); }); };
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const handleOf = (n: string) => '@' + (n || email.split('@')[0] || 'you').toLowerCase().replace(/[^a-z0-9]/g, '');
  const finish = (role: 'fan' | 'musician') => {
    setMe({ name: name || email.split('@')[0] || 'You', handle: handleOf(name), bio, email, role, genres, follows });
    nav({ to: role === 'fan' ? '/' : '/you' });
  };

  const bgArtists = [artists[0], artists[2], artists[5]].filter(Boolean) as typeof artists;

  return <PhoneShell><div className="join">
    <div className="join-video-bg" aria-hidden>
      {bgArtists.map(a => (
        <video key={a.name} autoPlay muted loop playsInline preload="auto">
          <source src={a.videoWebm} type="video/webm" />
          <source src={a.video} type="video/mp4" />
        </video>
      ))}
    </div>
    <div className="join-video-veil" aria-hidden />
    {history.length > 0 && <Button variant="ghost" size="icon" aria-label="Back" className="join-back" onClick={back}><ArrowLeft /></Button>}
    {step === 'welcome' && <div className="join-center">
      <img src={herdLogoUrl} alt="Herd logo" className="join-logo" />
      <h1 className="join-title">Stay you.<br />Be Herd.</h1>
      <p className="join-sub">Music videos from independent artists. Your hearts build the charts.</p>
      <Button className="join-cta" onClick={() => go('login')}>Log in</Button>
      <Button variant="secondary" className="join-option" onClick={() => go('birthday')}><span className="font-bold">G</span>Continue with Google</Button>
      <Button variant="ghost" className="w-full" onClick={() => nav({ to: '/' })}>Just look around</Button>
       <Button variant="ghost" className="w-full" onClick={() => nav({ to: '/floating-mcgee' })}>Floating McGee</Button>
    </div>}
    {step === 'login' && <div>
      <h1 className="join-title">Log in to Herd</h1>
      <Button variant="secondary" className="join-option" onClick={() => { setMe({ name: 'You', handle: '@you', bio: '', email: 'you@gmail.com', role: 'fan', genres: [], follows: [] }); nav({ to: '/' }); }}><span className="font-bold">G</span>Continue with Google</Button>
      <div className="join-or">or use email</div>
      <input className="form-field mb-3" type="email" placeholder="Email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="form-field" type="password" placeholder="Password" aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p className="upload-message upload-error">{error}</p>}
      <Button className="join-cta" onClick={() => { if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.'); if (!password) return setError('Enter your password.'); setMe({ name: email.split('@')[0] ?? 'You', handle: handleOf(''), bio: '', email, role: 'fan', genres: [], follows: [] }); nav({ to: '/' }); }}>Log in</Button>
    </div>}
    {step === 'birthday' && <div>
      <h1 className="join-title">When's your birthday?</h1>
      <p className="join-sub">You need to be 13 or older to join. This won't show on your profile.</p>
      <input className="form-field" type="date" aria-label="Birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
      {error && <p className="upload-message upload-error">{error}</p>}
      <Button className="join-cta" onClick={() => isOldEnough(birthday) ? go('path') : setError('You need to be 13 or older to join Herd.')}>Next</Button>
    </div>}
    {step === 'path' && <div>
      <h1 className="join-title">Which path?</h1>
      <p className="join-sub">You can switch later.</p>
      <button className="path-card" onClick={() => go('genres')}><Headphones /><div><strong>I'm a fan</strong><span>Discover artists, heart songs, move the charts.</span></div></button>
      <button className="path-card" onClick={() => go('musician')}><Mic2 /><div><strong>I'm a musician</strong><span>Share your sound and grow your herd.</span></div></button>
    </div>}
    {step === 'genres' && <div>
      <h1 className="join-title">What do you listen to?</h1>
      <p className="join-sub">Pick at least 3.</p>
      <div className="chip-grid">{GENRES.map(g => <button key={g} className={`genre-chip ${genres.includes(g) ? 'selected' : ''}`} onClick={() => toggle(genres, setGenres, g)}>{genres.includes(g) && <Check size={13} />}{g}</button>)}</div>
      <Button className="join-cta" disabled={genres.length < 3} onClick={() => go('follow')}>Next ({genres.length}/3)</Button>
    </div>}
    {step === 'follow' && <div>
      <h1 className="join-title">Join a herd</h1>
      <p className="join-sub">Follow a few artists to start your feed.</p>
      <ul className="follow-list">{artists.map(a => <li key={a.name}><img src={a.poster ?? a.image} alt="" /><div><strong>{a.name}</strong><span>{a.genre}</span></div><Button size="sm" variant={follows.includes(a.name) ? 'secondary' : 'default'} onClick={() => toggle(follows, setFollows, a.name)}>{follows.includes(a.name) ? 'Following' : 'Follow'}</Button></li>)}</ul>
      <Button className="join-cta" onClick={() => finish('fan')}>Start listening</Button>
    </div>}
    {step === 'musician' && <div>
      <h1 className="join-title">Set up your artist page</h1>
      <label className="field-label">Artist name</label>
      <input className="form-field" aria-label="Artist name" placeholder="Your stage name" value={name} onChange={e => setName(e.target.value)} />
      <label className="field-label">Short bio</label>
      <textarea className="form-field join-bio" aria-label="Bio" maxLength={150} placeholder="Where you're from, what you sound like" value={bio} onChange={e => setBio(e.target.value)} />
      <label className="field-label">Your genre</label>
      <div className="chip-grid">{GENRES.slice(0, 6).map(g => <button key={g} className={`genre-chip ${genres.includes(g) ? 'selected' : ''}`} onClick={() => setGenres([g])}>{g}</button>)}</div>
      {error && <p className="upload-message upload-error">{error}</p>}
      <Button className="join-cta" onClick={() => name.trim() ? finish('musician') : setError('Add your artist name.')}>Create my artist page</Button>
    </div>}
  </div></PhoneShell>;
}
