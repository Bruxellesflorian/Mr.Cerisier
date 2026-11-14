/* Ninety-second manual service, driven only by the game's animation clock. */
window.HoublonBarService=(()=>{
 const S=64,CAPACITY=8,DURATION=90;
 function create({items,data,state,player,save}){
  const bar=window.HoublonBar,entry=items.find(i=>i.kind==='entry'),counter=items.find(i=>i.kind==='counter');
  const access=bar.adjacent(items,counter),aisle=bar.route(items,[entry.x,entry.y],access)||[];
  const spots=aisle.slice(1,-1).reverse();
  for(let y=0;y<12;y++)for(let x=0;x<15;x++)if(bar.walkable(items,x,y)&&!(x===entry.x&&y===entry.y)&&!access.some(p=>p[0]===x&&p[1]===y)&&!spots.some(p=>p[0]===x&&p[1]===y))spots.push([x,y]);
  let phase='idle',remaining=DURATION,clients=[],next=0,id=0,carrying=null,busy=null,served=0,lost=0,score=0,earnings=0,message='';
  data.dollars=Number.isFinite(data.dollars)?Math.max(0,data.dollars):0;
  for(const keg of items.filter(i=>i.kind==='keg'))keg.remaining=Number.isInteger(keg.remaining)?Math.max(0,Math.min(CAPACITY,keg.remaining)):CAPACITY;
  const taps=()=>items.filter(i=>i.kind==='tap'&&bar.tapBeer(items,i,state.completed||[]));
  const beer=id=>bar.beerOptions(state.completed||[]).find(b=>b.id===id);
  const near=item=>Math.hypot(player.x-(item.x+.5)*S,player.y-(item.y+.5)*S)<=S*1.8;
  const first=()=>clients.find(g=>g.stage==='queue'||g.stage==='order');
  function send(g,targets,stage){const path=bar.route(items,[Math.round(g.x),Math.round(g.y)],targets);if(!path)return false;g.path=path.slice(1);g.stage=stage;return true;}
  function leave(g){g.spot=null;send(g,[[entry.x,entry.y]],'exit');}
  function start(){
   if(phase==='running')return false;
   if(!items.some(i=>i.kind==='stock')){message='Installez un stock de fûts.';return false;}
   if(!taps().length){message='Choisissez une bière sur une tireuse raccordée.';return false;}
   phase='running';remaining=DURATION;clients=[];next=.5;id=0;carrying=null;busy=null;served=lost=score=earnings=0;message='Le service commence !';return true;
  }
  function actions(){
   if(phase!=='running'||busy)return [];
   const result=[];
   if(!carrying)for(const tap of taps())if(near(tap)){const keg=bar.tapKeg(items,tap),b=bar.tapBeer(items,tap,state.completed||[]);result.push({id:'tap:'+tap.id,label:`${b.name} · ${keg.remaining}/${CAPACITY}`,disabled:keg.remaining===0});}
   const customer=first();if(carrying?.kind==='beer'&&customer?.stage==='order'&&!customer.path.length&&Math.hypot(player.x-(customer.x+.5)*S,player.y-(customer.y+.5)*S)<=S*1.4)result.push({id:'give:'+customer.id,label:'Servir le client'});
   if(!carrying)for(const stock of items.filter(i=>i.kind==='stock'))if(near(stock))result.push({id:'stock:'+stock.id,label:'Prendre un fût neuf'});
   if(carrying?.kind==='spare')for(const keg of items.filter(i=>i.kind==='keg'&&i.remaining===0))if(near(keg))result.push({id:'replace:'+keg.id,label:'Changer le fût vide'});
   if(carrying)result.push({id:'discard',label:carrying.kind==='beer'?'Vider le verre':'Reposer le fût'});
   return result;
  }
  function act(action){
   const allowed=actions().find(a=>a.id===action&&!a.disabled);if(!allowed)return false;
   const [kind,key]=action.split(':'),target=items.find(i=>i.id===Number(key));
   if(kind==='tap'){const keg=bar.tapKeg(items,target);busy={kind:'pour',tapId:target.id,kegId:keg.id,beerId:keg.beerId,left:1.2,total:1.2};message='La bière coule…';}
   if(kind==='stock'){carrying={kind:'spare'};message='Approchez-vous du fût vide pour le remplacer.';}
   if(kind==='replace'){busy={kind:'replace',kegId:target.id,left:1.8,total:1.8};message='Changement du fût…';}
   if(kind==='give'){
    const g=first();if(carrying.beerId!==g.beerId){message='Ce client demande : '+beer(g.beerId).name;return false;}
    const satisfaction=Math.max(10,Math.round(100-g.age/30*90)),dollars=2+Math.round(satisfaction*.08);
    served++;score+=satisfaction;earnings+=dollars;data.dollars+=dollars;data.sales++;g.beer=true;carrying=null;leave(g);save();message=`Servi ! +${dollars} $ · ${satisfaction} % satisfait`;
   }
   if(kind==='discard'){carrying=null;message='Les mains sont libres.';}
   return true;
  }
  function update(dt){
   if(phase==='idle')return;
   const active=phase==='running',step=active?Math.min(Math.max(0,dt),remaining):Math.max(0,dt);
   if(active){
    remaining=Math.max(0,remaining-step);if(remaining<1e-8)remaining=0;next-=step;
    if(busy){busy.left-=step;if(busy.left<=0){const keg=items.find(i=>i.id===busy.kegId);if(busy.kind==='pour'&&keg.remaining>0){keg.remaining--;carrying={kind:'beer',beerId:busy.beerId};message='Apportez la bière au premier client.';}else if(busy.kind==='replace'){keg.remaining=CAPACITY;carrying=null;message='Fût neuf raccordé.';}busy=null;save();}}
    if(next<=0&&clients.filter(g=>g.stage!=='exit').length<7){
     next=4;const choices=[...new Set(taps().map(t=>bar.tapBeer(items,t,state.completed||[]).id))];
     const spot=spots.find(p=>!clients.some(g=>g.spot?.[0]===p[0]&&g.spot?.[1]===p[1]));
     if(spot&&choices.length){const g={id:id++,x:entry.x,y:entry.y,spot,path:[],stage:'queue',age:0,walk:0,dir:'up',beerId:choices[Math.floor(Math.random()*choices.length)],look:{gender:Math.random()<.5?'girl':'boy',skin:Math.floor(Math.random()*6),hair:Math.floor(Math.random()*6),shirt:Math.floor(Math.random()*6)}};if(send(g,[spot],'queue'))clients.push(g);}
    }
   }
   for(const g of clients){
    if(active&&g.stage!=='exit'){g.age+=step;if(g.age>=30){lost++;leave(g);message='Un client est reparti après avoir attendu.';}}
    if(g.path.length){const [x,y]=g.path[0],dx=x-g.x,dy=y-g.y,d=Math.hypot(dx,dy),move=Math.min(d,step*1.8);if(d){g.x+=dx/d*move;g.y+=dy/d*move;g.walk+=move*35;g.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}if(d<=move+.001)g.path.shift();continue;}
    g.walk=0;if(g.stage==='exit'){g.done=true;continue;}
    if(active&&g.stage==='queue'&&first()===g){g.spot=null;send(g,access,'order');}
   }
   clients=clients.filter(g=>!g.done);
   if(active&&remaining===0){phase='finished';busy=null;carrying=null;clients.forEach(g=>{if(g.stage!=='exit'){lost++;leave(g);}});message='Service terminé !';save();}
  }
  return {start,update,actions,act,get clients(){return clients;},get phase(){return phase;},get remaining(){return remaining;},get carrying(){return carrying;},get busy(){return busy;},get message(){return message;},get summary(){return {served,lost,earnings,satisfaction:served+lost?Math.round(score/(served+lost)):100,dollars:data.dollars};}};
 }
 return {create,CAPACITY,DURATION};
})();
