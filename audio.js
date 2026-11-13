/* Original miniature scores, synthesized locally: no downloads or audio dependencies. */
window.HoublonAudio = (() => {
  let ctx,master,music,timer,scene='day',step=0,next=0,muted=false;
  const voices=new Set(),key='cerisier-audio-muted';
  try{muted=localStorage.getItem(key)==='true';}catch{}
  const scores={
    day:[60,.38,[0,4,7,12,9,7,4,null,2,5,9,12,7,4,2,null]],
    night:[57,.48,[0,7,10,14,12,null,7,3,5,12,15,14,10,null,7,3]],
    library:[65,.56,[0,null,7,4,2,null,9,7,4,null,12,9,7,null,4,2]]
  };
  const motifs=[[0,4,7,9,7,4,2,null],[0,7,5,4,9,7,12,null],
    [0,2,7,4,12,9,7,null],[7,4,0,2,5,9,7,null],
    [0,3,7,10,12,10,7,null],[0,7,10,14,12,7,3,null],
    [7,10,12,15,14,10,7,null],[0,5,10,7,3,7,12,null]];
  function score(){if(scores[scene])return scores[scene];const i=Number(scene.split('-')[1])||0;return [55+i%4*2,.40+i*.018,motifs[i%8]];}
  function note(midi,at,duration,volume,bus,type='sine',attack=.025){
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+attack);
    gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    osc.connect(gain);gain.connect(bus);voices.add(osc);
    osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};
    osc.start(at);osc.stop(at+duration+.03);
  }
  function clear(){clearInterval(timer);timer=null;for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
  // Sparse, composed answers to the main motif; each phrase has its own breathing room.
  const leadPhrases=[
    [null,null,4,null,2,null,1,null,null,0,null,null,null,null,null,null],
    [null,2,null,null,4,null,5,null,4,null,null,2,null,null,null,null],
    [null,null,null,0,null,1,null,2,null,null,4,null,2,null,null,null],
    [4,null,null,3,null,2,null,null,1,null,0,null,null,null,null,null],
    [null,null,2,null,null,4,null,6,null,5,null,null,4,null,null,null]
  ];
  function layers(root,beat,at){
    const minor=scene==='night'||(scene.startsWith('bar-')&&Number(scene.split('-')[1])>=4);
    const scale=minor?[0,2,3,5,7,10,12]:[0,2,4,5,7,9,12];
    const chordRoot=root+(Math.floor(step/8)%2?5:0);
    if(step%8===0){
      // Slow sine swells with a tiny detune: warmth without a bright synth buzz.
      [0,minor?3:4,7].forEach((interval,i)=>{
        note(chordRoot+interval,at,beat*9,.038,music,'sine',beat*2);
        note(chordRoot+interval+.035,at,beat*9,.018,music,'sine',beat*2.3);
      });
    }
    const phrase=Math.floor(step/16),position=step%16;
    if(phrase%4===0)return; // Leave a full phrase of space, including the introduction.
    const variant=(phrase+Math.floor(phrase/5))%leadPhrases.length;
    const degree=leadPhrases[variant][position];
    if(degree===null)return;
    const pitch=root+24+scale[(degree+Math.floor(phrase/7))%scale.length];
    note(pitch,at+beat*.08,beat*2.6,.062,music,'sine',.07);
    // A single quiet echo adds space; it follows the same mute and scene cleanup.
    note(pitch,at+beat*.83,beat*2,.014,music,'sine',.07);
  }
  function tick(){
    if(!ctx||ctx.state!=='running'||muted||document.hidden)return;
    const [root,beat,melody]=score();
    if(next<ctx.currentTime)next=ctx.currentTime+.04;
    while(next<ctx.currentTime+.15){
      const n=melody[step%melody.length];
      if(n!==null)note(root+12+n,next,beat*2,.10,music);
      layers(root,beat,next);
      if(step%4===0){const bass=root+(Math.floor(step/8)%2?5:0);
        note(bass-12,next,beat*3.8,.11,music);
        note(bass+7,next,beat*3,.035,music,'triangle');}
      next+=beat;step++;
    }
  }
  function start(){if(timer||!ctx||muted||document.hidden)return;next=ctx.currentTime+.06;timer=setInterval(tick,80);tick();}
  async function unlock(){
    if(muted||document.hidden)return;
    try{
      if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
        ctx=new Audio();master=ctx.createGain();master.gain.value=.32;master.connect(ctx.destination);
        music=ctx.createGain();music.gain.value=.65;music.connect(master);}
      if(ctx.state!=='running')await ctx.resume();start();
    }catch{/* Audio must never prevent playing. */}
  }
  function setScene(value){if(scene===value)return;scene=value;step=0;if(ctx){clear();start();}}
  function sfx(kind){if(!ctx||ctx.state!=='running'||muted||document.hidden)return;
    const notes={door:[60,67],correct:[76,79],wrong:[64,60],win:[72,76,79,84],click:[79]}[kind]||[79];
    notes.forEach((n,i)=>note(n,ctx.currentTime+.01+i*.105,.22,kind==='click'?.08:.16,master));
  }
  const button=document.getElementById('sound');
  function refresh(){button.textContent=muted?'♫ ×':'♫';button.setAttribute('aria-pressed',String(!muted));button.setAttribute('aria-label',muted?'Activer la musique et les sons':'Couper la musique et les sons');button.title=button.getAttribute('aria-label');}
  button.onclick=()=>{muted=!muted;try{localStorage.setItem(key,String(muted));}catch{}
    if(muted&&ctx){clear();ctx.suspend().catch(()=>{});}else unlock();refresh();};refresh();
  document.addEventListener('pointerdown',e=>{if(!button.contains(e.target))unlock();},{passive:true});
  document.addEventListener('keydown',e=>{if(!e.repeat)unlock();});
  document.addEventListener('click',e=>{if(e.target.closest('button')&&!button.contains(e.target)&&!e.target.closest('.answer'))sfx('click');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();ctx?.suspend().catch(()=>{});}else unlock();});
  window.addEventListener('pagehide',()=>{clear();ctx?.suspend().catch(()=>{});});
  return {setScene,sfx};
})();
