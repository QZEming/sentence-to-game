export const CASES = [
 {name:'俄耳甫斯之匣',model:'ORPHEUS',year:'1924',description:'有人把一段无人听过的旋律，锁进了这只保险箱。',origin:'维也纳 · 废弃歌剧院',difficulty:'入门调查',pins:[42,217,128],tolerance:6,frequency:432,freqTolerance:5,pattern:[0,1,2,1],tempo:600,clue:'箱盖刻着一句话：「三次清脆的应答之后，旋律才会苏醒。」',story:'匣中没有珠宝，只有一枚仍在振动的金色音符。它唱的是一位钟表匠未能亲口说出的告别。',hints:['在 30°–60° 之间慢慢寻找，清脆双击会告诉你准确落点。','在 420–450 Hz 之间寻找不再颤动的声音。','这段旋律有四个音：从低处出发，升到最高，再退一步。']},
 {name:'深海潮汐钟',model:'NAUTILUS',year:'1937',description:'它在海底沉睡了八十年，心跳却从未停下。',origin:'北大西洋 · 无名沉船',difficulty:'进阶调查',pins:[283,96,331],tolerance:4,frequency:528,freqTolerance:4,pattern:[0,0,2,1,0],tempo:520,clue:'盐蚀的铭牌上还能读出：「潮水去而复返，最深处总是安静的。」',story:'舱门后是一滴悬浮的海水。贴近它，你听见了沉船上所有人盼望归航的那一声汽笛。',hints:['第一枚锁芯的应答藏在 270°–300° 之间。','潮汐在 510–540 Hz 之间归于平静。','两次低沉的呼唤，跃上浪尖，再沿中音与低音回落。']},
 {name:'月背来信',model:'SELENE',year:'1969',description:'一封寄自月球背面的信，收件日期却是明天。',origin:'阿尔卑斯山 · 封存天文台',difficulty:'专家调查',pins:[157,24,306],tolerance:3,frequency:396,freqTolerance:3,pattern:[2,1,0,1,2,2],tempo:460,clue:'一道银色裂隙指向远处。旁边写着：「听完最后两次心跳，再打开明天。」',story:'这是一封写给明天的你的信。「如果你依然愿意倾听，我们就从未真正失去彼此。」星光照亮了你的掌心。',hints:['第一枚锁芯在 145°–170° 之间，放慢转动的速度。','月光在 380–410 Hz 之间留下它的频率。','从高音走下阶梯，再走回来。最后的高音，要响两次。']}
];
export const circularDistance=(a,b)=>Math.min(Math.abs(a-b)%360,360-Math.abs(a-b)%360);
export const proximity=(value,target,scale,circular=false)=>Math.max(0,1-(circular?circularDistance(value,target):Math.abs(value-target))/scale);
export const matchesPin=(angle,target,tolerance)=>circularDistance(angle,target)<=tolerance;
export const matchesFrequency=(value,target,tolerance)=>Math.abs(value-target)<=tolerance;
export const rating=(mistakes,hints)=>mistakes+hints<=2?'S':mistakes+hints<=6?'A':'B';
