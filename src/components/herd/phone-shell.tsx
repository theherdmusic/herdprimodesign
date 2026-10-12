import { Link, useLocation } from '@tanstack/react-router';
import { AudioLines, BarChart3, Radio, CirclePlus, UserRound, Search, Signal, Wifi, BatteryFull, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { artists } from './data';
import herdLogoUrl from '@/assets/herd-logo.png';
import { OpeningVideo, useOpeningVideo } from './opening-video';
const tabs = [{to:'/',label:'Discovery',icon:AudioLines},{to:'/charts',label:'Charts',icon:BarChart3},{to:'/radio',label:'Radio',icon:Radio},{to:'/upload',label:'Upload',icon:CirclePlus},{to:'/profile',label:'Profile',icon:UserRound}] as const;
export function PhoneShell({children}:{children:ReactNode}) {
 const opening = useOpeningVideo();
 const path=useLocation({select:l=>l.pathname}); const [search,setSearch]=useState(false); const [query,setQuery]=useState('');
  return <main className="prototype-stage"><div className={`phone ${path==='/'?'feed-mode':''}`}>{opening.active&&<OpeningVideo/>}<div className="status-bar"><span>9:41</span><div className="status-icons"><Signal size={13}/><Wifi size={14}/><BatteryFull size={20}/></div></div><header className="brand-header"><Link to="/" className="brand" aria-label="Herd home"><img src={herdLogoUrl} className="herd-logo" alt="Herd logo"/></Link><div className="flex items-center gap-3"><span className="header-label">THE HERD MUSIC - STAY YOU. BE HERD</span><Button variant="ghost" size="icon" aria-label={search?'Close search':'Search artists'} onClick={()=>setSearch(!search)}>{search?<X/>:<Search/>}</Button></div></header>{search&&<div className="search-panel"><input className="form-field" aria-label="Search" placeholder="Artists, songs, sounds…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<div className="mt-3 text-xs">{artists.filter(a=>`${a.name} ${a.song}`.toLowerCase().includes(query.toLowerCase())).map((a,i)=><Link key={a.name} to="/profile" search={{artist:i}} onClick={()=>setSearch(false)} className="block py-2">{a.name} <span className="text-muted-foreground">· {a.song}</span></Link>)}{!artists.some(a=>`${a.name} ${a.song}`.toLowerCase().includes(query.toLowerCase()))&&'No artists found'}</div>}</div>}<section className="screen-content">{children}</section><nav className="tab-bar" aria-label="Main navigation">{tabs.map(t=><Link key={t.to} to={t.to} className={`tab-link ${path===t.to?'active':''}`}><t.icon strokeWidth={path===t.to?2.2:1.7}/><span>{t.label}</span></Link>)}</nav><div className="home-indicator"/></div></main>;
}
