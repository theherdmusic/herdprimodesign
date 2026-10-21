import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { PhoneShell } from '@/components/herd/phone-shell';
import { artists, getArtist, songs, genres, pageHead } from '@/components/herd/data';
export const Route=createFileRoute('/charts')({head:()=>pageHead('Top 25','The independent music Top 25, updated hourly.'),component:Charts});
function Charts(){
 const [genre,setGenre]=useState('All');
 const rows=songs.map((song,i)=>{const a=getArtist(i);const title=i<artists.length?a.song:(genre==='All'?song:songs[(i+genres.indexOf(genre)*3)%25]);return {i,a,title,name:i<artists.length?a.name:['The Slow Days','June Wilder','Eastside Echo','Nova Lane'][i%4]};});
 const top=rows[0]!;
 return <PhoneShell><div className="page-inner charts"><h1 className="page-title">Top 25<span className="text-primary">.</span></h1><p className="page-subtitle">Updated hourly</p>
  <div className="genre-chips">{genres.map(g=><button key={g} type="button" className={`genre-chip ${genre===g?'selected':''}`} onClick={()=>setGenre(g)}>{g}</button>)}</div>
  <Link className="chart-hero" to="/" search={{track:top.i%artists.length}} style={{backgroundImage:`url(${top.a.image})`}}><span className="chart-hero-rank">#1</span><span className="chart-hero-text"><b>{top.title}</b><small>{top.name}</small></span></Link>
  <div>{rows.slice(1).map(r=><Link className="chart-row" key={r.i} to="/" search={{track:r.i%artists.length}}><span className="rank">{r.i+1}</span><img className="track-thumb" src={r.a.image} alt="" loading="lazy"/><div className="min-w-0"><div className="track-name">{r.title}</div><div className="track-artist">{r.name}</div></div></Link>)}</div>
 </div></PhoneShell>;
}
