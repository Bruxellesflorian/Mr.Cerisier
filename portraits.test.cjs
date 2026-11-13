const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const cropPosition=f=>`${[104,600,1085][f%3]/1196*100}% ${[90,585][Math.floor(f/3)]/674*100}%`;
function harness(){
 const elements=new Map();let answers=[],markup='';
 const element=()=>({style:{},dataset:{},classList:{add(){}},setAttribute(k,v){this[k]=v},scrollIntoView(){}});
 const c={window:{HoublonAudio:{sfx(){}}},Math:Object.create(Math),
  document:{getElementById:id=>elements.get(id),querySelectorAll:()=>answers},
  $:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},
  state:{name:'Test',completed:[]},save(){},hud(){},close(){},chapter(){},
  level:()=>1+c.state.completed.length,escape:s=>s,unlocked:()=>true};
 c.modal=(tag,html)=>{
  markup=html;elements.clear();const portrait=element();portrait.dataset.bar=String(c.quiz?.bar??0);elements.set('bartender-portrait',portrait);
  answers=(c.quiz?c.content.bars[c.quiz.bar].questions[c.quiz.index][1]:[]).map((_,i)=>({...element(),dataset:{answer:String(i)}}));
 };
 vm.createContext(c);
 for(const file of ['content.js','content-night.js','portraits.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
 c.content=c.window.HOUBLON_CONTENT;c.portraits=c.window.HoublonPortraits;
 const game=fs.readFileSync('game.js','utf8');
 vm.runInContext(game.slice(game.indexOf('function barIntro('),game.indexOf('function journal(')),c);
 return {c,answer:i=>answers[i].onclick(),markup:()=>markup};
}

test('six crops, eight identities, and no immediately repeated pose',()=>{
 const {c}=harness(),p=c.portraits;
 for(let bar=0;bar<8;bar++)for(let frame=0;frame<6;frame++){
  const html=p.html(bar,frame);assert(!html.includes('undefined'));
  assert(html.includes(`background-position:${cropPosition(frame)}`));
  for(let i=0;i<5;i++){c.Math.random=()=>i/5;const next=p.next(frame);assert(next>=0&&next<6&&next!==frame);}
 }
});

test('actual quiz handlers update portraits, reactions and results for all eight bars',()=>{
 const {c,answer,markup}=harness();
 for(let bar=0;bar<8;bar++){
  c.barIntro(bar);assert(markup().includes('bartender-portrait'));c.$('start-quiz').onclick();
  for(let i=0;i<4;i++){
   assert(markup().includes(`data-bar="${bar}"`));
   const correct=c.content.bars[bar].questions[i][2];answer(correct);
   assert.equal(c.quiz.portraitFrame,3);assert.equal(c.$('bartender-portrait').style.backgroundPosition,cropPosition(3));
   answer(correct);assert.equal(c.quiz.score,i+1); // repeated clicks cannot score twice
   c.$('next').onclick();
   if(i<3)assert.notEqual(c.quiz.portraitFrame,3);
  }
  assert(markup().includes('background-position:'+cropPosition(5)));
  assert.equal(c.state.completed.length,bar+1);
 }
 c.barIntro(0);c.$('start-quiz').onclick();
 for(let i=0;i<4;i++){const q=c.content.bars[0].questions[i];answer((q[2]+1)%q[1].length);assert.equal(c.quiz.portraitFrame,4);c.$('next').onclick();}
 assert(markup().includes('background-position:'+cropPosition(4)));assert.equal(c.state.completed.length,8);
});
