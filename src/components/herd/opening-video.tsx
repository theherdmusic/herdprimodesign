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
  const touchStartY = useRef<number | null>(null);
  useEffect(() => {
    const onWheel = (event: WheelEvent) => { if (event.deltaY > 30) finish(); };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [finish]);
  return <div className="opening-video" role="dialog" aria-label="Herd opening video"
    onTouchStart={event => { touchStartY.current = event.touches[0].clientY; }}
    onTouchMove={event => {
      if (touchStartY.current !== null && touchStartY.current - event.touches[0].clientY > 40) finish();
    }}
    onTouchEnd={() => { touchStartY.current = null; }}>
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