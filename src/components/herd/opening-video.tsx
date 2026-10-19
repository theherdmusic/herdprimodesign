import { createContext, useContext, useRef, useState, type ReactNode, type TouchEvent as RTouchEvent, type WheelEvent as RWheelEvent } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Volume2, VolumeX, ChevronsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { entryAfterOpening } from '@/lib/herd-entry';
import { useMe } from '@/components/herd/me';
import opening from '@/assets/herd-opening.mp4.asset.json';
import openingWebm from '@/assets/herd-opening.webm.asset.json';
import poster from '@/assets/herd-opening.jpg.asset.json';

const OpeningContext = createContext({ active: true, finish: () => {} });

export function OpeningVideoProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(true);
  return <OpeningContext.Provider value={{ active, finish: () => setActive(false) }}>{children}</OpeningContext.Provider>;
}

export function useOpeningVideo() {
  return useContext(OpeningContext);
}

export function OpeningVideo() {
  const { finish } = useOpeningVideo();
  const nav = useNavigate();
  const path = useLocation({ select: l => l.pathname });
  const { me } = useMe();
  const [muted, setMuted] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
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

  const startY = (e: RTouchEvent) => { startYRef.current = e.touches[0]?.clientY ?? null; };
  const moveY = (e: RTouchEvent) => {
    const y = e.touches[0]?.clientY;
    const start = startYRef.current;
    if (start !== null && y !== undefined && start - y > 40) dismiss();
  };
  const endY = () => { startYRef.current = null; };
  const onWheel = (e: RWheelEvent) => { if (e.deltaY > 30) dismiss(); };

  return <div ref={overlayRef} className="opening-video" role="dialog" aria-label="Herd opening video"
    onTouchStart={startY} onTouchMove={moveY} onTouchEnd={endY} onWheel={onWheel}>
    <video autoPlay playsInline muted={muted} poster={poster.url} onEnded={dismiss} onError={dismiss} aria-label="Herd opening film">
      <source src={openingWebm.url} type="video/webm" />
      <source src={opening.url} type="video/mp4" />
    </video>
    <div className="opening-controls">
      <Button variant="secondary" size="icon" aria-label={muted ? 'Turn opening sound on' : 'Mute opening sound'} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
     </div>
    <div className="opening-swipe" aria-hidden="true"><ChevronsUp size={26}/><span>Swipe up</span></div>
  </div>;
}
