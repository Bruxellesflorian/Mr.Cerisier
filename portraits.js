/* Non-destructive display crops: only the scene inside each gold frame is shown. */
window.HoublonPortraits=(()=>{
 const names=['Gaston','Lou','Iris','Alma','Nora','Émile','Sam','Mila'];
 const files=['gaston','lou','iris','alma','nora','emile','sam','mila'];
 const moods=['vous accueille','vous explique','présente une bière','vous encourage avec le sourire','réfléchit avec vous','vous félicite'];
 const cropWidth=340,cropHeight=350,sheetWidth=1536,sheetHeight=1024;
 const columns=[104,600,1085],rows=[90,585];
 const backgroundSize=`${sheetWidth/cropWidth*100}% ${sheetHeight/cropHeight*100}%`;
 function position(frame){return `${columns[frame%3]/(sheetWidth-cropWidth)*100}% ${rows[Math.floor(frame/3)]/(sheetHeight-cropHeight)*100}%`;}
 function html(bar,frame=0){
  return `<figure class="bartender"><div id="bartender-portrait" class="bartender-portrait" role="img" aria-label="${names[bar]} ${moods[frame]}" data-bar="${bar}" style="background-image:url('assets/portraits/${files[bar]}-transparent.png');background-size:${backgroundSize};background-position:${position(frame)}"></div><figcaption>${names[bar]}<small>Votre guide au comptoir</small></figcaption></figure>`;
 }
 function react(frame){const el=document.getElementById('bartender-portrait');if(!el)return;el.style.backgroundPosition=position(frame);el.setAttribute('aria-label',`${names[Number(el.dataset.bar)]} ${moods[frame]}`);}
 // Pick any other pose, including after the previous answer's reaction.
 function next(previous=0){return (previous+1+Math.floor(Math.random()*5))%6;}
 return {html,react,next};
})();
