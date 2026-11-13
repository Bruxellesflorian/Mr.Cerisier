window.HoublonView = {
  width:360, height:460, streetZoom:1.35, roomZoom:1.25, moveSpeed:140,
  // Reserve the bottom 50 pixels for the interaction button.
  follow(x,y,worldWidth,worldHeight,zoom){
    const clamp=(value,max)=>Math.max(0,Math.min(max,value));
    return {x:clamp(x-180/zoom,worldWidth-360/zoom),
            y:clamp(y-255/zoom,worldHeight-410/zoom)};
  }
};
