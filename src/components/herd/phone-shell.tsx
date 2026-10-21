import { Link, useLocation } from '@tanstack/react-router';
import { AudioLines, BarChart3, Tv, UserRound } from 'lucide-react';
import { type ReactNode } from 'react';
import herdLogoUrl from '@/assets/herd-logo.png';
import { OpeningVideo, useOpeningVideo } from './opening-video';
const tabs = [{to:'/',label:'Feed',icon:AudioLines},{to:'/charts',label:'Charts',icon:BarChart3},{to:'/upload',label:'TV',icon:Tv},{to:'/you',label:'You',icon:UserRound}] as const;
export function PhoneShell({children, landscape}:{children:ReactNode; landscape?:boolean}) {
 const opening = useOpeningVideo();
 const path=useLocation({select:l=>l.pathname});
 return <main className="prototype-stage"><div className={`phone ${path==='/'?'feed-full':''} ${landscape?'phone-landscape':''}`}>{opening.active&&<OpeningVideo/>}<header className="brand-header"><Link to="/" className="brand" aria-label="Herd home"><img src={herdLogoUrl} className="herd-logo" alt="Herd logo"/></Link></header><section className="screen-content">{children}</section><nav className="tab-bar" aria-label="Main navigation">{tabs.map(t=><Link key={t.to} to={t.to} className={`tab-link ${path===t.to?'active':''}`}><t.icon strokeWidth={path===t.to?2.2:1.7}/><span>{t.label}</span></Link>)}</nav><div className="home-indicator"/></div></main>;
}
