import './style.css';
import { createGame } from './game.js';
import { createScene } from './scene.js';
import { createUI } from './ui.js';
import { createAudio } from './audio.js';

const audio=createAudio();
let game,scene,ui;
function restart(){const muted=game?.state.muted??true;ui?.hideModal();game=createGame({onToast:message=>ui?.toast(message),onSound:name=>audio.play(name),onRelic:options=>ui.showRelic(options,id=>game.chooseRelic(id)),onEnd:result=>{try{const previous=Number(localStorage.getItem('starfluff-best')||0);if(result.won&&result.stars>previous)localStorage.setItem('starfluff-best',String(result.stars));}catch{}ui.showEnd(result,restart);}});game.state.muted=muted;ui?.update(game.state);}
const actions={
 selectTower:type=>game.selectTower(type),startWave:()=>game.startWave(),upgrade:()=>game.upgrade(),sell:()=>game.sell(),skill:id=>game.skill(id),pause:()=>game.pause(),speed:()=>game.speed(),restart,sound:()=>{game.state.muted=audio.toggle();},help:()=>{const paused=game.state.paused;game.state.paused=true;ui.showHelp(()=>{game.state.paused=paused;});},closeSelection:()=>game.closeSelection()
};
ui=createUI(document.querySelector('#app'),actions);restart();
try { scene=createScene(ui.canvasContainer,{onPlotClick:index=>game.selectPlot(index)}); }
catch(error){console.error(error);ui.canvasContainer.innerHTML='<div class="webgl-error"><strong>花园的星光暂时没有亮起</strong><p>当前浏览器无法创建 3D 画面，请开启硬件加速，或使用支持 WebGL 的现代浏览器。</p></div>';}
let previous=performance.now();
function frame(now){const dt=Math.max(0,Math.min((now-previous)/1000,.1));previous=now;game.step(dt);scene?.render(game.state,dt);ui.update(game.state);audio.tick(now/1000);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
window.addEventListener('resize',()=>scene?.resize());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state.phase==='wave')game.state.paused=true;previous=performance.now();});
window.addEventListener('keydown',event=>{
 if(event.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 if(document.querySelector('[role="dialog"]'))return;
 const key=event.key.toLowerCase();
 if(key===' '){event.preventDefault();game.state.phase==='prepare'?game.startWave():game.pause();}
 if(['1','2','3','4'].includes(key))game.selectTower(['bunny','cat','bear','owl'][Number(key)-1]);
 if(key==='q')game.skill('meteor');if(key==='w')game.skill('freeze');if(key==='e')game.skill('heal');
 if(key==='f')game.speed();if(key==='p')game.pause();if(key==='m')actions.sound();if(key==='escape')game.closeSelection();
});
window.__STARFLUFF__={
 getState:()=>JSON.parse(JSON.stringify(game.state)),
 getPlotScreenPosition:index=>{const p=scene?.getPlotScreenPosition(index),rect=ui.canvasContainer.getBoundingClientRect();return p?{x:p.x+rect.left,y:p.y+rect.top}:null;}
};
