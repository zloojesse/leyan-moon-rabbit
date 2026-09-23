const {test}=require('node:test');const assert=require('node:assert/strict');const E=require('../public/engine.js');
function playing(){let s=E.create();E.start(s);s.spawnIn=99;return s;}
function hit(type,shield=0){const s=playing();s.shield=shield;s.items=[{id:1,type,lane:1,z:.869,checked:false}];let events=E.step(s,.02);return {s,events};}
test('movement stays on three lanes and is disabled while paused',()=>{const s=playing();for(let i=0;i<10;i++)E.move(s,-1);assert.equal(s.lane,0);for(let i=0;i<10;i++)E.move(s,1);assert.equal(s.lane,2);s.mode='paused';E.move(s,-1);assert.equal(s.lane,2);});
test('moon cake scores exactly once',()=>{const {s}=hit('cake');assert.equal(s.cakes,1);assert.equal(s.score,100);E.step(s,.04);assert.equal(s.score,100);});
test('star earns 30 points without changing cake count',()=>{const {s}=hit('star');assert.equal(s.score,30);assert.equal(s.cakes,0);});
test('obstacle slows player but does not end run or remove points',()=>{const {s,events}=hit('rock');assert.ok(s.slow>0);assert.equal(s.mode,'playing');assert.equal(s.score,0);assert.deepEqual(events,['hit']);});
test('shield absorbs one obstacle and is consumed',()=>{const {s,events}=hit('rock',5);assert.equal(s.shield,0);assert.equal(s.slow,0);assert.deepEqual(events,['protected']);});
test('shield pickup grants five active seconds',()=>{const {s}=hit('shield');assert.equal(s.shield,5);s.mode='paused';E.step(s,1);assert.equal(s.shield,5);});
test('other-lane objects do not score',()=>{const s=playing();s.items=[{id:1,type:'cake',lane:0,z:.869}];E.step(s,.02);assert.equal(s.score,0);});
test('45 active seconds produces finish exactly once; pause freezes clock',()=>{const s=playing();s.mode='paused';for(let i=0;i<100;i++)E.step(s,.05);assert.equal(s.elapsed,0);s.mode='playing';let finishes=0;for(let i=0;i<1000;i++)finishes+=E.step(s,.05).filter(e=>e==='finish').length;assert.equal(s.elapsed,45);assert.equal(s.mode,'finished');assert.equal(finishes,1);});
test('replay clears previous run',()=>{const {s}=hit('cake');s.mode='finished';E.start(s);assert.equal(s.score,0);assert.equal(s.cakes,0);assert.equal(s.elapsed,0);assert.equal(s.items.length,0);assert.equal(s.mode,'playing');});
test('large frame gap does not skip collisions or consume whole game',()=>{const s=playing();E.step(s,100);assert.equal(s.elapsed,.05);});
