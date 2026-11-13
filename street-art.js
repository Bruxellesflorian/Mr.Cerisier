/* Coordinates are in world pixels. Walkways follow the painted cobblestones. */
window.HoublonStreet = (() => {
  const image = new Image();
  image.src = 'assets/rue-identites.png';
  const width = 720, height = 738;
  const doors = [
    {x:184, y:213, type:'library', label:'BIBLIOTHÈQUE'},
    {x:532, y:282, type:'bar', index:0},
    {x:185, y:423, type:'bar', index:1},
    {x:536, y:509, type:'bar', index:2},
    {x:184, y:618, type:'bar', index:3}
  ];
  // Bounds describe the character's feet, with room reserved around walls.
  const paths = [
    [337,20,378,704],
    [63,207,355,222],
    [356,279,663,293],
    [66,419,355,434],
    [356,506,663,520],
    [82,614,355,630],
    [192,642,503,705],
    [265,630,389,715]
  ];
  function canWalk(x,y) { return paths.some(([l,t,r,b])=>x>=l&&x<=r&&y>=t&&y<=b); }
  function paint(ctx, cameraX, cameraY, state, near, unlocked) {
    ctx.fillStyle='#120f18'; ctx.fillRect(0,0,360,460);
    if(!image.complete || !image.naturalWidth) {
      ctx.fillStyle='#eac27d';ctx.textAlign='center';ctx.font='12px sans-serif';
      ctx.fillText(image.complete?'Décor indisponible : vérifiez le dossier assets.':'Les lanternes s’allument…',180,220);
      return;
    }
    ctx.save();ctx.translate(-Math.round(cameraX),-Math.round(cameraY));
    ctx.drawImage(image,0,0,width,height);
    [[292,12],[615,69],[109,219],[633,301],[282,444]].forEach(([x,y],i)=>window.HoublonAtmosphere.chimney(ctx,x,y,i*1.7));
    for(const door of doors) {
      const completed=door.type==='bar'&&state.completed.includes(door.index);
      const open=door.type==='library'||unlocked(door.index);
      const active=near===door;
      const color=completed?'#bada8a':open?'#ffe0a0':'#c8bbcf';
      ctx.save();
      ctx.globalAlpha=active?1:.8;
      ctx.fillStyle='#160f18e8';ctx.strokeStyle=active?'#ffe0a0':'#9e784e';ctx.lineWidth=.7;
      ctx.beginPath();ctx.roundRect(door.x-10,door.y-47,20,15,3);ctx.fill();ctx.stroke();
      ctx.fillStyle=color;ctx.font='bold 9px monospace';ctx.textAlign='center';
      ctx.fillText(door.type==='library'?'B':completed?'✓':open?String(door.index+1):'×',door.x,door.y-36);
      if(active) {
        ctx.strokeStyle='#ffe0a0';ctx.lineWidth=1;
        ctx.beginPath();ctx.ellipse(door.x,door.y+2,15,4,0,0,Math.PI*2);ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
    // Gentle vignette keeps the lit architecture bright in the centre.
    const shade=ctx.createLinearGradient(0,0,360,0);
    shade.addColorStop(0,'#08071165');shade.addColorStop(.18,'#08071100');
    shade.addColorStop(.82,'#08071100');shade.addColorStop(1,'#08071165');
    ctx.fillStyle=shade;ctx.fillRect(0,0,360,460);
  }
  return {width,height,doors,canWalk,paint};
})();
