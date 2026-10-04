export const COUNTRIES = ['阿尔登','维斯塔','诺维亚','卡斯克'];
export const DAYS = [
  {title:'雾中的第一班岗',date:'1984.11.06',weather:'薄雾 / −2°C',memo:'北境重新开放。逐项核对证件，完成货物扫描后作出决定。',newRule:'护照与入境许可信息必须一致，且护照未过期。',rules:['护照须在当日有效，姓名、证件号与许可一致。','携带未申报货物：拒绝入境。','武器、爆炸物属于违禁品：拘留。'],cases:['clear','expired','identity','weapon','clear','undeclared']},
  {title:'突然收紧的边界',date:'1984.11.07',weather:'阴天 / −4°C',memo:'外交部来电：维斯塔公民暂停入境。货物重量上限已调整。',newRule:'新增国籍限制与货运限重 40 kg。',rules:['护照与许可须一致、有效；未申报货物拒绝。','维斯塔公民暂停入境。','货物实际总重不得超过 40 kg。','缺少紫外防伪印记：拒绝入境。','武器、爆炸物：拘留。'],cases:['embargo','clear','overweight','forged','expired','clear']},
  {title:'隔离线',date:'1984.11.08',weather:'小雪 / −6°C',memo:'北方出现疫情。所有入境者须出示绿色检疫证明，工作签另需工作证。',newRule:'新增检疫证明与工作许可检查。',rules:['沿用昨日证件、国籍和 40 kg 限重规定。','每位旅客必须持有效检疫证明。','入境目的为工作者须有工作证。','紫外检验无防伪标记：伪造证件，拘留。','武器、爆炸物：拘留。'],cases:['health','work','clear','identity','weapon','clear']},
  {title:'一封红色通报',date:'1984.11.09',weather:'风雪 / −8°C',memo:'情报部门要求比对通缉证件号。维斯塔入境限制今日解除。',newRule:'通缉证件号 NX-08419；维斯塔恢复通行。',rules:['沿用证件、检疫、工作证、限重及申报规定。','维斯塔入境限制解除。','通缉证件号 NX-08419：拘留（同名不算）。','伪造证件、武器、爆炸物：拘留。'],cases:['namesake','wanted','clear','undeclared','forged','overweight']},
  {title:'最后一辆车',date:'1984.11.10',weather:'晴雪 / −5°C',memo:'本周最后一个班次。药品需要运输许可证，请确保最后一道防线可靠。',newRule:'药品运输新增专项许可；其他规则保持生效。',rules:['所有证件有效且一致；检疫证明必备。','工作目的须持工作证；货重上限 40 kg。','药品运输必须持专项许可证。','通缉 NX-08419、伪造证件、武器、爆炸物：拘留。','未申报货物：拒绝。'],cases:['medicine','clear','combined','health','work','final']}
];
const names=['伊万·科瓦奇','安娜·米勒','列夫·彼得罗夫','米拉·索伦','奥托·韦伯','艾琳·沃斯','马克·诺瓦克','莉娜·贝克','尼古拉·弗罗斯特','维克多·罗森'];
const purposes=['探亲','旅游','货运'];
export function createTraveler(day,index,run=0){
 const kind=DAYS[day-1].cases[index];
 const n=(day*3+index+run)%names.length;
 const p={id:`case-${day}-${index}`,kind,name:names[n],permitName:names[n],country:COUNTRIES[(day+index)%3],number:`AL-${String(10231+day*109+index*71+run).padStart(5,'0')}`,birth:`19${43+n}.0${1+n%9}.${String(10+n).padStart(2,'0')}`,expires:'1985.05.18',purpose:purposes[index%3],duration:3+index*2,permit:true,health:true,work:true,authentic:true,medicinePermit:true,wanted:false,goods:[{name:'纺织品',qty:2,weight:12,declared:true},{name:'个人行李',qty:1,weight:8,declared:true}],skin:[0xd8ad88,0xbc927b,0xe2c3a4][index%3],coat:[0x687663,0x676777,0x7b6555,0x596b76][index%4],hair:[0x302b24,0x8a6a42,0x44322c][index%3],vehicle:[0x647361,0x8a7054,0x586c76,0x7d605b][index%4],quote:'早上好，检查员。这是我的证件。希望今天路况还不错。',answer:'证件上的信息都属实，行李也已经全部申报。',bribe:0};
 if(day!==2&&day!==3)p.country=COUNTRIES[(day+index)%4]; else p.country='阿尔登';
 if(kind==='expired'){p.expires='1984.11.05';p.quote='我已经在边境等了两天了。请让我通过吧。';p.answer='我以为护照还有几天才过期……是我记错了。';}
 if(kind==='identity'){p.permitName=names[(n+2)%names.length];p.answer='旅行社替我办理的许可，我没仔细看。';}
 if(kind==='weapon'){p.goods.push({name:'未申报手枪',qty:1,weight:2,declared:false,illegal:true});p.quote='只有一些日用品，不用特意检查了吧？';p.answer='箱子是我替朋友带的，我不知道里面还有什么。';p.bribe=35;}
 if(kind==='undeclared'){p.goods.push({name:'未申报相机',qty:3,weight:4,declared:false});p.answer='那几台相机也是给家人的礼物，需要申报吗？';}
 if(kind==='embargo'){p.country='维斯塔';p.quote='新规定不该把一家人分开。我的家人就在对面。';}
 if(kind==='overweight'){p.goods[0].weight=38;p.quote='车有点重，但都是普通布料。';}
 if(kind==='forged'){p.authentic=false;p.quote='新护照，昨天才办好的。';p.answer='防伪印记？我可不知道他们是怎么印的。';}
 if(kind==='health'){p.health=false;p.answer='医疗站的队伍太长了，我还没拿到检疫证明。';}
 if(kind==='work'){p.purpose='工作';p.work=false;p.answer='工厂说我先过去，工作证之后会补办。';}
 if(kind==='wanted'||kind==='combined'){p.name='维克多·罗森';p.permitName=p.name;p.number='NX-08419';p.wanted=true;p.quote='例行检查应该很快吧。我还要赶路。';}
 if(kind==='combined'){p.expires='1984.10.01';p.goods.push({name:'爆炸物',qty:1,weight:3,declared:false,illegal:true});}
 if(kind==='namesake'){p.name='维克多·罗森';p.permitName=p.name;p.number='NX-08491';p.quote='总有人把我和通报上的人认错。请核对证件号码。';}
 if(kind==='medicine'){p.goods=[{name:'医用药品',qty:2,weight:18,declared:true,medical:true}];p.medicinePermit=false;p.quote='村里的诊所急需这些药。还需要别的许可证吗？';}
 if(kind==='final'){p.name='伊莲娜·科瓦奇';p.permitName=p.name;p.purpose='探亲';p.expires=DAYS[day-1].date;p.goods=[{name:'儿童玩具',qty:2,weight:4,declared:true},{name:'个人行李',qty:1,weight:8,declared:true}];p.quote='孩子在另一边等着我。今天是护照有效期的最后一天。';}
 p.permitNumber=p.number;
 return p;
}
export function verdictFor(p,day){
 const detain=[],deny=[];
 if(p.goods.some(g=>g.illegal))detain.push('扫描发现武器或爆炸物');
 if(day>=3&&!p.authentic)detain.push('紫外检验缺少防伪标记');
 // Forgery first appears as a document discrepancy on day two, before the detention order.
 if(day===2&&!p.authentic)deny.push('证件缺少防伪标记');
 if(day>=4&&p.number==='NX-08419')detain.push('证件号命中通缉名单 NX-08419');
 if(p.expires<DAYS[day-1].date)deny.push('护照已过期');
 if(!p.permit)deny.push('缺少入境许可');
 if(p.name!==p.permitName||p.number!==p.permitNumber)deny.push('护照与入境许可身份不一致');
 if((day===2||day===3)&&p.country==='维斯塔')deny.push('维斯塔公民暂停入境');
 if(day>=2&&p.goods.reduce((n,g)=>n+g.weight,0)>40)deny.push('货物重量超过 40 kg');
 if(day>=3&&!p.health)deny.push('缺少有效检疫证明');
 if(day>=3&&p.purpose==='工作'&&!p.work)deny.push('缺少工作许可证');
 if(day>=5&&p.goods.some(g=>g.medical)&&!p.medicinePermit)deny.push('缺少药品运输许可证');
 if(p.goods.some(g=>!g.declared&&!g.illegal))deny.push('携带未申报货物');
 return {action:detain.length?'detain':deny.length?'deny':'approve',reasons:detain.length?[...detain,...deny]:deny.length?deny:['全部证件和货物符合当日规定']};
}
export const ACTION_NAMES={approve:'批准入境',deny:'拒绝入境',detain:'依法拘留'};
