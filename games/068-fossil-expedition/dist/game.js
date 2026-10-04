export const PARTS = [
  {id:'skull',name:'头骨',area:'A1',icon:'skull',tip:'宽大的头骨位于骨架前端。'},
  {id:'spine',name:'脊椎',area:'A2',icon:'spine',tip:'脊椎是连接头部、躯干与尾部的中轴。'},
  {id:'ribs',name:'胸廓',area:'A3',icon:'ribs',tip:'弧形肋骨环绕躯干，保护内脏。'},
  {id:'front',name:'前肢',area:'B1',icon:'bone',tip:'前肢连接在躯干靠近头部的位置。'},
  {id:'back',name:'后肢',area:'B2',icon:'bone',tip:'后肢连接在骨盆下方。'},
  {id:'tail',name:'尾椎',area:'B3',icon:'tail',tip:'逐渐变细的尾椎连接躯干后方。'}
];
export const SPECIES=[
  {name:'三角龙',latin:'Triceratops',site:'红岩峡谷',code:'RR',period:'晚白垩世 · 约 6800 万年前',age:'6800',difficulty:'入门',climate:'晴朗 · 26°C',coords:'47° N · 106° W',color:0xcda777,rock:0x986e4c,bg:0x343a31,description:'宽阔的头盾，三只醒目的角。这位白垩纪的植食巨兽正等待你重建。',fact:'三角龙是植食性恐龙，头部具有三只角和宽大的骨质颈盾。',source:'https://www.nhm.ac.uk/discover/dino-directory/triceratops.html'},
  {name:'霸王龙',latin:'Tyrannosaurus rex',site:'琥珀荒原',code:'AP',period:'晚白垩世 · 约 6600 万年前',age:'6600',difficulty:'进阶',climate:'微风 · 31°C',coords:'46° N · 104° W',color:0xbe9664,rock:0x916044,bg:0x36382d,description:'强壮的后肢与巨大的颌骨，构成这位白垩纪猎手令人惊叹的身姿。',fact:'霸王龙用两条后腿行走，是肉食性恐龙。巨大的头骨与强壮后肢是它醒目的特征。',source:'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html'},
  {name:'剑龙',latin:'Stegosaurus',site:'蕨林盆地',code:'FB',period:'晚侏罗世 · 约 1.5 亿年前',age:'15000',difficulty:'挑战',climate:'薄雾 · 22°C',coords:'39° N · 109° W',color:0xb4ac7b,rock:0x727656,bg:0x293c32,description:'沿背部排列的骨板与尾部的尖刺，勾勒出侏罗纪最独特的轮廓之一。',fact:'剑龙背上的骨板生长在皮肤中，并没有直接连接脊柱。游戏将骨板与胸廓作为一组复原。',source:'https://www.nhm.ac.uk/discover/dino-directory/stegosaurus.html'}
];
export const TOOLS=[
  {id:'hammer',name:'地质锤',caption:'破除坚硬岩层',icon:'pick',key:'1'},
  {id:'chisel',name:'精细凿',caption:'精确剥离土层',icon:'chisel',key:'2'},
  {id:'brush',name:'软毛刷',caption:'保护脆弱骨骼',icon:'brush',key:'3'},
  {id:'scan',name:'探测器',caption:'定位化石信号',icon:'scan',key:'4'}
];
export function newExpedition(){return {dig:[0,0,0,0,0,0],clean:Array.from({length:6},()=>[false,false,false,false,false]),placed:[false,false,false,false,false,false],integrity:100,scans:0,hits:0,rewarded:false};}
export function newGame(){return {version:1,species:0,view:'field',labMode:'clean',selected:0,tool:'hammer',energy:100,credits:0,upgrade:0,day:1,sound:false,rotation:1,expeditions:[newExpedition(),newExpedition(),newExpedition()],discovered:0,actions:0,firstHelp:true};}
export function validateSave(value){
 if(!value||value.version!==1||!Array.isArray(value.expeditions)||value.expeditions.length!==3)return null;
 const out=newGame();
 const bounded=(v,min,max,fallback)=>Number.isFinite(v)?Math.min(max,Math.max(min,Math.round(v))):fallback;
 out.species=bounded(value.species,0,2,0);out.selected=bounded(value.selected,0,5,0);
 out.view=['field','lab','museum'].includes(value.view)?value.view:'field';out.labMode=value.labMode==='assemble'?'assemble':'clean';out.tool=TOOLS.some(t=>t.id===value.tool)?value.tool:'hammer';
 for(const [k,min,max] of [['energy',0,100],['credits',0,999999],['upgrade',0,3],['day',1,9999],['rotation',0,3],['actions',0,999999],['discovered',0,18]])out[k]=bounded(value[k],min,max,out[k]);
 out.sound=Boolean(value.sound);out.firstHelp=Boolean(value.firstHelp);
 for(let e=0;e<3;e++){
   const s=value.expeditions[e];if(!s||!Array.isArray(s.dig)||s.dig.length!==6||!Array.isArray(s.clean)||s.clean.length!==6||!Array.isArray(s.placed)||s.placed.length!==6)return null;
   const x=out.expeditions[e];x.dig=s.dig.map(v=>bounded(v,0,100,0));
   x.clean=s.clean.map((v,i)=>Array.from({length:5},(_,j)=>x.dig[i]===100&&Array.isArray(v)&&Boolean(v[j])));
   x.placed=s.placed.map((v,i)=>Boolean(v)&&x.clean[i].every(Boolean));x.integrity=bounded(s.integrity,40,100,100);x.scans=bounded(s.scans,0,99999,0);x.hits=bounded(s.hits,0,99999,0);x.rewarded=Boolean(s.rewarded)&&x.placed.every(Boolean);
 }
 if(out.species>0&&!out.expeditions[out.species-1].rewarded)out.species=0;
 return out;
}
export const countFound=e=>e.dig.filter(v=>v===100).length;
export const countClean=e=>e.clean.filter(v=>v.every(Boolean)).length;
export const countPlaced=e=>e.placed.filter(Boolean).length;
export function digAction(state,index=state.selected){
 const e=state.expeditions[state.species]; if(!Number.isInteger(index)||index<0||index>5)return {error:'请选择有效地块。'};
 if(e.dig[index]===100)return {error:'这里的化石已收入标本箱。'};
 if(state.tool==='scan'){if(state.energy<5)return {error:'体力不足，回营地免费休整。'};state.energy-=5;e.scans++;return {scan:true};}
 const cost=state.tool==='hammer'?3:state.tool==='chisel'?2:1;if(state.energy<cost)return {error:'体力不足，回营地免费休整。'};
 state.energy-=cost;e.hits++;state.actions++;const p=e.dig[index];let delta=state.tool==='hammer'?30:state.tool==='chisel'?19:11;
 let damaged=false;if(p>=60&&state.tool==='hammer'){e.integrity=Math.max(40,e.integrity-5);damaged=true;}
 if(p>=80&&state.tool==='chisel'){e.integrity=Math.max(40,e.integrity-2);damaged=true;}
 delta+=state.upgrade*3;if(state.species===2&&state.tool!=='brush')delta-=3;
 e.dig[index]=Math.min(100,p+delta);const found=e.dig[index]===100;
 if(found){state.credits+=25;state.discovered++;}
 return {found,damaged,progress:e.dig[index],index};
}
export function cleanAction(state,index,spot){
 const e=state.expeditions[state.species];if(!Number.isInteger(index)||index<0||index>5||!Number.isInteger(spot)||spot<0||spot>4)return {error:'清理区域不存在。'};
 if(e.dig[index]<100)return {error:'先在遗址发掘这件标本。'};
 if(e.clean[index][spot])return {error:'这处泥块已清理干净。'};
 e.clean[index][spot]=true;state.actions++;return {clean:e.clean[index].every(Boolean),progress:e.clean[index].filter(Boolean).length*20};
}
export function placeAction(state,target){
 const e=state.expeditions[state.species],i=state.selected;
 if(!Number.isInteger(target)||target<0||target>5)return {error:'请选择有效的骨架位置。'};
 if(e.placed[i])return {error:'这个部件已经拼合完成。'};
 if(!e.clean[i].every(Boolean))return {error:'需要先清理这件标本的全部泥块。'};
 if(target!==i)return {error:`部位不匹配。${PARTS[i].tip}`};
 if(state.rotation!==0)return {error:'方向还没有对齐，点击旋转部件，直到方向为 0°。'};
 e.placed[i]=true;state.actions++;const complete=e.placed.every(Boolean);
 if(complete&&!e.rewarded){e.rewarded=true;const reward=300+e.integrity*2+state.species*100;state.credits+=reward;return {placed:true,complete,reward};}
 return {placed:true,complete};
}
