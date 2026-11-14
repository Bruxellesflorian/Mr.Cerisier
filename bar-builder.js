/* Local bar workshop. One floor tile represents one metre. */
window.HoublonBar=(()=>{
 const W=15,H=12,S=32;
 const catalog=[
  {id:'counter',type:'counter',name:'Comptoir',price:120,w:3,h:1,color:'#976946'},
  {id:'tap',type:'tap',name:'Têtes de bière',price:70,w:1,h:1,color:'#d4b46d'},
  {id:'keg',type:'keg',name:'Fût de bière',price:50,w:1,h:1,color:'#9aa7a4'},
  {id:'entry',type:'entry',name:'Entrée',price:10,w:1,h:1,color:'#8dbf92'},
  {id:'toilet',type:'toilet',name:'Toilettes',price:70,w:2,h:2,color:'#8b9ab0'},
  {id:'table2',type:'table',name:'Table + 2 chaises',price:60,w:2,h:2,seats:2,color:'#bb8a5c'},
  {id:'table4',type:'table',name:'Table + 4 chaises',price:90,w:3,h:2,seats:4,color:'#bb8a5c'},
  {id:'table6',type:'table',name:'Table + 6 chaises',price:120,w:3,h:3,seats:6,color:'#bb8a5c'},
  {id:'barrel2',type:'barrel',name:'Tonneau + 2 tabourets',price:40,w:2,h:2,seats:2,color:'#95724c'},
  {id:'barrel4',type:'barrel',name:'Tonneau + 4 tabourets',price:70,w:3,h:2,seats:4,color:'#95724c'},
  {id:'staff',type:'staff',name:'Embaucher Alex',price:120,w:1,h:1,color:'#c6ae8b'}
 ];
 const def=item=>catalog.find(d=>d.id===item.kind);
 const size=item=>{const d=def(item);return item.rot?[d.h,d.w]:[d.w,d.h];};
 const center=item=>{const [w,h]=size(item);return [item.x+w/2,item.y+h/2];};
 const type=(items,t)=>items.filter(i=>def(i).type===t);
 const inside=(x,y)=>x>=0&&x<W&&y>=0&&y<H;
 function validPlace(items,item){
  const [w,h]=size(item);if(!inside(item.x,item.y)||!inside(item.x+w-1,item.y+h-1))return 'Cet élément dépasse de la pièce.';
  if(def(item).type==='entry'&&item.x!==0&&item.y!==0&&item.x!==W-1&&item.y!==H-1)return 'Placez l’entrée sur un bord de la pièce.';
  for(const other of items){if(other.id===item.id)continue;const [ow,oh]=size(other);
   if(item.x<other.x+ow&&item.x+w>other.x&&item.y<other.y+oh&&item.y+h>other.y)return 'Cet emplacement est déjà occupé.';
  }return '';
 }
 function walkable(items,x,y){return inside(x,y)&&!items.some(i=>{const [w,h]=size(i);return def(i).type!=='entry'&&x>=i.x&&x<i.x+w&&y>=i.y&&y<i.y+h;});}
 function adjacent(items,item){const [w,h]=size(item),cells=[];
  for(let y=item.y-1;y<=item.y+h;y++)for(let x=item.x-1;x<=item.x+w;x++)if((x>=item.x&&x<item.x+w||y>=item.y&&y<item.y+h)&&walkable(items,x,y))cells.push([x,y]);return cells;
 }
 function route(items,start,targets){
  if(!targets.length)return null;const goals=new Set(targets.map(p=>p.join(','))),queue=[start],previous=new Map([[start.join(','),null]]);
  for(let n=0;n<queue.length;n++){const p=queue[n],key=p.join(',');if(goals.has(key)){const path=[];let k=key;while(k!==null){path.unshift(k.split(',').map(Number));k=previous.get(k);}return path;}
   for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p[0]+dx,y=p[1]+dy,k=x+','+y;if(!previous.has(k)&&walkable(items,x,y)){previous.set(k,key);queue.push([x,y]);}}
  }return null;
 }
 function openingErrors(items){
  const errors=[],required={counter:'un comptoir',tap:'des têtes de bière',keg:'un fût',entry:'une entrée',toilet:'des toilettes',table:'une table avec chaises',barrel:'un tonneau avec tabourets',staff:'un barman'};
  for(const [t,label]of Object.entries(required))if(!type(items,t).length)errors.push('Il manque '+label+'.');
  const kegs=type(items,'keg');
  for(const tap of type(items,'tap')){const [x,y]=center(tap);if(!kegs.some(k=>{const [kx,ky]=center(k);return Math.hypot(x-kx,y-ky)<=3;}))errors.push('Chaque tireuse doit être à 3 m maximum d’un fût (centre à centre).');}
  const entry=type(items,'entry')[0];if(entry){const start=[entry.x,entry.y];
   for(const item of items.filter(i=>['counter','table','barrel','toilet','staff'].includes(def(i).type)))if(!route(items,start,adjacent(items,item)))errors.push(def(item).name+' inaccessible : laissez un passage depuis l’entrée.');
  }return [...new Set(errors)];
 }
 let cleanup=()=>{};
 const html=()=>`<h2 id="sheet-title">Mon bar</h2><p>Aménagez votre établissement. Une case = 1 m. Choisissez un achat, puis touchez une case libre. Touchez un élément posé pour le déplacer.</p><div class="builder-wallet" id="bar-wallet"></div><canvas id="bar-floor" width="480" height="384" tabindex="0" aria-label="Plan du bar. Flèches pour choisir une case, Entrée pour placer ou sélectionner."></canvas><div id="bar-message" role="status" class="builder-message"></div><div class="builder-tools"><button id="bar-turn">↻ Pivoter</button><button id="bar-cancel">Annuler</button><button id="bar-remove">Revendre</button></div><button id="bar-open" class="primary">Ouvrir le bar</button><div id="bar-checklist" class="card"></div><h3 id="bar-shop-title">Équipement</h3><div id="bar-shop" class="builder-shop"></div><p class="tiny">Le mobilier comprend ses sièges. Alex est le premier barman disponible. Revente au prix d’achat pour tester librement. Les clients achètent des bières fictives ; leurs visites ne rapportent pas encore d’XP.</p>`;
 function mount({state,earned,save}){
  cleanup();const $=id=>document.getElementById(id),canvas=$('bar-floor'),c=canvas.getContext('2d');
  if(!state.myBar||!Array.isArray(state.myBar.items))state.myBar={items:[],sales:0};
  const data=state.myBar;data.items=data.items.filter(i=>catalog.some(d=>d.id===i.kind)&&Number.isInteger(i.x)&&Number.isInteger(i.y));
  data.sales=Number.isFinite(data.sales)?Math.max(0,data.sales):0;
  let selected=null,buy=null,rot=false,opened=false,customers=[],clock=0,last=0,nextArrival=0,raf,disposed=false,cursor=[7,6],cursorVisible=false;
  const spent=()=>data.items.reduce((n,i)=>n+def(i).price,0),balance=()=>Math.max(0,earned()-spent());
  const message=text=>{$('bar-message').textContent=text;};
  function refresh(){
   $('bar-wallet').textContent=`${balance()} XP disponibles · ${spent()} XP investis · ${data.sales} bières servies`;
   const errors=openingErrors(data.items);$('bar-checklist').replaceChildren();
   const text=document.createElement('p');text.textContent=opened?'Le bar est ouvert. Les clients commandent, s’installent puis repartent.':errors.length?errors.join(' '):'Tout est prêt : vous pouvez accueillir les clients !';$('bar-checklist').append(text);
   $('bar-open').textContent=opened?'Fermer et aménager':'Ouvrir le bar';
   $('bar-open').disabled=!opened&&errors.length>0;
   $('bar-turn').disabled=opened||!buy&&!selected;$('bar-remove').disabled=opened||!selected;$('bar-cancel').disabled=opened||!buy&&!selected;
   $('bar-shop').hidden=opened;$('bar-shop-title').hidden=opened;
   $('bar-shop').innerHTML=catalog.map(d=>`<button data-buy="${d.id}" ${d.price>balance()||(['entry','staff'].includes(d.type)&&type(data.items,d.type).length)?'disabled':''}><strong>${d.name}</strong><small>${d.price} XP${d.seats?' · '+d.seats+' places':''}</small></button>`).join('');
   $('bar-shop').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{buy=b.dataset.buy;selected=null;rot=false;message('À placer : '+catalog.find(d=>d.id===buy).name+'. Aucun XP débité avant le placement.');refresh();canvas.scrollIntoView({block:'center',behavior:'smooth'});});
  }
  function place(x,y){if(opened)return;cursor=[x,y];cursorVisible=true;
   if(buy||selected){const item=buy?{id:Math.max(0,...data.items.map(i=>i.id))+1,kind:buy,x,y,rot}:{...selected,x,y,rot};
    const error=validPlace(data.items,item);if(error){message(error);return;}
    if(buy&&def(item).price>balance()){message('XP insuffisants.');return;}
    if(buy)data.items.push(item);else Object.assign(selected,item);
    save();window.HoublonAudio.sfx('click');buy=null;selected=null;refresh();message('Élément placé.');
   }else{selected=data.items.find(i=>{const [w,h]=size(i);return x>=i.x&&x<i.x+w&&y>=i.y&&y<i.y+h;})||null;
    if(selected){rot=!!selected.rot;message(def(selected).name+' : touchez sa nouvelle position ou choisissez Revendre.');}refresh();}
  }
  canvas.onclick=e=>{const r=canvas.getBoundingClientRect();place(Math.min(W-1,Math.floor((e.clientX-r.left)/r.width*W)),Math.min(H-1,Math.floor((e.clientY-r.top)/r.height*H)));};
  canvas.onkeydown=e=>{const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta){e.preventDefault();cursor=[Math.max(0,Math.min(W-1,cursor[0]+delta[0])),Math.max(0,Math.min(H-1,cursor[1]+delta[1]))];cursorVisible=true;}if(e.key==='Enter'||e.key===' '){e.preventDefault();place(...cursor);}};
  $('bar-turn').onclick=()=>{rot=!rot;message('Orientation changée : touchez une case pour confirmer.');};
  $('bar-cancel').onclick=()=>{selected=null;buy=null;refresh();message('Sélection annulée.');};
  $('bar-remove').onclick=()=>{if(!selected)return;const price=def(selected).price;data.items=data.items.filter(i=>i.id!==selected.id);selected=null;save();refresh();message(price+' XP rendus disponibles.');};
  $('bar-open').onclick=()=>{
   if(!opened){const errors=openingErrors(data.items);if(errors.length){message(errors.join(' '));return;}}
   opened=!opened;customers=[];buy=null;selected=null;nextArrival=clock+.5;refresh();message(opened?'Bienvenue ! Alex prend son service.':'Bar fermé : vous pouvez modifier le plan.');
  };
  function send(customer,targets,stage){const path=route(data.items,[Math.round(customer.x),Math.round(customer.y)],targets);if(!path)return false;customer.path=path.slice(1);customer.stage=stage;return true;}
  function depart(customer){const entry=type(data.items,'entry')[0];send(customer,[[entry.x,entry.y]],'exit');}
  function update(dt){clock+=dt;if(!opened)return;
   if(clock>=nextArrival&&customers.length<6){nextArrival=clock+4;const entry=type(data.items,'entry')[0],counter=type(data.items,'counter')[0];
    const guest={x:entry.x,y:entry.y,path:[],stage:'order',wait:0,walk:0,dir:'up',look:{gender:Math.random()<.5?'girl':'boy',skin:Math.floor(Math.random()*6),hair:Math.floor(Math.random()*6),shirt:Math.floor(Math.random()*6)}};
    if(send(guest,adjacent(data.items,counter),'order'))customers.push(guest);
   }
   for(const guest of customers){
    if(guest.path.length){const [x,y]=guest.path[0],dx=x-guest.x,dy=y-guest.y,d=Math.hypot(dx,dy),distance=Math.min(d,dt*2);
     if(d){guest.x+=dx/d*distance;guest.y+=dy/d*distance;guest.walk+=distance*20;guest.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
     if(d<=distance+.001){guest.x=x;guest.y=y;guest.path.shift();}continue;
    }
    guest.walk=0;guest.wait+=dt;
    if(guest.stage==='exit'){guest.done=true;continue;}
    if(guest.stage==='order'&&guest.wait>2){
     // One bartender serves one customer at a time.
     if(customers.find(g=>g.stage==='order'&&!g.path.length)!==guest)continue;
     data.sales++;guest.wait=0;guest.beer=true;save();refresh();window.HoublonAudio.sfx('correct');
     const seat=data.items.find(i=>def(i).seats&&customers.filter(g=>g.seat===i.id).length<def(i).seats);
     if(seat&&send(guest,adjacent(data.items,seat),'sit')){
      guest.seat=seat.id;guest.seatSlot=Array.from({length:def(seat).seats},(_,i)=>i).find(i=>!customers.some(g=>g!==guest&&g.seat===seat.id&&g.seatSlot===i));
     }else depart(guest);
    }else if(guest.stage==='sit'&&guest.wait>6){guest.seat=null;depart(guest);}
   }customers=customers.filter(g=>!g.done);
  }
  function paint(){
   c.clearRect(0,0,W*S,H*S);c.fillStyle='#bfaa8b';c.fillRect(0,0,W*S,H*S);
   c.strokeStyle='#9e876a55';c.lineWidth=1;
   for(let x=0;x<=W;x++){c.beginPath();c.moveTo(x*S,0);c.lineTo(x*S,H*S);c.stroke();}for(let y=0;y<=H;y++){c.beginPath();c.moveTo(0,y*S);c.lineTo(W*S,y*S);c.stroke();}
   c.strokeStyle='#4b493e';c.lineWidth=6;c.strokeRect(3,3,W*S-6,H*S-6);
   for(const item of data.items){const d=def(item),[w,h]=size(item),x=item.x*S,y=item.y*S;
    c.fillStyle=d.color;c.strokeStyle=selected?.id===item.id?'#fff6c8':'#514a3e';c.lineWidth=selected?.id===item.id?3:1;
    c.beginPath();c.roundRect(x+3,y+3,w*S-6,h*S-6,5);c.fill();c.stroke();
    c.fillStyle='#263830';c.textAlign='center';c.font='bold 10px sans-serif';
    if(d.seats){const cx=x+w*S/2,cy=y+h*S/2;c.fillStyle='#64482e';
     for(let j=0;j<d.seats;j++){const angle=j/d.seats*Math.PI*2;c.beginPath();c.arc(cx+Math.cos(angle)*(w*S/2-9),cy+Math.sin(angle)*(h*S/2-9),5,0,Math.PI*2);c.fill();}
     c.fillStyle='#dfb77a';c.beginPath();if(d.type==='barrel')c.arc(cx,cy,13,0,Math.PI*2);else c.roundRect(cx-15,cy-11,30,22,4);c.fill();c.fillStyle='#453929';c.fillText(d.seats,cx,cy+4);
    }else if(d.type==='staff'){window.HoublonCharacters.draw(c,x+16,y+28,{gender:'boy',skin:1,hair:0,shirt:3},0,'down',27);}
    else{const label={counter:'COMPTOIR',tap:'TIREUSE',keg:'FÛT',entry:'ENTRÉE',toilet:'WC'}[d.type];c.font=d.type==='tap'||d.type==='entry'?'7px sans-serif':'bold 10px sans-serif';c.fillText(label,x+w*S/2,y+h*S/2+4);}
   }
   if(!opened)for(const tap of type(data.items,'tap')){const kegs=type(data.items,'keg');if(!kegs.length)continue;const a=center(tap),k=kegs.reduce((best,k)=>Math.hypot(...center(k).map((v,i)=>v-a[i]))<Math.hypot(...center(best).map((v,i)=>v-a[i]))?k:best),b=center(k),distance=Math.hypot(a[0]-b[0],a[1]-b[1]);
    c.strokeStyle=distance<=3?'#336444':'#a73f33';c.lineWidth=2;c.setLineDash([4,3]);c.beginPath();c.moveTo(a[0]*S,a[1]*S);c.lineTo(b[0]*S,b[1]*S);c.stroke();c.setLineDash([]);c.fillStyle='#182d23';c.font='bold 10px sans-serif';c.fillText(distance.toFixed(1)+' m',(a[0]+b[0])*S/2,(a[1]+b[1])*S/2-5);
   }
   for(const guest of [...customers].sort((a,b)=>a.y-b.y)){
    let px=(guest.x+.5)*S,py=(guest.y+.8)*S;
    if(guest.stage==='sit'&&!guest.path.length){const seat=data.items.find(i=>i.id===guest.seat);if(seat){const [w,h]=size(seat),angle=guest.seatSlot/def(seat).seats*Math.PI*2;px=(seat.x+w/2)*S+Math.cos(angle)*(w*S/2-9);py=(seat.y+h/2)*S+Math.sin(angle)*(h*S/2-9)+4;}}
    window.HoublonCharacters.draw(c,px,py,guest.look,guest.walk,guest.dir,29);if(guest.beer){c.fillStyle='#efbe58';c.fillRect(px+6,py-10,4,6);}
   }
   if(cursorVisible&&!opened){const d=buy?catalog.find(d=>d.id===buy):selected?def(selected):null;const w=d?(rot?d.h:d.w):1,h=d?(rot?d.w:d.h):1;c.strokeStyle='#fff8d2';c.lineWidth=2;c.strokeRect(cursor[0]*S+1,cursor[1]*S+1,w*S-2,h*S-2);}
  }
  function frame(now){if(disposed)return;if(!canvas.isConnected){cleanup();return;}const dt=document.hidden?0:Math.min(.05,last?(now-last)/1000:0);last=now;update(dt);paint();raf=requestAnimationFrame(frame);}
  cleanup=()=>{disposed=true;cancelAnimationFrame(raf);};refresh();message('La pièce est vide : commencez par choisir un équipement.');raf=requestAnimationFrame(frame);
 }
 return {html,mount,stop:()=>cleanup(),catalog,validPlace,openingErrors,route,size};
})();
