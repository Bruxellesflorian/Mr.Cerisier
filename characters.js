/* Embedded atlas keeps local-file canvas recolouring available without a server. */
window.HoublonCharacters = (() => {
 const palettes={
  skin:['#efc099','#c58c63','#946548','#624433','#d9a47b','#754d3d'],
  hair:['#553d32','#b67a37','#d6bc77','#343a39','#813c37','#b6ada1'],
  shirt:['#a86043','#527e91','#886593','#56754e','#b39355','#455263']
 };
 const names={skin:['Pêche','Doré','Ambré','Ébène','Miel','Acajou'],hair:['Châtain','Cuivré','Blond','Noir','Auburn','Argent'],shirt:['Terracotta','Bleu pétrole','Prune','Sauge','Ocre','Ardoise']};
 const atlas=new Image(),frames=new Map(),cache=new Map();let ready=false,failed=false;
 const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
 atlas.onload=()=>{ready=true;window.dispatchEvent(new Event('characters-ready'));};
 atlas.onerror=()=>{failed=true;};atlas.src=window.HOUBLON_SPRITES_DATA;
 function base(gender,row,frame){
  const key=[gender,row,frame].join(':');if(frames.has(key))return frames.get(key);
  const w=atlas.naturalWidth/8,h=atlas.naturalHeight/4,col=(gender==='girl'?4:0)+frame;
  const source=document.createElement('canvas');source.width=Math.ceil(w);source.height=Math.ceil(h);
  const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(atlas,col*w,row*h,w,h,0,0,source.width,source.height);
  const pixels=sc.getImageData(0,0,source.width,source.height).data;
  let l=source.width,r=0,t=source.height,b=0;
  for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(pixels[(y*source.width+x)*4+3]>140){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  const out=document.createElement('canvas');out.width=64;out.height=96;
  const c=out.getContext('2d',{willReadFrequently:true});c.imageSmoothingEnabled=true;
  const height=92,width=(r-l+1)/(b-t+1)*height;
  c.drawImage(source,l,t,r-l+1,b-t+1,(64-width)/2,2,width,height);
  const data=c.getImageData(0,0,64,96);frames.set(key,data);return data;
 }
 function tinted(p,row,frame){
  const key=[p.gender,p.skin,p.hair,p.shirt,row,frame].join(':');if(cache.has(key))return cache.get(key);
  const src=base(p.gender,row,frame),out=document.createElement('canvas');out.width=64;out.height=96;
  const c=out.getContext('2d'),data=c.createImageData(64,96);data.data.set(src.data);
  const colors={skin:rgb(palettes.skin[p.skin]||palettes.skin[0]),hair:rgb(palettes.hair[p.hair]||palettes.hair[0]),shirt:rgb(palettes.shirt[p.shirt]||palettes.shirt[0])};
  for(let i=0;i<data.data.length;i+=4){
   const d=data.data;if(!d[i+3])continue;const r=d[i],g=d[i+1],b=d[i+2],y=Math.floor(i/4/64)/96;
   const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
   const hue=delta===0?0:((max===r?(g-b)/delta:max===g?(b-r)/delta+2:(r-g)/delta+4)*60+360)%360;
   if(d[i+3]<8){d[i+3]=0;continue;}
   let kind=null;
   const saturation=max?delta/max:0;
   if(y<.43&&max>65&&max<190&&g<130&&r>g*1.08&&hue>8&&hue<52)kind='hair';
   if(y<.78&&r>180&&g>130&&hue>14&&hue<48&&saturation>.18&&saturation<.65)kind='skin';
   if(y>.35&&y<.78&&((p.gender==='girl'&&hue>=34&&hue<63&&saturation>.35&&g>105)||(p.gender!=='girl'&&hue>=65&&hue<165&&saturation>.12)))kind='shirt';
   if(kind){const lum=(r*.3+g*.59+b*.11),ref=kind==='hair'?(p.gender==='girl'?115:72):kind==='skin'?183:(p.gender==='girl'?177:75),shade=Math.max(.45,Math.min(1.2,lum/ref));const color=colors[kind];for(let k=0;k<3;k++)d[i+k]=Math.min(255,color[k]*shade);}

  }
  c.putImageData(data,0,0);if(cache.size>512)cache.clear();cache.set(key,out);return out;
 }
 function draw(c,x,y,p,walk,dir,height=44){
  c.save();c.imageSmoothingEnabled=true;
  c.fillStyle='#293f3830';c.beginPath();c.ellipse(Math.round(x),Math.round(y),height*.17,height*.045,0,0,Math.PI*2);c.fill();
  if(ready){const row={down:0,left:1,right:2,up:3}[dir]||0,frame=walk?Math.floor(walk/8)%4:1;
   const image=tinted(p,row,frame);c.drawImage(image,Math.round(x-height/3),Math.round(y-height),height*2/3,height);
  }else{c.fillStyle='#d8b584';c.textAlign='center';c.font='9px sans-serif';c.fillText(failed?'!':'…',x,y-12);}
  c.restore();
 }
 return {draw,palettes,names,get ready(){return ready;}};
})();
