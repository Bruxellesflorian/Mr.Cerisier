/* A playable room built directly from the saved workshop layout. */
window.HoublonBarWorld=(()=>{
 const S=64,W=15,H=12;
 function create({data,state,save}){
  const errors=window.HoublonBar.openingErrors(data.items,state.completed);if(errors.length)throw new Error(errors.join(' '));
  const bar=window.HoublonBar,items=data.items,definition=i=>bar.catalog.find(d=>d.id===i.kind);
  const entry=items.find(i=>i.kind==='entry'),counter=items.find(i=>i.kind==='counter');
  const player={x:(entry.x+.5)*S,y:(entry.y+.5)*S};
  let guests=[],clock=0,nextArrival=1,nextId=0,introElapsed=0;
  const staffLook={gender:'boy',skin:1,hair:0,shirt:3};
  const service=window.HoublonBarService?.create({items,data,state,player,save});
  const floor=document.createElement('canvas');floor.width=W*S;floor.height=H*S;
  const f=floor.getContext('2d');f.fillStyle='#a77f58';f.fillRect(0,0,floor.width,floor.height);
  for(let row=0;row<32;row++)for(let col=-1;col<9;col++){
   const x=col*136+(row%2)*68,y=row*24,shade=Math.sin(row*9+col*17);
   f.fillStyle=`hsl(31 29% ${49+shade*3}%)`;f.fillRect(x+1,y+1,134,22);
   f.strokeStyle='#e4be8726';f.beginPath();f.moveTo(x+6,y+7);f.bezierCurveTo(x+35,y+5,x+90,y+12,x+128,y+8);f.stroke();
   f.fillStyle='#573f3128';f.fillRect(x+6,y+5,2,2);f.fillRect(x+126,y+18,2,2);
  }
  function canWalk(x,y){
   if(introElapsed<1.8||service?.busy)return false;
   return [[-11,-8],[11,-8],[-11,8],[11,8]].every(([dx,dy])=>bar.walkable(items,Math.floor((x+dx)/S),Math.floor((y+dy)/S)));
  }
  function send(g,targets,stage){const path=bar.route(items,[Math.round(g.x),Math.round(g.y)],targets);if(!path)return false;g.path=path.slice(1);g.stage=stage;g.wait=0;return true;}
  function depart(g){g.seat=null;send(g,[[entry.x,entry.y]],'exit');}
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const counterAccess=bar.adjacent(items,counter);
  // Prefer a single line along the route from the entrance to the counter.
  const aisle=bar.route(items,[entry.x,entry.y],counterAccess)||[];
  const arrival=aisle.at(-1)||[entry.x,entry.y];player.x=(arrival[0]+.5)*S;player.y=(arrival[1]+.5)*S;
  if(reduced?.matches)introElapsed=1.8;
  const queueCells=aisle.slice(1,-1).reverse();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(bar.walkable(items,x,y)&&!(x===entry.x&&y===entry.y)&&!counterAccess.some(p=>p[0]===x&&p[1]===y)&&!queueCells.some(p=>p[0]===x&&p[1]===y))queueCells.push([x,y]);
  function availableSeat(){return items.find(i=>definition(i).seats&&guests.filter(g=>g.seat===i.id).length<definition(i).seats);}
  function reserveSeat(g,seat){g.seat=seat.id;g.slot=Array.from({length:definition(seat).seats},(_,i)=>i).find(i=>!guests.some(other=>other!==g&&other.seat===seat.id&&other.slot===i));}
  function seatPosition(item,slot){
   const slots={table2:[[.15,.55],[.85,.55]],table4:[[.3,.15],[.7,.15],[.3,.85],[.7,.85]],table6:[[.15,.22],[.15,.5],[.15,.78],[.85,.22],[.85,.5],[.85,.78]],barrel2:[[.15,.6],[.85,.6]],barrel4:[[.5,.15],[.15,.5],[.85,.5],[.5,.85]]};
   let [u,v]=slots[item.kind][slot];if(item.rot)[u,v]=[1-v,u];const [w,h]=bar.size(item);return [(item.x+u*w)*S,(item.y+v*h)*S+8];
  }
  function update(dt,realDt=dt){
   clock+=dt;if(introElapsed<1.8){introElapsed=Math.min(1.8,introElapsed+realDt);return;}
   if(service&&service.phase!=='idle'){service.update(realDt);return;}
   if(clock>=nextArrival&&guests.length<12){nextArrival=clock+2.8;const g={id:nextId++,x:entry.x,y:entry.y,path:[],wait:0,walk:0,dir:'up',look:{gender:Math.random()<.5?'girl':'boy',skin:Math.floor(Math.random()*6),hair:Math.floor(Math.random()*6),shirt:Math.floor(Math.random()*6)}};
    const spot=queueCells.find(p=>!guests.some(other=>other.queueSpot?.[0]===p[0]&&other.queueSpot?.[1]===p[1]));
    if(spot&&send(g,[spot],'queue')){g.queueSpot=spot;guests.push(g);}
   }
   for(const g of guests){
    if(g.path.length){const [x,y]=g.path[0],dx=x-g.x,dy=y-g.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*1.7);if(d){g.x+=dx/d*step;g.y+=dy/d*step;g.walk+=step*35;g.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}if(d<=step+.001)g.path.shift();continue;}
    g.walk=0;g.wait+=dt;
    if(g.stage==='exit'){g.done=true;continue;}
    if(g.stage==='queue'){
     const first=guests.find(other=>other.stage==='queue'||other.stage==='order'),seat=availableSeat();
     if(first===g&&seat&&send(g,counterAccess,'order')){reserveSeat(g,seat);g.queueSpot=null;}
     continue;
    }
    if(g.stage==='order'&&g.wait>2){
     if(guests.find(other=>other.stage==='order'&&!other.path.length)!==g)continue;
     const taps=items.filter(i=>i.kind==='tap'&&bar.tapBeer(items,i,state.completed||[]));const served=taps[Math.floor(Math.random()*taps.length)];g.beerId=served?bar.tapBeer(items,served,state.completed||[]).id:null;
     data.sales++;save();g.beer=true;
     const seat=items.find(i=>i.id===g.seat);
     if(seat){const [sx,sy]=seatPosition(seat,g.slot);const targets=bar.adjacent(items,seat).sort((a,b)=>Math.hypot((a[0]+.5)*S-sx,(a[1]+.5)*S-sy)-Math.hypot((b[0]+.5)*S-sx,(b[1]+.5)*S-sy));const target=targets.find(p=>bar.route(items,[Math.round(g.x),Math.round(g.y)],[p]));g.stay=Math.random()*15;if(!target||!send(g,[target],'sit'))depart(g);}else depart(g);
    }else if(g.stage==='sit'&&g.wait>=g.stay){
     g.seat=null;g.beer=false;
     const toilet=items.find(i=>i.kind==='toilet'&&!guests.some(other=>other.toilet===i.id));
     if(toilet&&g.id%2===0&&send(g,bar.access(items,toilet),'toilet'))g.toilet=toilet.id;else depart(g);
    }else if(g.stage==='toilet'&&g.wait>3.5){g.toilet=null;depart(g);}
   }
   guests=guests.filter(g=>!g.done);
  }
  function paint(c,view,person,walk,dir){
   const zoom=1.1,cam=view.follow(player.x,player.y,W*S,H*S,zoom,S*1.75);
   if(introElapsed<1.8){const start=view.follow((entry.x+.5)*S,(entry.y+.5)*S,W*S,H*S,zoom,S*1.75),t=introElapsed/1.8,ease=t*t*(3-2*t);cam.x=start.x+(cam.x-start.x)*ease;cam.y=start.y+(cam.y-start.y)*ease;}
   c.fillStyle='#2b3932';c.fillRect(0,0,view.width,view.height);c.save();c.scale(zoom,zoom);c.translate(-cam.x,-cam.y);
   c.drawImage(floor,0,0);window.HoublonBarAssets.walls?.(c,W,H,S,items);
   c.fillStyle='#9e7953';c.fillRect(entry.x*S,entry.y*S,S,S);
   const shade=c.createLinearGradient(0,0,0,70);shade.addColorStop(0,'#1a241e66');shade.addColorStop(1,'#1a241e00');c.fillStyle=shade;c.fillRect(12,14,W*S-24,56);
   bar.drawConnections(c,items,S);
   const seatedDraws=[];
   const draws=items.map(item=>({y:(item.y+bar.size(item)[1])*S,priority:(item.kind.startsWith('poster')||item.kind==='station')?3:item.kind==='tap'?2:0,draw(){const [w,h]=bar.size(item);if(item.kind==='staff'){const pumping=(!service||service.phase==='idle')&&guests.some(g=>g.stage==='order'&&!g.path.length);person(c,(item.x+.5)*S,(item.y+.85)*S,staffLook,0,'up',50,{pumping,pump:reduced?.matches?.5:(1+Math.sin(clock*7))/2});return;}window.HoublonBarAssets.draw(c,item.kind.startsWith('poster')?{...item,mountKind:bar.decorSupport(items,item)?.kind}:item,item.x*S,item.y*S,w*S,h*S);}}));
   const visibleGuests=service&&service.phase!=='idle'?service.clients:guests;
   for(const g of visibleGuests){
    let px=(g.x+.5)*S,py=(g.y+.85)*S;
    if(g.stage==='toilet'&&!g.path.length){
     if(g.wait>=.6&&g.wait<=2.9)continue;
     const toilet=items.find(i=>i.id===g.toilet),[w,h]=bar.size(toilet);
     const q=g.wait<.6?g.wait/.6:Math.max(0,(3.5-g.wait)/.6);
     const tx=toilet.rot?toilet.x*S+4:(toilet.x+w/2)*S,ty=toilet.rot?(toilet.y+h/2)*S:(toilet.y+h)*S-4;
     px+=(tx-px)*q;py+=(ty-py)*q;
    }
    if(g.stage==='sit'&&!g.path.length){const seat=items.find(i=>i.id===g.seat);if(seat){
     [px,py]=seatPosition(seat,g.slot);const [w,h]=bar.size(seat),dx=(seat.x+w/2)*S-px,dy=(seat.y+h/2)*S-(py-8);
     const facing=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';
     const sip=reduced?.matches?0:Math.max(0,Math.sin(g.wait*2.5+g.id*.4))**2;
     seatedDraws.push(()=>person(c,px,py,g.look,0,facing,50,{seated:true,sip,beer:g.beer}));continue;
    }}
    draws.push({y:py,priority:1,draw(){person(c,px,py,g.look,g.walk,g.dir,50);if(g.beer){c.fillStyle='#edc56d';c.fillRect(px+10,py-18,6,9);}}});
   }
   draws.push({y:player.y,priority:1,draw(){const job=service?.busy,tap=job?.tapId?items.find(i=>i.id===job.tapId):null,dx=tap?(tap.x+.5)*S-player.x:0,dy=tap?(tap.y+.5)*S-player.y:0,facing=tap?(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up'):dir;person(c,player.x,player.y,state,job?0:walk,facing,54,{pumping:job?.kind==='pour',pump:job?(reduced?.matches?.5:(1+Math.sin(clock*9))/2):0,carryBeer:service?.carrying?.kind==='beer'});if(service?.carrying?.kind==='spare')window.HoublonBarAssets.draw(c,{kind:'keg'},player.x+10,player.y-33,22,28);}});
   draws.sort((a,b)=>a.y-b.y||a.priority-b.priority).forEach(d=>d.draw());
   seatedDraws.forEach(draw=>draw());
   if(service?.phase==='running')for(const g of service.clients.filter(g=>g.stage!=='exit')){
    const name=bar.beerOptions(state.completed||[]).find(b=>b.id===g.beerId)?.name.split(' · ')[0]||'Bière';
    const x=(g.x+.5)*S,y=(g.y+.85)*S-60,text='Une '+name.toLowerCase()+', svp';c.save();c.font='10px sans-serif';c.textAlign='center';const width=Math.min(190,(c.measureText?.(text)?.width||text.length*5)+12);c.fillStyle='#f5f0df';c.strokeStyle=g.age>20?'#c5684e':'#55634c';c.lineWidth=1;c.beginPath();c.roundRect(x-width/2,y-16,width,22,5);c.fill();c.stroke();c.fillStyle='#293f38';c.fillText(text,x,y-2,width-8);c.restore();
   }
   for(const tap of items.filter(i=>i.kind==='tap').sort((a,b)=>Math.hypot(player.x-(a.x+.5)*S,player.y-(a.y+1)*S)-Math.hypot(player.x-(b.x+.5)*S,player.y-(b.y+1)*S)).slice(0,1)){
    const x=(tap.x+.5)*S,y=(tap.y+1)*S;
    if(Math.hypot(player.x-x,player.y-y)>S*1.8)continue;
    const name=bar.tapBeer(items,tap,state.completed||[])?.name||'Choisir une bière';
    c.save();c.font='9px sans-serif';c.textAlign='center';const width=Math.min(210,(c.measureText?.(name)?.width||name.length*5)+14);
    c.fillStyle='#202b29ee';c.strokeStyle='#b9c799';c.lineWidth=1;c.beginPath();c.roundRect(x-width/2,y+6,width,23,5);c.fill();c.stroke();c.fillStyle='#f1eee4';c.fillText(name,x,y+21,width-10);c.restore();
   }
   c.strokeStyle='#e4cb8b';c.lineWidth=1.5;c.beginPath();c.ellipse((entry.x+.5)*S,(entry.y+.5)*S,19,7,0,0,Math.PI*2);c.stroke();c.restore();
  }
  return {player,canWalk,update,paint,service,startService:()=>{if(introElapsed<1.8||!service)return false;const started=service.start();if(started)guests=[];return started;},get canControl(){return introElapsed>=1.8&&!service?.busy;},get stats(){if(service&&service.phase!=='idle'){const q=service.summary;return `${q.served} servis · ${q.earnings} $ · ${q.satisfaction} % satisfaits`;}return `${guests.length} clients · ${guests.filter(g=>g.stage==='queue'||g.stage==='order').length} en attente · ${data.sales} bières servies`;},nearExit:()=>Math.hypot(player.x-(entry.x+.5)*S,player.y-(entry.y+.5)*S)<S*.8};
 }
 return {create};
})();
