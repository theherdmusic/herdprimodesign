import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import { MAX_PORTAL_FILE_BYTES, MAX_PORTAL_VIDEO_SECONDS, UPLOAD_SECTIONS, type UploadKind, type UploadSection } from '@/lib/herd-portal';

export const Route = createFileRoute('/artist-portal/upload')({
  validateSearch: (s: Record<string, unknown>): { section: UploadSection } => ({ section: UPLOAD_SECTIONS.some(x => x.id === s['section']) ? s['section'] as UploadSection : 'upload' }),
  head: () => pageHead('Upload · Artist Portal', 'Send Herd your vertical videos, press photos and artwork.'),
  component: UploadFiles,
});

function videoSeconds(file: File) {
  return new Promise<number>(resolve => {
    const v = document.createElement('video'); v.preload = 'metadata';
    v.onloadedmetadata = () => { resolve(v.duration); URL.revokeObjectURL(v.src); };
    v.onerror = () => resolve(0);
    v.src = URL.createObjectURL(file);
  });
}

type Slot = { kind: UploadKind; label: string; accept: string };

function slotsFor(section: UploadSection): Slot[] {
  return [
    { kind: 'cover', label: 'Artwork upload', accept: 'image/*' },
    { kind: 'photo-vertical', label: 'Vertical upload', accept: 'image/*' },
    { kind: 'video', label: 'Music video upload', accept: 'video/*' },
  ];
}

function UploadFiles() {
  const { addUpload } = useMe(); const nav = useNavigate();
  const { section } = Route.useSearch();
  const sec = UPLOAD_SECTIONS.find(x => x.id === section)!;
  const slots = slotsFor(section);
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [agreed, setAgreed] = useState(false); const [err, setErr] = useState('');
  const submit = async () => {
    if (!title.trim()) return setErr('Add a song title.');
    for (const s of slots) {
      const f = files[s.kind];
      if (!f) return setErr(`Choose a file for ${s.label}.`);
      if (f.size > MAX_PORTAL_FILE_BYTES) return setErr('Files can be up to 1GB.');
      if (s.kind === 'video' && (await videoSeconds(f)) > MAX_PORTAL_VIDEO_SECONDS + 0.5) return setErr('Videos can be up to 1 minute long.');
    }
    if (!agreed) return setErr('Agree to the Submission Release first.');
    for (const s of slots) addUpload({ kind: s.kind, title: title.trim(), description: '', releaseDate: '', fileName: files[s.kind]!.name });
    nav({ to: '/artist-portal/uploads' });
  };
  return <>
    <Button asChild variant="ghost" size="icon" className="join-back" aria-label="Back to portal"><Link to="/artist-portal"><ArrowLeft /></Link></Button>
    <h1 className="join-title">{sec.title}</h1>
    <p className="join-sub">Up to 1GB per file. Videos can be up to 1 minute long.</p>
    <label className="field-label" htmlFor="up-title">Song title</label>
    <input id="up-title" className="form-field" value={title} onChange={e => setTitle(e.target.value)} />
    {slots.map(s => <div key={s.kind}>
      <label className="field-label" htmlFor={`up-${s.kind}`}>{s.label}</label>
      <input id={`up-${s.kind}`} type="file" accept={s.accept} className="form-field pt-2.5" onChange={e => { const f = e.target.files?.[0] ?? null; setFiles(m => ({ ...m, [s.kind]: f })); }} />
    </div>)}
    <label className="flex gap-3 items-start mt-5 p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
      <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-primary" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
      <span>I have read and agree to the Submission Release. I confirm I own or control all rights in this content, that I am 18 or older, and I grant The Herd Music, LLC the license described in the Release.</span>
    </label>
    {err && <p className="upload-message upload-error">{err}</p>}
    <Button className="join-cta" onClick={submit}>Add upload</Button>
  </>;
}
