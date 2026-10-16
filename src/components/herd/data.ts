import live from '@/assets/indie-live.jpg';
import studio from '@/assets/artist-studio.jpg';
import runningClip from '@/assets/herd-video.mp4.asset.json';
import runningClipWebm from '@/assets/herd-video.webm.asset.json';
import runningCover from '@/assets/herd-video-poster.jpg.asset.json';
import elcaminoClip from '@/assets/elcamino.mp4.asset.json';
import elcaminoClipWebm from '@/assets/elcamino.webm.asset.json';
import elcaminoCover from '@/assets/elcamino-poster.jpg.asset.json';
import graceClip from '@/assets/grace.mp4.asset.json';
import graceClipWebm from '@/assets/grace.webm.asset.json';
import graceCover from '@/assets/grace-poster.jpg.asset.json';
import brittClip from '@/assets/britt.mp4.asset.json';
import brittClipWebm from '@/assets/britt.webm.asset.json';
import brittCover from '@/assets/britt-poster.jpg.asset.json';
export { live, studio };
export type HerdArtist = { name: string; song: string; genre: string; image: string; hearts: string; bio: string; handle: string; video?: string; videoWebm?: string; poster?: string };
export const artists: HerdArtist[] = [
 { name:'Grace Maher', song:'Running out of daylight', genre:'Indie Rock', image:runningCover.url, poster:runningCover.url, video:runningClip.url, videoWebm:runningClipWebm.url, hearts:'12.8K', bio:'A little grit. A lot of heart. Independent artist making noise out of Austin, TX.', handle:'@lunahhayes' },
 { name:'Miles Carter', song:'Something real', genre:'Rap', image:elcaminoCover.url, poster:elcaminoCover.url, video:elcaminoClip.url, videoWebm:elcaminoClipWebm.url, hearts:'9.6K', bio:'Late nights, honest verses. Making music on my own terms. Chicago, IL.', handle:'@milescarter' },
 { name:'Grace', song:'Uneasy', genre:'Pop', image:graceCover.url, poster:graceCover.url, video:graceClip.url, videoWebm:graceClipWebm.url, hearts:'7.4K', bio:'Songs for the feelings you can\'t name. Nashville, TN.', handle:'@grace' },
 { name:'Brittany Elise', song:'YLL', genre:'Country', image:brittCover.url, poster:brittCover.url, video:brittClip.url, videoWebm:brittClipWebm.url, hearts:'6.1K', bio:'Small-town stories with a big voice. Tennessee backroads and honest country. Nashville, TN.', handle:'@brittanyelise' },
];
export const songs = ['Running out of daylight','Something real','Backroad summer','Velvet skies','Nothing to lose','After hours','Wildflower','Slow motion','Stay a little longer','City lights','Good enough','Golden hour','Home again','No apologies','Between the lines','Headlights','On my own','Midnight drive','Let it go','Blue Sunday','All we know','Easy days','Break the silence','Tomorrow','One more time'];
export const genres = ['All','Rock','Country','Rap','Pop','R&B','Electronic'];
export function pageHead(title:string, description:string) { return { meta:[{title:`${title} · Herd`},{name:'description',content:description},{property:'og:title',content:`${title} · Herd`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}] }; }

export function getArtist(index:number): HerdArtist { return artists[index % artists.length] ?? { name:"Luna Hayes", song:"Running out of daylight", genre:"Indie Rock", image:live, hearts:"12.8K", bio:"Independent artist making noise out of Austin, TX.", handle:"@lunahhayes" }; }
