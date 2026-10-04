export const STORAGE_KEY='nightfall-radio-v1';
export const CALLS=[
 {time:'00:07',name:'阿岚',place:'港口 · 收音机修理铺',initial:'岚',preview:'「那个来修收音机的女孩……\n到现在，还没有回家。」',text:'小满傍晚来过，拿着她父亲留下的短波机，想让一段旧录音重新发出声音。我给她换了电池。她说，今晚要让镇上的人听见。现在店门外全是水，她还没回来。',choices:[
 {label:'校准她留下的发射参数',effect:[0,10,-5],flags:['HINT_936'],result:'阿岚报出了 93.6 MHz。你记下频率：也许那里还有她的声音。'},
 {label:'先联系家人，保护女孩的隐私',effect:[8,-5,-2],flags:['FAMILY'],result:'家属愿意协助。小满带走的磁带，属于十年前在泵站去世的父亲林舟。'},
 {label:'广播寻人描述，请听众提供线索',effect:[-6,8,-1],flags:['SIGHTING'],result:'有听众在北岸见过她。家属希望你能更谨慎地使用她的名字。'}]},
 {time:'00:19',name:'老周',place:'北岬 · 灯塔',initial:'周',preview:'「那一夜的灯，\n是我亲手关掉的。」',text:'灯塔又快熄了。我知道镇上会想起十年前。那晚我确实关过灯，可不是睡着了。林舟说，里面还有人。我把备用电接去了泵站。小满今天来问过旧梯子，我没敢把往事都告诉她。',choices:[
 {label:'留出时间，听完他的证词',effect:[8,-6,-4],flags:['WITNESS'],result:'林舟没有逃走。灯塔熄灭时，泵站仍然有电。为什么正式报告会写反？'},
 {label:'请他确认灯塔备用梯是否可走',effect:[-2,3,-5],flags:['ROUTE'],result:'旧梯可以通往三号井的上口。黄色扶手处右转——一条备用救援路线。'},
 {label:'请他把备用电送给电台',effect:[-5,8,10],flags:['HINT_904'],result:'电台电力恢复，海面上的灯却暗了。老周提醒你：90.4 MHz 仍在发送导航信标。'}]},
 {time:'00:34',name:'顾师傅',place:'水库 · 值班室',initial:'顾',preview:'「交上去的日志很整齐。\n留下的这本，却沾着水。」',text:'我手里有两本日志。有人把关电的时间挪早了七分钟。我一直觉得，那不是我的事。刚才北岸又跳了同一个警报。你先别挂，我把抽屉打开……这次，不该再把门关上了。',choices:[
 {label:'逐页核对并读出原始记录',effect:[6,-5,-4],flags:['ORDER','PROOF'],result:'先断回流电源，再开检修门。原始日志证明：林舟留下来，是为了让其他人先走。'},
 {label:'先确认今晚安全开门的顺序',effect:[2,5,-2],flags:['ORDER'],result:'先断回流，再开检修门。你获得了救援程序；旧日志仍留在抽屉里。'},
 {label:'请他接通值班室临时电源',effect:[-3,-2,12],flags:['HINT_881'],result:'备用电接通了。顾师傅低声说，88.1 MHz 的旧工作频道可能还存着录音。'}]},
 {time:'00:48',name:'许真',place:'下街 · 便利店',initial:'许',preview:'「孩子问我，停电以后，\n收音机会不会也睡着。」',text:'我把卷帘门撑起来了，街坊都在店里等广播。有人要去码头找船，有人想往灯塔走。我这里还有一副旧天线和一块蓄电池，但送东西的人，只能先去一个地方。你来决定吧。',choices:[
 {label:'组织居民分批沿北坡去学校',effect:[8,-4,-3],flags:['EVAC_PREP'],result:'许真开始清点人数。现在发布疏散广播，只需要 30 点信任就能让所有人行动。'},
 {label:'接起商店屋顶的备用天线',effect:[-4,12,-4],flags:['ANTENNA'],result:'雾港南面的收音机也接到了信号。居民们在黑暗里，又等了一会儿。'},
 {label:'把蓄电池送来，保住电台',effect:[-8,-4,16],flags:['BATTERY'],result:'电台还能坚持。便利店暂时失去了照明，街坊的争论声变大了。'}]},
 {time:'01:03',name:'林小满',place:'北岸 · 未知位置',initial:'满',preview:'「我听见你的歌了。\n你能告诉我妈妈吗？」',text:'这里有一扇写着数字的门，水还没到台阶最上面。我找到爸爸那卷磁带了，他最后说的不是“我先走”，是“让他们先走”。你能告诉我妈吗？还有……我现在该往上走，还是留在这里？',choices:[
 {label:'陪她稳住呼吸，确认门牌与水位',effect:[8,-5,-5],flags:['LOCATION'],result:'三号井，最上层的高阶。你终于知道她在哪里了。她说：“我会等你们。”'},
 {label:'让她留在高阶，持续发送短报码',effect:[0,10,-3],flags:['BEACON'],result:'三个短音，重复着。救援时所需信号降低 5 点。精确位置还需要其他线索。'},
 {label:'把父亲的磁带接入电话线路',effect:[-4,-5,-6],flags:['PROOF','ORDER'],result:'“先断回流……让他们先走。”全新的证据进入录音机。女孩那边的水声更近了。'}]},
 {time:'01:17',name:'老周',place:'北岸 · 岔路口',initial:'周',preview:'「我们到了岔路口。\n现在，照着你的声音走。」',text:'左边通检修门，右边是灯塔旧梯。雨太大，看不清井口，我只能照着你的声音走。你刚才说的话，街上不少人都听见了。现在告诉我，先去接那个孩子，还是留住这条线等外面的救援队？',choices:[
 {label:'断回流、开检修门，接她回家',effect:[4,-8,-8],requires:['LOCATION','ORDER'],rescue:'gate',result:'回流电已断开，门打开了。耳机里传来老周的喘息：“接到了……人接到了。”'},
 {label:'沿备用梯上行，在出口接应',effect:[-6,4,-4],requires:['LOCATION','ROUTE'],rescue:'ladder',result:'黄色扶手处亮起了一束手电。小满握住老周的手，踩上了通往地面的最后一级台阶。'},
 {label:'保持定位，等待专业救援队',effect:[6,10,-2],flags:['SEARCH'],result:'专业搜救队正在靠近北岸。你答应小满，天亮前不会关掉这个频道。'}]}
];
export const PROGRAMS=[{id:'music',title:'一首未眠的歌',description:'安抚情绪 · 重拾信任',kind:'MUSIC / 03:42',icon:'disc',effect:[12,-4,-3]},{id:'truth',title:'雾中的真相',description:'播出证词 · 让真相留下',kind:'STORY / LIVE',icon:'tape',effect:[6,-6,-6]},{id:'evac',title:'给所有未睡的人',description:'紧急指引 · 守护下街',kind:'NOTICE / PRIORITY',icon:'radio',effect:[-4,6,-6]}];
export const FREQUENCIES=[{freq:88.1,title:'被留下的工作录音',hint:'旧水库工作频道',flags:['ORDER','PROOF'],text:'“二十三点十七分，回流还通着……先断它，再开门。林舟留下，其他人上去。”正式报告的时间，比录音早了七分钟。'},{freq:90.4,title:'灯塔的另一条路',hint:'备用导航信标',flags:['ROUTE'],text:'三声短响后，传来维护员的旧录音：“北侧旧梯可达三号井上口，黄色扶手处右转。”'},{freq:93.6,title:'雨里的三个短音',hint:'阿岚校准的频道',flags:['LOCATION','BEACON'],text:'沙沙声里，有人在敲三下。“我在三号，不在灯塔……这里听得到你的歌。”小满的信号仍在。'}];
export const FLAG_NAMES={LOCATION:'三号井的位置',ORDER:'安全开门顺序',ROUTE:'灯塔备用梯',PROOF:'原始事故证据',BEACON:'短报码定位',RESCUED:'小满获救',TRUTH_PUBLIC:'真相已留存',EVAC_DONE:'下街已疏散'};
export const initialState=()=>({version:1,turn:0,phase:'ringing',trust:62,signal:78,power:86,flags:[],journal:[],tuned:[],selected:'music',broadcasted:false,activeProgram:null,result:'',repaired:false,ending:null,volume:.35,muted:true});
const clamp=v=>Math.min(100,Math.max(0,v));
export function adjust(s,values){['trust','signal','power'].forEach((k,i)=>s[k]=clamp(s[k]+values[i]));}
export function flag(s,key){if(!s.flags.includes(key))s.flags.push(key);}
export function log(s,title,text){s.journal.unshift({time:CALLS[s.turn]?.time||'05:42',title,text});}
export function effectLabel(values){return values.map((v,i)=>v?`${['信任','信号','电力'][i]} ${v>0?'+':''}${v}`:'').filter(Boolean).join('  ·  ');}
export function choiceRequirement(s,c){let missing=(c.requires||[]).filter(f=>!s.flags.includes(f)).map(f=>FLAG_NAMES[f]);if(missing.length)return '需要：'+missing.join('、');const b=s.flags.includes('BEACON')?5:0;if(c.rescue==='gate'&&(s.signal+c.effect[1]<25-b||s.power+c.effect[2]<10))return `需要信号 ≥ ${33-b}、电力 ≥ 18`;if(c.rescue==='ladder'&&(s.trust+c.effect[0]<50||s.signal+c.effect[1]<20-b))return `需要信任 ≥ 56、信号 ≥ ${16-b}`;return '';}
export function answerCall(s){if(s.phase!=='ringing')return false;s.phase='connected';return true;}
export function choose(s,index){if(s.phase!=='connected')return false;let c=CALLS[s.turn].choices[index];if(!c||choiceRequirement(s,c))return false;adjust(s,c.effect);(c.flags||[]).forEach(f=>flag(s,f));if(c.rescue)flag(s,'RESCUED');s.result=c.result;s.phase='resolved';log(s,`${CALLS[s.turn].name} · ${c.label}`,c.result);return true;}
export function broadcast(s){if(s.broadcasted||s.phase==='ended')return false;let p=PROGRAMS.find(p=>p.id===s.selected);if(s.power<Math.abs(p.effect[2]))return false;adjust(s,p.effect);let result='';if(p.id==='music'){result='旧歌缓缓响起。有人跟着副歌，慢慢停止了敲门。';}if(p.id==='truth'){if(s.flags.includes('PROOF')&&s.signal>=20&&s.power>=5){flag(s,'TRUTH_PUBLIC');result='邻镇电台回执：原始录音已留存。林舟的名字，终于和真相一起被听见。';}else{result='你播出了已经确认的寻人进展。公开事故定论还需要原始证据、播出后 20 信号和 5 电力。';}}if(p.id==='evac'){let min=s.flags.includes('EVAC_PREP')?30:40;if(s.trust>=min&&s.signal>=20){flag(s,'EVAC_DONE');result='许真回电：下街居民已抵达北坡学校。最后一个名字也点到了。';}else result=`广播传到了下街，但还没能组织好所有人。播出后需要 ${min} 信任与 20 信号。`; }s.broadcasted=true;s.activeProgram=p.id;log(s,p.title,result);return result;}
export function tune(s,freq){if(s.phase==='ended')return {error:'这一夜已经结束。重新开始后可以继续探索。'};let f=FREQUENCIES.find(f=>Math.abs(f.freq-freq)<.13);if(!f)return {error:'只有雨声与杂音。慢慢转动旋钮，靠近信号峰值。'};if(s.tuned.includes(f.freq))return {clue:f,repeat:true};if(s.power<3)return {error:'锁定信号需要 3 电力。检查配电箱能否恢复供电。'};s.power-=3;s.tuned.push(f.freq);f.flags.forEach(f=>flag(s,f));log(s,`${f.freq} MHz · ${f.title}`,f.text);return {clue:f};}
export function repair(s){if(s.repaired||s.phase==='ended')return false;s.power=clamp(s.power+18);s.repaired=true;log(s,'备用电路恢复','回流 → 地线 → 主闸。备用电路重新接通，电力 +18。');return true;}
export function next(s){if(s.phase!=='resolved')return false;if(s.turn===5){s.phase='ended';s.ending=getEnding(s);log(s,s.ending.title,s.ending.text);return true;}s.turn++;s.phase='ringing';s.broadcasted=false;s.result='';return true;}
export function getEnding(s){const rescued=s.flags.includes('RESCUED'),truth=s.flags.includes('TRUTH_PUBLIC');if(rescued&&truth)return {id:'dawn',title:'天亮之前',tag:'ENDING 01 / A VOICE FOR THE DAWN',text:'天亮时，小满披着一件不合身的雨衣坐进直播间。她没有马上说话。你把第二支话筒，轻轻推到她面前。'};if(rescued)return {id:'home',title:'有人回家',tag:'ENDING 02 / THE WAY HOME',text:'她回来了。那卷磁带晾在窗边，还没有进入任何一份新档案。有些话，终于有人愿意继续听。'};if(truth)return {id:'voice',title:'留下声音的人',tag:'ENDING 03 / VOICES THAT REMAIN',text:'邻镇回电说，录音已经存好。搜救队正在靠近北岸。你没有关掉她的频道，天色一点点从海上亮起来。'};return {id:'listening',title:'仍有人收听',tag:'ENDING 04 / STILL LISTENING',text:'雨声渐小，电台只剩一盏灯。你又念了一遍最后确认的位置。很久以后，耳机里传来一声：“收到。”'};}
export function readSave(storage){try{let s=JSON.parse(storage.getItem(STORAGE_KEY));if(!s||s.version!==1||!Number.isInteger(s.turn)||s.turn<0||s.turn>5||!['ringing','connected','resolved','ended'].includes(s.phase)||!['trust','signal','power'].every(k=>Number.isFinite(s[k])&&s[k]>=0&&s[k]<=100)||!Array.isArray(s.flags)||!s.flags.every(f=>typeof f==='string')||!Array.isArray(s.journal)||!s.journal.every(j=>j&&typeof j.title==='string'&&typeof j.text==='string'&&typeof j.time==='string')||!Array.isArray(s.tuned)||typeof s.broadcasted!=='boolean'||typeof s.repaired!=='boolean'||(s.phase==='ended'&&s.turn!==5))return initialState();return {...initialState(),...s,selected:PROGRAMS.some(p=>p.id===s.selected)?s.selected:'music'};}catch{return initialState();}}
