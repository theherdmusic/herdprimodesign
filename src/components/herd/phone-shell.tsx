import { Link, useLocation } from '@tanstack/react-router';
import { AudioLines, BarChart3, Tv, UserRound } from 'lucide-react';
import { createContext, Fragment, useContext, useEffect, useState, type ReactNode } from 'react';
import herdLogoUrl from '@/assets/herd-logo.png';
import reactAUrl from '@/assets/react-a.png';
import { OpeningVideo, useOpeningVideo } from './opening-video';
import { ReactAd } from './react-ad';
const tabs = [{to:'/',label:'Discovery',icon:AudioLines},{to:'/charts',label:'Charts',icon:BarChart3},{to:'/upload',label:'TV',icon:Tv},{to:'/you',label:'You',icon:UserRound}] as const;
const ReactAdContext = createContext<{open:boolean;setOpen:(open:boolean)=>void}>({open:false,setOpen:()=>{}});
export function useReactAd(){ return useContext(ReactAdContext); }
export function ReactAdProvider({children}:{children:ReactNode}){ const [open,setOpen]=useState(false); return <ReactAdContext.Provider value={{open,setOpen}}>{children}</ReactAdContext.Provider>; }
export function PhoneShell({children, landscape}:{children:ReactNode; landscape?:boolean}) {
  const opening = useOpeningVideo();
  const path=useLocation({select:l=>l.pathname});
  const {open:reactOpen,setOpen:setReactOpen}=useReactAd();
  // Every page starts at its top: the phone's inner scroll area would otherwise keep the previous page's position.
  useEffect(()=>{ const el=document.querySelector<HTMLElement>('.screen-content'); if(!el) return;
    el.scrollTop=0; requestAnimationFrame(()=>{ el.scrollTop=0; });
  },[path]);
  return <main className="prototype-stage"><div className={`phone ${path==='/'?'feed-full':''} ${landscape?'phone-landscape':''}`}>{opening.active&&<OpeningVideo/>}<header className="brand-header"><Link to="/" className="brand" aria-label="Herd home"><img src={herdLogoUrl} className="herd-logo" alt="Herd logo"/></Link></header><section className="screen-content">{children}</section><nav className="tab-bar" aria-label="Main navigation">{tabs.map((t,i)=><Fragment key={t.to}>{i===2&&<button type="button" className="tab-link tab-react" aria-label="React & Win" onClick={()=>setReactOpen(true)}><img src={reactAUrl} className="tab-react-img" alt=""/></button>}<Link to={t.to} className={`tab-link ${path===t.to?'active':''}`}><t.icon strokeWidth={path===t.to?2.2:1.7}/><span>{t.label}</span></Link></Fragment>)}</nav>{reactOpen&&<ReactAd onClose={()=>setReactOpen(false)}/>}</div></main>;
}
