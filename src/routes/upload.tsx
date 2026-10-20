// ============= HERD TV: sheep intro -> full show video -> commercial -> repeat =============

import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { pageHead } from '@/components/herd/data';
import introMp4 from '@/assets/herdtv-intro.mp4.asset.json';
import introWebm from '@/assets/herdtv-intro.webm.asset.json';
import mattieMp4 from '@/assets/mattie.mp4.asset.json';
import mattieWebm from '@/assets/mattie.webm.asset.json';
import mattiePoster from '@/assets/mattie.jpg.asset.json';
import adMp4 from '@/assets/herdtv-ad.mp4.asset.json';
import adWebm from '@/assets/herdtv-ad.webm.asset.json';
import brittPoster from '@/assets/britt-poster.jpg.asset.json';
import gracePoster from '@/assets/grace-poster.jpg.asset.json';
import hobbsPoster from '@/assets/hobbs-poster.jpg.asset.json';
import dariannPoster from '@/assets/dariann-poster.jpg.asset.json';
import elcaminoPoster from '@/assets/elcamino-poster.jpg.asset.json';
import herdPoster from '@/assets/herd-video-poster.jpg.asset.json';
import reactPoster from '@/assets/react-win.jpg.asset.json';
import mcgeePoster from '@/assets/floating-mcgee-poster.jpg';
import { ChevronLeft, Play } from 'lucide-react';

// Placeholder artwork — swap for real show art later.
const SHOWS = [
  { title: 'Barstool Stage', tag: 'Live sets', art: elcaminoPoster.url },
  { title: 'The HERD Morning Show', tag: 'Daily', art: gracePoster.url },
  { title: 'HERD House', tag: 'Reality', art: brittPoster.url },
  { title: 'Backyard Parties', tag: 'Live', art: hobbsPoster.url },
  { title: 'Busking Wars', tag: 'Competition', art: dariannPoster.url },
  { title: 'HERD LRT', tag: 'On the move', art: herdPoster.url },
  { title: 'Floating McGee Fight Night', tag: 'Fight night', art: mcgeePoster },
];

const NEXT_UP_AT = 15; // show "next video" countdown this many seconds before the ad ends

type Stage = 'intro' | 'show' | 'ad';

export const Route = createFileRoute('/upload')({
  head: () => pageHead('HERD TV', 'Watch HERD TV — shows and commercials, upright or sideways.'),
  component: HerdTv,
});

function HerdTv() {
  const [watching, setWatching] = useState(false);
  const [soon, setSoon] = useState<string | null>(null);
  if (watching) return <AlwaysOn onBack={() => setWatching(false)} />;
  return (
    <PhoneShell>
      <div className="tvm">
        <button className="tvm-hero" onClick={() => setWatching(true)} style={{ backgroundImage: `url(${mattiePoster.url})` }}>
          <span className="tvm-live">● Live</span>
          <span className="tvm-hero-title">HERD TV<br /><small>Always On</small></span>
          <span className="tvm-play"><Play size={16} fill="currentColor" /> Watch now</span>
        </button>
        <h3 className="tvm-row-title">HERD Originals</h3>
        <div className="tvm-row">
          {SHOWS.map(s => (
            <button key={s.title} className="tvm-tile" onClick={() => setSoon(s.title)} style={{ backgroundImage: `url(${s.art})` }}>
              <span className="tvm-tag">{s.tag}</span>
              <span className="tvm-tile-title">{s.title}</span>
            </button>
          ))}
        </div>
        <h3 className="tvm-row-title">Trending on HERD</h3>
        <div className="tvm-row">
          {[...SHOWS].reverse().map(s => (
            <button key={s.title} className="tvm-tile tvm-tile--wide" onClick={() => setSoon(s.title)} style={{ backgroundImage: `url(${s.title === 'HERD LRT' ? reactPoster.url : s.art})` }}>
              <span className="tvm-tile-title">{s.title}</span>
            </button>
          ))}
        </div>
        {soon && (
          <div className="tvm-soon" onClick={() => setSoon(null)}>
            <div className="tvm-soon-card">
              <strong>{soon}</strong>
              <p>New episodes coming soon to HERD TV.</p>
              <button onClick={() => setSoon(null)}>Got it</button>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

function AlwaysOn({ onBack }: { onBack: () => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const [land, setLand] = useState(false);
  const [stage, setStage] = useState<Stage>('intro');
  const [adLeft, setAdLeft] = useState<number | null>(null); // seconds left in the commercial

  useEffect(() => {
    const m = window.matchMedia('(orientation: landscape)');
    const f = () => setLand(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    el.muted = false;
    el.load();
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [stage]);

  const onTime = () => {
    const el = v.current;
    if (!el) return;
    if (stage === 'ad' && el.duration) {
      setAdLeft(Math.max(0, Math.ceil(el.duration - el.currentTime)));
    }
  };

  const onEnded = () => {
    setAdLeft(null);
    if (stage === 'intro') setStage('show');
    else if (stage === 'show') setStage('ad');
    else setStage('show');
  };

  const sources =
    stage === 'intro' ? (
      <>
        <source src={introWebm.url} type="video/webm" />
        <source src={introMp4.url} type="video/mp4" />
      </>
    ) : stage === 'ad' ? (
      <>
        <source src={adWebm.url} type="video/webm" />
        <source src={adMp4.url} type="video/mp4" />
      </>
    ) : (
      <>
        <source src={mattieWebm.url} type="video/webm" />
        <source src={mattieMp4.url} type="video/mp4" />
      </>
    );

  return (
    <PhoneShell landscape={land}>
      <div className="rw-stage">
        <button className="tvm-back" onClick={onBack} aria-label="Back to HERD TV menu"><ChevronLeft size={18} /> Shows</button>
        <video
          ref={v}
          className="rw-video"
          autoPlay
          loop={false}
          playsInline
          poster={stage === 'show' ? mattiePoster.url : undefined}
          aria-label="HERD TV"
          onEnded={onEnded}
          onTimeUpdate={onTime}
          onClick={e => {
            e.currentTarget.muted = false;
          }}
        >
          {sources}
        </video>
        <div className="tv-lowerthird">
          <span className="tv-right">
            {stage === 'ad' && (
              <span className="tv-count tv-count--break">Commercial break</span>
            )}
            {stage === 'ad' && adLeft !== null && adLeft <= NEXT_UP_AT && (
              <span className="tv-count">Next video in {adLeft}s</span>
            )}
          </span>
        </div>
      </div>
    </PhoneShell>
  );
}
