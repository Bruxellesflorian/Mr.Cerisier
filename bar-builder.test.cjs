const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function load(){
 const nodes=new Map();let callback,saves=0;
 const ctx=new Proxy({}, {get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 function node(id){if(nodes.has(id))return nodes.get(id);const n={id,classList:{toggle(){},contains(){return true;},add(){},remove(){}},parentElement:{scrollLeft:0,scrollTop:0,scrollIntoView(){}},style:{},isConnected:true,innerHTML:'',textContent:'',replaceChildren(){},append(){},scrollIntoView(){},getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0,width:480,height:384}),querySelectorAll(selector){const key=selector==='[data-serve]'?'serve':'buy';this.buttons=[...this.innerHTML.matchAll(new RegExp('data-'+key+'="([^"]+)"','g'))].map(m=>({dataset:{[key]:m[1]}}));return this.buttons;}};nodes.set(id,n);return n;}
 const c={performance:{now:()=>0},window:{HoublonAudio:{sfx(){}},HoublonCharacters:{draw(){}}},document:{getElementById:node,createElement:()=>node(Math.random()),hidden:false},requestAnimationFrame:f=>(callback=f,1),cancelAnimationFrame(){callback=null;}};
 vm.createContext(c);vm.runInContext(fs.readFileSync('bar-builder.js','utf8'),c);
 return {bar:c.window.HoublonBar,node,c,save:()=>saves++,get saves(){return saves;},frame:t=>callback?.(t)};
}
const layout=()=>[
 {id:1,kind:'entry',x:7,y:11},{id:2,kind:'counter',x:6,y:3},{id:3,kind:'tap',x:6,y:3},{id:4,kind:'keg',x:8,y:1,stationId:9},
 {id:5,kind:'staff',x:6,y:4},{id:6,kind:'toilet',x:0,y:0},{id:7,kind:'table2',x:1,y:6},{id:8,kind:'barrel2',x:11,y:6},{id:9,kind:'station',x:8,y:0},{id:40,kind:'stock',x:13,y:2}
];
test('equipment, distance and access checks gate opening',()=>{
 const {bar}=load(),items=layout();assert.equal(bar.openingErrors(items).length,0);
 for(const item of items)assert.equal(bar.validPlace(items,item),'');
 assert(bar.openingErrors(items.filter(i=>i.kind!=='staff')).some(s=>s.includes('barman')));
 items[3].x=9;items[3].y=3;items[8].x=9;items[8].y=2;items.push({id:30,kind:'wall',x:9,y:2});assert.equal(bar.openingErrors(items).length,0); // exactly 3 m
 items[3].y=2;assert(bar.openingErrors(items).some(s=>s.includes('3 m')));
 assert(bar.validPlace(items,{id:10,kind:'entry',x:5,y:5}));
 assert(bar.validPlace(items,{id:10,kind:'table6',x:14,y:11}));
 assert(bar.validPlace(items,{id:10,kind:'table2',x:1,y:0}));
 const blocked=layout();blocked.push({id:20,kind:'keg',x:6,y:11},{id:10,kind:'keg',x:8,y:11},{id:11,kind:'keg',x:7,y:10});
 assert(bar.openingErrors(blocked).some(s=>s.includes('inaccessible')));
});
test('purchases debit once, moving costs nothing, selling refunds and saved layouts reload',()=>{
 const h=load(),state={};h.bar.mount({state,earned:()=>200,save:h.save});
 h.node('bar-shop').buttons.find(b=>b.dataset.buy==='counter').onclick();
 h.node('bar-floor').onclick({clientX:200,clientY:100});
 assert.equal(state.myBar.items.length,1);assert(h.node('bar-wallet').textContent.startsWith('80 XP'));
 h.node('bar-floor').onclick({clientX:200,clientY:100});h.node('bar-floor').onclick({clientX:320,clientY:160});
 assert.equal(state.myBar.items.length,1);assert.equal(state.myBar.items[0].x,10);assert(h.node('bar-wallet').textContent.startsWith('80 XP'));
 h.bar.stop();h.bar.mount({state:JSON.parse(JSON.stringify(state)),earned:()=>200,save:h.save});assert(h.node('bar-wallet').textContent.startsWith('80 XP'));
 h.node('bar-floor').onclick({clientX:320,clientY:160});h.node('bar-remove').onclick();assert(h.node('bar-wallet').textContent.startsWith('200 XP'));
 assert(h.saves>=3);
});
test('opening serves customers and closing stops the simulation without awarding XP',()=>{
 const h=load(),state={myBar:{items:layout(),sales:0}};h.bar.mount({state,earned:()=>700,save:h.save});
 assert.equal(h.node('bar-open').disabled,false);h.node('bar-open').onclick();
 for(let t=0;t<=90000;t+=50)h.frame(t);
 assert(state.myBar.sales>2);assert(h.saves>2);
 const sales=state.myBar.sales;h.node('bar-open').onclick();for(let t=90050;t<95000;t+=50)h.frame(t);assert.equal(state.myBar.sales,sales);
 assert.equal(state.myBar.items.length,10);assert(h.node('bar-wallet').textContent.startsWith('20 XP'));
 h.bar.stop();
});

