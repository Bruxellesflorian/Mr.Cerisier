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
  const crowns=[[31,18,21,16],[16,105,11,19],[584,32,29,23],
    [18,365,13,20],[701,474,14,17],[467,539,22,21],[88,653,19,18]];
  function swayTrees(c,image,t){
    const sx=image.naturalWidth/720,sy=image.naturalHeight/738;
    crowns.forEach(([x,y,rx,ry],i)=>{
      const gust=1.8+1.2*Math.sin(t*.7+i*.4),sway=Math.sin(t*1.5+i*.65)*gust;
      c.save();c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.clip();
      // Warp narrow canopy strips in place; the trunk and surrounding buildings stay fixed.
      for(let dy=-ry;dy<ry;dy+=2){
        const shift=sway*Math.sin((dy+ry)/(ry*2)*Math.PI);
        const sourceX=Math.max(0,x-rx-shift),sourceY=Math.max(0,y+dy);
        c.drawImage(image,sourceX*sx,sourceY*sy,rx*2*sx,2*sy,x-rx,y+dy,rx*2,2);
      }
      c.restore();
    });
  }
  // Independent particles scattered over paved surfaces, rather than shared trails.
  const leafZones=[[333,22,378,710],[58,212,333,240],[382,282,661,310],
    [65,425,333,454],[382,512,660,540],[82,620,333,651],[158,650,502,706]];
  let leafSeed=73429;
  const randomLeaf=()=>{leafSeed=(Math.imul(1664525,leafSeed)+1013904223)>>>0;return leafSeed/4294967296;};
  const groundLeaves=Array.from({length:170},(_,i)=>({
    zone:leafZones[i%leafZones.length],u:randomLeaf(),v:randomLeaf(),
    speed:4+randomLeaf()*13,drift:(randomLeaf()-.5)*7,
    phase:randomLeaf()*Math.PI*2,turn:.6+randomLeaf()*1.7,
    radius:1.3+randomLeaf()*1.1,lift:randomLeaf()<.25?4+randomLeaf()*5:randomLeaf()*2,
    color:['#9a9c60','#b99a66','#7c9058'][Math.floor(randomLeaf()*3)]
  }));
  const airLeaves=Array.from({length:84},()=>({offset:randomLeaf(),duration:7+randomLeaf()*6,
    x:(randomLeaf()-.5)*32,y:(randomLeaf()-.5)*24,drift:40+randomLeaf()*65,phase:randomLeaf()*6.28}));
  const wrap=(n,size)=>((n%size)+size)%size;
  function dayWind(c,image) {
    if(reduced?.matches)return;
    const t=time();c.save();
    if(image?.naturalWidth)swayTrees(c,image,t);
    dayTrees.forEach(([x,y],i)=>{
      const sway=Math.sin(t*1.5+i*.65)*3;
      // A few moving flecks give the flat, baked-in canopy a gentle rustle.
      for(let j=0;j<4;j++) {
        c.globalAlpha=.18;c.fillStyle=j%2?'#d1d39a':'#567347';
        c.beginPath();c.ellipse(x+(j-1.5)*5+sway,y+Math.sin(j*2+i)*5,
          2.6,1.3,Math.sin(t*.7+i)*.2,0,Math.PI*2);c.fill();
      }
      for(let j=0;j<12;j++) {
        const leaf=airLeaves[i*12+j],age=(t/leaf.duration+leaf.offset)%1;
        const drift=age*leaf.drift,flutter=Math.sin(t*2.6+leaf.phase);
        c.globalAlpha=Math.sin(age*Math.PI)*.65;
        c.fillStyle=(i+j)%2?'#b4b678':'#78915b';
        c.beginPath();c.ellipse(x+drift+flutter*4+leaf.x,y+age*35+Math.sin(age*9+leaf.phase)*6+leaf.y,
          1.7,.55+Math.abs(flutter)*.35,age*5+i,0,Math.PI*2);c.fill();
      }
    });
    groundLeaves.forEach(leaf=>{
      const [left,top,right,bottom]=leaf.zone,w=right-left,h=bottom-top;
      const wind=t-.8*Math.sin(t*.8+leaf.phase)/.8;
      const u=wrap(leaf.u*w+wind*leaf.speed+Math.sin(t*leaf.turn+leaf.phase)*5,w);
      const v=wrap(leaf.v*h+t*leaf.drift+Math.sin(t*.7+leaf.phase)*4,h);
      const x=left+u,ground=top+v;
      const flutter=Math.sin(t*leaf.turn*2+leaf.phase);
      const lift=Math.max(0,Math.sin(t*1.6+leaf.phase))*leaf.lift;
      // Fade at each boundary so wrapping never appears as a teleport.
      const opacity=Math.min(1,u/6,(w-u)/6,v/4,(h-v)/4)*.8;
      c.globalAlpha=opacity*.18;c.fillStyle='#544735';
      c.beginPath();c.ellipse(x+.6,ground+.8,leaf.radius,.65,0,0,Math.PI*2);c.fill();
      c.globalAlpha=opacity;c.fillStyle=leaf.color;
      c.beginPath();c.ellipse(x,ground-lift,leaf.radius,.55+Math.abs(flutter)*.4,
        leaf.phase+t*leaf.turn+flutter*.3,0,Math.PI*2);c.fill();
    });

    c.restore();
  }
  return {chimney,fire,glow,time,nightLights,dayWind};
})();
