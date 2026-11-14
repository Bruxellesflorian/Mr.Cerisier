const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(two=false){
 const env={window:{},Math:Object.create(Math)};env.Math.random=()=>.25;vm.createContext(env);
 for(const file of ['content.js','content-night.js','content-gothic.js','bar-builder.js','bar-service.js'])vm.runInContext(fs.readFileSync(file,'utf8'),env);
 const items=[{id:1,kind:'entry',x:7,y:11},{id:2,kind:'counter',x:6,y:3},{id:3,kind:'tap',x:6,y:3,kegId:4},{id:4,kind:'keg',x:8,y:1,stationId:9,beerId:0},{id:5,kind:'staff',x:6,y:4},{id:6,kind:'toilet',x:0,y:0},{id:7,kind:'table2',x:1,y:6},{id:8,kind:'barrel2',x:11,y:6},{id:9,kind:'station',x:8,y:0},{id:10,kind:'stock',x:13,y:2}];
 if(two)items.push({id:11,kind:'station',x:5,y:0},{id:12,kind:'keg',x:5,y:1,stationId:11,beerId:2},{id:13,kind:'tap',x:7,y:3,kegId:12});
 const data={items,sales:0,dollars:0},state={completed:[0,2]},player={x:7.5*64,y:4.5*64};let saves=0;
 const service=env.window.HoublonBarService.create({items,data,state,player,save:()=>saves++});
 const tick=seconds=>{for(let left=seconds;left>1e-8;left-=.05)service.update(Math.min(.05,left));};
 const go=item=>{player.x=(item.x+.5)*64;player.y=(item.y+.5)*64;};
 const head=()=>{for(let n=0;n<500;n++){const first=service.clients.find(g=>g.stage==='order'&&!g.path.length);if(first)return first;service.update(.05);}throw Error('No waiting customer');};
 return {env,service,data,items,player,tick,go,head,get saves(){return saves;}};
}
test('stock is mandatory for opening, and orders use only beers actually on tap',()=>{
 const h=setup();assert(h.env.window.HoublonBar.openingErrors(h.items.filter(i=>i.kind!=='stock'),[0,2]).some(e=>e.includes('stock')));
 assert(h.service.start());h.tick(10);assert(h.service.clients.length>0);assert(h.service.clients.every(g=>g.beerId===0));
 const both=setup(true);let n=0;both.env.Math.random=()=>++n%2?.1:.9;both.service.start();both.tick(12);assert.deepEqual([...new Set(both.service.clients.map(g=>g.beerId))].sort(),[0,2]);
});
test('pouring requires proximity, consumes a serving, and a wrong beer earns nothing',()=>{
 const h=setup(true);h.service.start();const g=h.head();
 h.go(h.items.find(i=>i.id===13));assert(h.service.act('tap:13'));assert(!h.service.act('tap:13'));h.tick(1.2);
 assert.equal(h.items.find(i=>i.id===12).remaining,7);assert.equal(h.service.carrying.beerId,2);
 h.go(g);assert(!h.service.act('give:'+g.id));assert.equal(h.data.dollars,0);assert.equal(h.service.summary.served,0);
 h.service.act('discard');h.go(h.items[2]);h.service.act('tap:3');h.tick(1.2);h.go(g);assert(h.service.act('give:'+g.id));
 assert.equal(h.service.summary.served,1);assert(h.data.dollars>0);assert(h.service.summary.satisfaction>0);assert.equal(h.service.carrying,null);
 assert(!h.service.act('give:'+g.id));assert(h.saves>=3);
});
test('empty kegs need a spare collected from stock before replacement',()=>{
 const h=setup();h.items[3].remaining=1;h.service.start();h.go(h.items[2]);h.service.act('tap:3');h.tick(1.2);assert.equal(h.items[3].remaining,0);
 h.service.act('discard');assert(h.service.actions().find(a=>a.id==='tap:3').disabled);assert(!h.service.act('replace:4'));
 h.go(h.items.find(i=>i.kind==='stock'));assert(h.service.act('stock:10'));assert.equal(h.service.carrying.kind,'spare');
 assert(!h.service.act('replace:4'));h.go(h.items[3]);assert(h.service.act('replace:4'));h.tick(1.8);assert.equal(h.items[3].remaining,8);assert.equal(h.service.carrying,null);
});
test('the service ends at exactly 90 seconds, preserves dollars and cannot pay after time',()=>{
 const h=setup();h.data.dollars=12;h.service.start();h.tick(89.9);assert.equal(h.service.phase,'running');h.tick(.1);
 assert.equal(h.service.phase,'finished');assert.equal(h.service.remaining,0);assert.equal(h.data.dollars,12);assert(!h.service.act('tap:3'));assert.equal(h.service.actions().length,0);
 h.tick(10);assert.equal(h.service.remaining,0);assert(h.service.summary.lost>0);assert.equal(h.service.summary.satisfaction,0);
 h.service.start();assert.equal(h.service.remaining,90);assert.equal(h.service.summary.dollars,12);assert.equal(h.service.summary.earnings,0);
});
test('fast delivery has better satisfaction and earnings than delayed delivery',()=>{
 function play(delay){const h=setup();h.service.start();const g=h.head();h.tick(delay);h.go(h.items[2]);h.service.act('tap:3');h.tick(1.2);h.go(g);assert(h.service.act('give:'+g.id));return h.service.summary;}
 const fast=play(0),slow=play(10);assert(fast.satisfaction>slow.satisfaction);assert(fast.earnings>slow.earnings);
});
