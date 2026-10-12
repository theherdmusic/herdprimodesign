import { createFileRoute } from '@tanstack/react-router';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import mp4 from '@/assets/react-win.mp4.asset.json';
import webm from '@/assets/react-win.webm.asset.json';
import poster from '@/assets/react-win.jpg.asset.json';

export const Route = createFileRoute('/radio')({ head: () => pageHead('React & Win', 'React & Win on Herd: watch, react and win.'), component: ReactWin });

function ReactWin() {
  const main = useRef<HTMLVideoElement>(null); const bg = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  useEffect(() => { if (main.current) main.current.muted = !soundOn; }, [soundOn]);
  // keep the blurred backdrop in step with the main video
  const sync = () => { const m = main.current, b = bg.current; if (m && b && Math.abs(b.currentTime - m.currentTime) > 0.3) b.currentTime = m.currentTime; };
  const sources = <><source src={webm.url} type="video/webm" /><source src={mp4.url} type="video/mp4" /></>;
  return <PhoneShell><div className="rw-stage">
    <video ref={bg} className="rw-backdrop" autoPlay muted loop playsInline poster={poster.url} aria-hidden="true">{sources}</video>
    <div className="rw-shade" />
    <video ref={main} className="rw-video" autoPlay muted loop playsInline poster={poster.url} onTimeUpdate={sync} onClick={() => setSoundOn(v => !v)} aria-label="React & Win video">{sources}</video>
    <Button variant="secondary" size="icon" className="rw-sound" aria-label={soundOn ? 'Mute video' : 'Turn sound on'} onClick={() => setSoundOn(v => !v)}>{soundOn ? <Volume2 /> : <VolumeX />}</Button>
  </div></PhoneShell>;
}
