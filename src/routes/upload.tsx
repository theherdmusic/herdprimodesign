import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { pageHead } from '@/components/herd/data';
import introMp4 from '@/assets/herdtv-intro.mp4.asset.json';
import introWebm from '@/assets/herdtv-intro.webm.asset.json';
import mattieMp4 from '@/assets/mattie.mp4.asset.json';
import mattieWebm from '@/assets/mattie.webm.asset.json';
import mattiePoster from '@/assets/mattie.jpg.asset.json';

export const Route = createFileRoute('/upload')({
  head: () => pageHead('HERD TV', 'Watch the HERD TV clip — it plays on a loop, upright or sideways.'),
  component: HerdTv,
});

function HerdTv() {
  const v = useRef<HTMLVideoElement>(null);
  const [land, setLand] = useState(false);
  const [introDone, setIntroDone] = useState(false);

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
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [introDone]);

  return (
    <PhoneShell landscape={land}>
      <div className="rw-stage">
        <video
          ref={v}
          className="rw-video"
          autoPlay
          loop={introDone}
          playsInline
          poster={introDone ? mattiePoster.url : undefined}
          aria-label="HERD TV"
          onEnded={() => setIntroDone(true)}
          onClick={e => {
            e.currentTarget.muted = false;
          }}
        >
          {introDone ? (
            <>
              <source src={mattieWebm.url} type="video/webm" />
              <source src={mattieMp4.url} type="video/mp4" />
            </>
          ) : (
            <>
              <source src={introWebm.url} type="video/webm" />
              <source src={introMp4.url} type="video/mp4" />
            </>
          )}
        </video>
      </div>
    </PhoneShell>
  );
}
