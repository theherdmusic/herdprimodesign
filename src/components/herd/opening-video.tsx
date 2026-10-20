import { createContext, useContext, useRef, useState, type ReactNode, type TouchEvent as RTouchEvent, type WheelEvent as RWheelEvent } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Volume2, VolumeX, ChevronsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { entryAfterOpening } from '@/lib/herd-entry';
import { nextIntroStage } from '@/lib/herd-intro';
import { useMe } from '@/components/herd/me';
import filmMp4 from '@/assets/herd-opening.mp4.asset.json';
import filmWebm from '@/assets/herd-opening.webm.asset.json';
import filmPoster from '@/assets/herd-opening.jpg.asset.json';

const OpeningContext = createContext({ active: true, finish: () => {} });

export function OpeningVideoProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(true);
  return <OpeningContext.Provider value={{ active, finish: () => setActive(false) }}>{children}</OpeningContext.Provider>;
}

export function useOpeningVideo() {
  return useContext(OpeningContext);
}

// A single opening film plays before the app itself appears: the sheep intro.
// It carries its own shape so it is shown whole, never cropped, with a soft
// blurred fill behind it so there are no black bars.
const OPENING_FILM = { mp4: filmMp4.url, webm: filmWebm.url, poster: filmPoster.url, label: 'Herd opening film', aspect: '1080 / 1920', feather: false };
const FILMS = [OPENING_FILM];

export function OpeningVideo() {
  const { finish } = useOpeningVideo();
  const nav = useNavigate();
  const path = useLocation({ select: l => l.pathname });
  const { me } = useMe();
  const [muted, setMuted] = useState(true);
  const startYRef = useRef<number | null>(null);
  const closedRef = useRef(false);
  const doneRef = useRef<() => void>(() => {});
  const finishRef = useRef(finish);
  finishRef.current = finish;

  doneRef.current = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    const target = entryAfterOpening(path, me !== null);
    finishRef.current();
    if (target) nav({ to: target });
  };
  const dismiss = () => doneRef.current();

  // The opening film is the last one, so it closing ends the opening.
  const filmEnded = () => {
    if (nextIntroStage(0, FILMS.length) === null) dismiss();
  };

  const startY = (e: RTouchEvent) => { startYRef.current = e.touches[0]?.clientY ?? null; };
  const moveY = (e: RTouchEvent) => {
    const y = e.touches[0]?.clientY;
    const start = startYRef.current;
    if (start !== null && y !== undefined && start - y > 40) dismiss();
  };
  const endY = () => { startYRef.current = null; };
  const onWheel = (e: RWheelEvent) => { if (e.deltaY < -30) dismiss(); };

  return <div className="opening-video" role="dialog" aria-label="Herd opening video"
    onTouchStart={startY} onTouchMove={moveY} onTouchEnd={endY} onWheel={onWheel}>
    {/* A blurred, zoomed copy of the same film fills the space around the clip. */}
    <video className="opening-bg" aria-hidden="true" autoPlay playsInline muted loop
      onEnded={filmEnded} onError={filmEnded}>
      <source src={OPENING_FILM.webm} type="video/webm" />
      <source src={OPENING_FILM.mp4} type="video/mp4" />
    </video>
    <div className={OPENING_FILM.feather ? 'opening-band opening-band--feather' : 'opening-band'} style={{ aspectRatio: OPENING_FILM.aspect }}>
      <video autoPlay playsInline muted={muted} poster={OPENING_FILM.poster} onEnded={filmEnded} onError={filmEnded} aria-label={OPENING_FILM.label}>
        <source src={OPENING_FILM.webm} type="video/webm" />
        <source src={OPENING_FILM.mp4} type="video/mp4" />
      </video>
    </div>
    <div className="opening-controls">
      <Button variant="secondary" size="icon" aria-label={muted ? 'Turn opening sound on' : 'Mute opening sound'} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
    </div>
    <div className="opening-swipe" aria-hidden="true"><ChevronsUp size={26}/><span>Swipe up</span></div>
  </div>;
}
