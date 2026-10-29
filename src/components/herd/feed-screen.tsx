import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, Plus, Check, Send, X, Link2, MessageCircle, Flag, Search, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneShell, useReactAd } from './phone-shell';
import { artists, getArtist, genres, type HerdArtist } from './data';
import { useKeyboardInset } from '@/lib/herd-keyboard';
import { needsSignIn, type GatedAction } from '@/lib/herd-entry';
import { feedRankedIndexes, parseHearts, formatHearts, chartMove } from '@/lib/herd-charts';
import { useOpeningVideo } from './opening-video';
import { REPORT_REASONS, useMe } from './me';
let feedIndex=0; let soundOn=false; let justUnlocked=0; let mp4Ok:boolean|null=null;
// Pick one file per clip: iPhones get the MP4, browsers without H.264 get the WebM.
function clipSrc(a:HerdArtist){ if(mp4Ok===null&&typeof document!=='undefined')mp4Ok=document.createElement('video').canPlayType('video/mp4; codecs="avc1.64001F"')!==''; return (mp4Ok!==false||!a.videoWebm)?a.video:a.videoWebm; }
// User-activation events: phones only let a video play with sound inside one of these, never on pointerdown/touchstart.
const ACTIVATION=['touchend','pointerup','click','keydown'] as const;
type Sheet = null|'share'|'comments'|'more'|'report'|'signin';
type FeedTab = 'discovery'|'top100'|'following';
export function FeedScreen({initialTrack}:{initialTrack?:number|undefined}) {
 const { active: openingActive } = useOpeningVideo(); const { me } = useMe(); const nav=useNavigate();
 const [index,setIndex]=useState(feedIndex%artists.length); const [liked,setLiked]=useState<number[]>([]); const [following,setFollowing]=useState<number[]>([]);
 const [tab,setTab]=useState<FeedTab>('discovery'); const [sheet,setSheet]=useState<Sheet>(null); const [gateFor,setGateFor]=useState<GatedAction>('heart');
 const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState(''); const [genre,setGenre]=useState('All');
 const [note,setNote]=useState(''); const [draft,setDraft]=useState(''); const [comments,setComments]=useState<Record<number,{user:string;text:string}[]>>({});
  const {open:adOpen}=useReactAd();
  const [burst,setBurst]=useState(0); const [tip,setTip]=useState(false); const bar=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{try{if(!localStorage.getItem('herd-vote-tip')){setTip(true);localStorage.setItem('herd-vote-tip','1');const t=setTimeout(()=>setTip(false),5000);return()=>clearTimeout(t);}}catch{/* storage blocked */}},[]);
  const touch=useRef(0); const wheel=useRef(0); const clip=useRef<HTMLVideoElement|null>(null); const userPaused=useRef(false); useKeyboardInset();
 const blocked=useRef(false); blocked.current=openingActive||adOpen;
 useEffect(()=>{if(initialTrack!==undefined)setIndex(initialTrack%artists.length);},[initialTrack]);
 useEffect(()=>{feedIndex=index;},[index]);
 useEffect(()=>{ if(!note)return;const t=setTimeout(()=>setNote(''),2200);return()=>clearTimeout(t); },[note]);
 // One video element is reused for every clip. Phones "bless" an element after a tap, so keeping the same
 // element (and swapping its file during the swipe itself) lets every next clip autoplay, with sound once unlocked.
 const playClip=(i:number)=>{const v=clip.current;const a=getArtist(i);if(!v||!a.video)return;const src=clipSrc(a)!;
  if(v.dataset['src']!==src){v.dataset['src']=src;v.src=src;}
  if(blocked.current)return;
  v.defaultMuted=!soundOn;v.muted=!soundOn;
  const p=v.play() as Promise<void>|undefined;
  p?.catch?.((err:unknown)=>{if((err as {name?:string})?.name==='NotAllowedError'){soundOn=false;v.muted=true;v.play()?.catch?.(()=>{});}});};
 useEffect(()=>{const v=clip.current;if(!v)return;if(openingActive||adOpen){v.pause();return;}
   playClip(index);
   const kick=()=>{if(v.paused&&!userPaused.current)playClip(index);};
   const evs=['loadedmetadata','loadeddata','canplay','canplaythrough','stalled','suspend'];evs.forEach(e=>v.addEventListener(e,kick));
   const retry=setInterval(kick,500);
   return()=>{clearInterval(retry);evs.forEach(e=>v.removeEventListener(e,kick));};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[index,openingActive,adOpen]);
 useEffect(()=>{
   const unlock=()=>{if(soundOn||blocked.current)return;const v=clip.current;if(!v)return;justUnlocked=Date.now();soundOn=true;v.muted=false;
     v.play()?.catch?.(()=>{soundOn=false;v.muted=true;v.play()?.catch?.(()=>{});});};
   ACTIVATION.forEach(e=>window.addEventListener(e,unlock));
   return()=>ACTIVATION.forEach(e=>window.removeEventListener(e,unlock));
  },[]);
 const go=(i:number)=>{userPaused.current=false;setIndex(i);playClip(i);};
 const artist=getArtist(index); const isLiked=liked.includes(index); const isFollowing=following.includes(index);
 const sample=[{user:'@riffqueen',text:'This chorus lives in my head now 🔥'},{user:'@backroadkid',text:'Finally real indie music on my feed.'},{user:'@nightowl',text:'Need the full song ASAP'}]; const currentComments=[...sample,...(comments[index]??[])];
 const gate=(a:GatedAction,run:()=>void)=>{ if(needsSignIn(a,me!==null)){setGateFor(a);setSheet('signin');return;} run(); };
 const lineup=tab==='following'?following:tab==='top100'?feedRankedIndexes():artists.map((_,i)=>i); const rank=tab==='top100'?(lineup.indexOf(index)+1):index+1;
  const next=()=>{ if(!lineup.length)return; const pos=lineup.indexOf(index); go(lineup[(pos+1)%lineup.length]??0); };
  const prev=()=>{ if(!lineup.length)return; const pos=lineup.indexOf(index); if(pos<=0)return; go(lineup[pos-1]??0); };
 const q=query.trim().toLowerCase();
 const hits=artists.map((a,i)=>({a,i})).filter(({a})=>(genre==='All'||a.genre===genre)&&(!q||`${a.name} ${a.song}`.toLowerCase().includes(q)));
 const busy=!!sheet||searchOpen||adOpen;
 return <PhoneShell><div className="feed" onTouchStart={e=>{touch.current=(e.touches[0]?.clientY??0);}} onTouchEnd={e=>{if(busy)return;const d=touch.current-(e.changedTouches[0]?.clientY??0);if(d>45)next();else if(d<-45)prev();}} onWheel={e=>{if(busy)return;const now=Date.now();if(now-wheel.current<700)return;if(e.deltaY>20){wheel.current=now;next();}else if(e.deltaY<-20){wheel.current=now;prev();}}}>
<video ref={clip} className="feed-video" poster={artist.poster??artist.image} autoPlay={!openingActive&&!adOpen} muted loop playsInline preload="auto" onTimeUpdate={e=>{const v=e.currentTarget;if(bar.current&&v.duration)bar.current.style.transform=`scaleX(${v.currentTime/v.duration})`;}} onError={()=>{const a=getArtist(index);if(a.videoWebm&&clip.current?.dataset['src']===a.video){mp4Ok=false;playClip(index);}}} onClick={e=>{const v=e.currentTarget;if(Date.now()-justUnlocked<800)return;if(v.muted){soundOn=true;v.muted=false;userPaused.current=false;if(v.paused)v.play()?.catch?.(()=>{});}else if(v.paused){userPaused.current=false;v.play()?.catch?.(()=>{});}else{userPaused.current=true;v.pause();}}} aria-label={`${artist.name} performing ${artist.song}`}/>{!artist.video&&<img key={artist.image} className="feed-photo" src={artist.image} alt={`${artist.name} performing ${artist.song}`}/>}<div className="feed-shade"/>
  <div className="feed-top"><div className="feed-tabs">
   <button type="button" className={`feed-mode ${tab==='discovery'?'selected':''}`} onClick={()=>setTab('discovery')}>For You</button>
   <button type="button" className={`feed-mode ${tab==='top100'?'selected':''}`} onClick={()=>{setTab('top100');setIndex(feedRankedIndexes()[0]??index);}}>Top 25</button>
   <button type="button" className={`feed-mode ${tab==='following'?'selected':''}`} onClick={()=>{setTab('following');if(following.length){if(!following.includes(index))setIndex(following[0]!);}else setNote('Follow an artist to fill this tab.');}}>Following</button>
   <button type="button" className="feed-search-glass" aria-label="Search" onClick={()=>setSearchOpen(true)}><Search size={18}/></button>
  </div></div>
  <span className="rank-chip">#{rank} this hour</span>
  <div className="feed-actions">
   <div className="feed-action avatar-follow"><Link to="/profile" search={{artist:index}} aria-label={`View ${artist.name}'s profile`}><img src={artist.image} className="feed-avatar" alt={artist.name}/></Link><Button className="follow-plus" aria-label={isFollowing?'Unfollow artist':'Follow artist'} onClick={()=>gate('follow',()=>setFollowing(v=>v.includes(index)?v.filter(i=>i!==index):[...v,index]))}>{isFollowing?<Check/>:<Plus/>}</Button></div>
   <div className="feed-action"><Button variant="ghost" className={`action-button ${isLiked?'text-primary':''}`} aria-label={isLiked?'Unlike video':'Heart video'} onClick={()=>gate('heart',()=>{if(!isLiked){setBurst(b=>b+1);setNote(`+1 vote for ${artist.name}`);navigator.vibrate?.(12);}setLiked(v=>v.includes(index)?v.filter(i=>i!==index):[...v,index]);})}><Heart key={`h${burst}`} className={burst&&isLiked?'heart-pop':''} fill={isLiked?'currentColor':'none'}/>{burst>0&&isLiked&&<span key={`b${burst}`} className="heart-burst" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{['--a' as string]:`${i*45}deg`}}/>)}</span>}</Button><span key={burst} className={`heart-count ${burst?'tick':''}`}>{formatHearts(parseHearts(artist.hearts)+(isLiked?1:0))}</span>{tip&&<small className="vote-tip" role="tooltip">Your heart is a vote.</small>}</div>
   <div className="feed-action"><Button variant="ghost" className="action-button" aria-label="Open comments" onClick={()=>setSheet('comments')}><MessageCircle/></Button><span>{currentComments.length}</span></div>
   <div className="feed-action"><Button variant="ghost" className="action-button" aria-label="Share video" onClick={()=>setSheet('share')}><Send/></Button></div>
  </div>
  <div className="feed-bottom">{artist.newArtist&&<span className="new-artist-tag">New Artist</span>}<div className="artist-row"><Link to="/profile" search={{artist:index}} className="artist-line">{artist.name}</Link><button type="button" className="more-btn" aria-label="More options" onClick={()=>setSheet('more')}><MoreHorizontal size={20}/></button></div><div className="artist-meta"><span className="feed-genre">{artist.genre}</span>{(()=>{const m=chartMove(index);return <span className={`move-chip ${m>0?'up':'down'}`}>{m>0?`▲ ${m} spots today`:`▼ ${-m}`}</span>;})()}</div><div className="song-line"><span className="sound-wave" aria-hidden="true"><i/><i/><i/><i/></span><div className="song-marquee"><span key={index} className={artist.song.length>22?'scroll':''}>{artist.song}</span></div></div></div><div className="feed-progress" aria-hidden="true"><div ref={bar}/></div>
  </div>
  {searchOpen&&<div className="search-sheet" role="dialog" aria-label="Search"><div className="search-sheet-top"><div className="feed-search"><Search size={16}/><input aria-label="Search artists" placeholder="Artists or songs" value={query} onChange={e=>setQuery(e.target.value)} autoFocus/></div><button type="button" className="sheet-x" aria-label="Close search" onClick={()=>{setSearchOpen(false);setQuery('');}}><X size={20}/></button></div><div className="genre-chips">{genres.map(g=><button key={g} type="button" className={`genre-chip ${genre===g?'selected':''}`} onClick={()=>setGenre(g)}>{g}</button>)}</div><div className="search-hits">{hits.map(({a,i})=><button key={a.name} type="button" className="search-hit" onClick={()=>{setIndex(i);setTab('discovery');setSearchOpen(false);setQuery('');}}><img src={a.image} alt=""/><span><b>{a.name}</b><small>{a.song} · {a.genre}</small></span></button>)}{!hits.length&&<p className="feed-search-empty">No artists found</p>}</div></div>}
  {sheet==='share'&&<div className="share-panel" role="dialog" aria-label="Share"><div className="share-top"><strong>Share</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><Button className="share-link" onClick={async()=>{try{await navigator.clipboard.writeText(`${location.origin}/?track=${index}`);setNote('Link copied');}catch{setNote('Copy failed');}setSheet(null);}}><Link2/>Copy link</Button></div>}
  {sheet==='more'&&<div className="share-panel" role="dialog" aria-label="More options"><div className="share-top"><strong>Options</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><Button variant="secondary" className="share-link" onClick={()=>setSheet('report')}><Flag/>Report</Button></div>}
  {sheet==='report'&&<div className="share-panel" role="dialog" aria-label="Report this video"><div className="share-top"><strong>Report</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><ul className="report-list">{REPORT_REASONS.map(r=><li key={r}><button onClick={()=>{setSheet(null);setNote("Thanks. We'll review it.");}}>{r}</button></li>)}</ul></div>}
  {sheet==='signin'&&<div className="share-panel" role="dialog" aria-label="Sign in"><div className="share-top"><strong>Sign in to {gateFor}</strong><button className="sheet-x" aria-label="Close" onClick={()=>setSheet(null)}><X size={20}/></button></div><Button className="share-link" onClick={()=>nav({to:'/join'})}>Log in</Button><Button variant="ghost" className="share-link mt-2" onClick={()=>setSheet(null)}>Not now</Button></div>}
  {sheet==='comments'&&<div className="comments-panel" role="dialog" aria-label="Comments"><div className="share-top"><strong>{currentComments.length} comments</strong><button className="sheet-x" aria-label="Close comments" onClick={()=>setSheet(null)}><X size={20}/></button></div><ul className="comments-list">{currentComments.map((c,i)=><li key={i}><span className="comment-avatar">{c.user[1]?.toUpperCase()}</span><div><b>{c.user}</b><p>{c.text}</p></div></li>)}</ul><form className="comment-form" onSubmit={e=>{e.preventDefault();const t=draft.trim();if(!t)return;gate('comment',()=>{setComments(c=>({...c,[index]:[...(c[index]??[]),{user:'@you',text:t}]}));setDraft('');});}}><input value={draft} onChange={e=>setDraft(e.target.value)} onFocus={()=>{if(needsSignIn('comment',me!==null)){setGateFor('comment');setSheet('signin');}}} placeholder="Add a comment…" aria-label="Add a comment"/><Button type="submit" size="icon" aria-label="Post comment" disabled={!draft.trim()}><Send size={16}/></Button></form></div>}
  {note&&<div className="toast-note" role="status">{note}</div>}
 </PhoneShell>;
}
