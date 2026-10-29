import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PhoneShell } from '@/components/herd/phone-shell';
import { artists, genres, pageHead } from '@/components/herd/data';
import { CHART_MONTHS, getChartRows, monthTopGenre } from '@/lib/herd-charts';
export const Route=createFileRoute('/charts')({head:()=>pageHead('Top 25','Explore Herd’s independent music Top 25 by genre and month.'),component:Charts});
function Charts(){
 const [genre,setGenre]=useState('All');
 const [month,setMonth]=useState<number|null>(null);
 const [monthsOpen,setMonthsOpen]=useState(false);
 const rows=getChartRows(genre,month);
 const topGenre=month!==null?monthTopGenre(month):null;
 const top=rows[0];
 if(!top) return null;
 return <PhoneShell><div className="page-inner charts"><h1 className="page-title">Top 25<span className="text-primary">.</span></h1><p className="page-subtitle">{month===null?'Updated hourly':CHART_MONTHS[month]}</p>
  {topGenre&&<div className="month-top-genre"><Flame aria-hidden />Most hearts this month: {topGenre}</div>}
  <div className="genre-chips">{genres.map(g=>g==='All'?<Popover key={g} open={monthsOpen} onOpenChange={setMonthsOpen}>
   <PopoverTrigger asChild><Button variant="ghost" className={`genre-chip ${genre==='All'?'selected':''}`} onClick={()=>setGenre('All')}>All<ChevronDown/></Button></PopoverTrigger>
   <PopoverContent align="start" className="w-72 max-w-[calc(100vw-32px)]" aria-label="Chart month">
    <h2 className="mb-3 text-sm font-semibold">Top 25 by month</h2>
    <div className="grid grid-cols-3 gap-1">{CHART_MONTHS.map((label,i)=><Button key={label} variant={month===i?'default':'ghost'} className="h-11 px-1 text-xs" aria-pressed={month===i} onClick={()=>{setMonth(i);setGenre('All');setMonthsOpen(false);}}>{label}</Button>)}</div>
   </PopoverContent>
  </Popover>:<Button variant="ghost" key={g} type="button" className={`genre-chip ${genre===g?'selected':''}`} onClick={()=>setGenre(g)}>{g}</Button>)}</div>
  <Link key={`${month}-${genre}`} className="chart-hero chart-in" to="/" search={{track:top.i%artists.length}} style={{backgroundImage:`url(${top.a.image})`}}><span className="chart-hero-rank">#1</span><span className="chart-hero-text"><b>{top.title}</b><small>{top.name}</small></span></Link>
  <div>{rows.slice(1).map((r,rank)=><Link className="chart-row chart-in" style={{animationDelay:`${Math.min(rank,12)*35}ms`}} key={`${month}-${genre}-${r.i}`} to="/" search={{track:r.i%artists.length}}><span className="rank rank-pop">{rank+2}</span><img className="track-thumb" src={r.a.image} alt="" loading="lazy"/><div className="min-w-0"><div className="track-name">{r.title}</div><div className="track-artist">{r.name}</div></div></Link>)}</div>
 </div></PhoneShell>;
}
