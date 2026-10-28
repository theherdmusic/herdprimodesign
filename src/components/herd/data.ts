import mattieClip from '@/assets/mattie.mp4.asset.json';
import mattieClipWebm from '@/assets/mattie.webm.asset.json';
import mattiePoster from '@/assets/mattie.jpg.asset.json';
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
import dariannClip from '@/assets/dariann.mp4.asset.json';
import dariannClipWebm from '@/assets/dariann.webm.asset.json';
import dariannCover from '@/assets/dariann-poster.jpg.asset.json';
import hobbsClip from '@/assets/hobbs.mp4.asset.json';
import hobbsClipWebm from '@/assets/hobbs.webm.asset.json';
import hobbsCover from '@/assets/hobbs-poster.jpg.asset.json';
import vinniClip from '@/assets/vinni.mp4.asset.json';
import vinniClipWebm from '@/assets/vinni.webm.asset.json';
import vinniCover from '@/assets/vinni-poster.jpg.asset.json';
import rrClip from '@/assets/rr.mp4.asset.json';
import rrClipWebm from '@/assets/rr.webm.asset.json';
import rrCover from '@/assets/rr-poster.jpg.asset.json';
import moreno2Clip from '@/assets/moreno2.mp4.asset.json';
import moreno2ClipWebm from '@/assets/moreno2.webm.asset.json';
import moreno2Cover from '@/assets/moreno2-poster.jpg.asset.json';
export { live, studio };
export type HerdArtist = { name: string; song: string; genre: string; image: string; hearts: string; bio: string; handle: string; video?: string; videoWebm?: string; poster?: string; newArtist?: boolean };
export const artists: HerdArtist[] = [
 { name:'Chris Moreno', song:'Running out of daylight', genre:'Rock', image:runningCover.url, poster:runningCover.url, video:runningClip.url, videoWebm:runningClipWebm.url, hearts:'12.8K', bio:'A little grit. A lot of heart. Independent artist making noise out of Austin, TX.', handle:'@lunahhayes' },
 { name:'Chris Moreno', song:'Wonder Chorus', genre:'Rock', image:moreno2Cover.url, poster:moreno2Cover.url, video:moreno2Clip.url, videoWebm:moreno2ClipWebm.url, hearts:'9.1K', bio:'A little grit. A lot of heart. Independent artist making noise out of Austin, TX.', handle:'@lunahhayes' },
 { name:'Clever', song:'Something real', genre:'Hip Hop/Rap', image:elcaminoCover.url, poster:elcaminoCover.url, video:elcaminoClip.url, videoWebm:elcaminoClipWebm.url, hearts:'9.6K', bio:'Late nights, honest verses. Making music on my own terms. Chicago, IL.', handle:'@milescarter' },
 { name:'Grace', song:'Uneasy', genre:'Pop', image:graceCover.url, poster:graceCover.url, video:graceClip.url, videoWebm:graceClipWebm.url, hearts:'7.4K', bio:'Songs for the feelings you can\'t name. Nashville, TN.', handle:'@grace' },
 { name:'Brittany Elise', song:'YLL', genre:'Country', image:brittCover.url, poster:brittCover.url, video:brittClip.url, videoWebm:brittClipWebm.url, hearts:'6.1K', bio:'Small-town stories with a big voice. Tennessee backroads and honest country. Nashville, TN.', handle:'@brittanyelise', newArtist:true },
 { name:'Dariann', song:'Daddy', genre:'Country', image:dariannCover.url, poster:dariannCover.url, video:dariannClip.url, videoWebm:dariannClipWebm.url, hearts:'4.8K', bio:'Safety pins, spurs and a whole lot of attitude. Country with the volume up. Nashville, TN.', handle:'@dariann', newArtist:true },
 { name:'Hobbs', song:'SGL', genre:'Country', image:hobbsCover.url, poster:hobbsCover.url, video:hobbsClip.url, videoWebm:hobbsClipWebm.url, hearts:'3.9K', bio:'Meadow sunsets and honest hooks. Country made for front-porch evenings. Austin, TX.', handle:'@hobbs', newArtist:true },
 { name:'Big Vinni', song:'Walmart Pool', genre:'Country', image:vinniCover.url, poster:vinniCover.url, video:vinniClip.url, videoWebm:vinniClipWebm.url, hearts:'2.7K', bio:'Full send, no brakes. Songs for the last day of summer. Nashville, TN.', handle:'@bigvinni', newArtist:true },
 { name:'RR', song:'Untitled', genre:'Country', image:rrCover.url, poster:rrCover.url, video:rrClip.url, videoWebm:rrClipWebm.url, hearts:'1.9K', bio:'New to the Herd. First video just dropped.', handle:'@rr', newArtist:true },
 { name:'Jade Rivers', song:'Neon Nights', genre:'Pop', image:mattiePoster.url, poster:mattiePoster.url, video:mattieClip.url, videoWebm:mattieClipWebm.url, hearts:'15.2K', bio:'Arena-ready pop with a streetwise edge. Los Angeles, CA.', handle:'@jaderivers', newArtist:true },
];
export const songs = ['Running out of daylight','Something real','Backroad summer','Velvet skies','Nothing to lose','After hours','Wildflower','Slow motion','Stay a little longer','City lights','Good enough','Golden hour','Home again','No apologies','Between the lines','Headlights','On my own','Midnight drive','Let it go','Blue Sunday','All we know','Easy days','Break the silence','Tomorrow','One more time'];
export const genres = ['All','Pop','Rock','Country','Hip Hop/Rap','EDM'];
export function pageHead(title:string, description:string) { return { meta:[{title:`${title} · Herd`},{name:'description',content:description},{property:'og:title',content:`${title} · Herd`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}] }; }

export function getArtist(index:number): HerdArtist { return artists[index % artists.length] ?? { name:"Luna Hayes", song:"Running out of daylight", genre:"Rock", image:live, hearts:"12.8K", bio:"Independent artist making noise out of Austin, TX.", handle:"@lunahhayes" }; }
