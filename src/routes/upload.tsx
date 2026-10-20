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

const AD_AFTER = 30; // seconds of Mattie Go before the commercial
const NEXT_UP_AT = 15; // show "next video" countdown this many seconds before the ad ends

type Stage = 'intro' | 'show' | 'ad';

export const Route = createFileRoute('/upload')({
  head: () => pageHead('HERD TV', 'Watch HERD TV — shows and commercials, upright or sideways.'),
  component: HerdTv,
});

function HerdTv() {
  const v = useRef<HTMLVideoElement>(null);
  const [land, setLand] = useState(false);
  const [stage, setStage] = useState<Stage>('intro');
  const [showT, setShowT] = useState(0); // seconds the Mattie Go loop has played
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
    if (stage === 'show') {
      setShowT(el.currentTime);
      if (el.currentTime >= AD_AFTER) setStage('ad');
    } else if (stage === 'ad' && el.duration) {
      setAdLeft(Math.max(0, Math.ceil(el.duration - el.currentTime)));
    }
  };

  const onEnded = () => {
    if (stage === 'intro') setStage('show');
    else if (stage === 'ad') {
      setShowT(0);
      setAdLeft(null);
      setStage('show');
    }
  };

  const commercialIn = Math.max(0, Math.ceil(AD_AFTER - showT));
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
        <video
          ref={v}
          className="rw-video"
          autoPlay
          loop={stage === 'show'}
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
          <span className="tv-brand">HERD TV</span>
          {stage === 'show' && (
            <span className="tv-count">
              Commercial in {commercialIn}s
            </span>
          )}
          {stage === 'ad' && (
            <span className="tv-count tv-count--break">Commercial break</span>
          )}
          {stage === 'ad' && adLeft !== null && adLeft <= NEXT_UP_AT && (
            <span className="tv-count">
              Next video in {adLeft}s
            </span>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}
