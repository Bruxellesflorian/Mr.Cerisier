/* Transparent game props. Bounds crop only the display, never the source PNGs. */
window.HoublonBarAssets=(()=>{
 const images=new Map(),staffLook={gender:'boy',skin:1,hair:0,shirt:3};
 function get(kind){if(!images.has(kind)){const image=new Image();image.src=`assets/bar-items/${kind}.png`;images.set(kind,image);}return images.get(kind);}
 for(const kind of ['counter','tap','keg','entry','toilet','table2','table4','table6','barrel2','barrel4','staff','stock','station','wall','post',...Array.from({length:10},(_,i)=>'poster'+i)])get(kind);
 function draw(c,item,x,y,w,h){
  if(item.kind==='staff'&&window.HoublonCharacters){window.HoublonCharacters.draw(c,x+w/2,y+h*.9,staffLook,0,'down',Math.min(w,h)*.88);return true;}
  const image=get(item.kind);if(!image.complete||!image.naturalWidth)return false;
  const bounds=window.HOUBLON_BAR_BOUNDS?.[item.kind]||[0,0,image.naturalWidth,image.naturalHeight];
  const [sx,sy,sw,sh]=bounds,bw=item.rot?h:w,bh=item.rot?w:h;
  const scale=Math.min((bw-4)/sw,(bh-4)/sh)*(item.kind.startsWith('poster')?(item.mountKind==='post'?.4:.65):1);
  const wallBleed=Math.max(4,Math.min(bw,bh)*.08);
  const dw=item.kind==='wall'?bw+wallBleed:sw*scale,dh=item.kind==='wall'?bh+wallBleed:sh*scale;
  c.save();c.translate(x+w/2,y+h/2-(item.kind==='tap'?h*.7:0));if(item.rot)c.rotate(Math.PI/2);
  // Full-cell wood backing closes transparent rounded edges between adjoining panels.
  if(item.kind==='wall'){c.fillStyle='#a57544';c.fillRect(-dw/2,-dh/2,dw,dh);}
  c.imageSmoothingEnabled=true;c.drawImage(image,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);c.restore();return true;
 }
 function walls(c,W,H,S,items){
  const width=W*S,height=H*S,thickness=S*.38;
  c.save();c.fillStyle='#795234';c.fillRect(0,0,width,thickness);c.fillRect(0,height-thickness,width,thickness);c.fillRect(0,0,thickness,height);c.fillRect(width-thickness,0,thickness,height);
  c.strokeStyle='#b78a58';c.lineWidth=1;
  for(let x=8;x<width;x+=S*.3){c.beginPath();c.moveTo(x,0);c.lineTo(x,thickness);c.moveTo(x,height-thickness);c.lineTo(x,height);c.stroke();}
  for(let y=8;y<height;y+=S*.3){c.beginPath();c.moveTo(0,y);c.lineTo(thickness,y);c.moveTo(width-thickness,y);c.lineTo(width,y);c.stroke();}
  c.strokeStyle='#422e24';c.lineWidth=3;c.strokeRect(thickness,thickness,width-thickness*2,height-thickness*2);
  for(const item of items){
   if(item.kind==='entry'){c.fillStyle='#b38b63';c.fillRect(item.x*S,item.y*S,S,S);}
   if((item.kind.startsWith('poster')||item.kind==='station')&&(item.x===0||item.y===0||item.x===W-1||item.y===H-1)&&!items.some(i=>['wall','post'].includes(i.kind)&&i.x===item.x&&i.y===item.y))draw(c,{kind:'wall'},item.x*S,item.y*S,S,S);
  }c.restore();
 }
 return {draw,walls};
})();
