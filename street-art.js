/* Coordinates are in world pixels. Walkways follow the painted cobblestones. */
window.HoublonStreet = (() => {
  let image = new Image();
  image.src = 'assets/rue-douce.png';
  const width = 720, height = 738;
  const dayDoors = [
    {x:184, y:213, type:'library', label:'BIBLIOTHÈQUE'},
    {x:532, y:282, type:'bar', index:0},
    {x:185, y:423, type:'bar', index:1},
    {x:536, y:509, type:'bar', index:2},
    {x:184, y:618, type:'bar', index:3}
  ];
  // Bounds describe the character's feet, with room reserved around walls.
  const dayPaths = [
    [337,20,378,704],
    [63,207,355,222],
    [356,279,663,293],
    [66,419,355,434],
    [356,506,663,520],
    // The fourth bar opens onto the southern plaza: keep a continuous approach.
    [82,610,355,650],
    [155,634,503,705],
    [265,630,389,715]
  ];
  const nightImage=new Image();nightImage.src='assets/place-lanternes.png';
  const dayImage=image;
  dayDoors.push({x:358,y:680,type:'travel',label:'PLACE DES LANTERNES'});
  const maps=[
   {name:'Quartier des Brasseurs',image:dayImage,doors:dayDoors,paths:dayPaths,spawn:[358,680],chimneys:[[292,12],[615,69],[109,219],[633,301],[282,444]]},
   {name:'Place des Lanternes',image:nightImage,spawn:[356,670],chimneys:[[287,43],[617,17],[113,386],[615,378]],
    doors:[{x:87,y:373,type:'library',label:'KIOSQUE DES SAVOIRS'},
     {x:208,y:238,type:'bar',index:4},{x:525,y:238,type:'bar',index:5},
     {x:199,y:582,type:'bar',index:6},{x:527,y:582,type:'bar',index:7},
     {x:356,y:670,type:'travel',label:'QUARTIER DES BRASSEURS'}],
    paths:[[325,15,378,300],[325,365,378,720],[36,228,687,258],
     [22,248,43,586],[676,248,695,586],[40,573,683,599],
     [148,254,670,390],[45,366,170,382],[108,615,610,714]]}
  ];
  let current=0,doors=dayDoors;
  function select(id){current=id===1?1:0;image=maps[current].image;doors=maps[current].doors;}
  function canWalk(x,y) {
   if(current===1&&x>=294&&x<=420&&y>=291&&y<=363)return false;
   return maps[current].paths.some(([l,t,r,b])=>x>=l&&x<=r&&y>=t&&y<=b);
  }
  function paint(ctx, cameraX, cameraY, state, near, unlocked) {
    ctx.fillStyle=current===1?'#5c577b':'#c9b5a1'; ctx.fillRect(0,0,360,window.HoublonView.height);
    if(!image.complete || !image.naturalWidth) {
      ctx.fillStyle='#293f38';ctx.textAlign='center';ctx.font='12px sans-serif';
      ctx.fillText(image.complete?'Décor indisponible : vérifiez le dossier assets.':'Les lanternes s’allument…',180,220);
      return;
    }
    ctx.save();ctx.scale(window.HoublonView.streetZoom,window.HoublonView.streetZoom);ctx.translate(-cameraX,-cameraY);
    ctx.imageSmoothingEnabled=true;ctx.drawImage(image,0,0,width,height);
    maps[current].chimneys.forEach(([x,y],i)=>window.HoublonAtmosphere.chimney(ctx,x,y,i*1.7));
    for(const door of doors) {
      const completed=door.type==='bar'&&state.completed.includes(door.index);
      const open=door.type!=='bar'||unlocked(door.index);
      const active=near===door;
      const color=completed?'#c6d7ad':open?'#fff2cf':'#d8d2c4';
      ctx.save();
      ctx.globalAlpha=active?1:.8;
      ctx.fillStyle='#293f38e8';ctx.strokeStyle=active?'#fff2cf':'#f4efdf';ctx.lineWidth=.7;
      ctx.beginPath();ctx.roundRect(door.x-10,door.y-47,20,15,3);ctx.fill();ctx.stroke();
      ctx.fillStyle=color;ctx.font='bold 9px monospace';ctx.textAlign='center';
      ctx.fillText(door.type==='travel'?'↔':door.type==='library'?'B':completed?'✓':open?String(door.index+1):'×',door.x,door.y-36);
      if(active) {
        ctx.strokeStyle='#fff2cf';ctx.lineWidth=1;
        ctx.beginPath();ctx.ellipse(door.x,door.y+2,15,4,0,0,Math.PI*2);ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
    // Gentle vignette keeps the lit architecture bright in the centre.
    const shade=ctx.createLinearGradient(0,0,360,0);
    shade.addColorStop(0,'#293f3810');shade.addColorStop(.18,'#08071100');
    shade.addColorStop(.82,'#08071100');shade.addColorStop(1,'#293f3810');
    ctx.fillStyle=shade;ctx.fillRect(0,0,360,window.HoublonView.height);
  }
  return {width,height,maps,select,get doors(){return doors;},get current(){return current;},canWalk,paint};
})();
