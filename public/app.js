'use strict';
const $=id=>document.getElementById(id), E=MoonEngine, state=E.create(), canvas=$('game'), ctx=canvas.getContext('2d');
const W=480,H=760,PAPER='#f9f4ee',GREEN='#3d6e5a';
const publicURL=new URL('./',location.href).href;
let prev=0,visualLane=1,animation=0,particles=[],toastTimer,sound=false,audio,cardBlob=null,cardURL=null;
const hero=$('hero'),logo=new Image();logo.src='./assets/logo.png';
const C=MoonCollection;let collection=[],collectionPersistent=true,currentReward=null,selectedRecord=null;
try{const saved=C.load(localStorage);collection=saved.records;collectionPersistent=saved.persistent;}catch{collectionPersistent=false;}
const cardImages=new Map();

const stars=Array.from({length:48},(_,i)=>({x:(i*127.31)%W,y:(i*79.77)%480,r:i%5===0?1.8:.8}));
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600);}
function visible(id,yes){$(id).hidden=!yes;}
function begin(){$('stage').classList.remove('is-finished');E.start(state);visualLane=1;particles=[];cardBlob=null;if(cardURL){URL.revokeObjectURL(cardURL);cardURL=null;}['start-screen','finish-screen','pause-screen'].forEach(id=>visible(id,false));['hud','tools','controls','journey'].forEach(id=>visible(id,true));$('footnote').textContent='左右切換跑道 · 碰到隕石只減速，不會出局';$('pause').focus({preventScroll:true});}
function pause(){if(state.mode!=='playing')return;state.mode='paused';visible('pause-screen',true);$('resume').focus({preventScroll:true});}
function resume(){if(state.mode!=='paused')return;state.mode='playing';visible('pause-screen',false);prev=performance.now();$('pause').focus({preventScroll:true});}
function bestScore(){try{return Number(localStorage.getItem('leyan-moon-best-v1'))||0;}catch{return 0;}}
function finish(){unlockCard();$('stage').classList.add('is-finished');['hud','tools','controls','journey','power'].forEach(id=>visible(id,false));visible('finish-screen',true);$('rank').textContent=E.rank(state.score);$('final-cakes').replaceChildren(document.createTextNode(state.cakes));const unit=document.createElement('small');unit.textContent='枚';$('final-cakes').append(unit);$('final-score').textContent=state.score;const best=Math.max(state.score,bestScore());try{localStorage.setItem('leyan-moon-best-v1',best);}catch{}$('best').textContent=`這台裝置的最高紀錄 ${best.toLocaleString()} 分`;$('footnote').textContent='把你的中秋祝福，分享給重要的人。';$('download').textContent='↓ 下載這款圖卡';$('download').focus({preventScroll:true});beep(784,.15);setTimeout(()=>beep(1046,.22),170);}
function beep(freq,duration=.09){if(!sound||!audio)return;try{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}catch{}}
function round(c,x,y,w,h,r,fill){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function star(c,x,y,r,color){c.save();c.translate(x,y);c.fillStyle=color;c.beginPath();for(let i=0;i<10;i++){let a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();c.restore();}
function cake(c,x,y,r){c.save();c.translate(x,y);c.fillStyle='#bd8646';c.beginPath();for(let i=0;i<48;i++){const a=i*Math.PI/24,rr=r*(i%4<2?1:.91);c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();ellipse(c,0,-2,r*.8,r*.8,'#eac278');c.strokeStyle='#b17a39';c.lineWidth=Math.max(1,r*.075);c.beginPath();c.arc(0,-2,r*.57,0,Math.PI*2);c.stroke();for(let i=0;i<4;i++){c.save();c.rotate(i*Math.PI/2);c.beginPath();c.ellipse(0,-r*.21,r*.12,r*.23,0,0,Math.PI*2);c.stroke();c.restore();}c.restore();}
function rabbit(c,x,y,k=1,t=0){c.save();c.translate(x,y);c.scale(k,k);const bob=Math.sin(t*3)*2;c.translate(0,bob);ellipse(c,0,39,44,11,'#00000024');c.fillStyle='#ecc171';c.beginPath();c.moveTo(-17,30);c.quadraticCurveTo(0,60+Math.sin(t*15)*6,17,30);c.fill();ellipse(c,0,29,12,15,'#fff0bc');round(c,-27,-32,54,47,20,'#f5eedc');ellipse(c,-13,-48,8,25,'#f5eedc');ellipse(c,13,-48,8,25,'#f5eedc');ellipse(c,-13,-48,3,17,'#dbbba2');ellipse(c,13,-48,3,17,'#dbbba2');ellipse(c,0,-16,28,25,'#fff8e8');ellipse(c,-10,-17,2.5,3.5,'#403b34');ellipse(c,10,-17,2.5,3.5,'#403b34');ellipse(c,0,-9,3,2,'#b78972');ellipse(c,-18,-8,5,3,'#e5c4a4');ellipse(c,18,-8,5,3,'#e5c4a4');c.strokeStyle='#8a7660';c.lineWidth=4;c.beginPath();c.arc(0,-17,28,Math.PI,0);c.stroke();round(c,-32,-22,8,17,4,'#8a7660');round(c,24,-22,8,17,4,'#8a7660');c.strokeStyle='#8a7660';c.lineWidth=2;c.beginPath();c.moveTo(28,-8);c.lineTo(18,1);c.lineTo(10,1);c.stroke();round(c,-19,6,38,9,4,GREEN);c.fillStyle=GREEN;c.beginPath();c.moveTo(15,9);c.lineTo(40,4);c.lineTo(35,18);c.closePath();c.fill();ellipse(c,0,24,49,19,'#9a8060');ellipse(c,0,18,46,15,'#ead9ba');ellipse(c,0,18,22,8,'#3d6e5a');ellipse(c,-33,19,5,4,'#e6bd70');ellipse(c,33,19,5,4,'#e6bd70');c.restore();}
function project(lane,z){const depth=z*z;return {x:240+(lane-1)*(26+depth*131),y:285+depth*423,scale:.2+depth*1.05};}
function scene(dt){animation+=dt;const c=ctx;
const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#213c36');bg.addColorStop(.48,'#486853');bg.addColorStop(1,'#8a7660');c.fillStyle=bg;c.fillRect(0,0,W,H);
for(const s of stars){c.globalAlpha=.35+.4*(1+Math.sin(animation+s.x))/2;ellipse(c,s.x,s.y,s.r,s.r,'#f4dfac');}c.globalAlpha=1;
const glow=c.createRadialGradient(240,223,30,240,223,138);glow.addColorStop(0,'#f5dd9950');glow.addColorStop(1,'#f5dd9900');c.fillStyle=glow;c.fillRect(100,85,280,280);ellipse(c,240,221,69,69,'#eed697');ellipse(c,219,199,14,9,'#e0c78a');ellipse(c,259,239,17,12,'#e4cb8b');ellipse(c,267,204,7,7,'#e4cb8b');
for(let layer=0;layer<3;layer++){c.fillStyle=['#506653','#3c594b','#314a40'][layer];c.beginPath();c.moveTo(0,330+layer*31);for(let x=0;x<=W;x+=8)c.lineTo(x,325+layer*35+Math.sin(x*.012+layer*2)*25+Math.sin(x*.025)*11);c.lineTo(W,H);c.lineTo(0,H);c.fill();}
c.fillStyle='#a395742b';c.beginPath();c.moveTo(212,290);c.lineTo(268,290);c.lineTo(492,760);c.lineTo(-12,760);c.closePath();c.fill();c.strokeStyle='#efd6a830';c.lineWidth=1;for(let lane=-.5;lane<=2.5;lane++){c.beginPath();c.moveTo(240+(lane-1)*26,285);c.lineTo(240+(lane-1)*157,708);c.stroke();}
for(let i=0;i<17;i++){const z=((i/17+animation*.16)%1),p=project(i%2?-.5:2.5,z);ellipse(c,p.x,p.y,1+p.scale*2,1+p.scale,'#ead9ac88');}
for(const o of state.items){const p=project(o.lane,o.z);if(o.type==='cake')cake(c,p.x,p.y,23*p.scale);if(o.type==='star')star(c,p.x,p.y,23*p.scale,'#f8dc86');if(o.type==='shield'){ellipse(c,p.x,p.y,24*p.scale,24*p.scale,'#8abbb072');c.strokeStyle='#b6e7d5';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,24*p.scale,0,Math.PI*2);c.stroke();c.fillStyle='#e4fff1';c.font=`${25*p.scale}px Georgia`;c.textAlign='center';c.fillText('✦',p.x,p.y+9*p.scale);}if(o.type==='rock'){c.save();c.translate(p.x,p.y);c.rotate(o.id+animation*.35);c.fillStyle='#958b7d';c.beginPath();for(let i=0;i<7;i++){let a=i*Math.PI*2/7,r=(i%2?22:28)*p.scale;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();ellipse(c,-7*p.scale,-4*p.scale,6*p.scale,4*p.scale,'#716d62');ellipse(c,8*p.scale,8*p.scale,4*p.scale,3*p.scale,'#b0a594');c.restore();}}
visualLane+=(state.lane-visualLane)*Math.min(1,dt*15);const player=project(visualLane,.87);if(state.shield>0){c.strokeStyle='#b6e7d5';c.lineWidth=2;c.fillStyle='#b6e7d51a';c.beginPath();c.ellipse(player.x,player.y-10,58,78,0,0,Math.PI*2);c.fill();c.stroke();}if(state.invulnerable>0)c.globalAlpha=.55+.45*Math.sin(animation*35)**2;rabbit(c,player.x,player.y,.98,animation);c.globalAlpha=1;
particles=particles.filter(p=>p.life>0);for(const p of particles){p.life-=dt;p.y-=dt*40;c.globalAlpha=Math.max(0,p.life);c.fillStyle='#ffedaf';c.font='bold 21px sans-serif';c.textAlign='center';c.fillText(p.text,p.x,p.y);}c.globalAlpha=1;
}
function frame(now){const dt=Math.min((now-prev)/1000||0,.05);prev=now;if(state.mode==='playing'){const events=E.step(state,dt);for(const event of events){if(['cake','star','shield'].includes(event)){const p=project(state.lane,.87);particles.push({x:p.x,y:p.y-80,life:1,text:event==='cake'?'+100':event==='star'?'+30':'守護 +5秒'});beep(event==='cake'?880:1174);}if(event==='hit'){toast('慢一點也沒關係，繼續向團圓前進');beep(180,.2);}if(event==='protected'){toast('樂衍守護盾，替你擋下一次碰撞');beep(660);}if(event==='finish')finish();}$('cakes').textContent=state.cakes;$('score').textContent=state.score;$('time').textContent=Math.ceil(E.DURATION-state.elapsed);$('journey-fill').style.width=`${state.elapsed/E.DURATION*100}%`;visible('power',state.shield>0&&state.mode==='playing');if(state.shield>0)$('power').textContent=`守護盾 · ${Math.ceil(state.shield)}秒`;}
if(state.mode==='playing'||state.mode==='idle')scene(dt);requestAnimationFrame(frame);}
$('start').onclick=begin;$('replay').onclick=begin;$('pause').onclick=pause;$('resume').onclick=resume;$('left').onclick=()=>E.move(state,-1);$('right').onclick=()=>E.move(state,1);
$('sound').onclick=()=>{sound=!sound;$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'關閉音效':'開啟音效');if(sound){try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();beep(660);}catch{sound=false;toast('此瀏覽器無法啟用音效');}}};
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.tagName==='INPUT')return;if(['ArrowLeft','a','A','ArrowRight','d','D'].includes(e.key)&&state.mode==='playing'){e.preventDefault();E.move(state,['ArrowLeft','a','A'].includes(e.key)?-1:1);}if(e.code==='Space'&&e.target===document.body){e.preventDefault();state.mode==='playing'?pause():resume();}if(e.key==='Escape'&&state.mode==='playing')pause();});
let touchStart=null;canvas.addEventListener('pointerdown',e=>{touchStart={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy))E.move(state,dx>0?1:-1);else if(Math.abs(dx)<10&&Math.abs(dy)<10){const r=canvas.getBoundingClientRect();E.move(state,e.clientX<r.left+r.width/2?-1:1);}touchStart=null;});canvas.addEventListener('pointercancel',()=>touchStart=null);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',pause);
function shareText(){return state.mode==='finished'?`我在「樂衍月兔出任務」拿到 ${state.score} 分，成為「${E.rank(state.score)}」！🐇 換你來挑戰，祝你中秋快樂 🌕`:'你照顧大家，樂衍陪你安心團圓 🌕 來場 45 秒的月兔小冒險，帶走你的中秋賀卡！';}
function showLink(){const input=$('share-url');input.value=publicURL;$('line-share').href='https://line.me/R/msg/text/?'+encodeURIComponent(shareText()+'\n'+publicURL);if(!$('link-dialog').open)$('link-dialog').showModal();input.focus();input.select();}
async function copyLink(){try{await navigator.clipboard.writeText(publicURL);toast('遊戲連結已複製，貼給朋友吧！');}catch{showLink();toast('請長按或選取網址複製');}}
async function shareLink(){if(navigator.share){try{await navigator.share({title:'樂衍月兔出任務｜中秋快樂',text:shareText(),url:publicURL});return;}catch(e){if(e.name==='AbortError')return;}}showLink();}
document.querySelectorAll('[data-share]').forEach(b=>b.onclick=shareLink);document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=copyLink);$('close-link').onclick=()=>$('link-dialog').close();$('close-card').onclick=()=>$('card-dialog').close();
async function readyImage(img){if(img.complete&&img.naturalWidth)return true;try{await img.decode();return true;}catch{return false;}}
function updateAlbumCounts(){document.querySelectorAll('[data-album]').forEach(b=>b.textContent=`我的圖鑑 · ${collection.length} / 6`);}
function unlockCard(){
 currentReward=C.award(collection,state.score,state.cakes);collection=currentReward.records;
 try{collectionPersistent=C.save(localStorage,collection);}catch{collectionPersistent=false;}
 $('unlock-info').textContent=`${currentReward.isNew?'新卡入藏':'再次相遇'} · ${currentReward.card.name}  ${collection.length}/6${collection.length===6?' · 全套集滿！':''}`;
 updateAlbumCounts();
}
function openAlbum(){
 $('album-progress').textContent=collection.length===6?'六款全套集滿！謝謝你一路陪月兔團圓。':`已收集 ${collection.length} / 6 款 · 點已解鎖圖卡即可下載`;
 $('album-note').textContent=collectionPersistent?'收藏只存在這台裝置，清除瀏覽器資料會重置。':'此瀏覽器目前無法保存收藏，關閉頁面後可能重置；請先下載喜歡的圖卡。';
 const grid=$('album-grid');grid.replaceChildren();
 C.CARDS.forEach((card,index)=>{const record=collection.find(r=>r.id===card.id);const tile=document.createElement('button');tile.className='album-tile'+(record?'':' locked');tile.type='button';tile.disabled=!record;tile.setAttribute('aria-label',record?`下載 ${card.name} 圖卡`:`第 ${index+1} 款尚未解鎖`);
 if(record){const img=document.createElement('img');img.src=card.art;img.alt=card.name;img.loading='lazy';tile.append(img);}else{const cover=document.createElement('span');cover.className='locked-art';cover.textContent='☾';tile.append(cover);}
 const label=document.createElement('strong');label.textContent=`${String(index+1).padStart(2,'0')} · ${record?card.name:'待你發現'}`;tile.append(label);const sub=document.createElement('small');sub.textContent=record?`${record.score} 分 · 查看圖卡`:'完成旅程解鎖';tile.append(sub);
 if(record)tile.onclick=()=>showCard(record,false);grid.append(tile);});
 $('album-play').textContent=collection.length===6?'再出發，刷新你的紀錄 →':'再出發，收集下一款 →';
 if(!$('album-dialog').open)$('album-dialog').showModal();
}
async function getCardArt(card){let img=cardImages.get(card.id);if(!img){img=new Image();img.src=card.art;cardImages.set(card.id,img);}if(!await readyImage(img)){cardImages.delete(card.id);throw new Error('插畫尚未載入');}return img;}
async function createCard(record){
 await document.fonts.ready;const card=C.CARDS.find(c=>c.id===record.id);if(!card)throw new Error('找不到圖卡');
 const [art,hasLogo]=await Promise.all([getCardArt(card),readyImage(logo)]);if(!hasLogo)throw new Error('品牌圖示尚未載入');
 const out=document.createElement('canvas');out.width=1080;out.height=1440;
 MoonCard.drawCard(out.getContext('2d'),{hero:art,logo,score:record.score,cakes:record.cakes,rank:E.rank(record.score),card,index:C.CARDS.indexOf(card)});
 return new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error('圖卡產生失敗')),'image/png'));
}
let cardPreparing=false;
async function showCard(record,autoDownload){
 if(cardPreparing)return;cardPreparing=true;const b=$('download');b.disabled=true;b.textContent='圖卡準備中…';
 // Open feedback before loading so slow networks never feel like a dead button.
 visible('card-error',false);visible('card-preview',false);visible('save-card',false);visible('share-card',false);
 const card=C.CARDS.find(c=>c.id===record.id);$('card-title').textContent=card.name+' · 準備中';if(!$('card-dialog').open)$('card-dialog').showModal();
 try{const blob=await createCard(record);cardBlob=blob;selectedRecord=record;if(cardURL)URL.revokeObjectURL(cardURL);cardURL=URL.createObjectURL(blob);const filename=`leyan-${record.id}-midautumn.png`;
 $('card-preview').src=cardURL;$('card-preview').alt=`${card.name}｜樂衍中秋祝福`;$('save-card').href=cardURL;$('save-card').download=filename;$('card-title').textContent=card.name+' · 中秋收藏卡';
 visible('card-preview',true);visible('save-card',true);const file=new File([blob],filename,{type:'image/png'});visible('share-card',!!navigator.canShare?.({files:[file]}));
 if(autoDownload){const a=document.createElement('a');a.href=cardURL;a.download=filename;a.click();}
 }catch{$('card-title').textContent='圖卡還在路上';$('card-error').textContent='圖片暫時無法載入，收藏已保留。請關閉後再試一次。';visible('card-error',true);}
 finally{cardPreparing=false;b.disabled=false;b.textContent='↓ 下載這款圖卡';}
}
$('download').onclick=()=>{if(currentReward)showCard(currentReward.record,true);};
$('share-card').onclick=async()=>{if(!cardBlob||!selectedRecord)return;const card=C.CARDS.find(c=>c.id===selectedRecord.id);try{await navigator.share({files:[new File([cardBlob],`leyan-${card.id}-midautumn.png`,{type:'image/png'})],title:'樂衍中秋祝福',text:`我收集到樂衍「${card.name}」中秋圖卡！祝你中秋快樂。`});}catch(e){if(e.name!=='AbortError'){$('card-error').textContent='請使用儲存圖卡，再從相簿分享。';visible('card-error',true);}}};
document.querySelectorAll('[data-album]').forEach(b=>b.onclick=openAlbum);
$('close-album').onclick=()=>$('album-dialog').close();$('album-play').onclick=()=>{$('album-dialog').close();begin();};
updateAlbumCounts();
hero.onerror=()=>{hero.hidden=true;hero.parentElement.style.background='radial-gradient(circle, #e9d39d 0%, #f9f4ee 68%)';};
requestAnimationFrame(frame);
