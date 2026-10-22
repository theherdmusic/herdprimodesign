import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/components/herd/data';
import { useMe } from '@/components/herd/me';
import { isValidReleaseDate, MAX_PORTAL_FILE_BYTES, MAX_PORTAL_VIDEO_SECONDS, UPLOAD_KINDS, UPLOAD_SECTIONS, type UploadKind, type UploadSection } from '@/lib/herd-portal';

export const Route = createFileRoute('/artist-portal/upload')({
  validateSearch: (s: Record<string, unknown>): { section: UploadSection } => ({ section: UPLOAD_SECTIONS.some(x => x.id === s['section']) ? s['section'] as UploadSection : 'verticals' }),
  head: () => pageHead('Upload · Artist Portal', 'Send Herd your vertical videos, horizontal photos and artwork.'),
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

function UploadFiles() {
  const { addUpload } = useMe(); const nav = useNavigate();
  const { section } = Route.useSearch();
  const sec = UPLOAD_SECTIONS.find(x => x.id === section)!;
  const [kind, setKind] = useState<UploadKind>(sec.kinds[0]!);
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [releaseDate, setReleaseDate] = useState('');
  const [file, setFile] = useState<File | null>(null); const [agreed, setAgreed] = useState(false); const [err, setErr] = useState('');
  const k = UPLOAD_KINDS.find(x => x.id === kind)!;
  const submit = async () => {
    if (!title.trim()) return setErr('Add a title.');
    if (!file) return setErr('Choose a file.');
    if (file.size > MAX_PORTAL_FILE_BYTES) return setErr('Files can be up to 1GB.');
    if (kind === 'video' && !isValidReleaseDate(releaseDate)) return setErr('Release date must be within the last 6 months, or upcoming.');
    if (kind === 'video' && (await videoSeconds(file)) > MAX_PORTAL_VIDEO_SECONDS + 0.5) return setErr('Videos can be up to 1 minute long.');
    if (!agreed) return setErr('Agree to the Submission Release first.');
    addUpload({ kind, title: title.trim(), description, releaseDate, fileName: file.name });
    nav({ to: '/artist-portal/uploads' });
  };
  return <>
    <Button asChild variant="ghost" size="icon" className="join-back" aria-label="Back to portal"><Link to="/artist-portal"><ArrowLeft /></Link></Button>
    <h1 className="join-title">{sec.title}</h1>
    <p className="join-sub">Up to 1GB per file. Videos can be up to 1 minute long.</p>
    {sec.kinds.length > 1 && <><label className="field-label">File type</label>
    <div className="chip-grid">{UPLOAD_KINDS.filter(x => sec.kinds.includes(x.id)).map(x => <button key={x.id} className={`genre-chip ${kind === x.id ? 'selected' : ''}`} onClick={() => { setKind(x.id); setFile(null); setErr(''); }}>{x.label}</button>)}</div></>}
    <p className="text-xs text-muted-foreground mt-2">{k.hint}</p>
    <label className="field-label" htmlFor="up-title">Title</label>
    <input id="up-title" className="form-field" value={title} onChange={e => setTitle(e.target.value)} />
    <label className="field-label" htmlFor="up-desc">Description</label>
    <input id="up-desc" className="form-field" value={description} onChange={e => setDescription(e.target.value)} />
    {kind === 'video' && <><label className="field-label" htmlFor="up-date">Release date</label>
    <input id="up-date" type="date" className="form-field" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
    <p className="text-xs text-muted-foreground mt-2">Already out? Must be within the last 6 months. Not out yet? Pick the upcoming date.</p></>}
    <label className="field-label" htmlFor="up-file">File</label>
    <input key={kind} id="up-file" type="file" accept={k.accept} className="form-field pt-2.5" onChange={e => setFile(e.target.files?.[0] ?? null)} />
    <label className="flex gap-3 items-start mt-5 p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
      <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-primary" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
      <span>I have read and agree to the Submission Release. I confirm I own or control all rights in this content, that I am 18 or older, and I grant The Herd Music, LLC the license described in the Release.</span>
    </label>
    {err && <p className="upload-message upload-error">{err}</p>}
    <Button className="join-cta" onClick={submit}>Add upload</Button>
  </>;
}
