import { useEffect, useRef, useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import adMp4 from '@/assets/britt-ad.mp4.asset.json';
import adWebm from '@/assets/britt-ad.webm.asset.json';
import adPoster from '@/assets/britt-ad.jpg.asset.json';
import introMp4 from '@/assets/pre-ad.mp4.asset.json';
import introWebm from '@/assets/pre-ad.webm.asset.json';
import music from '@/assets/suspense.m4a.asset.json';

// DEMO ONLY: simulated trivia prize. No payments, no saved state.
const SPONSOR = 'American Stock';
const QUESTION = 'What number is Brittany Elise\'s "Backroad Story" on the music chart shown in the ad?';
const ANSWERS = [{ k: 'A', v: '5' }, { k: 'B', v: '2' }, { k: 'C', v: '3' }, { k: 'D', v: '7' }];
const CORRECT = 'A';
// The pre-ad clip has no built-in countdown, so a "Get ready" 3-2-1 runs before the commercial.
const INTRO: { mp4: string; webm: string } | null = { mp4: introMp4.url, webm: introWebm.url };
const INTRO_HAS_COUNTDOWN = false;

type Step = 'start' | 'intro' | 'countdown' | 'ad' | 'ask' | 'win' | 'lose';

export function ReactAd({ onClose }: { onClose: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [step, setStep] = useState<Step>('start');
  const [count, setCount] = useState(3);
  const [blocked, setBlocked] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const bg = useRef<HTMLAudioElement>(null);
  // Light game-show music plays under the start screen, countdown and question, never over the videos.
  useEffect(() => { const a = bg.current; if (!a) return; a.volume = 0.35;
    if (step === 'start' || step === 'countdown' || step === 'ask') a.play().catch(() => {}); else a.pause(); }, [step]);

  useEffect(() => { document.querySelectorAll('video').forEach(el => { if (el !== v.current) el.pause(); }); }, []);

  const playCurrent = () => {
    const el = v.current; if (!el) return;
    el.muted = false;
    el.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
  };
  useEffect(() => { if (step === 'intro' || step === 'ad') { v.current?.load(); playCurrent(); } }, [step]);
  useEffect(() => {
    if (step !== 'countdown') return;
    if (count <= 0) { setStep('ad'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, count]);

  const afterIntro = () => { if (INTRO_HAS_COUNTDOWN) setStep('ad'); else { setCount(3); setStep('countdown'); } };
  const start = () => {
    if (started.current) return;
    started.current = true;
    if (INTRO) setStep('intro'); else { setCount(3); setStep('countdown'); }
  };
  const reset = () => { started.current = false; setPick(null); setBlocked(false); setStep('start'); };
  const src = step === 'intro' && INTRO ? INTRO : { mp4: adMp4.url, webm: adWebm.url };

  return <div className="react-ad" role="dialog" aria-label={`Sponsored by ${SPONSOR}`}>
    <audio ref={bg} src={music.url} loop preload="auto" />
    <button className="react-ad-close" aria-label="Close" onClick={onClose}><X size={20} /></button>
    {step === 'start' && <div className="react-ad-card">
      <strong>Choose correctly and win $20 sent to your Venmo right now.</strong>
      <p className="trivia-demo">DEMO ONLY - simulated prize. No real money will be sent.</p>
      <button type="button" className="trivia-start" aria-label="Start trivia" onClick={start}><span /></button>
      <span className="react-ad-by">Tap the red dot to start</span>
    </div>}
    {(step === 'intro' || step === 'ad') && <>
      {step === 'ad' && <span className="react-ad-by">Brought to you by {SPONSOR}</span>}
      <video ref={v} key={step} className="react-ad-video trivia-video" playsInline preload="auto" poster={step === 'ad' ? adPoster.url : undefined}
        onEnded={() => step === 'intro' ? afterIntro() : setStep('ask')}>
        <source src={src.mp4} type="video/mp4" /><source src={src.webm} type="video/webm" />
      </video>
      {blocked && <Button onClick={playCurrent}>Tap to play</Button>}
    </>}
    {step === 'countdown' && <div className="trivia-count" role="status"><span>Get ready</span><b key={count}>{count || 1}</b></div>}
    {step === 'ask' && <div className="react-ad-card">
      <strong>{QUESTION}</strong>
      {ANSWERS.map(a => <Button key={a.k} variant={pick === a.k ? 'default' : 'secondary'} aria-pressed={pick === a.k} className="react-ad-answer" onClick={() => setPick(a.k)}>{a.k}. {a.v}</Button>)}
      <Button className="react-ad-answer" disabled={!pick} onClick={() => setStep(pick === CORRECT ? 'win' : 'lose')}>Submit answer</Button>
    </div>}
    {step === 'win' && <div className="react-ad-card trivia-win" role="status">
      <div className="trivia-fireworks" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ ['--a' as string]: `${i * 30}deg` }} />)}</div>
      <strong className="trivia-big">YOU WIN!!</strong>
      <Trophy className="text-primary" size={40} />
      <span className="trivia-prize">$20</span>
      <span>Simulated Venmo payout: $20</span>
      <p className="trivia-demo">DEMO ONLY - no money was sent.</p>
      <Button variant="secondary" onClick={onClose}>Done</Button>
    </div>}
    {step === 'lose' && <div className="react-ad-card" role="status">
      <strong>Not this time! The correct answer is 5.</strong>
      <Button className="react-ad-answer" onClick={reset}>Play again</Button>
    </div>}
  </div>;
}
