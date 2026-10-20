import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import artwork from '@/assets/floating-mcgee.png.asset.json';

export const Route = createFileRoute('/floating-mcgee')({
  head: () => pageHead('Floating McGee', 'Floating McGee floats across the screen on Herd.'),
  component: FloatingMcGee,
});

function FloatingMcGee() {
  return <main className="floating-mcgee-screen" aria-label="Floating McGee">
    <Button asChild variant="ghost" size="icon" className="floating-mcgee-back">
      <Link to="/join" aria-label="Back to login" title="Back to login"><ArrowLeft /></Link>
    </Button>
    <div className="floating-mcgee-track">
      <img className="floating-mcgee-artwork" src={artwork.url} alt="Floating McGee sheep with headphones and a tartan cap" draggable={false} />
    </div>
  </main>;
}