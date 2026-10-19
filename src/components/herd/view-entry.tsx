import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMe, type View } from './me';

/** Sets the mockup's fan/artist view, then opens the Discovery feed. */
export function ViewEntry({ view }: { view: View }) {
  const { setView } = useMe();
  const navigate = useNavigate();
  useEffect(() => { setView(view); navigate({ to: '/', replace: true }); }, [view]);
  return <main className="prototype-stage" />;
}
