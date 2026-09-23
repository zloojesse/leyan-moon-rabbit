/* Six illustrated cards. First six completed journeys never repeat. */
(function(root){
const CARDS=[
 {id:'launch',name:'月光啟程',art:'./assets/hero.jpg',line1:'每一段旅程，都有溫柔的陪伴。',line2:'願你帶著美好，安心走向團圓。',color:'#3d6e5a'},
 {id:'tea',name:'桂月茶敘',art:'./assets/cards/tea.jpg',line1:'一杯暖茶，留給忙碌的自己。',line2:'願你在月色裡，品嚐生活的甜。',color:'#79704a'},
 {id:'delivery',name:'星河快遞',art:'./assets/cards/delivery.jpg',line1:'把感謝裝滿，把祝福送到。',line2:'願每一份心意，都抵達你身旁。',color:'#426f7c'},
 {id:'cloud',name:'雲海望月',art:'./assets/cards/cloud.jpg',line1:'偶爾慢下來，抬頭看看月亮。',line2:'願心有餘裕，日子自在從容。',color:'#607c71'},
 {id:'bakery',name:'月宮烘焙',art:'./assets/cards/bakery.jpg',line1:'把努力揉進日子，把甜留給你。',line2:'願付出有收穫，生活有溫度。',color:'#956b44'},
 {id:'reunion',name:'滿月團圓',art:'./assets/cards/reunion.jpg',line1:'最好的風景，是重要的人都在。',line2:'願月常圓，人常安，心常暖。',color:'#805e57'}
];
const KEY='leyan-moon-collection-v1';
function normalize(records){if(!Array.isArray(records))return [];const found=new Map();for(const r of records){if(!r||!CARDS.some(c=>c.id===r.id)||found.has(r.id)||!Number.isFinite(r.score)||!Number.isFinite(r.cakes)||r.score<0||r.cakes<0)continue;found.set(r.id,{id:r.id,score:Math.floor(r.score),cakes:Math.floor(r.cakes),unlockedAt:typeof r.unlockedAt==='string'?r.unlockedAt:''});}return [...found.values()];}
function load(storage){try{return {records:normalize(JSON.parse(storage.getItem(KEY)||'[]')),persistent:true};}catch{return {records:[],persistent:false};}}
function save(storage,records){try{storage.setItem(KEY,JSON.stringify(normalize(records)));return true;}catch{return false;}}
function award(records,score,cakes,random=Math.random){const next=normalize(records);const missing=CARDS.filter(c=>!next.some(r=>r.id===c.id));const pool=missing.length?missing:CARDS;const n=random();const index=Math.min(pool.length-1,Math.max(0,Math.floor((Number.isFinite(n)?n:0)*pool.length)));const card=pool[index];const previous=next.find(r=>r.id===card.id);const record={id:card.id,score:Math.max(0,Math.floor(score)||0),cakes:Math.max(0,Math.floor(cakes)||0),unlockedAt:previous?.unlockedAt||new Date().toISOString()};if(!previous)next.push(record);else if(record.score>previous.score)next[next.indexOf(previous)]=record;return {records:next,record,card,isNew:!previous,count:next.length};}
const api={CARDS,KEY,normalize,load,save,award};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MoonCollection=api;
})(typeof globalThis!=='undefined'?globalThis:this);
