/* Pure game state, shared by the browser and regression tests. */
(function(root){
const DURATION=45;
function create(){return {mode:'idle',elapsed:0,score:0,cakes:0,lane:1,items:[],spawnIn:.45,shield:0,slow:0,invulnerable:0,serial:0};}
function start(s){Object.assign(s,create(),{mode:'playing'});}
function move(s,dir){if(s.mode==='playing')s.lane=Math.max(0,Math.min(2,s.lane+dir));}
function rank(score){return score>=1600?'滿月領航員':score>=1000?'月餅配送王':score>=500?'團圓守護者':'月光小旅人';}
function step(s,delta,random=Math.random){
 if(s.mode!=='playing')return [];
 const dt=Math.min(Math.max(delta,0),.05),events=[];
 s.elapsed=Math.min(DURATION,s.elapsed+dt);s.shield=Math.max(0,s.shield-dt);s.slow=Math.max(0,s.slow-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
 s.spawnIn-=dt;
 if(s.spawnIn<=0){s.spawnIn=.59-.15*(s.elapsed/DURATION);const lane=Math.floor(random()*3),r=random();const type=r<.16?'rock':r<.23?'shield':r<.4?'star':'cake';s.items.push({id:++s.serial,lane,type,z:0,checked:false});}
 for(const o of s.items){o.z+=dt*(.30+s.elapsed*.0018)*(s.slow>0?.55:1);if(!o.checked&&o.z>=.87){o.checked=true;if(o.lane===s.lane){if(o.type==='rock'){if(s.shield>0){s.shield=0;events.push('protected');}else if(s.invulnerable===0){s.slow=1.25;s.invulnerable=1.1;events.push('hit');}}else{if(o.type==='cake'){s.cakes++;s.score+=100;}if(o.type==='star')s.score+=30;if(o.type==='shield')s.shield=5;events.push(o.type);o.collected=true;}}}}
 s.items=s.items.filter(o=>o.z<1.15&&!o.collected);
 if(s.elapsed>=DURATION){s.mode='finished';events.push('finish');}
 return events;
}
const api={DURATION,create,start,move,rank,step};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MoonEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