test('taps require a counter, and mounted taps protect their support',()=>{
 const {bar}=load(),items=layout();
 assert.match(bar.validPlace(items,{...items[2],y:2}),/comptoir/);
 assert.equal(bar.validPlace(items,items[2]),'');
 assert.match(bar.validPlace(items,{...items[1],x:7}),/tireuses/);
 const rotated={id:20,kind:'counter',x:10,y:2,rot:true};
 assert.equal(bar.validPlace([rotated],{id:21,kind:'tap',x:10,y:4}),'');
 assert.match(bar.validPlace([rotated],{id:21,kind:'tap',x:11,y:4}),/comptoir/);
});

test('toilets need access to their actual doorway, including after rotation',()=>{
 const {bar}=load(),items=layout();
 assert.deepEqual(Array.from(bar.toiletDoor(items[5])),[1,2]);
 items.push({id:22,kind:'keg',x:1,y:2});
 assert(bar.openingErrors(items).some(e=>e.includes('Toilettes inaccessible')));
 assert.match(bar.validPlace([],{id:23,kind:'toilet',x:4,y:10}),/porte/);
 assert.deepEqual(Array.from(bar.toiletDoor({kind:'toilet',x:5,y:4,rot:true})),[4,5]);
});

test('opening hands the saved arrangement to the playable room',()=>{
 const h=load(),state={myBar:{items:layout(),sales:0}};let opened;
 h.bar.mount({state,earned:()=>700,save:h.save,onOpen:data=>opened=data});
 h.node('bar-open').onclick();assert.equal(opened,state.myBar);
 vm.runInContext(fs.readFileSync('bar-service.js','utf8'),h.c);vm.runInContext(fs.readFileSync('bar-world.js','utf8'),h.c);
 h.c.window.HoublonBarAssets={draw(){return true;}};
 const room=h.c.window.HoublonBarWorld.create({data:opened,state,save:h.save});
 room.update(1.8);assert(room.canWalk(room.player.x,room.player.y));
 assert(!room.canWalk(7*64,3.5*64));assert(!room.canWalk(-1,100));
 room.player.x=7.5*64;room.player.y=11.5*64;assert(room.nearExit());room.player.y-=128;assert(!room.nearExit());
 for(let i=0;i<3200;i++)room.update(.05);
 assert(opened.sales>5);assert(opened.items.length===10);
 const ctx=h.node('bar-floor').getContext('2d');ctx.createLinearGradient=()=>({addColorStop(){}});
 room.paint(ctx,{width:360,height:580,follow:()=>({x:0,y:0})},()=>{},0,'down');
});

