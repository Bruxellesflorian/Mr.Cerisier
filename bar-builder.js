/* Local bar workshop. One floor tile represents one metre. */
window.HoublonBar=(()=>{
 const W=15,H=12,S=40;
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
 const posterNames=['Cerisier','Brume du Verger','Pavés Dorés','Ambrée des Amis','Houblon Vagabond','Nuit de Velours','Rousse du Coin','Triple Rencontre','Saison des Fleurs','Zéro Détour'];
 catalog.push({id:'stock',type:'stock',name:'Stock de fûts',price:60,w:1,h:1,color:'#a88459'},{id:'station',type:'station',name:'Station murale de tirage',price:80,w:1,h:1,color:'#a9b3ae'},{id:'wall',type:'wall',name:'Mur en bois',price:30,w:1,h:1,color:'#926d48'},{id:'post',type:'post',name:'Poteau en bois',price:40,w:1,h:1,color:'#805a39'},...posterNames.map((name,i)=>({id:'poster'+i,type:'poster',name,price:25,w:1,h:1,color:'#cfb77e'})));
 const def=item=>catalog.find(d=>d.id===item.kind);
 const size=item=>{const d=def(item);return item.rot?[d.h,d.w]:[d.w,d.h];};
 const center=item=>{const [w,h]=size(item);return [item.x+w/2,item.y+h/2];};
 const type=(items,t)=>items.filter(i=>def(i).type===t);
 const inside=(x,y)=>x>=0&&x<W&&y>=0&&y<H;
 const contains=(outer,item)=>{const [w,h]=size(outer),[iw,ih]=size(item);return item.x>=outer.x&&item.y>=outer.y&&item.x+iw<=outer.x+w&&item.y+ih<=outer.y+h;};
 const support=(items,item)=>items.find(i=>def(i).type==='counter'&&contains(i,item));
 const mounted=(items,counter)=>items.filter(i=>def(i).type==='tap'&&contains(counter,i));
 const isBoundary=item=>item.x===0||item.y===0||item.x===W-1||item.y===H-1;
 const decorSupport=(items,item)=>items.find(i=>['wall','post'].includes(def(i).type)&&contains(i,item));
 const decorMounted=(items,base)=>items.filter(i=>['poster','station'].includes(def(i).type)&&contains(base,i));
 const layer=item=>['tap','poster','station'].includes(def(item).type)?1:0;
 const toiletDoor=item=>{const [w,h]=size(item);return item.rot?[item.x-1,item.y+Math.floor(h/2)]:[item.x+Math.floor(w/2),item.y+h];};
 const access=(items,item)=>def(item).type==='toilet'?[toiletDoor(item)].filter(([x,y])=>walkable(items,x,y)):adjacent(items,item);
 function validPlace(items,item){
  const [w,h]=size(item);if(!inside(item.x,item.y)||!inside(item.x+w-1,item.y+h-1))return 'Cet élément dépasse de la pièce.';
  if(def(item).type==='entry'&&item.x!==0&&item.y!==0&&item.x!==W-1&&item.y!==H-1)return 'Placez l’entrée sur un bord de la pièce.';
  const kind=def(item).type;
  if(kind==='tap'&&!support(items,item))return 'Une tireuse doit être posée sur un comptoir.';
  if(kind==='poster'&&!decorSupport(items,item)&&!isBoundary(item))return 'Fixez ce tableau à un mur ou à un poteau.';
  if(kind==='station'&&!items.some(i=>def(i).type==='wall'&&contains(i,item))&&!isBoundary(item))return 'La station se fixe uniquement sur un mur.';
  const old=items.find(i=>i.id===item.id);
  if(kind==='counter'&&old&&mounted(items,old).length&&(old.x!==item.x||old.y!==item.y||!!old.rot!==!!item.rot))return 'Déplacez d’abord les tireuses posées sur ce comptoir.';
  if(['wall','post'].includes(kind)&&old&&decorMounted(items,old).length&&(old.x!==item.x||old.y!==item.y||!!old.rot!==!!item.rot))return 'Décrochez d’abord les éléments fixés à ce support.';
  if(kind==='toilet'&&!inside(...toiletDoor(item)))return 'Laissez une case devant la porte des toilettes.';
  for(const other of items){if(other.id===item.id)continue;
   if(kind==='tap'&&def(other).type==='counter'&&contains(other,item))continue;
   if(kind==='counter'&&def(other).type==='tap'&&contains(item,other))continue;
   if(kind==='poster'&&['wall','post'].includes(def(other).type)&&contains(other,item))continue;
   if(kind==='station'&&def(other).type==='wall'&&contains(other,item))continue;
   if(kind==='wall'&&def(other).type==='station'&&contains(item,other))continue;
   if(['wall','post'].includes(kind)&&def(other).type==='poster'&&contains(item,other))continue;const [ow,oh]=size(other);
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
 function connectionError(items,keg){
  const station=items.find(i=>i.id===keg.stationId&&i.kind==='station');
  if(!station)return 'Raccordez chaque fût à une station murale.';
  if(Math.abs(keg.x-station.x)+Math.abs(keg.y-station.y)!==1)return 'Le fût doit toucher sa station par un côté.';
  return '';
 }
 function beerOptions(completed){return (window.HOUBLON_CONTENT?.bars||[]).map((b,id)=>({id,name:b.theme,bar:b.name})).filter(b=>completed.includes(b.id));}
 function tapKeg(items,tap){
  const [x,y]=center(tap);const candidates=type(items,'keg').filter(k=>!connectionError(items,k)&&Math.hypot(...center(k).map((v,i)=>v-[x,y][i]))<=3);
  return tap.kegId!=null?candidates.find(k=>k.id===tap.kegId):candidates.sort((a,b)=>Math.hypot(...center(a).map((v,i)=>v-[x,y][i]))-Math.hypot(...center(b).map((v,i)=>v-[x,y][i])))[0];
 }
 function tapBeer(items,tap,completed){const keg=tapKeg(items,tap);return keg?beerOptions(completed).find(b=>b.id===keg.beerId):null;}
 function drawConnections(c,items,S){
  c.save();c.lineCap='round';
  for(const keg of type(items,'keg')){const station=items.find(i=>i.id===keg.stationId&&i.kind==='station');if(!station)continue;
   const [ax,ay]=center(keg),[bx,by]=center(station);c.strokeStyle=connectionError(items,keg)?'#c65d4d':'#8ab6c4';c.lineWidth=3;
   c.beginPath();c.moveTo(ax*S,ay*S);c.bezierCurveTo(ax*S,(ay+by)*S/2,bx*S,(ay+by)*S/2,bx*S,by*S);c.stroke();
  }c.restore();
 }
 function openingErrors(items,completed){
  const errors=[],required={counter:'un comptoir',tap:'des têtes de bière',keg:'un fût',entry:'une entrée',toilet:'des toilettes',table:'une table avec chaises',barrel:'un tonneau avec tabourets',staff:'un barman',station:'une station murale',stock:'un stock de fûts'};
  for(const [t,label]of Object.entries(required))if(!type(items,t).length)errors.push('Il manque '+label+'.');
  for(const item of items){const error=validPlace(items,item);if(error)errors.push(error);}
  const kegs=type(items,'keg');for(const keg of kegs){const error=connectionError(items,keg);if(error)errors.push(error);}
  for(const tap of type(items,'tap')){const [x,y]=center(tap);if(!kegs.some(k=>{const [kx,ky]=center(k);return Math.hypot(x-kx,y-ky)<=3;}))errors.push('Chaque tireuse doit être à 3 m maximum d’un fût (centre à centre).');}
  if(Array.isArray(completed)){for(const keg of kegs)if(!beerOptions(completed).some(b=>b.id===keg.beerId))errors.push('Choisissez une bière débloquée pour chaque fût en touchant une tireuse.');for(const tap of type(items,'tap'))if(!tapBeer(items,tap,completed))errors.push('Chaque tireuse doit desservir un fût raccordé avec une bière débloquée.');}
  const entry=type(items,'entry')[0];if(entry){const start=[entry.x,entry.y];
   for(const item of items.filter(i=>['counter','table','barrel','toilet','staff','stock'].includes(def(i).type)))if(!route(items,start,access(items,item)))errors.push(def(item).name+' inaccessible : laissez un passage depuis l’entrée.');
  }return [...new Set(errors)];
 }
 let cleanup=()=>{};
 const html=()=>`<h2 id="sheet-title">Mon bar</h2><p>Aménagez votre établissement. Une case = 1 m. Choisissez un achat, puis touchez son emplacement. Les tireuses se posent sur les comptoirs. Fixez une station au mur, sélectionnez un fût puis Raccorder et touchez la station. Collez le fût à sa station par un côté. Les tableaux se fixent aux murs et aux poteaux. La flèche des toilettes indique leur porte. Faites glisser le plan pour le déplacer ; touchez un élément posé pour le sélectionner.</p><div class="builder-wallet" id="bar-wallet"></div><h3 id="bar-shop-title">Équipement · faites défiler</h3><div id="bar-shop" class="builder-shop" aria-label="Équipement à placer"></div><div id="bar-posters" class="builder-posters" role="region" aria-label="Tableaux de marques de bière" hidden></div><div class="bar-floor-viewport" aria-label="Plan défilable du bar"><canvas id="bar-floor" width="600" height="480" tabindex="0" aria-label="Plan du bar. Faites glisser pour le déplacer. Flèches pour choisir une case, Entrée pour placer ou sélectionner."></canvas></div><div id="bar-beer-picker" class="builder-beer-picker" hidden></div><div id="bar-message" role="status" class="builder-message"></div><div class="builder-tools"><button id="bar-turn">↻ Pivoter</button><button id="bar-link">Raccorder</button><button id="bar-unlink">Débrancher</button><button id="bar-cancel">Annuler</button><button id="bar-remove">Revendre</button></div><button id="bar-open" class="primary">Ouvrir le bar</button><div id="bar-checklist" class="card"></div><p class="tiny">Le mobilier comprend ses sièges. Alex est le premier barman disponible. Revente au prix d’achat pour tester librement. Les clients achètent des bières fictives ; leurs visites ne rapportent pas encore d’XP.</p>`;
 function mount({state,earned,save,onOpen}){
  cleanup();const $=id=>document.getElementById(id),canvas=$('bar-floor'),c=canvas.getContext('2d');
  if(!state.myBar||!Array.isArray(state.myBar.items))state.myBar={items:[],sales:0};
  const data=state.myBar;data.items=data.items.filter(i=>catalog.some(d=>d.id===i.kind)&&Number.isInteger(i.x)&&Number.isInteger(i.y));
  const unlockedBeers=()=>beerOptions(state.completed||[]);
  for(const keg of type(data.items,'keg'))if(keg.beerId==null&&unlockedBeers().length){keg.beerId=unlockedBeers()[0].id;save();}
  data.sales=Number.isFinite(data.sales)?Math.max(0,data.sales):0;
  let selected=null,buy=null,rot=false,opened=false,postersOpen=false,linking=false,customers=[],clock=0,last=0,nextArrival=0,raf,disposed=false,cursor=[7,6],cursorVisible=false;
  const spent=()=>data.items.reduce((n,i)=>n+def(i).price,0),balance=()=>Math.max(0,earned()-spent());
  const message=text=>{$('bar-message').textContent=text;};
  function refresh(){
   $('bar-link').disabled=opened||selected?.kind!=='keg';$('bar-unlink').disabled=opened||selected?.kind!=='keg'||!selected.stationId;
   const panMode=!opened&&!buy&&!selected;canvas.classList.toggle('pan-mode',panMode);canvas.style.touchAction=panMode?'pan-y':'manipulation';
   $('bar-wallet').textContent=`${balance()} XP disponibles · ${spent()} XP investis · ${data.sales} bières servies`;
   const errors=openingErrors(data.items,state.completed);$('bar-checklist').replaceChildren();
   const text=document.createElement('p');text.textContent=opened?'Le bar est ouvert. Les clients commandent, s’installent puis repartent.':errors.length?errors.join(' '):'Tout est prêt : vous pouvez accueillir les clients !';$('bar-checklist').append(text);
   $('bar-open').textContent=opened?'Fermer et aménager':'Ouvrir le bar';
   $('bar-open').disabled=!opened&&errors.length>0;
   $('bar-turn').disabled=opened||!buy&&!selected;$('bar-remove').disabled=opened||!selected;$('bar-cancel').disabled=opened||!buy&&!selected;
   $('bar-shop').hidden=opened;$('bar-shop-title').hidden=opened;
   const button=d=>`<button data-buy="${d.id}" class="${buy===d.id?'selected':''}" aria-pressed="${buy===d.id}" ${d.price>balance()||(['entry','staff'].includes(d.type)&&type(data.items,d.type).length)?'disabled':''}><img class="builder-item-icon" src="assets/bar-items/${d.id}.png" alt=""><strong>${d.name}</strong><small>${d.price} XP${d.seats?' · '+d.seats+' places':['wall','post'].includes(d.type)?' · 1 case':''}</small></button>`;
   $('bar-shop').innerHTML=catalog.filter(d=>d.type!=='poster').map(button).join('')+`<button id="bar-poster-tab" class="${postersOpen?'selected':''}" aria-expanded="${postersOpen}" aria-controls="bar-posters"><span class="builder-poster-symbol">▧</span><strong>Tableaux ${postersOpen?'▴':'▾'}</strong><small>10 créations · 25 XP chacune</small></button>`;
   $('bar-posters').hidden=opened||!postersOpen;
   $('bar-posters').innerHTML=catalog.filter(d=>d.type==='poster').map(button).join('');
   $('bar-poster-tab').onclick=()=>{postersOpen=!postersOpen;refresh();$('bar-poster-tab').focus?.();};
   const choose=b=>{buy=b.dataset.buy;linking=false;selected=null;rot=false;const d=catalog.find(d=>d.id===buy);message('À placer : '+d.name+(d.type==='poster'?' · sur un mur ou un poteau.':'. Aucun XP débité avant le placement.'));refresh();canvas.parentElement.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});};
   for(const list of [$('bar-shop'),$('bar-posters')])list.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>choose(b));
   refreshBeers();
  }
  function refreshBeers(){
   const panel=$('bar-beer-picker');panel.hidden=selected?.kind!=='tap'||opened;
   if(panel.hidden)return;
   const [x,y]=center(selected),kegs=type(data.items,'keg').filter(k=>!connectionError(data.items,k)&&Math.hypot(...center(k).map((v,i)=>v-[x,y][i]))<=3);
   const beers=unlockedBeers();
   panel.innerHTML='<h3>Bière servie à cette tireuse</h3>'+(!beers.length?'<p>Réussissez un bar pour débloquer son type de fût.</p>':!kegs.length?'<p>Raccordez un fût à sa station, à 3 m maximum de la tireuse.</p>':kegs.map(k=>`<div class="beer-keg-choice"><strong>Fût n° ${k.id}</strong><div class="choices">${beers.map(b=>`<button data-serve="${k.id}:${b.id}" aria-pressed="${selected.kegId===k.id&&k.beerId===b.id}" class="${selected.kegId===k.id&&k.beerId===b.id?'active':''}">${b.name}</button>`).join('')}</div></div>`).join(''));
   panel.querySelectorAll('[data-serve]').forEach(button=>button.onclick=()=>{const [kegId,beerId]=button.dataset.serve.split(':').map(Number),keg=kegs.find(k=>k.id===kegId);if(!keg||!beers.some(b=>b.id===beerId))return;keg.beerId=beerId;selected.kegId=kegId;save();refresh();message('Bière sélectionnée : '+beers.find(b=>b.id===beerId).name+'.');});
  }
  function place(x,y){if(opened)return;cursor=[x,y];cursorVisible=true;
   if(linking&&selected?.kind==='keg'){const station=data.items.find(i=>i.kind==='station'&&i.x===x&&i.y===y);if(!station){message('Touchez une station murale pour raccorder ce fût.');return;}const error=connectionError(data.items,{...selected,stationId:station.id});if(error){message(error);return;}selected.stationId=station.id;linking=false;save();refresh();message('Fût raccordé à la station.');return;}
   if(buy||selected){const item=buy?{id:Math.max(0,...data.items.map(i=>i.id))+1,kind:buy,x,y,rot}:{...selected,x,y,rot};
    const error=validPlace(data.items,item);if(error){message(error);return;}
    if(buy&&def(item).price>balance()){message('XP insuffisants.');return;}
    if(buy)data.items.push(item);else Object.assign(selected,item);
    save();window.HoublonAudio.sfx('click');buy=null;selected=null;refresh();message('Élément placé.');
   }else{selected=[...data.items].sort((a,b)=>layer(b)-layer(a)).find(i=>{const [w,h]=size(i);return x>=i.x&&x<i.x+w&&y>=i.y&&y<i.y+h;})||null;
    if(selected){rot=!!selected.rot;message(def(selected).name+' : touchez sa nouvelle position ou choisissez Revendre.');}refresh();if(selected?.kind==='tap')$('bar-beer-picker').scrollIntoView({block:'nearest',behavior:'smooth'});}
  }
  let drag=null,suppressClickUntil=0;
  canvas.onpointerdown=e=>{if(!canvas.classList.contains('pan-mode')||(e.pointerType==='mouse'&&e.button!==0))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:canvas.parentElement.scrollLeft,top:canvas.parentElement.scrollTop,moved:false};canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)>6){drag.moved=true;canvas.classList.add('dragging');}if(drag.moved){canvas.parentElement.scrollLeft=drag.left-dx;canvas.parentElement.scrollTop=drag.top-dy;}};
  const endDrag=e=>{if(!drag||drag.id!==e.pointerId)return;if(drag.moved)suppressClickUntil=performance.now()+400;canvas.classList.remove('dragging');if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);drag=null;};
  canvas.onpointerup=endDrag;canvas.onpointercancel=endDrag;
  canvas.onclick=e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();return;}const r=canvas.getBoundingClientRect();place(Math.min(W-1,Math.floor((e.clientX-r.left)/r.width*W)),Math.min(H-1,Math.floor((e.clientY-r.top)/r.height*H)));};
  canvas.onkeydown=e=>{const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta){e.preventDefault();cursor=[Math.max(0,Math.min(W-1,cursor[0]+delta[0])),Math.max(0,Math.min(H-1,cursor[1]+delta[1]))];cursorVisible=true;}if(e.key==='Enter'||e.key===' '){e.preventDefault();place(...cursor);}};
  $('bar-link').onclick=()=>{if(selected?.kind!=='keg')return;linking=true;message('Touchez la station murale à relier au fût. Collez le fût à sa station par un côté.');};
  $('bar-unlink').onclick=()=>{if(selected?.kind!=='keg')return;delete selected.stationId;linking=false;save();refresh();message('Fût débranché.');};
  $('bar-turn').onclick=()=>{rot=!rot;message('Orientation changée : touchez une case pour confirmer.');};
  $('bar-cancel').onclick=()=>{selected=null;buy=null;linking=false;refresh();message('Sélection annulée.');};
  $('bar-remove').onclick=()=>{if(!selected)return;if(['wall','post'].includes(def(selected).type)&&decorMounted(data.items,selected).length){message('Décrochez d’abord les éléments fixés à ce support.');return;}if(def(selected).type==='counter'&&mounted(data.items,selected).length){message('Déplacez ou revendez d’abord les tireuses de ce comptoir.');return;}if(selected.kind==='station')for(const keg of type(data.items,'keg'))if(keg.stationId===selected.id)delete keg.stationId;const price=def(selected).price;data.items=data.items.filter(i=>i.id!==selected.id);selected=null;save();refresh();message(price+' XP rendus disponibles.');};
  $('bar-open').onclick=()=>{
   if(!opened){const errors=openingErrors(data.items,state.completed);if(errors.length){message(errors.join(' '));return;}}
   if(onOpen){cleanup();onOpen(data);return;}
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
   c.clearRect(0,0,W*S,H*S);c.fillStyle='#bfaa8b';c.fillRect(0,0,W*S,H*S);window.HoublonBarAssets?.walls?.(c,W,H,S,data.items);
   c.strokeStyle='#9e876a55';c.lineWidth=1;
   for(let x=0;x<=W;x++){c.beginPath();c.moveTo(x*S,0);c.lineTo(x*S,H*S);c.stroke();}for(let y=0;y<=H;y++){c.beginPath();c.moveTo(0,y*S);c.lineTo(W*S,y*S);c.stroke();}
   drawConnections(c,data.items,S);c.strokeStyle='#4b493e';c.lineWidth=6;c.strokeRect(3,3,W*S-6,H*S-6);
   for(const item of [...data.items].sort((a,b)=>layer(a)-layer(b))){const d=def(item),[w,h]=size(item),x=item.x*S,y=item.y*S;
    if(window.HoublonBarAssets?.draw(c,def(item).type==='poster'?{...item,mountKind:decorSupport(data.items,item)?.kind}:item,x,y,w*S,h*S)){if(selected?.id===item.id){c.strokeStyle='#fff6c8';c.lineWidth=2;c.strokeRect(x+1,y+1,w*S-2,h*S-2);}if(d.type==='toilet'){const [tx,ty]=toiletDoor(item);c.fillStyle='#f6d38d';c.font='bold 16px sans-serif';c.textAlign='center';c.fillText(item.rot?'→':'↑',(tx+.5)*S,(ty+.6)*S);}continue;}
    c.fillStyle=d.color;c.strokeStyle=selected?.id===item.id?'#fff6c8':'#514a3e';c.lineWidth=selected?.id===item.id?3:1;
    c.beginPath();c.roundRect(x+3,y+3,w*S-6,h*S-6,5);c.fill();c.stroke();
    c.fillStyle='#263830';c.textAlign='center';c.font='bold 10px sans-serif';
    if(d.seats){const cx=x+w*S/2,cy=y+h*S/2;c.fillStyle='#64482e';
     for(let j=0;j<d.seats;j++){const angle=j/d.seats*Math.PI*2;c.beginPath();c.arc(cx+Math.cos(angle)*(w*S/2-9),cy+Math.sin(angle)*(h*S/2-9),5,0,Math.PI*2);c.fill();}
     c.fillStyle='#dfb77a';c.beginPath();if(d.type==='barrel')c.arc(cx,cy,13,0,Math.PI*2);else c.roundRect(cx-15,cy-11,30,22,4);c.fill();c.fillStyle='#453929';c.fillText(d.seats,cx,cy+4);
    }else if(d.type==='staff'){window.HoublonCharacters.draw(c,x+16,y+28,{gender:'boy',skin:1,hair:0,shirt:3},0,'down',27);}
    else{const label={counter:'COMPTOIR',tap:'TIREUSE',keg:'FÛT',entry:'ENTRÉE',toilet:'WC',wall:'MUR',post:'POTEAU',poster:'TABLEAU',station:'STATION',stock:'STOCK'}[d.type];c.font=d.type==='tap'||d.type==='entry'?'7px sans-serif':'bold 10px sans-serif';c.fillText(label,x+w*S/2,y+h*S/2+4);}
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
 return {html,mount,stop:()=>cleanup(),catalog,validPlace,openingErrors,route,size,walkable,adjacent,access,toiletDoor,support,decorSupport,connectionError,drawConnections,beerOptions,tapKeg,tapBeer};
})();
