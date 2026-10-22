import { useEffect, useRef, useState } from 'react';
import { RotateCw, X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mp4 from '@/assets/react-win.mp4.asset.json';
import webm from '@/assets/react-win.webm.asset.json';
import poster from '@/assets/react-win.jpg.asset.json';

const SPONSOR = 'Ice Shaker';
const QUESTION = 'Would you use this at the gym?';
const ANSWERS = ['Every day', 'Sometimes', 'Not for me'];
// The sponsor clip is widescreen, so a small rotate hint shows while it plays upright.
const AD_IS_LANDSCAPE = true;

type Step = 'ad' | 'ask' | 'done';

export function ReactAd({ onClose }: { onClose: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('ad');
  const [upright, setUpright] = useState(true);
  useEffect(() => { const m = window.matchMedia('(orientation: portrait)'); const f = () => setUpright(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  useEffect(() => { document.querySelectorAll('video').forEach(el => { if (el !== v.current) el.pause(); }); }, []);
  useEffect(() => { const el = v.current; if (!el) return; el.muted = false; el.play().catch(() => { el.muted = true; el.play().catch(() => {}); }); }, []);
  useEffect(() => { if (step !== 'done') return; const t = setTimeout(onClose, 1800); return () => clearTimeout(t); }, [step, onClose]);

  return <div className="react-ad" role="dialog" aria-label={`Sponsored by ${SPONSOR}`}>
    <button className="react-ad-close" aria-label="Close" onClick={onClose}><X size={20} /></button>
    {step === 'ad' && <>
      <span className="react-ad-by">Brought to you by {SPONSOR}</span>
      <video ref={v} className="react-ad-video" playsInline autoPlay preload="auto" poster={poster.url} onEnded={() => setStep('ask')} onError={() => setStep('ask')} onClick={e => { e.currentTarget.muted = false; }}>
        <source src={webm.url} type="video/webm" /><source src={mp4.url} type="video/mp4" />
      </video>
      {AD_IS_LANDSCAPE && upright && <span className="react-ad-rotate"><RotateCw size={14} /> Rotate for full screen</span>}
      <button className="react-ad-skip" onClick={() => setStep('ask')}>Answer now</button>
    </>}
    {step === 'ask' && <div className="react-ad-card">
      <strong>{QUESTION}</strong>
      {ANSWERS.map(a => <Button key={a} variant="secondary" className="react-ad-answer" onClick={() => setStep('done')}>{a}</Button>)}
    </div>}
    {step === 'done' && <div className="react-ad-card" role="status"><Trophy className="text-primary" size={34} /><strong>You're in to win</strong></div>}
  </div>;
}