test('the game opens the workshop room, moves its player, and returns to editing',()=>{
 const h=load();const base=h.node('world');
 const state={name:'Test',created:true,gender:'boy',skin:0,hair:0,shirt:0,completed:[],read:[],x:358,y:680,area:0,streetVersion:2,myBar:{items:layout(),sales:0}};
 // Earn enough for the saved layout without changing the real browser save.
 state.completed=[0,1,2,3];
 const listeners={},scheduled=[];h.c.requestAnimationFrame=f=>(scheduled.push(f),scheduled.length);h.c.cancelAnimationFrame=()=>{};
 h.c.localStorage={getItem:()=>JSON.stringify(state),setItem(){}};
 h.c.ResizeObserver=class{observe(){}};
 h.c.Image=class{constructor(){this.complete=true;this.naturalWidth=1536;this.naturalHeight=1024;}};
 const originalNode=h.c.document.getElementById;
 h.c.document.getElementById=id=>{const n=originalNode(id);n.focus=()=>{};n.setAttribute=()=>{};n.parentElement.style={};return n;};
 h.c.document.querySelector=selector=>h.c.document.getElementById(selector);
 h.c.window.addEventListener=(name,handler)=>listeners[name]=handler;
 h.c.document.addEventListener=()=>{};
 h.c.window.HoublonJoystick={attach:()=>({vector:{x:0,y:0},reset(){}})};
 h.c.window.HoublonAudio.setScene=()=>{};
 h.c.window.HoublonCharacters.palettes={skin:[],hair:[],shirt:[]};
 h.c.window.HoublonAtmosphere={dayWind(){},nightLights(){},gothicLights(){},mapLeaves(){},chimney(){}};
 h.c.window.HoublonBarAssets={draw:()=>true};
 h.c.setTimeout=()=>1;h.c.clearTimeout=()=>{};
 base.getContext('2d').createLinearGradient=()=>({addColorStop(){}});
 h.node('overlay').hidden=true;
 for(const file of ['content.js','content-night.js','content-gothic.js','camera.js','street-art.js','interiors.js','portraits.js','bar-service.js','bar-world.js'])vm.runInContext(fs.readFileSync(file,'utf8'),h.c);
 let scene;const create=h.c.window.HoublonBarWorld.create;h.c.window.HoublonBarWorld.create=options=>(scene=create(options));
 vm.runInContext(fs.readFileSync('game.js','utf8'),h.c);const gameFrame=scheduled.at(-1);
 h.node('my-bar').onclick();assert(!h.node('overlay').hidden);
 h.node('bar-open').onclick();assert(h.node('overlay').hidden);assert(scene);
 for(let t=20;t<=2000;t+=20)gameFrame(t);
 const y=scene.player.y;listeners.keydown({key:'ArrowUp',preventDefault(){}});gameFrame(2020);
 assert(scene.player.y<y);assert.equal(h.node('place-name').textContent,'✦ MON BAR');
 h.node('bar-service-start').onclick();gameFrame(2040);assert.equal(scene.service.phase,'running');assert.equal(h.node('bar-service-timer').textContent,'01:30');assert(h.node('quest').hidden);
 gameFrame(3040);assert(scene.service.remaining<89.1);assert(!h.node('bar-service-status').hidden);
 h.node('exit-room').onclick();assert(!h.node('overlay').hidden);assert(h.node('sheet-content').innerHTML.includes('Mon bar'));
});

