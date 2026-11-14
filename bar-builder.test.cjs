const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function load(){
 const nodes=new Map();let callback,saves=0;
 const ctx=new Proxy({}, {get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 function node(id){if(nodes.has(id))return nodes.get(id);const n={id,style:{},isConnected:true,innerHTML:'',textContent:'',replaceChildren(){},append(){},scrollIntoView(){},getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0,width:480,height:384}),querySelectorAll(){this.buttons=[...this.innerHTML.matchAll(/data-buy="([^"]+)"/g)].map(m=>({dataset:{buy:m[1]}}));return this.buttons;}};nodes.set(id,n);return n;}
 const c={window:{HoublonAudio:{sfx(){}},HoublonCharacters:{draw(){}}},document:{getElementById:node,createElement:()=>node(Math.random()),hidden:false},requestAnimationFrame:f=>(callback=f,1),cancelAnimationFrame(){callback=null;}};
 vm.createContext(c);vm.runInContext(fs.readFileSync('bar-builder.js','utf8'),c);
 return {bar:c.window.HoublonBar,node,c,save:()=>saves++,get saves(){return saves;},frame:t=>callback?.(t)};
}
const layout=()=>[
 {id:1,kind:'entry',x:7,y:11},{id:2,kind:'counter',x:6,y:3},{id:3,kind:'tap',x:6,y:2},{id:4,kind:'keg',x:8,y:2},
 {id:5,kind:'staff',x:6,y:4},{id:6,kind:'toilet',x:0,y:0},{id:7,kind:'table2',x:1,y:6},{id:8,kind:'barrel2',x:11,y:6}
];
test('equipment, distance and access checks gate opening',()=>{
 const {bar}=load(),items=layout();assert.equal(bar.openingErrors(items).length,0);
 for(const item of items)assert.equal(bar.validPlace(items,item),'');
 assert(bar.openingErrors(items.filter(i=>i.kind!=='staff')).some(s=>s.includes('barman')));
 items[3].x=9;assert.equal(bar.openingErrors(items).length,0); // exactly 3 m
 items[3].y=1;assert(bar.openingErrors(items).some(s=>s.includes('3 m')));
 assert(bar.validPlace(items,{id:10,kind:'entry',x:5,y:5}));
 assert(bar.validPlace(items,{id:10,kind:'table6',x:14,y:11}));
 assert(bar.validPlace(items,{id:10,kind:'table2',x:1,y:0}));
 const blocked=layout();blocked.push({id:9,kind:'keg',x:6,y:11},{id:10,kind:'keg',x:8,y:11},{id:11,kind:'keg',x:7,y:10});
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
 assert.equal(state.myBar.items.length,8);assert(h.node('bar-wallet').textContent.startsWith('160 XP'));
 h.bar.stop();
});
