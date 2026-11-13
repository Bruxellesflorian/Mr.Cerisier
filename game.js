(() => {
'use strict';
const $ = id => document.getElementById(id), content = window.HOUBLON_CONTENT;
const STORE = 'cerisier-houblon-v1';
const fresh = () => ({name:'Camille',gender:'girl',skin:0,hair:1,shirt:4,created:false,completed:[],read:[],x:300,y:215,streetVersion:2,area:0});
let state = fresh(), storageOK = true;
try { const s = JSON.parse(localStorage.getItem(STORE)); if (s && typeof s === 'object') {
 state = {...state,...s, streetVersion:s.streetVersion===2?2:1, name:typeof s.name === 'string' ? s.name.slice(0,18) : 'Camille',completed:[...new Set((Array.isArray(s.completed)?s.completed:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<content.bars.length))],read:[...new Set((Array.isArray(s.read)?s.read:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<content.bars.length))]};
 for(const k of ['skin','hair','shirt']) if(!Number.isInteger(state[k])||state[k]<0||state[k]>5)state[k]=0;
 if(!['girl','boy'].includes(state.gender))state.gender='girl';
 if(!Number.isFinite(state.x)||!Number.isFinite(state.y)) {state.x=300;state.y=215;}
}} catch {storageOK=false;}
const characters=window.HoublonCharacters,{skin:skins,hair:hairs,shirt:shirts}=characters.palettes;
let previewDirection='down',previewMoving=true;
const canvas=$('world'), ctx=canvas.getContext('2d');canvas.width=720;canvas.height=920;ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;
const view=window.HoublonView,street=window.HoublonStreet, interiors=window.HoublonInteriors;let cameraX=0,room=null;
if(state.streetVersion!==2){state.x=300;state.y=215;state.streetVersion=2;}
const stick=window.HoublonJoystick.attach(canvas,$('joystick'),()=>$('overlay').hidden);
function resizeViewport(){
 const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
 view.height=Math.round(box.height*view.width/box.width);
 canvas.height=view.height*2;ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=true;
 stick.reset();
}
new ResizeObserver(resizeViewport).observe(canvas);resizeViewport();
const keys=new Set();let camera=0,last=0,step=0,near=null,toastTimer,quiz=null,draft=null,lastFocus=null;
if(state.area!==1||![0,1,2,3].every(i=>state.completed.includes(i)))state.area=0;
street.select(state.area);
let buildings=street.doors;
function level(){return 1+state.completed.length;}
function nightUnlocked(){return [0,1,2,3].every(i=>state.completed.includes(i));}
const escape = str => String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function xp(){return state.completed.reduce((sum,i)=>sum+content.bars[i].reward,0)}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch{storageOK=false;} }
function unlocked(i){return i===0||state.completed.includes(i-1)}
function notify(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',3200);}
function hud(){const total=xp();$('player-name').textContent=state.name;$('rank').textContent=`Niveau ${level()} · ${total>=500?'Connaisseur':total>=250?'Explorateur':'Curieux'}`;$('xp').textContent=total;$('player-level').textContent='Niv. '+level();$('xp-fill').style.width=(state.completed.length/content.bars.length*100)+'%';$('xp-fill').parentElement.title=state.completed.length+' / '+content.bars.length+' bars réussis';const next=content.bars.findIndex((_,i)=>!state.completed.includes(i));$('quest').innerHTML=state.read.length===0&&state.area===0?'PREMIÈRE ESCALE<strong>← Bibliothèque · première ruelle</strong>':next<0?'AVENTURE ACCOMPLIE<strong>Les huit bars vous accueillent !</strong>':`PROCHAINE ESCALE<strong>${next>=4&&state.area===0?'Place des Lanternes · bouton Quartiers':escape(content.bars[next].name)}</strong>`;const ac=$('avatar').getContext('2d');ac.clearRect(0,0,96,96);person(ac,48,93,state,0,'down',88);placeHUD();}
function modal(tag,html,closable=true){keys.clear();stick.reset();lastFocus=document.activeElement;$('overlay').hidden=false;$('sheet-tag').textContent=tag;$('sheet-content').innerHTML=html;$('close').hidden=!closable;document.querySelector('.sheet').scrollTop=0;requestAnimationFrame(()=>{const focus=$('sheet-content').querySelector('input,button');(focus||$('close')).focus();});}
function close(){if(!state.created)return;$('overlay').hidden=true;quiz=null;draft=null;keys.clear();stick.reset();save();(lastFocus?.isConnected?lastFocus:canvas).focus();}
$('close').onclick=close;
function paintPreview(){
 const el=$('preview');if(!draft||!el)return;
 const c=el.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,el.width,el.height);c.setTransform(el.width/192,0,0,el.height/192,0,0);
 const animated=previewMoving&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 person(c,96,177,draft,animated?performance.now()/1000*60:0,previewDirection,160);
}
function createCharacter(){
 draft={...state};previewDirection='down';previewMoving=true;
 modal('L’ATELIER DU PERSONNAGE',`<h2 id="sheet-title">Donnez vie à<br>votre voyageur.</h2><p>Une silhouette expressive, vos couleurs et une petite sacoche pour partir explorer.</p>
 <div class="character-stage detailed"><button id="rotate-left" class="rotate-character rotate-left" type="button" aria-label="Faire pivoter le personnage vers la gauche">‹</button><button id="rotate-right" class="rotate-character rotate-right" type="button" aria-label="Faire pivoter le personnage vers la droite">›</button><canvas id="preview" width="384" height="384" aria-label="Aperçu animé du personnage"></canvas><span>APERÇU EN JEU</span><button id="preview-motion" aria-pressed="true">Ⅱ Pause</button></div>

 <label class="form-label" for="name">Votre prénom</label><input id="name" maxlength="18" value="${escape(state.name)}" autocomplete="off">
 <span class="form-label">Personnage</span><div class="choices" id="gender"><button data-value="girl">Fille · cheveux attachés</button><button data-value="boy">Garçon · cheveux courts</button></div>
 ${[['skin','Teint',skins],['hair','Cheveux',hairs],['shirt','Veste',shirts]].map(([key,label,colors])=>`<span class="form-label">${label} <small id="label-${key}"></small></span><div class="choices" id="${key}">${colors.map((c,i)=>`<button class="swatch" style="background:${c}" data-value="${i}" title="${characters.names[key][i]}" aria-label="${label} : ${characters.names[key][i]}"></button>`).join('')}</div>`).join('')}
 <button class="book random-look" id="random-look">✦ Proposer une palette</button><button id="begin" class="primary">${state.created?'Enregistrer mon personnage':'Entrer dans la rue →'}</button>`,state.created);
 function refresh(){
  for(const key of ['gender','skin','hair','shirt'])for(const b of $(key).children){const active=String(draft[key])===b.dataset.value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);}
  for(const key of ['skin','hair','shirt'])$('label-'+key).textContent=characters.names[key][draft[key]];
  paintPreview();
 }
 for(const key of ['gender','skin','hair','shirt'])$(key).onclick=e=>{const b=e.target.closest('button');if(!b)return;draft[key]=key==='gender'?b.dataset.value:Number(b.dataset.value);refresh();};
 const orientations=['down','right','up','left'];
 function rotatePreview(delta){
  previewDirection=orientations[(orientations.indexOf(previewDirection)+delta+orientations.length)%orientations.length];
  $('preview').setAttribute('aria-label','Aperçu du personnage : '+({down:'face',right:'profil droit',up:'dos',left:'profil gauche'}[previewDirection]));
  paintPreview();
 }
 $('rotate-left').onclick=()=>rotatePreview(-1);
 $('rotate-right').onclick=()=>rotatePreview(1);
 $('preview-motion').onclick=()=>{previewMoving=!previewMoving;$('preview-motion').textContent=previewMoving?'Ⅱ Pause':'▶ Marcher';$('preview-motion').setAttribute('aria-pressed',previewMoving);paintPreview();};
 $('random-look').onclick=()=>{for(const key of ['skin','hair','shirt'])draft[key]=Math.floor(Math.random()*characters.palettes[key].length);refresh();};
 $('begin').onclick=()=>{const first=!state.created;Object.assign(state,draft,{name:$('name').value.trim()||'Camille',created:true});save();hud();close();if(first)notify('Bienvenue ! Approchez-vous de la porte de la bibliothèque, à gauche.');};refresh();
}
function library(){modal('LA BIBLIOTHÈQUE',`<h2 id="sheet-title">Un peu de savoir<br>avant le comptoir.</h2><p>Quatre chapitres pour préparer les défis de ce quartier.</p>${content.chapters.map((ch,i)=>({ch,i})).filter(({i})=>Math.floor(i/4)===state.area).map(({ch,i})=>`<button class="book" data-chapter="${i}"><strong>${state.read.includes(i)?'✓':'▤'} ${ch.title}</strong><small>${ch.subtitle} · Bar ${i+1}</small></button>`).join('')}<p class="tiny">Contenu de démonstration. Le cours et les questions de Mr Cerisier seront intégrés lorsqu’ils seront disponibles dans le dossier.</p>`);document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>chapter(+b.dataset.chapter));}
function chapter(i){const ch=content.chapters[i];modal(`BIBLIOTHÈQUE · CHAPITRE ${i+1}`,`<h2 id="sheet-title">${ch.title}</h2><p>${ch.text}</p>${ch.sourceUrl?`<p class="tiny">Pour approfondir : <a href="${ch.sourceUrl}" target="_blank" rel="noopener noreferrer">${ch.sourceTitle}</a></p>`:''}<div class="card"><span class="pill">À RETENIR</span><p>${ch.takeaway}</p></div><button class="primary" id="read">${state.read.includes(i)?'Déjà lu · Revenir aux chapitres':'J’ai lu · Revenir aux chapitres'}</button>`);$('read').onclick=()=>{if(!state.read.includes(i))state.read.push(i);save();hud();library();};}
function barIntro(i){const b=content.bars[i];if(!unlocked(i)){notify(`Terminez d’abord « ${content.bars[i-1].name} » pour ouvrir ce bar.`);return;}modal(`BAR ${i+1} / ${content.bars.length} · ${b.theme.toUpperCase()}`,`<div class="result-icon">♜</div><h2 id="sheet-title">${b.name}</h2><p>Le patron vous propose quatre questions sur ${b.theme.toLowerCase()}. Obtenez au moins <b>3 bonnes réponses sur 4</b> pour réussir.</p><div class="card"><span class="pill">${state.completed.includes(i)?'DÉFI DÉJÀ RÉUSSI':`RÉCOMPENSE · +${b.reward} XP`}</span><p>${state.completed.includes(i)?'Vous pouvez rejouer pour vous entraîner. Les XP sont attribués une seule fois.':i<content.bars.length-1?`Débloquez aussi « ${content.bars[i+1].name} ».`:'Dernière étape pour compléter votre aventure !'}</p></div><button class="primary" id="start-quiz">Relever le défi →</button><button class="book" id="revise"><strong>▤ Revoir le chapitre</strong><small>${content.chapters[i].title}</small></button>`);$('start-quiz').onclick=()=>{quiz={bar:i,index:0,score:0,answered:false};question();};$('revise').onclick=()=>chapter(i);}
function question(){const q=quiz,b=content.bars[q.bar],data=b.questions[q.index];q.answered=false;modal(`${b.name.toUpperCase()} · ${q.index+1} / 4`,`<div class="quiz-progress">${b.questions.map((_,i)=>`<i class="${i<=q.index?'done':''}"></i>`).join('')}</div><h2 id="sheet-title" style="font-size:23px">${data[0]}</h2>${data[1].map((a,i)=>`<button class="answer" data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('')}<div id="answer-feedback" aria-live="polite"></div><button class="primary" id="next" hidden>${q.index===3?'Voir le résultat':'Question suivante →'}</button>`);document.querySelectorAll('[data-answer]').forEach(button=>button.onclick=()=>{if(q.answered)return;q.answered=true;const answer=+button.dataset.answer,correct=answer===data[2];if(correct)q.score++;document.querySelectorAll('[data-answer]').forEach(a=>{a.disabled=true;if(+a.dataset.answer===data[2])a.classList.add('correct');});if(!correct)button.classList.add('wrong');$('answer-feedback').innerHTML=`<div class="feedback"><b>${correct?'Bien joué !':'À retenir pour la suite'}</b><br>${data[3]}</div>`;$('next').hidden=false;$('next').scrollIntoView({block:'nearest',behavior:'smooth'});});$('next').onclick=()=>{if(!q.answered)return;if(q.index<3){q.index++;question();}else result();};}
function result(){const q=quiz,b=content.bars[q.bar],success=q.score>=3,earned=success&&!state.completed.includes(q.bar)?b.reward:0;if(earned){state.completed.push(q.bar);save();hud();}modal(success?'DÉFI RÉUSSI':'ON APPREND À CHAQUE ESSAI',`<div class="result-icon">${success?'✦':'▤'}</div><h2 id="sheet-title">${success?'Bien joué, '+escape(state.name)+' !':'Presque au bout !'}</h2><p>${q.score} bonne${q.score>1?'s':''} réponse${q.score>1?'s':''} sur 4. ${success?'Le patron salue vos connaissances.':'Il en faut 3 pour débloquer la suite. Relisez le chapitre et retentez votre chance.'}</p>${earned?`<div class="reward">Niveau ${level()} !<p>+1 niveau · +${earned} XP</p></div>`:''}<div class="card"><p>${success?(q.bar===content.bars.length-1?'Les huit bars sont maîtrisés. Les deux quartiers vous accueillent !':q.bar===3?'La Place des Lanternes est débloquée ! Sortez puis touchez Quartiers pour continuer.':`« ${content.bars[q.bar+1].name} » vous ouvre ses portes.`):'Votre progression est conservée. Vous pouvez recommencer autant de fois que vous le souhaitez.'}</p></div><button class="primary" id="result-action">${success?'Revenir dans le bar →':'Réessayer le défi →'}</button>${!success?'<button class="book" id="review">Relire le chapitre</button>':''}`);$('result-action').onclick=success?close:()=>barIntro(q.bar);if(!success)$('review').onclick=()=>chapter(q.bar);}
function journal(){modal('VOTRE CARNET',`<h2 id="sheet-title">Un pavé à la fois.</h2><p>${xp()} XP gagnés · ${state.read.length} / ${content.chapters.length} chapitres lus · ${state.completed.length} / ${content.bars.length} défis réussis. Niveau ${level()}.</p>${content.bars.map((b,i)=>`<div class="card"><strong style="font-size:13px">${state.completed.includes(i)?'✓':unlocked(i)?'◇':'▣'} ${b.name}</strong><p>${b.theme} · ${b.reward} XP<br>${state.completed.includes(i)?'Défi réussi':unlocked(i)?'Ouvert : rendez-vous à sa porte':'Réussissez le bar précédent pour entrer'}</p></div>`).join('')}<p class="tiny">${storageOK?'Progression enregistrée dans ce navigateur.':'La sauvegarde locale est indisponible dans ce navigateur.'} Chaque nouveau bar réussi donne exactement un niveau. Rejouer un bar ne donne ni niveau ni XP supplémentaires. Les points gagnés sont conservés pour la future boutique.</p><button class="danger" id="reset">Recommencer l’aventure</button>`);$('reset').onclick=()=>{modal('NOUVEAU DÉPART',`<h2 id="sheet-title">Repartir de zéro ?</h2><p>Le personnage, les chapitres lus et les XP de cette aventure seront effacés sur ce navigateur.</p><button class="primary" id="confirm-reset">Oui, recommencer</button><button class="book" id="cancel-reset">Garder mon aventure</button>`);$('cancel-reset').onclick=journal;$('confirm-reset').onclick=()=>{room=null;state=fresh();street.select(0);buildings=street.doors;save();hud();createCharacter();};};}
function collection(){modal('LA COLLECTION · APERÇU',`<h2 id="sheet-title">Dix découvertes<br>à venir.</h2><p>La future boutique permettra de dépenser vos points. Voici ses dix premières bières fictives, à collectionner dans le jeu.</p><div class="card"><span class="pill">${xp()} XP GAGNÉS</span><p>Achats disponibles dans une prochaine version. Prix indicatifs.</p></div><div class="beer-grid">${content.beers.map(b=>`<article class="beer-card"><span class="bottle" style="--beer:${b[2]}"></span><strong>${b[0]}</strong><small>${b[1]}</small><small>${b[3]} XP · bientôt</small></article>`).join('')}</div>`);}
function help(){modal('BIENVENUE DANS LE QUARTIER',`<h2 id="sheet-title">À vous la rue.</h2><p><b>1. Marchez.</b> Utilisez les flèches du clavier, ZQSD, WASD ou posez le pouce sur le décor : un joystick apparaît sous votre doigt. Faites-le glisser pour avancer, puis relâchez pour le masquer. Plus vous l’écartez du centre, plus vous marchez vite.</p><p><b>2. Entrez.</b> Approchez-vous d’une porte et touchez la fenêtre d’entrée qui apparaît (ou appuyez sur E au clavier).</p><p><b>3. Apprenez.</b> Dans la bibliothèque, avancez vers le grand livre et touchez la fenêtre pour lire. Dans les bars, rejoignez le comptoir pour lancer le défi. Chaque bar correspond à l’un d’eux.</p><p><b>4. Progressez.</b> Réussissez 3 questions sur 4 pour gagner des XP, un niveau et ouvrir le bar suivant. Après les quatre premiers bars, le bouton Quartiers donne accès à la place de nuit. Descendez la rue et empruntez les ruelles latérales pour rejoindre les portes. La caméra suit votre personnage.</p><p>Le carnet suit votre parcours. Touchez votre portrait pour changer de style. À l’intérieur, la sortie se trouve en bas. Le bouton Sortir ou Échap permet aussi de rejoindre la rue. Échap ferme d’abord une fenêtre ouverte.</p><button class="primary" id="understood">C’est parti →</button>`);$('understood').onclick=close;}
function placeHUD(){
 const inside=!!room;
 $('place-name').textContent=inside?'✦ '+interiors.names[interiors.slot(room.door)].toUpperCase():'✦ '+street.maps[state.area].name.toUpperCase();
 document.querySelector('.phone').classList.toggle('night-area',state.area===1);
 $('exit-room').hidden=!inside;
 if(inside)$('quest').innerHTML='À L’INTÉRIEUR<strong>'+interiors.hints[interiors.slot(room.door)]+'</strong>';
 canvas.setAttribute('aria-label',inside?'Intérieur. Flèches pour marcher, E pour interagir. Rejoignez la sortie en bas pour retourner dans la rue.':'Rue du Houblon. Flèches pour marcher, E pour entrer.');
}
function enterRoom(door){
 if(door.type==='bar'&&!unlocked(door.index)){notify(`Terminez d’abord « ${content.bars[door.index-1].name} » pour ouvrir ce bar.`);return;}
 room={door,x:230,y:399};near=null;keys.clear();stick.reset();direction='up';hud();save();
 notify(door.type==='library'?'Bienvenue ! Avancez jusqu’au grand livre pour le consulter.':'Avancez vers le comptoir pour parler au patron.');
}
function leaveRoom(){
 if(!room)return;
 state.x=room.door.x;state.y=room.door.y;room=null;near=null;keys.clear();stick.reset();direction='down';
 if(!$('overlay').hidden)close();hud();save();canvas.focus();
}
function changeArea(id){
 if(id===1&&!nightUnlocked()){notify('Réussissez les quatre bars du premier quartier pour découvrir la place de nuit.');return;}
 if(state.area===id){close();return;}
 room=null;state.area=id;street.select(id);buildings=street.doors;
 [state.x,state.y]=street.maps[id].spawn;near=null;keys.clear();stick.reset();close();hud();save();
 notify('Bienvenue : '+street.maps[id].name);
}
function areas(){
 modal('LA ROUTE DE L’APPRENTISSAGE',`<h2 id="sheet-title">Deux quartiers,<br>huit découvertes.</h2><p>Niveau ${level()} · Un nouveau bar réussi = un niveau gagné.</p>${street.maps.map((m,i)=>`<button class="book area-choice" data-area="${i}" ${i===1&&!nightUnlocked()?'disabled':''}><strong>${i===0?'☀':'☾'} ${m.name}</strong><small>${state.area===i?'Vous êtes ici · ':''}${state.completed.filter(b=>Math.floor(b/4)===i).length} / 4 bars réussis · ${i===0?'Les bases':nightUnlocked()?'Approfondissement':'Réussissez les quatre premiers bars'}</small></button>`).join('')}`);
 document.querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>changeArea(Number(b.dataset.area)));
}
$('areas').onclick=areas;
function interact(){
 if(!$('overlay').hidden)return;
 if(room){const target=interiors.target(room);if(target==='exit')leaveRoom();else if(target==='host'){keys.clear();stick.reset();room.door.type==='library'?library():barIntro(room.door.index);}else notify('Avancez vers le livre ou le comptoir. La sortie se trouve en bas.');return;}
 if(!near){notify('Suivez les pavés jusqu’à une porte pour entrer.');return;}
 if(near.type==='travel'){changeArea(state.area===0?1:0);return;}
 enterRoom(near);
}
$('exit-room').onclick=leaveRoom;
$('avatar-button').onclick=createCharacter;$('help').onclick=help;$('journal').onclick=journal;$('collection').onclick=collection;$('street').onclick=()=>{if(room)leaveRoom();else close();};$('interact').onclick=interact;
const mapping={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'up',w:'up',s:'down',q:'left',a:'left',d:'right'};
window.addEventListener('keydown',e=>{if(!$('overlay').hidden){if(e.key==='Escape')close();if(e.key==='Tab'){const items=[...document.querySelectorAll('.sheet button,.sheet input')].filter(el=>!el.hidden&&!el.disabled&&el.getClientRects().length);const first=items[0],end=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus();}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus();}}return;}if(e.key==='Escape'&&room){leaveRoom();return;}const key=mapping[e.key]||mapping[e.key.toLowerCase()];if(key){e.preventDefault();keys.add(key);}if(e.key.toLowerCase()==='e'&&!e.repeat)interact();});
window.addEventListener('keyup',e=>keys.delete(mapping[e.key]||mapping[e.key.toLowerCase()]));window.addEventListener('blur',()=>{keys.clear();stick.reset();save();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();stick.reset();save();}});window.addEventListener('pagehide',save);

function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)}
function person(c,x,y,p,walk,dir,height=44){characters.draw(c,x,y,p,walk,dir,height);}
function draw(){if(room){interiors.paint(ctx,room,person,state,step,direction);return;}street.paint(ctx,cameraX,camera,state,near,unlocked);ctx.save();ctx.scale(view.streetZoom,view.streetZoom);ctx.translate(-cameraX,-camera);person(ctx,state.x,state.y,state,step,direction);ctx.restore();}
let direction='down';function blocked(x,y){return !street.canWalk(x,y);}
if(blocked(state.x,state.y)){[state.x,state.y]=state.area===1?street.maps[1].spawn:[300,215];}
function frame(now){
 const dt=Math.min((now-last)/1000,.04);last=now;
 let dx=0,dy=0;
 if($('overlay').hidden){
  dx=(keys.has('right')?1:0)-(keys.has('left')?1:0);dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);
  if(!dx&&!dy){dx=stick.vector.x;dy=stick.vector.y;}
  const magnitude=Math.hypot(dx,dy);if(magnitude>1){dx/=magnitude;dy/=magnitude;}
  if(dx||dy){
   const speed=view.moveSpeed*dt,actor=room||state;
   const canMove=room?interiors.canWalk:street.canWalk;
   const nx=actor.x+dx*speed,ny=actor.y+dy*speed;
   if(canMove(nx,actor.y))actor.x=nx;
   if(canMove(actor.x,ny))actor.y=ny;
   direction=Math.abs(dy)>Math.abs(dx)?dy>0?'down':'up':dx>0?'right':'left';step+=dt*60*(view.moveSpeed/95)*Math.min(1,magnitude);
  }else step=0;
 }
 let label,available=false;
 if(room){
  const target=interiors.target(room);available=!!target;
  label=target==='exit'?'Sortir dans la rue →':target==='host'?(room.door.type==='library'?'Consulter le grand livre →':'Parler au patron →'):'Explorez · Rejoignez le livre ou le comptoir';
 }else{
  const framing=view.follow(state.x,state.y,street.width,street.height,view.streetZoom);camera=framing.y;cameraX=framing.x;
  near=buildings.find(b=>Math.hypot(state.x-b.x,state.y-b.y)<23)||null;available=!!near;
  label=near?(near.type==='travel'?(state.area===1?'Retour au quartier des Brasseurs →':nightUnlocked()?'Découvrir la Place des Lanternes →':'🔒 Terminez les quatre premiers bars'):near.type==='library'?'Entrer dans la bibliothèque →':unlocked(near.index)?`Entrer : ${content.bars[near.index].name} →`:'🔒 Réussissez le bar précédent'):'Approchez-vous d’une porte';
 }
 if($('interact').textContent!==label)$('interact').textContent=label;
 $('interact').hidden=!available;$('interact').disabled=!available;draw();if(draft&&!$('overlay').hidden)paintPreview();requestAnimationFrame(frame);
}
window.addEventListener('characters-ready',hud);hud();requestAnimationFrame(frame);if(!state.created)createCharacter();
})();
