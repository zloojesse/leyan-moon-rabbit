/* One shared renderer for the downloadable card and design preview. */
(function(root){
function fit(c,img,x,y,w,h){const s=Math.min(w/img.width,h/img.height);c.drawImage(img,x+(w-img.width*s)/2,y+(h-img.height*s)/2,img.width*s,img.height*s);}
function drawCard(c,{hero,logo,score,cakes,rank}){
 const paper='#f9f4ee',green='#3d6e5a',mocha='#8a7660';
 c.fillStyle=paper;c.fillRect(0,0,1080,1440);
 c.strokeStyle='#d7c9b5';c.lineWidth=2;c.strokeRect(35,35,1010,1370);
 c.textAlign='center';c.fillStyle=mocha;c.font='20px sans-serif';c.fillText('LE-YAN  /  MID-AUTUMN 2026',540,93);
 c.font='46px "Songti TC", serif';c.fillText('樂衍敬祝',540,169);
 c.fillStyle=green;c.font='bold 92px "Songti TC", serif';c.fillText('中秋快樂',540,277);
 c.fillStyle=mocha;c.font='34px "Songti TC", serif';c.fillText('把美好，帶回團圓。',540,337);
 if(hero)fit(c,hero,215,360,650,560);
 c.fillStyle='#e5ecdf';c.beginPath();c.roundRect(225,953,630,62,31);c.fill();
 c.fillStyle=green;c.font='29px "Songti TC", serif';c.fillText(rank+'  ·  '+score+' 分',540,994);
 c.fillStyle=mocha;c.font='25px "Songti TC", serif';c.fillText('這趟月光旅程，收集了 '+cakes+' 枚團圓月餅',540,1064);
 c.fillStyle=green;c.font='40px "Songti TC", serif';c.fillText('平日，陪你照顧每一份託付。',540,1164);
 c.fillText('中秋，願你安心享受每一刻團圓。',540,1226);
 if(logo)fit(c,logo,350,1270,380,94);
}
if(typeof module!=='undefined'&&module.exports)module.exports={drawCard};else root.MoonCard={drawCard};
})(typeof globalThis!=='undefined'?globalThis:this);
