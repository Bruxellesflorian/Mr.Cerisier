/* Coordinates are in world pixels. Walkways follow the painted cobblestones. */
window.HoublonStreet = (() => {
  let image = new Image();
  image.src = 'assets/rue-douce-texturee.png';
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
  const nightImage=new Image();nightImage.src='assets/place-lanternes-texturee.png';
  const dayImage=image;const gothicImage=new Image();gothicImage.src='assets/gothic-map-texturee.png';
  dayDoors.push({x:358,y:680,type:'travel',targetArea:1,label:'PLACE DES LANTERNES'});
  const maps=[
   {name:'Quartier des Brasseurs',image:dayImage,doors:dayDoors,paths:dayPaths,spawn:[358,680],chimneys:[[292,12],[615,69],[109,219],[633,301],[282,444]]},
   {name:'Place des Lanternes',image:nightImage,spawn:[356,670],chimneys:[[287,43],[617,17],[113,386],[615,378]],
    doors:[{x:87,y:373,type:'library',label:'KIOSQUE DES SAVOIRS'},
     {x:208,y:238,type:'bar',index:4},{x:525,y:238,type:'bar',index:5},
     {x:199,y:582,type:'bar',index:6},{x:527,y:582,type:'bar',index:7},
     {x:450,y:680,type:'travel',targetArea:2,label:'QUARTIER DES BRUMES'},{x:356,y:670,type:'travel',targetArea:0,label:'QUARTIER DES BRASSEURS'}],
    paths:[[325,15,378,300],[325,365,378,720],[36,228,687,258],
     // Overlap junctions so movement never hits an invisible gap.
     [22,248,52,600],[670,248,695,600],[40,573,683,615],
     [148,254,670,390],[22,366,190,390],[108,610,610,714]]}
  ];
  maps.push({name:'Quartier des Brumes',image:gothicImage,spawn:[360,700],chimneys:[[612,25],[124,282]],
   doors:[{x:193,y:214,type:'library',label:'BIBLIOTHÈQUE DES BRUMES'},{x:526,y:220,type:'bar',index:8},{x:181,y:447,type:'bar',index:9},{x:571,y:476,type:'bar',index:10},{x:154,y:647,type:'bar',index:11},{x:360,y:700,type:'travel',targetArea:1,label:'PLACE DES LANTERNES'}],
   paths:[[340,240,390,728],[178,210,211,255],[180,239,532,263],[512,218,540,257],[166,444,198,475],[178,450,575,478],[552,469,584,480],[141,642,173,671],[151,655,365,680]]});
  let current=0,doors=dayDoors;
  function select(id){current=maps[id]?id:0;image=maps[current].image;doors=maps[current].doors;}
  function canWalk(x,y) {
   if(current===1&&x>=294&&x<=420&&y>=291&&y<=363)return false;
   return maps[current].paths.some(([l,t,r,b])=>x>=l&&x<=r&&y>=t&&y<=b);
  }
  function paint(ctx, cameraX, cameraY, state, near, unlocked) {
    ctx.fillStyle=current===2?'#4d455d':current===1?'#5c577b':'#c9b5a1'; ctx.fillRect(0,0,360,window.HoublonView.height);
    if(!image.complete || !image.naturalWidth) {
      ctx.fillStyle='#293f38';ctx.textAlign='center';ctx.font='12px sans-serif';
      ctx.fillText(image.complete?'Décor indisponible : vérifiez le dossier assets.':'Les lanternes s’allument…',180,220);
      return;
    }
    ctx.save();ctx.scale(window.HoublonView.streetZoom,window.HoublonView.streetZoom);ctx.translate(-cameraX,-cameraY);
    ctx.imageSmoothingEnabled=true;ctx.drawImage(image,0,0,width,height);
    if(current===2)window.HoublonAtmosphere.gothicLights(ctx);
    else if(current===1)window.HoublonAtmosphere.nightLights(ctx);
    else window.HoublonAtmosphere.dayWind(ctx,image);
    if(current>0)window.HoublonAtmosphere.mapLeaves(ctx,current);
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
