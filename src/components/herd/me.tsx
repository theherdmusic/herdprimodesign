import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ArtistPage, PortalUpload } from '@/lib/herd-portal';

export type Me = { name: string; handle: string; bio: string; email: string; role: 'fan' | 'musician'; genres: string[]; follows: string[] };
export type MyVideo = { title: string; genre: string };

const EMPTY_PAGE: ArtistPage = { tagline: '', hometown: '', website: '', instagram: '', tiktok: '', youtube: '', spotify: '', color: '#00FFAA' };

type Ctx = {
  me: Me | null; setMe: (m: Me | null) => void; videos: MyVideo[]; addVideo: (v: MyVideo) => void;
  page: ArtistPage; setPage: (p: ArtistPage) => void; uploads: PortalUpload[]; addUpload: (u: PortalUpload) => void;
};
const MeContext = createContext<Ctx>({ me: null, setMe: () => {}, videos: [], addVideo: () => {}, page: EMPTY_PAGE, setPage: () => {}, uploads: [], addUpload: () => {} });

/** Mockup-only account state: lives in memory, resets on page reload. */
export function MeProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [videos, setVideos] = useState<MyVideo[]>([]);
  const [page, setPage] = useState<ArtistPage>(EMPTY_PAGE);
  const [uploads, setUploads] = useState<PortalUpload[]>([]);
  return <MeContext.Provider value={{ me, setMe, videos, addVideo: v => setVideos(list => [v, ...list]), page, setPage, uploads, addUpload: u => setUploads(list => [u, ...list]) }}>{children}</MeContext.Provider>;
}

export const useMe = () => useContext(MeContext);

export const GENRES = ['Rock', 'Country', 'Rap', 'Pop', 'R&B', 'Indie', 'Electronic', 'Folk', 'Latin', 'Metal'];

export const REPORT_REASONS = [
  'It uses music or video without permission',
  'Nudity or sexual content',
  'Violence or dangerous acts',
  'Hate speech or symbols',
  'Bullying or harassment',
  'Spam or misleading',
  'Something else',
];

/** Herd accounts require age 13+. */
export function isOldEnough(birthday: string, today = new Date()) {
  const b = new Date(birthday);
  if (Number.isNaN(b.getTime())) return false;
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age >= 13;
}
