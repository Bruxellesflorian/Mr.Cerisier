window.HoublonInteriors = (() => {
  const atlas=new Image();atlas.src='assets/interieurs-atlas.png';
  const names=['La bibliothèque','Le Premier Malt','La Cuve Dorée','Le Houblon Sauvage','Le Cercle des Brasseurs'];
  const hints=['Approchez-vous du grand livre','Rejoignez le patron au comptoir','Retrouvez le maître brasseur','Parlez à la botaniste du bar','Retrouvez la patronne du Cercle'];
  const npcs=[null,{name:'Gaston',gender:'boy',skin:1,hair:1,shirt:3},{name:'Lou',gender:'girl',skin:2,hair:0,shirt:0},{name:'Iris',gender:'girl',skin:1,hair:2,shirt:3},{name:'Alma',gender:'girl',skin:3,hair:3,shirt:2}];
  const slot=door=>door.type==='library'?0:door.index+1;
  function canWalk(x,y){return x>=112&&x<=348&&y>=286&&y<=434;}
  function target(room){if(Math.hypot(room.x-230,room.y-430)<25)return 'exit';if(Math.hypot(room.x-230,room.y-293)<32)return 'host';return null;}
  function paint(c,room,person,state,step,direction) {
    const i=slot(room.door),cam=Math.max(0,Math.min(100,room.x-180));
    c.fillStyle='#160f19';c.fillRect(0,0,360,460);
    if(!atlas.complete||!atlas.naturalWidth) {
      c.fillStyle='#eac27d';c.textAlign='center';c.font='12px sans-serif';
      c.fillText(atlas.complete?'Intérieur indisponible : vérifiez les fichiers.':'Ouverture des portes…',180,220);return;
    }
    c.save();c.translate(-Math.round(cam),0);
    const w=atlas.naturalWidth/3,h=atlas.naturalHeight/2;
    c.drawImage(atlas,(i%3)*w,Math.floor(i/3)*h,w,h,0,0,460,460);
    window.HoublonAtmosphere.fire(c,i===0?66:68,244,i*.8);
    if(npcs[i])person(c,230,215,npcs[i],0,'down');
    // In-world interaction signs remain visible without covering the artwork.
    c.textAlign='center';c.font='bold 8px monospace';
    c.fillStyle='#1c131cdd';c.fillRect(193,273,74,13);
    c.fillStyle='#f3d29a';c.fillText(i===0?'LIRE LE LIVRE':npcs[i].name.toUpperCase(),230,282);
    c.strokeStyle='#d4a55f88';c.lineWidth=1;c.beginPath();c.ellipse(230,430,22,6,0,0,Math.PI*2);c.stroke();
    c.fillStyle='#f1cf97';c.fillText('↓ SORTIE',230,451);
    person(c,room.x,room.y,state,step,direction);
    c.restore();
  }
  return {slot,names,hints,canWalk,target,paint};
})();
