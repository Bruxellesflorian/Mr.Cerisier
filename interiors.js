window.HoublonInteriors = (() => {
  const atlas=new Image();atlas.src='assets/interieurs-doux.png';
  const names=['La bibliothèque','Le Premier Malt','La Cuve Dorée','Le Houblon Sauvage','Le Cercle des Brasseurs'];
  const hints=['Approchez-vous du grand livre','Rejoignez le patron au comptoir','Retrouvez le maître brasseur','Parlez à la botaniste du bar','Retrouvez la patronne du Cercle'];
  const npcs=[null,{name:'Gaston',gender:'boy',skin:1,hair:1,shirt:3},{name:'Lou',gender:'girl',skin:2,hair:0,shirt:0},{name:'Iris',gender:'girl',skin:1,hair:2,shirt:3},{name:'Alma',gender:'girl',skin:3,hair:3,shirt:2}];
  const slot=door=>door.type==='library'?0:door.index+1;
  function canWalk(x,y){return x>=112&&x<=348&&y>=310&&y<=434;}
  function target(room){if(Math.hypot(room.x-230,room.y-430)<25)return 'exit';if(Math.hypot(room.x-230,room.y-317)<32)return 'host';return null;}
  function paint(c,room,person,state,step,direction) {
    const i=slot(room.door),view=window.HoublonView;
    const cam=view.follow(room.x,room.y,460,460,view.roomZoom);
    c.fillStyle='#c9b5a1';c.fillRect(0,0,360,460);
    if(!atlas.complete||!atlas.naturalWidth) {
      c.fillStyle='#293f38';c.textAlign='center';c.font='12px sans-serif';
      c.fillText(atlas.complete?'Intérieur indisponible : vérifiez les fichiers.':'Ouverture des portes…',180,220);return;
    }
    c.save();c.scale(view.roomZoom,view.roomZoom);c.translate(-cam.x,-cam.y);
    const w=atlas.naturalWidth/3,h=atlas.naturalHeight/2;
    c.imageSmoothingEnabled=true;c.drawImage(atlas,(i%3)*w+10,Math.floor(i/3)*h+10,w-20,h-20,0,0,460,460);
    window.HoublonAtmosphere.fire(c,i===0?64:64,257,i*.8);
    if(npcs[i])person(c,230,224,npcs[i],0,'down',58);
    // In-world interaction signs remain visible without covering the artwork.
    c.textAlign='center';c.font='bold 8px monospace';
    c.fillStyle='#293f38dd';c.fillRect(193,295,74,13);
    c.fillStyle='#f3d29a';c.fillText(i===0?'LIRE LE LIVRE':npcs[i].name.toUpperCase(),230,304);
    c.strokeStyle='#d4a55f88';c.lineWidth=1;c.beginPath();c.ellipse(230,430,22,6,0,0,Math.PI*2);c.stroke();
    c.fillStyle='#f1cf97';c.fillText('↓ SORTIE',230,451);
    person(c,room.x,room.y,state,step,direction,68);
    c.restore();
  }
  return {slot,names,hints,canWalk,target,paint};
})();
