/* Animated effects share the same world coordinates as the painted assets. */
window.HoublonAtmosphere = (() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const time = () => reduced?.matches ? 2 : performance.now()/1000;
  function glow(c,x,y,r,color,strength) {
    c.save();c.globalAlpha=strength;
    const g=c.createRadialGradient(x,y,1,x,y,r);
    g.addColorStop(0,color);g.addColorStop(1,'transparent');
    c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();
  }
  function chimney(c,x,y,seed) {
    const t=time()+seed;c.save();
    for(let i=0;i<4;i++){
      const age=(t*.12+i/4)%1;
      c.globalAlpha=(1-age)*.22;c.fillStyle='#f5efdf';
      c.beginPath();c.ellipse(x+Math.sin(age*4+seed)*3+age*6,y-age*29,2+age*4,3+age*4,0,0,Math.PI*2);c.fill();
    }
    c.restore();
  }
  function fire(c,x,y,seed=0) {
    const t=time()+seed;glow(c,x,y-8,43,'#e9aa50',.09);
    c.save();c.fillStyle='#826344';c.fillRect(x-14,y-3,28,4);
    for(let i=0;i<3;i++){
      const px=x+(i-1)*8,tip=y-17-Math.sin(t*3+i*2)*4-(i===1?5:0);
      c.fillStyle=i===1?'#edb45b':'#d79348';c.beginPath();c.moveTo(px-7,y);
      c.quadraticCurveTo(px-11,y-8,px,tip);c.quadraticCurveTo(px+2,y-10,px+6,y-7);c.quadraticCurveTo(px+9,y,px-7,y);c.fill();
    }
    c.fillStyle='#f8d58a';c.beginPath();c.moveTo(x-5,y);c.quadraticCurveTo(x-7,y-6,x+1,y-13-Math.sin(t*4)*2);c.quadraticCurveTo(x+7,y-2,x+4,y);c.fill();c.restore();
  }
  // One small cached light texture, reused without full-screen blur or pixel reads.
  let lightTexture;
  function softLight(c,x,y,rx,ry,alpha) {
    if(!lightTexture) {
      lightTexture=document.createElement('canvas');lightTexture.width=128;lightTexture.height=128;
      const b=lightTexture.getContext('2d'),g=b.createRadialGradient(64,64,0,64,64,64);
      g.addColorStop(0,'rgba(255,226,163,.95)');
      g.addColorStop(.22,'rgba(255,198,108,.5)');
      g.addColorStop(.6,'rgba(247,164,87,.13)');g.addColorStop(1,'rgba(247,164,87,0)');
      b.fillStyle=g;b.fillRect(0,0,128,128);
    }
    c.globalAlpha=alpha;c.drawImage(lightTexture,x-rx,y-ry,rx*2,ry*2);
  }
  // Lantern centres and their ground projections in the 720 x 738 night map.
  const nightLamps=[[172,169,238],[244,169,238],[492,169,238],[559,169,238],
    [66,317,373],[110,317,373],[163,510,582],[235,510,582],
    [492,510,582],[564,510,582],[103,639,680],[618,639,680]];
  function nightLights(c) {
    const t=time();c.save();c.globalCompositeOperation='screen';
    nightLamps.forEach(([x,y,ground],i)=>{
      const pulse=.94+.06*Math.sin(t*1.4+i*2.3);
      softLight(c,x,y,29,34,.42*pulse);
      softLight(c,x,y,8,11,.28*pulse);
      softLight(c,x,ground+3,25,9,.19*pulse);
      softLight(c,x,ground+12,11,22,.12*pulse);
      // Broken horizontal glints suggest damp paving without mirroring the building.
      c.fillStyle='#f5ce8b';
      for(let j=0;j<4;j++) {
        c.globalAlpha=(.09-j*.016)*pulse;
        const half=7-j,offset=Math.sin(i*3+j*4)*4;
        c.fillRect(x-half+offset,ground+3+j*5,half*2,1);
      }
    });
    c.restore();
  }
  // Crown accents stay inside the painted foliage; only tiny loose leaves drift away.
  const dayTrees=[[31,18],[16,105],[584,32],[18,365],[701,474],[467,539],[88,653]];
  // Short trails centred on the day map's paving, clear of building facades.
  const leafTrails=[[90,215,260,215],[390,286,620,286],
    [90,426,275,426],[390,513,620,513],[100,624,285,624],
    [350,265,362,390],[350,460,362,595],[210,668,455,678]];
  function dayWind(c) {
    if(reduced?.matches)return;
    const t=time();c.save();
    dayTrees.forEach(([x,y],i)=>{
      const sway=Math.sin(t*.85+i*1.7)*1.1;
      // A few moving flecks give the flat, baked-in canopy a gentle rustle.
      for(let j=0;j<4;j++) {
        c.globalAlpha=.18;c.fillStyle=j%2?'#d1d39a':'#567347';
        c.beginPath();c.ellipse(x+(j-1.5)*5+sway,y+Math.sin(j*2+i)*5,
          2.6,1.3,Math.sin(t*.7+i)*.2,0,Math.PI*2);c.fill();
      }
      for(let j=0;j<5;j++) {
        const age=(t/(13+i%3)+i*.137+j*.2)%1;
        const drift=age*(38+j*5),flutter=Math.sin(t*1.6+i+j*3);
        c.globalAlpha=Math.sin(age*Math.PI)*.48;
        c.fillStyle=(i+j)%2?'#b4b678':'#78915b';
        c.beginPath();c.ellipse(x+drift+flutter*2+(j-2)*4,y+age*35+Math.sin(age*9+i)*3,
          1.7,.55+Math.abs(flutter)*.35,age*5+i,0,Math.PI*2);c.fill();
      }
    });
    leafTrails.forEach(([x1,y1,x2,y2],i)=>{
      // Monotonic motion alternates between near-rest and a gentle gust.
      const wind=t-.88*Math.sin(t*.8+i*.6)/.8;
      for(let j=0;j<4;j++) {
        const age=(wind/(24+i%3*3)+j*.25+i*.113)%1;
        const flutter=Math.sin(t*2+i+j*2),x=x1+(x2-x1)*age;
        const y=y1+(y2-y1)*age+Math.sin(age*10+j)*1.6;
        const opacity=Math.min(1,age*10,(1-age)*10)*.6;
        c.globalAlpha=opacity*.18;c.fillStyle='#544735';
        c.beginPath();c.ellipse(x+.6,y+.8,2.2,.65,0,0,Math.PI*2);c.fill();
        c.globalAlpha=opacity;c.fillStyle=['#9a9c60','#b99a66','#7c9058'][(i+j)%3];
        c.beginPath();c.ellipse(x,y,1.9,.65+Math.abs(flutter)*.2,
          i+j+age*4+flutter*.25,0,Math.PI*2);c.fill();
      }
    });
    c.restore();
  }
  return {chimney,fire,glow,time,nightLights,dayWind};
})();
