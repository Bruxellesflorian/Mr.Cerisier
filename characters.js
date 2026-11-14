/* Continuous articulated characters: no generated sprite sheets. */
window.HoublonCharacters=(()=>{
 const palettes={
  skin:['#efc099','#c58c63','#946548','#624433','#d9a47b','#754d3d'],
  hair:['#553d32','#b67a37','#d6bc77','#343a39','#813c37','#b6ada1'],
  shirt:['#a86043','#527e91','#886593','#56754e','#b39355','#455263']
 };
 const names={skin:['Pêche','Doré','Ambré','Ébène','Miel','Acajou'],hair:['Châtain','Cuivré','Blond','Noir','Auburn','Argent'],shirt:['Terracotta','Bleu pétrole','Prune','Sauge','Ocre','Ardoise']};

 const TAU=Math.PI*2;
 const motion=new WeakMap();
 const mix=(a,b,t)=>a+(b-a)*t;
 function gait(phase){
  const p=((phase%1)+1)%1;
  if(p<.6)return {reach:13-26*p/.6,lift:0};
  const t=(p-.6)/.4,s=t*t*(3-2*t);
  return {reach:mix(-13,13,s),lift:8*Math.sin(Math.PI*t)};
 }
 function draw(c,x,y,p,walk,dir,height=44,pose={}){
  const seated=!!pose.seated,sip=seated?Math.max(0,Math.min(1,pose.sip||0)):0;if(seated)walk=0;
  let actors=motion.get(c);if(!actors){actors=new WeakMap();motion.set(c,actors);}
  const now=performance.now()/1000,previous=actors.get(p)||{time:now,amount:0,phase:0,walk:0};
  const dt=Math.min(.05,Math.max(0,now-previous.time)),target=walk>0?1:0;
  const amount=previous.amount+(target-previous.amount)*(1-Math.exp(-dt*18));
  const phase=walk>0?previous.phase+Math.max(0,walk-previous.walk)/64:previous.phase;
  actors.set(p,{time:now,amount,phase,walk});
  const side=dir==='left'||dir==='right',back=dir==='up',moving=amount>.001,female=p.gender==='girl';
  const bob=Math.cos(phase*TAU*2)*.8*amount;
  const skin=palettes.skin[p.skin]||palettes.skin[0],hair=palettes.hair[p.hair]||palettes.hair[0],coat=palettes.shirt[p.shirt]||palettes.shirt[0];
  c.save();c.translate(x,y+(seated?height*.32:0));c.scale(height/100,height/100);if(dir==='left')c.scale(-1,1);
  c.lineCap='round';c.lineJoin='round';
  function oval(px,py,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(px,py,rx,ry,0,0,TAU);c.fill();}
  function line(ax,ay,bx,by,width,color){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();}
  function box(px,py,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(px,py,w,h,r);c.fill();}
  function joint(ax,ay,bx,by,length,bend){
   const dx=bx-ax,dy=by-ay,d=Math.max(.001,Math.hypot(dx,dy)),offset=Math.sqrt(Math.max(0,length*length-d*d/4));
   return [(ax+bx)/2+dy/d*offset*bend,(ay+by)/2-dx/d*offset*bend];
  }
  const legs=[0,.5].map((offset,i)=>{
   const raw=gait(phase+offset),g={reach:raw.reach*amount,lift:raw.lift*amount};
   return {i,g,hipX:side?0:(i?6:-6),footX:side?g.reach:(i?6:-6),footY:-3-g.lift+(side?0:g.reach*(back?-.22:.22))};
  });
  if(!seated)oval(0,0,16,4,'#16231e30');
  function leg(l,far){
   // Front/back foreshortening stays vertical; knees only bend sideways in profile.
   const hx=l.hipX,hy=-32+bob;if(seated){const kneeX=side?14:hx,kneeY=-25,footX=side?16:hx;const color=far?'#50483e':'#6a6050';line(hx,hy,kneeX,kneeY,9,color);line(kneeX,kneeY,footX,-10,8,color);box(footX-4,-13,side?12:9,6,3,'#453b30');return;}const k=side?joint(hx,hy,l.footX,l.footY,18,1):[hx,(hy+l.footY)/2];
   const color=far?'#50483e':'#6a6050';
   line(hx,hy,k[0],k[1],9,color);line(k[0],k[1],l.footX,l.footY-2,8,color);
   box(l.footX-4,l.footY-5,side?13:9,6,3,far?'#342e29':'#453b30');
  }
  function arm(i,far){
   const swing=moving?Math.sin((phase+i*.5)*TAU)*10*amount:0;
   const ax=side?0:(i?13:-13),ay=-58+bob;
   const handX=pose.pumping&&!i?(side?18:13):seated?(i?side?1:-10:side?14:10):side?-swing+2:ax+(i?1:-1)*2,handY=pose.pumping&&!i?-62+17*(pose.pump||0):seated?-39-(i?0:29*sip):-34+bob+(side?0:swing*.25);
   const k=joint(ax,ay,handX,handY,14,side?-1:(i?1:-1));
   line(ax,ay,k[0],k[1],8,coat);line(k[0],k[1],handX,handY-2,7,coat);oval(handX,handY,3.8,4.5,skin);
   if(far){c.fillStyle='#17251d20';c.beginPath();c.ellipse(handX,handY,3.8,4.5,0,0,TAU);c.fill();}
  }
  // Rear limbs, torso, front limbs: stable depth order keeps joints readable.
  if(side)arm(1,true);
  leg(legs[1],true);leg(legs[0],false);
  box(side?-9:-14,-64+bob,side?20:28,34,8,coat);
  if(!back){box(side?7:-3,-61+bob,side?3:6,28,1,'#eee2c5');line(side?8:0,-55+bob,side?8:0,-33+bob,1,'#c5b895');}
  if(female){
   // Clothing and hair are decorative: both characters share every joint and gait value.
   box(side?-8:-12,-65+bob,side?18:24,5,2,'#d8c7a4');
   if(!back){box(side?6:6,-62+bob,4,10,2,'#e7d8b9');oval(side?4:4,-46+bob,1,1,'#d5b779');}
  }
  if(!side)arm(1,true);
  if(back)line(-10,-61+bob,10,-33+bob,4,'#a7784b');else line(side?7:10,-62+bob,side?-6:-11,-34+bob,4,'#a7784b');
  const bagX=side?-10:(back?6:-16),bagY=-39+bob+(moving?Math.sin(phase*TAU-.4)*.7:0);
  box(bagX,bagY,12,13,4,'#93623e');box(bagX,bagY,12,5,3,'#ad7b4d');oval(bagX+6,bagY+6,1,1,'#d5b779');
  arm(0,false);
  function drink(){if((seated&&pose.beer)||pose.carryBeer){const mx=side?16:12,my=-39-29*sip;c.save();c.translate(mx,my);c.rotate(-sip*.3);box(-4,-7,9,13,2,'#e8b451');box(-4,-8,9,3,1,'#fff0c9');c.strokeStyle='#e4d6ad';c.lineWidth=2;c.beginPath();c.arc(6,-1,4,-Math.PI/2,Math.PI/2);c.stroke();c.restore();}}
  if(back)drink();
  const headY=-78+bob*.65;
  if(female){
   oval(side?-15:12,headY+4,8,15,hair);
   oval(side?-16:12,headY-10,7,8,hair);
   box(side?-20:9,headY-6,7,4,2,coat);
  }
  oval(side?1:0,headY,side?13:16,17,skin);
  oval(side?-10:-15,headY+2,3,4,skin);if(!side)oval(15,headY+2,3,4,skin);
  if(back){oval(0,headY-2,16,17,hair);oval(-8,headY+10,6,4,hair);oval(8,headY+10,6,4,hair);}
  else{
   c.fillStyle=hair;c.beginPath();c.moveTo(-15,headY+1);c.bezierCurveTo(-20,headY-24,18,headY-26,16,headY-5);c.lineTo(10,headY-10);c.quadraticCurveTo(0,headY-1,-6,headY-6);c.lineTo(-11,headY+1);c.fill();
   if(female){oval(-13,headY+3,3,8,hair);if(!side)oval(13,headY+2,3,7,hair);}
   if(side){oval(11,headY,1.4,2,'#302c29');oval(14,headY+5,3,2,skin);line(10,headY+10,13,headY+9,1,'#875a43');}
   else{oval(-6,headY+1,1.5,2,'#302c29');oval(6,headY+1,1.5,2,'#302c29');c.strokeStyle='#875a43';c.lineWidth=1;c.beginPath();c.arc(0,headY+6,4,.2,Math.PI-.2);c.stroke();}
  }
  if(female&&back){oval(0,headY+7,8,12,hair);box(-4,headY-1,8,4,2,coat);}
  if(!back)drink();
  c.restore();
 }
 return {draw,palettes,names,ready:true,gait};
})();
