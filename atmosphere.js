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
  return {chimney,fire,glow,time};
})();
