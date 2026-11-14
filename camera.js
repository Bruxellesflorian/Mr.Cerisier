window.HoublonView = {
  width:360, height:580, streetZoom:1.35, roomZoom:1.25, moveSpeed:140,
  // Reserve the bottom 50 pixels for the interaction button.
  follow(x,y,worldWidth,worldHeight,zoom,topPadding=0){
    const clamp=(value,max)=>Math.max(0,Math.min(max,value));
    return {x:clamp(x-this.width/2/zoom,worldWidth-this.width/zoom),
            y:Math.max(-topPadding,Math.min(worldHeight-(this.height-50)/zoom,y-this.height*.55/zoom))};
  }
};
