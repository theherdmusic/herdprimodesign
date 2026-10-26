import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type TouchEvent as RTouchEvent, type WheelEvent as RWheelEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { nextIntroStage } from '@/lib/herd-intro';
import filmMp4 from '@/assets/herd-opening.mp4.asset.json';
import filmWebm from '@/assets/herd-opening.webm.asset.json';
import filmPoster from '@/assets/herd-opening.jpg.asset.json';

type Phase = 'checking' | 'play' | 'done';
const OpeningContext = createContext({ active: true, playing: false, finish: () => {} });

export function OpeningVideoProvider({ children }: { children: ReactNode }) {
  // Plays on every fresh load of the app; finishing or skipping dismisses it for this visit only.
  const [phase, setPhase] = useState<Phase>('checking');
  useEffect(() => { setPhase(p => (p === 'checking' ? 'play' : p)); }, []);
  const finish = () => { setPhase('done'); };
  return <OpeningContext.Provider value={{ active: phase !== 'done', playing: phase === 'play', finish }}>{children}</OpeningContext.Provider>;
}

export function useOpeningVideo() {
  return useContext(OpeningContext);
}

const FILMS = [{ mp4: filmMp4.url, webm: filmWebm.url, poster: filmPoster.url }];
const FILM = FILMS[0]!;

export function OpeningVideo() {
  const { finish, playing } = useOpeningVideo();
  const nav = useNavigate();
  const [muted, setMuted] = useState(true);
  const startYRef = useRef<number | null>(null);
  const closedRef = useRef(false);

  const dismiss = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    finish();
    nav({ to: '/' });
  };
  const filmEnded = () => { if (nextIntroStage(0, FILMS.length) === null) dismiss(); };
  const startY = (e: RTouchEvent) => { startYRef.current = e.touches[0]?.clientY ?? null; };
  const moveY = (e: RTouchEvent) => { const y = e.touches[0]?.clientY; const s = startYRef.current; if (s !== null && y !== undefined && s - y > 40) dismiss(); };
  const onWheel = (e: RWheelEvent) => { if (e.deltaY < -30) dismiss(); };

  if (!playing) return <div className="opening-video" aria-hidden="true" />;
  return <div className="opening-video" role="dialog" aria-label="Herd opening video"
    onTouchStart={startY} onTouchMove={moveY} onTouchEnd={() => { startYRef.current = null; }} onWheel={onWheel}>
    <video className="opening-bg" aria-hidden="true" autoPlay playsInline muted loop preload="auto">
      <source src={FILM.webm} type="video/webm" /><source src={FILM.mp4} type="video/mp4" />
    </video>
    <div className="opening-band" style={{ aspectRatio: '1080 / 1920' }}>
      <video autoPlay playsInline muted={muted} poster={FILM.poster} preload="auto" onEnded={filmEnded} onError={filmEnded} aria-label="Herd opening film">
        <source src={FILM.webm} type="video/webm" /><source src={FILM.mp4} type="video/mp4" />
      </video>
    </div>
    <div className="opening-controls">
      <Button variant="secondary" size="icon" className="h-11 w-11 rounded-full" aria-label={muted ? 'Turn opening sound on' : 'Mute opening sound'} onClick={() => setMuted(v => !v)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
      <Button variant="secondary" className="opening-skip" onClick={dismiss}>Skip</Button>
    </div>
  </div>;
}
