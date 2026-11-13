window.HoublonJoystick = {
  attach(surface, element, enabled) {
    let pointer=null,originX=0,originY=0;
    element.hidden=true;
    const vector={x:0,y:0};
    function reset(){
      const previous=pointer;pointer=null;vector.x=0;vector.y=0;
      element.style.setProperty('--stick-x','0px');element.style.setProperty('--stick-y','0px');
      element.classList.remove('dragging');element.hidden=true;
      if(previous!==null&&surface.hasPointerCapture(previous))surface.releasePointerCapture(previous);
    }
    function update(e){
      const radius=31;
      const x=e.clientX-originX,y=e.clientY-originY;
      const distance=Math.hypot(x,y),length=Math.min(distance,radius),scale=distance?length/distance:0;
      element.style.setProperty('--stick-x',`${x*scale}px`);element.style.setProperty('--stick-y',`${y*scale}px`);
      const strength=Math.max(0,(length/radius-.16)/.84);
      vector.x=distance?x/distance*strength:0;vector.y=distance?y/distance*strength:0;
    }
    surface.addEventListener('pointerdown',e=>{
      if(pointer!==null||!enabled()||(e.pointerType==='mouse'&&e.button!==0))return;
      e.preventDefault();pointer=e.pointerId;originX=e.clientX;originY=e.clientY;
      const box=surface.getBoundingClientRect();element.style.left=`${originX-box.left}px`;element.style.top=`${originY-box.top}px`;
      element.hidden=false;surface.setPointerCapture(pointer);element.classList.add('dragging');update(e);
    });
    surface.addEventListener('pointermove',e=>{
      if(e.pointerId!==pointer)return;
      if(!enabled()){reset();return;}e.preventDefault();update(e);
    });
    for(const event of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(event,e=>{if(e.pointerId===pointer)reset();});
    surface.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('blur',reset);
    window.addEventListener('pagehide',reset);
    window.addEventListener('resize',reset);window.addEventListener('scroll',reset,true);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
    return {vector,reset};
  }
};