test('seated guests face the rotated table, draw above furniture, sip, and stay for 0–15 seconds',()=>{
 for(const random of [0,.5,.99]){
  const h=load();h.c.Math=Object.create(Math);h.c.Math.random=()=>random;
  vm.runInContext(fs.readFileSync('bar-service.js','utf8'),h.c);vm.runInContext(fs.readFileSync('bar-world.js','utf8'),h.c);
  const items=layout();items[6].kind='table4';items[6].rot=true;
  const data={items,sales:0},room=h.c.window.HoublonBarWorld.create({data,state:{},save(){}});
  const ctx=h.node('bar-floor').getContext('2d');ctx.createLinearGradient=()=>({addColorStop(){}});
  const observations=new Map();let stamp=0,events=[],sips=new Set(),queued=false;
  h.c.window.HoublonBarAssets={draw(){events.push('furniture');return true;}};
  for(let frame=0;frame<2200;frame++){
   stamp=frame*.05;events=[];room.update(.05);
   room.paint(ctx,{width:360,height:580,follow:()=>({x:0,y:0})},(c,x,y,look,walk,dir,height,pose)=>{
    if(!pose?.seated)return;
    assert.equal(walk,0);assert(pose.beer);events.push('seated');sips.add(pose.sip.toFixed(2));
    const table=items.find(i=>i.kind==='table4');const [w,hgt]=h.bar.size(table);
    if(x<table.x*64+w*64&&y<(table.y+hgt)*64+8){const dx=(table.x+w/2)*64-x,dy=(table.y+hgt/2)*64-(y-8);assert.equal(dir,Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');}
    const seen=observations.get(look)||{first:stamp};seen.last=stamp;observations.set(look,seen);
   },0,'down');
   if(events.includes('seated'))assert(events.indexOf('seated')>events.lastIndexOf('furniture'));
   if(/· [1-9]\d* en attente/.test(room.stats))queued=true;
  }
  const completed=[...observations.values()].filter(o=>o.first<stamp-20);assert(completed.length>=3);
  for(const o of completed)assert(Math.abs(o.last-o.first-random*15)<.12);
  assert(sips.size>2);assert(queued);assert(data.sales>3);
 }
});

test('ten pictures require a wall or post, and protect their support',()=>{
 const {bar}=load();assert.equal(bar.catalog.filter(d=>d.type==='poster').length,10);
 assert.equal(bar.catalog.find(d=>d.id==='post').w,1);assert.equal(bar.catalog.find(d=>d.id==='post').h,1);
 const post={id:1,kind:'post',x:5,y:5},picture={id:2,kind:'poster0',x:5,y:5};
 assert.match(bar.validPlace([],picture),/mur ou.*poteau/);
 assert.equal(bar.validPlace([post],picture),'');
 assert.equal(bar.validPlace([],{...picture,x:0}),'');
 assert.match(bar.validPlace([{id:3,kind:'counter',x:5,y:5}],picture),/mur ou.*poteau/);
 assert.match(bar.validPlace([post,picture],{...post,x:6}),/Décrochez/);
 assert.match(bar.validPlace([post,picture],{...picture,id:4,kind:'poster1'}),/occupé/);
 assert(!bar.walkable([post,picture],5,5));
});

test('the vertical picture list buys, highlights and refunds decorations',()=>{
 const h=load(),state={};h.bar.mount({state,earned:()=>100,save:h.save});
 assert(h.node('bar-posters').hidden);h.node('bar-poster-tab').onclick();assert(!h.node('bar-posters').hidden);
 assert.equal(h.node('bar-posters').buttons.length,10);
 h.node('bar-shop').buttons.find(b=>b.dataset.buy==='post').onclick();h.node('bar-floor').onclick({clientX:160,clientY:160});
 h.node('bar-posters').buttons.find(b=>b.dataset.buy==='poster2').onclick();
 assert(h.node('bar-posters').innerHTML.includes('data-buy="poster2" class="selected"'));
 h.node('bar-floor').onclick({clientX:160,clientY:160});assert.equal(state.myBar.items.length,2);assert(h.node('bar-wallet').textContent.startsWith('35 XP'));
 h.node('bar-floor').onclick({clientX:160,clientY:160});h.node('bar-remove').onclick();
 assert.equal(state.myBar.items.length,1);assert.equal(state.myBar.items[0].kind,'post');assert(h.node('bar-wallet').textContent.startsWith('60 XP'));
});

test('wall stations require kegs directly adjacent along an edge',()=>{
 const {bar}=load(),station={id:9,kind:'station',x:5,y:5},keg={id:4,kind:'keg',x:5,y:6,stationId:9};
 assert.match(bar.validPlace([],station),/mur/);
 assert.equal(bar.validPlace([{id:10,kind:'wall',x:5,y:5}],station),'');
 assert.match(bar.validPlace([{id:10,kind:'post',x:5,y:5}],station),/mur/);
 assert.equal(bar.connectionError([station,keg],keg),'');
 assert.match(bar.connectionError([station],{...keg,y:7}),/toucher/);
 assert.match(bar.connectionError([station],{...keg,stationId:18}),/Raccordez/);
 const items=layout();delete items[3].stationId;
 assert(bar.openingErrors(items).some(e=>e.includes('Raccordez')));
});

test('connecting, reloading, disconnecting and selling stations update the supply',()=>{
 const h=load(),state={myBar:{items:layout(),sales:0}};delete state.myBar.items[3].stationId;
 h.bar.mount({state,earned:()=>700,save:h.save});assert(h.node('bar-open').disabled);
 h.node('bar-floor').onclick({clientX:272,clientY:48});h.node('bar-link').onclick();
 h.node('bar-floor').onclick({clientX:272,clientY:16});
 assert.equal(state.myBar.items[3].stationId,9);assert(!h.node('bar-open').disabled);
 const reloaded=JSON.parse(JSON.stringify(state));h.bar.mount({state:reloaded,earned:()=>700,save:h.save});assert(!h.node('bar-open').disabled);
 h.node('bar-floor').onclick({clientX:272,clientY:48});h.node('bar-unlink').onclick();assert(h.node('bar-open').disabled);
 h.node('bar-link').onclick();h.node('bar-floor').onclick({clientX:272,clientY:16});assert(!h.node('bar-open').disabled);
 h.node('bar-cancel').onclick();h.node('bar-floor').onclick({clientX:272,clientY:16});h.node('bar-remove').onclick();
 assert(!reloaded.myBar.items.some(i=>i.kind==='station'));assert.equal(reloaded.myBar.items[3].stationId,undefined);assert(h.node('bar-open').disabled);
});

test('winning bars unlocks their keg styles and a tap saves the selected beer',()=>{
 const h=load();for(const file of ['content.js','content-night.js','content-gothic.js'])vm.runInContext(fs.readFileSync(file,'utf8'),h.c);
 const state={completed:[0,2],myBar:{items:layout(),sales:0}};
 assert.deepEqual(Array.from(h.bar.beerOptions(state.completed),b=>b.id),[0,2]);assert.equal(h.bar.beerOptions([]).length,0);
 h.bar.mount({state,earned:()=>700,save:h.save});
 h.node('bar-floor').onclick({clientX:208,clientY:112});
 assert(!h.node('bar-beer-picker').hidden);assert.equal(h.node('bar-beer-picker').buttons.length,2);
 h.node('bar-beer-picker').buttons.find(b=>b.dataset.serve==='4:2').onclick();
 assert.equal(state.myBar.items[2].kegId,4);assert.equal(state.myBar.items[3].beerId,2);
 const reloaded=JSON.parse(JSON.stringify(state));h.bar.mount({state:reloaded,earned:()=>700,save:h.save});
 assert.equal(h.bar.tapBeer(reloaded.myBar.items,reloaded.myBar.items[2],reloaded.completed).id,2);
 reloaded.myBar.items[3].beerId=1;assert(h.bar.openingErrors(reloaded.myBar.items,reloaded.completed).some(e=>e.includes('débloquée')));
});

test('the nearest tap displays its beer name only within walking proximity',()=>{
 const h=load();for(const file of ['content.js','content-night.js','content-gothic.js','bar-service.js','bar-world.js'])vm.runInContext(fs.readFileSync(file,'utf8'),h.c);
 const data={items:layout(),sales:0};data.items[2].kegId=4;data.items[3].beerId=2;
 const state={completed:[0,2]},room=h.c.window.HoublonBarWorld.create({data,state,save(){}});
 h.c.window.HoublonBarAssets={draw(){return true;}};
 const c=h.node('bar-floor').getContext('2d');c.createLinearGradient=()=>({addColorStop(){}});const texts=[];c.fillText=text=>texts.push(text);
 const view={width:360,height:580,follow:()=>({x:0,y:0})};
 room.player.x=7.5*64;room.player.y=11.5*64;room.paint(c,view,()=>{},0,'down');assert(!texts.some(t=>t.includes('IPA')));
 room.player.x=7.5*64;room.player.y=4.5*64;room.paint(c,view,()=>{},0,'down');assert(texts.some(t=>t==='IPA · American IPA'));
});
