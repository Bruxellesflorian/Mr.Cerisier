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
    const t=time()+seed;
    c.save();
    // The fire stays inside the fireplace; the roof emits smoke and embers.
    for(let i=0;i<7;i++) {
      const age=(t*.19+i/7)%1;
      const px=x+Math.sin(age*5+seed)*5+age*11;
      const py=y-age*40;
      const size=3+age*8;
      c.globalAlpha=(1-age)*.23;c.fillStyle='#c3b2ba';
      c.fillRect(Math.round(px-size/2),Math.round(py-size/2),Math.ceil(size),Math.ceil(size*.7));
    }
    for(let i=0;i<3;i++) {
      const age=(t*.4+i/3)%1;c.globalAlpha=(1-age)*.6;
      c.fillStyle=i%2?'#ffbd5c':'#ed7845';
      c.fillRect(Math.round(x+Math.sin(t+i*4)*3+age*5),Math.round(y-age*25),1,1);
    }
    c.restore();
  }
  function fire(c,x,y,seed=0) {
    const t=time()+seed;
    glow(c,x,y-7,61,'#ff862b',.19+Math.sin(t*5)*.025);
    c.save();
    c.fillStyle='#45281b';c.fillRect(x-18,y-3,36,5);
    c.fillStyle='#a35423';c.fillRect(x-16,y-4,30,2);
    for(let i=0;i<9;i++) {
      const px=x-17+i*4;
      const h=9+Math.sin(t*7+i*1.4)*5+Math.sin(t*11+i)*3+(4-Math.abs(i-4))*2;
      c.fillStyle=i%2?'#eb5621':'#ed7624';c.fillRect(px,Math.round(y-h),4,Math.round(h));
      c.fillStyle='#ffb840';c.fillRect(px+1,Math.round(y-h*.65),3,Math.ceil(h*.65));
      c.fillStyle='#ffe4a0';c.fillRect(px+1,y-5,2,5);
    }
    for(let i=0;i<4;i++) {
      const age=(t*.7+i/4)%1;c.globalAlpha=1-age;c.fillStyle='#ffcf70';
      c.fillRect(Math.round(x+Math.sin(t+i*2)*12),Math.round(y-8-age*25),1,2);
    }
    c.restore();
  }
  return {chimney,fire,glow,time};
})();
