export const TITLE = '星绒守夜队';
export const PATH = [
 {x:-11,z:-3},{x:-7,z:-3},{x:-7,z:2},{x:-2,z:2},{x:-2,z:-3},{x:3,z:-3},{x:3,z:2},{x:8,z:2},{x:8,z:-2},{x:11,z:-2}
];
export const PLOTS = [
 {x:-8.8,z:-0.3},{x:-5,z:-0.8},{x:-4.5,z:4.1},{x:0,z:0.1},{x:0,z:-5.1},{x:5.1,z:-0.8},{x:5.7,z:4.1},{x:9.9,z:0.7},{x:-9,z:-5.4},{x:5.3,z:-5.1}
];
export const TOWERS = {
 bunny:{name:'星弹兔',short:'兔',role:'远程 · 单体',icon:'🐰',cost:80,color:'#f6c880',range:4.2,damage:19,rate:0.78,desc:'把小星星弹向梦魇，射程远，是可靠的花园哨兵。',upgrade:['星光弹匣','月亮神射手']},
 cat:{name:'薄荷猫',short:'猫',role:'减速 · 控场',icon:'🐱',cost:100,color:'#93d5cc',range:3.4,damage:9,rate:0.85,slow:0.45,desc:'薄荷泡泡让敌人减速 45%，为伙伴争取更多时间。',upgrade:['冰露泡泡','永冻薄荷']},
 bear:{name:'蜜糖熊',short:'熊',role:'爆破 · 群伤',icon:'🐻',cost:125,color:'#eeb290',range:3.8,damage:25,rate:1.8,splash:1.65,desc:'抛出蜜糖罐造成范围伤害，爆破可穿透一半护甲。',upgrade:['加大糖罐','流星蜜糖']},
 owl:{name:'灯笼啾',short:'啾',role:'支援 · 产星',icon:'🦉',cost:105,color:'#c4b2e8',range:3.8,damage:10,rate:1.25,income:5,desc:'每 7 秒产出星露，也用月光帮助攻击附近敌人。',upgrade:['盈月灯笼','星河许愿灯']}
};
export const ENEMIES = {
 puff:{name:'迷路绒团',hp:58,speed:1.18,reward:9,leak:1,color:'#9594b7'},
 runner:{name:'闪电团团',hp:42,speed:2.05,reward:10,leak:1,color:'#c58dba'},
 shell:{name:'硬壳栗球',hp:175,speed:.74,reward:16,leak:2,color:'#819dab',armor:.45},
 healer:{name:'困困蘑菇',hp:105,speed:1.04,reward:18,leak:1,color:'#e5a3b4',heal:5},
 boss:{name:'噩梦毛球王',hp:1550,speed:.48,reward:100,leak:6,color:'#756789',armor:.12}
};
export const WAVES = [
 ['puff',7], ['puff',10,'runner',3], ['puff',10,'runner',6], ['shell',3,'puff',10],
 ['runner',15,'shell',3], ['healer',3,'puff',13,'shell',3], ['shell',7,'runner',12],
 ['healer',4,'shell',8,'runner',10], ['runner',24,'shell',6], ['healer',6,'shell',12,'puff',8],
 ['shell',15,'runner',18,'healer',6], ['boss',1,'shell',9,'runner',16,'healer',5]
];
export const CHAPTERS = [
 {wave:1,kicker:'序章 · 落星之夜',title:'今晚，换我们守护梦。',text:'月芽树结出最后一颗梦种。迷路的梦魇循着微光而来，兔兔邀请你成为守夜队长，把它们温柔地送回夜空。'},
 {wave:4,kicker:'第一章 · 薄荷来信',title:'风里有一封薄荷味的信。',text:'“队长，带壳的栗球怕连番攻击。把薄荷猫与蜜糖熊安排在转角，一起守住花园吧。”——巡夜员啾啾'},
 {wave:8,kicker:'第二章 · 不眠花园',title:'每一盏小灯，都记得你的勇气。',text:'梦种正在发芽。困困蘑菇会治疗附近的梦魇；用流星雨集中驱散它们。再坚持一会儿，黎明就来了。'},
 {wave:12,kicker:'终章 · 把噩梦抱一抱',title:'原来大毛球，也只是怕黑。',text:'最后一个梦魇躲在巨大的绒毛里。点亮所有灯笼，用最明亮的星光告诉它：这个花园，也欢迎好梦。'}
];
export const RELICS = [
 {id:'power',icon:'✦',name:'灿星徽章',desc:'所有守卫的伤害提高 18%'},
 {id:'range',icon:'◎',name:'月光望远镜',desc:'所有守卫的射程提高 15%'},
 {id:'fortune',icon:'❋',name:'幸运四叶草',desc:'立即获得 150 星露'},
 {id:'heart',icon:'♡',name:'暖心棉花糖',desc:'恢复 5 点梦种生命'},
 {id:'haste',icon:'ϟ',name:'风铃羽毛',desc:'所有守卫的攻击速度提高 16%'}
];
export const SKILLS = {
 meteor:{name:'流星雨',icon:'✦',key:'Q',cooldown:36,desc:'全场伤害：100 + 当前波数 × 12'},
 freeze:{name:'晚安泡泡',icon:'❄',key:'W',cooldown:28,desc:'让全部敌人停下 4 秒'},
 heal:{name:'月芽祝福',icon:'♡',key:'E',cooldown:52,desc:'恢复梦种 3 点生命'}
};
