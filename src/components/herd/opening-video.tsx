import { createContext, useContext, useRef, useState, type ReactNode, type TouchEvent as RTouchEvent, type WheelEvent as RWheelEvent } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Volume2, VolumeX, ChevronsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { entryAfterOpening } from '@/lib/herd-entry';
import { nextIntroStage } from '@/lib/herd-intro';
import { useMe } from '@/components/herd/me';
import opening from '@/assets/herd-opening.mp4.asset.json';
import openingWebm from '@/assets/herd-opening.webm.asset.json';
import poster from '@/assets/herd-opening.jpg.asset.json';
import after from '@/assets/herd-after.mp4.asset.json';
import afterWebm from '@/assets/herd-after.webm.asset.json';
import afterPoster from '@/assets/herd-after.jpg.asset.json';

const OpeningContext = createContext({ active: true, finish: () => {} });

export function OpeningVideoProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(true);
  return <OpeningContext.Provider value={{ active, finish: () => setActive(false) }}>{children}</OpeningContext.Provider>;
}

export function useOpeningVideo() {
  return useContext(OpeningContext);
}

// Films play back to back: the sheep intro first, then the follow-up clip.
// Each film carries its own shape so it is shown whole, never cropped.
const SHEEP_INTRO = { mp4: opening.url, webm: openingWebm.url, poster: poster.url, label: 'Herd opening film', aspect: '1080 / 1920', feather: false };
const FOLLOW_UP = { mp4: after.url, webm: afterWebm.url, poster: afterPoster.url, label: 'Herd intro film', aspect: '1280 / 720', feather: true };
const FILMS = [SHEEP_INTRO, FOLLOW_UP];

export function OpeningVideo() {
  const { finish } = useOpeningVideo();
  const nav = useNavigate();
  const path = useLocation({ select: l => l.pathname });
  const { me } = useMe();
  const [muted, setMuted] = useState(true);
  const [stage, setStage] = useState(0);
  const startYRef = useRef<number | null>(null);
  const closedRef = useRef(false);
  const doneRef = useRef<() => void>(() => {});
  const finishRef = useRef(finish);
  finishRef.current = finish;
  const stageRef = useRef(stage);
  stageRef.current = stage;

  doneRef.current = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    const target = entryAfterOpening(path, me !== null);
    finishRef.current();
    if (target) nav({ to: target });
  };
  const dismiss = () => doneRef.current();

  // A film ending moves on to the next one; the last one closes the opening.
  const filmEnded = () => {
    const next = nextIntroStage(stageRef.current, FILMS.length);
    if (next === null) dismiss();
    else setStage(next);
  };

  const startY = (e: RTouchEvent) => { startYRef.current = e.touches[0]?.clientY ?? null; };
  const moveY = (e: RTouchEvent) => {
    const y = e.touches[0]?.clientY;
    const start = startYRef.current;
    if (start !== null && y !== undefined && start - y > 40) dismiss();
  };
  const endY = () => { startYRef.current = null; };
  const onWheel = (e: RWheelEvent) => { if (e.deltaY < -30) dismiss(); };

  const film = stage === 0 ? SHEEP_INTRO : FOLLOW_UP;

  return <div className="opening-video" role="dialog" aria-label="Herd opening video"
    onTouchStart={startY} onTouchMove={moveY} onTouchEnd={endY} onWheel={onWheel}>
    {/* A blurred, zoomed copy of the same film fills the space around a widescreen clip. */}
    <video key={`bg-${stage}`} className="opening-bg" aria-hidden="true" autoPlay playsInline muted loop
      onEnded={filmEnded} onError={filmEnded}>
      <source src={film.webm} type="video/webm" />
      <source src={film.mp4} type="video/mp4" />
    </video>
    <div key={`band-${stage}`} className={film.feather ? 'opening-band opening-band--feather' : 'opening-band'} style={{ aspectRatio: film.aspect }}>
      <video key={stage} autoPlay playsInline muted={muted} poster={film.poster} onEnded={filmEnded} onError={filmEnded} aria-label={film.label}>
        <source src={film.webm} type="video/webm" />
        <source src={film.mp4} type="video/mp4" />
      </video>
    </div>
    <div className="opening-controls">
      <Button variant="secondary" size="icon" aria-label={muted ? 'Turn opening sound on' : 'Mute opening sound'} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
     </div>
    <div className="opening-swipe" aria-hidden="true"><ChevronsUp size={26}/><span>Swipe up</span></div>
  </div>;
}
