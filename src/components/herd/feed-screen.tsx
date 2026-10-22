import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, Plus, Check, Send, X, Link2, MessageCircle, Flag, Search, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneShell, useReactAd } from './phone-shell';
import { artists, getArtist, genres } from './data';
import { useKeyboardInset } from '@/lib/herd-keyboard';
import { needsSignIn, type GatedAction } from '@/lib/herd-entry';
import { useOpeningVideo } from './opening-video';
import { REPORT_REASONS, useMe } from './me';
let feedIndex=0;
type Sheet = null|'share'|'comments'|'more'|'report'|'signin';
export function FeedScreen({initialTrack}:{initialTrack?:number|undefined}) {
 const { active: openingActive } = useOpeningVideo(); const { me } = useMe(); const nav=useNavigate();
 const [index,setIndex]=useState(feedIndex%artists.length); const [liked,setLiked]=useState<number[]>([]); const [following,setFollowing]=useState<number[]>([]);
 const [tab,setTab]=useState<'foryou'|'following'>('foryou'); const [sheet,setSheet]=useState<Sheet>(null); const [gateFor,setGateFor]=useState<GatedAction>('heart');
 const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState(''); const [genre,setGenre]=useState('All');
 const [note,setNote]=useState(''); const [draft,setDraft]=useState(''); const [comments,setComments]=useState<Record<number,{user:string;text:string}[]>>({});
 const {open:adOpen}=useReactAd();
 const touch=useRef(0); const wheel=useRef(0); const clip=useRef<HTMLVideoElement|null>(null); useKeyboardInset();
 useEffect(()=>{if(initialTrack!==undefined)setIndex(initialTrack%artists.length);},[initialTrack]);
 useEffect(()=>{feedIndex=index;},[index]);
 useEffect(()=>{ if(!note)return;const t=setTimeout(()=>setNote(''),2200);return()=>clearTimeout(t); },[note]);
  useEffect(()=>{const v=clip.current;if(!v)return;if(openingActive||adOpen){v.pause();return;}
   const start=()=>{if(!v.paused&&!v.muted)return;v.muted=false;v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});};
   // First touch anywhere turns sound on (browsers block sound until the visitor interacts once).
   const unlock=()=>{v.muted=false;v.play().catch(()=>{});};
   start(); v.addEventListener('loadeddata',start); v.addEventListener('canplay',start);
   window.addEventListener('pointerdown',unlock,{once:true}); window.addEventListener('touchstart',unlock,{once:true});
   return()=>{v.removeEventListener('loadeddata',start);v.removeEventListener('canplay',start);window.removeEventListener('pointerdown',unlock);window.removeEventListener('touchstart',unlock);};
  },[index,openingActive,adOpen]);
 const artist=getArtist(index); const isLiked=liked.includes(index); const isFollowing=following.includes(index);
 const sample=[{user:'@riffqueen',text:'This chorus lives in my head now 🔥'},{user:'@backroadkid',text:'Finally real indie music on my feed.'},{user:'@nightowl',text:'Need the full song ASAP'}]; const currentComments=[...sample,...(comments[index]??[])];
 const gate=(a:GatedAction,run:()=>void)=>{ if(needsSignIn(a,me!==null)){setGateFor(a);setSheet('signin');return;} run(); };
 const lineup=tab==='following'?following:artists.map((_,i)=>i);
  const next=()=>{ if(!lineup.length)return; const pos=lineup.indexOf(index); setIndex(lineup[(pos+1)%lineup.length]??0); };
  const prev=()=>{ if(!lineup.length)return; const pos=lineup.indexOf(index); if(pos<=0)return; setIndex(lineup[pos-1]??0); };
 const nextArtist=getArtist(lineup.length?(lineup[(lineup.indexOf(index)+1)%lineup.length]??index):index);
 const q=query.trim().toLowerCase();
 const hits=artists.map((a,i)=>({a,i})).filter(({a})=>(genre==='All'||a.genre===genre)&&(!q||`${a.name} ${a.song}`.toLowerCase().includes(q)));
 const busy=!!sheet||searchOpen||adOpen;
 return <PhoneShell><div className="feed" onTouchStart={e=>{touch.current=(e.touches[0]?.clientY??0);}} onTouchEnd={e=>{if(busy)return;const d=touch.current-(e.changedTouches[0]?.clientY??0);if(d>45)next();else if(d<-45)prev();}} onWheel={e=>{if(busy)return;const now=Date.now();if(now-wheel.current<700)return;if(e.deltaY>20){wheel.current=now;next();}else if(e.deltaY<-20){wheel.current=now;prev();}}}>
{artist.video?<video key={artist.video} ref={clip} className="feed-video" poster={artist.poster??artist.image} autoPlay={!openingActive} muted loop playsInline preload="auto" onClick={e=>{const v=e.currentTarget;if(v.paused){v.muted=false;v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});}else v.pause();}} aria-label={`${artist.name} performing ${artist.song}`}><source src={artist.video} type="video/mp4"/>{artist.videoWebm&&<source src={artist.videoWebm} type="video/webm"/>}</video>:<img key={artist.image} className="feed-photo" src={artist.image} alt={`${artist.name} performing ${artist.song}`}/>}<div className="feed-shade"/>
  {nextArtist.video&&nextArtist.video!==artist.video&&<video key={`preload-${nextArtist.video}`} className="feed-preload" preload="auto" muted playsInline aria-hidden="true"><source src={nextArtist.video} type="video/mp4"/>{nextArtist.videoWebm&&<source src={nextArtist.videoWebm} type="video/webm"/>}</video>}
  <div className="feed-top"><div className="feed-tabs">
   <button type="button" className={`feed-mode ${tab==='foryou'?'selected':''}`} onClick={()=>setTab('foryou')}>For You</button>
   <button type="button" className={`feed-mode ${tab==='following'?'selected':''}`} onClick={()=>{setTab('following');if(following.length){if(!following.includes(index))setIndex(following[0]!);}else setNote('Follow an artist to fill this tab.');}}>Following</button>
   <button type="button" className="feed-search-glass" aria-label="Search" onClick={()=>setSearchOpen(true)}><Search size={18}/></button>
  </div></div>
  <span className="rank-chip">#{index+1} this hour</span>
  <div className="feed-actions">
   <div className="feed-action avatar-follow"><Link to="/profile" search={{artist:index}} aria-label={`View ${artist.name}'s profile`}><img src={artist.image} className="feed-avatar" alt={artist.name}/></Link><Button className="follow-plus" aria-label={isFollowing?'Unfollow artist':'Follow artist'} onClick={()=>gate('follow',()=>setFollowing(v=>v.includes(index)?v.filter(i=>i!==index):[...v,index]))}>{isFollowing?<Check/>:<Plus/>}</Button></div>
   <div className="feed-action"><Button variant="ghost" className={`action-button ${isLiked?'text-primary':''}`} aria-label={isLiked?'Unlike video':'Heart video'} onClick={()=>gate('heart',()=>setLiked(v=>v.includes(index)?v.filter(i=>i!==index):[...v,index]))}><Heart fill={isLiked?'currentColor':'none'}/></Button><span>{isLiked?'12.9K':artist.hearts}</span><small className="vote-line">Your heart is a vote.</small></div>
   <div className="feed-action"><Button variant="ghost" className="action-button" aria-label="Open comments" onClick={()=>setSheet('comments')}><MessageCircle/></Button><span>{currentComments.length}</span></div>
   <div className="feed-action"><Button variant="ghost" className="action-button" aria-label="Share video" onClick={()=>setSheet('share')}><Send/></Button></div>
  </div>
  <div className="feed-bottom">{artist.newArtist&&<span className="new-artist-tag">New Artist</span>}<div className="artist-row"><Link to="/profile" search={{artist:index}} className="artist-line">{artist.name}</Link><button type="button" className="more-btn" aria-label="More options" onClick={()=>setSheet('more')}><MoreHorizontal size={20}/></button></div><p className="song-title">{artist.song}</p></div>
  </div>
  {searchOpen&&<div className="search-sheet" role="dialog" aria-label="Search"><div className="search-sheet-top"><div className="feed-search"><Search size={16}/><input aria-label="Search artists" placeholder="Artists or songs" value={query} onChange={e=>setQuery(e.target.value)} autoFocus/></div><button type="button" className="sheet-x" aria-label="Close search" onClick={()=>{setSearchOpen(false);setQuery('');}}><X size={20}/></button></div><div className="genre-chips">{genres.map(g=><button key={g} type="button" className={`genre-chip ${genre===g?'selected':''}`} onClick={()=>setGenre(g)}>{g}</button>)}</div><div className="search-hits">{hits.map(({a,i})=><button key={a.name} type="button" className="search-hit" onClick={()=>{setIndex(i);setTab('foryou');setSearchOpen(false);setQuery('');}}><img src={a.image} alt=""/><span><b>{a.name}</b><small>{a.song} · {a.genre}</small></span></button>)}{!hits.length&&<p className="feed-search-empty">No artists found</p>}</div></div>}
  {sheet==='share'&&<div className="share-panel" role="dialog" aria-label="Share"><div className="share-top"><strong>Share</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><Button className="share-link" onClick={async()=>{try{await navigator.clipboard.writeText(`${location.origin}/?track=${index}`);setNote('Link copied');}catch{setNote('Copy failed');}setSheet(null);}}><Link2/>Copy link</Button></div>}
  {sheet==='more'&&<div className="share-panel" role="dialog" aria-label="More options"><div className="share-top"><strong>Options</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><Button variant="secondary" className="share-link" onClick={()=>setSheet('report')}><Flag/>Report</Button></div>}
  {sheet==='report'&&<div className="share-panel" role="dialog" aria-label="Report this video"><div className="share-top"><strong>Report</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><ul className="report-list">{REPORT_REASONS.map(r=><li key={r}><button onClick={()=>{setSheet(null);setNote("Thanks. We'll review it.");}}>{r}</button></li>)}</ul></div>}
  {sheet==='signin'&&<div className="share-panel" role="dialog" aria-label="Sign in"><div className="share-top"><strong>Sign in to {gateFor}</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><Button className="share-link" onClick={()=>nav({to:'/join'})}>Log in</Button><Button variant="ghost" className="share-link mt-2" onClick={()=>setSheet(null)}>Not now</Button></div>}
  {sheet==='comments'&&<div className="comments-panel" role="dialog" aria-label="Comments"><div className="share-top"><strong>{currentComments.length} comments</strong><button className="sheet-x" aria-label="Close comments" onClick={()=>setSheet(null)}><X size={20}/></button></div><ul className="comments-list">{currentComments.map((c,i)=><li key={i}><span className="comment-avatar">{c.user[1]?.toUpperCase()}</span><div><b>{c.user}</b><p>{c.text}</p></div></li>)}</ul><form className="comment-form" onSubmit={e=>{e.preventDefault();const t=draft.trim();if(!t)return;gate('comment',()=>{setComments(c=>({...c,[index]:[...(c[index]??[]),{user:'@you',text:t}]}));setDraft('');});}}><input value={draft} onChange={e=>setDraft(e.target.value)} onFocus={()=>{if(needsSignIn('comment',me!==null)){setGateFor('comment');setSheet('signin');}}} placeholder="Add a comment…" aria-label="Add a comment"/><Button type="submit" size="icon" aria-label="Post comment" disabled={!draft.trim()}><Send size={16}/></Button></form></div>}
  {note&&<div className="toast-note" role="status">{note}</div>}
 </PhoneShell>;
}
