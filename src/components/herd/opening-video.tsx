import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Volume2, VolumeX, ChevronsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [muted, setMuted] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const finishRef = useRef(finish);
  finishRef.current = finish;
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onStart = (event: TouchEvent) => { startYRef.current = event.touches[0]?.clientY ?? null; console.log("cmp start", startYRef.current); };
    const onMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      const startY = startYRef.current;
      console.log("cmp move", startY, y); if (startY !== null && y !== undefined && startY - y > 40) finishRef.current();
    };
    const onEnd = () => { startYRef.current = null; };
    const onWheel = (event: WheelEvent) => { if (event.deltaY > 30) finishRef.current(); };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);
  return <div ref={overlayRef} className="opening-video" role="dialog" aria-label="Herd opening video">
    <video autoPlay playsInline muted={muted} poster={poster.url} onEnded={finish} onError={finish} aria-label="Herd opening film">
      <source src={openingWebm.url} type="video/webm" />
      <source src={opening.url} type="video/mp4" />
    </video>
    <div className="opening-controls">
      <Button variant="secondary" size="icon" aria-label={muted ? 'Turn opening sound on' : 'Mute opening sound'} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
     </div>
    <div className="opening-swipe" aria-hidden="true"><ChevronsUp size={26}/><span>Swipe up</span></div>
  </div>;
}