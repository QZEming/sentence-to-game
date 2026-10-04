export const CHAPTERS = [
 {name:'遗忘的庭院',sub:'THE FORGOTTEN COURTYARD',intro:'那些断开的路，曾经通向同一个梦。', mechanic:'旋转房间，让光路重新相连。收集两枚记忆碎片，走向金色的门。', shards:[2,6], start:8, exit:0, phase:false, swap:false, rotations:[1,2,0,3,1,2,1,0,2], doors:[[1,2],[1,3],[2,3],[0,1,2],[0,1,2,3],[0,2,3],[0,1],[1,3],[0,3]]},
 {name:'昼夜的回声',sub:'ECHOES BETWEEN WORLDS',intro:'在另一个世界，消失的路依然存在。', mechanic:'切换梦境相位，穿过只在月影中显现的桥。找到钥匙，再开启出口。', shards:[2,6,4], start:8, exit:0, key:5, lock:0, phase:true, swap:false, spectral:[1,3,7], rotations:[2,0,1,1,0,3,2,0,1], doors:[[1,2],[1,3],[2,3],[0,2],[0,1,2,3],[0,2,3],[0,1],[1,3],[0,3]]},
 {name:'不可能的归途',sub:'THE IMPOSSIBLE WAY HOME',intro:'如果世界没有出口，就重新拼起这个世界。', mechanic:'交换相邻房间，重排梦境。紫色传送门连接远方；收齐四枚记忆后醒来。', shards:[1,2,6,7], start:8, exit:0, key:4, lock:0, phase:true, swap:true, spectral:[3,5], portals:[2,6], rotations:[1,1,3,2,2,0,1,3,2], doors:[[0,2],[0,1],[1,2],[1,3],[0,1,2,3],[0,2],[0,3],[2,3],[0,3]]}
];
export class DreamGame {
 constructor(level=0){this.load(level)}
 load(level){this.level=level;this.config=CHAPTERS[level];this.rooms=this.config.doors.map((doors,id)=>({id,doors,rot:this.config.rotations[id],pos:id}));this.player=this.config.start;this.selected=this.player;this.collected=[];this.key=false;this.phase=0;this.moves=0;this.won=false;this.history=[];this.swapping=false;}
 snapshot(){return JSON.parse(JSON.stringify({rooms:this.rooms,player:this.player,selected:this.selected,collected:this.collected,key:this.key,phase:this.phase,moves:this.moves,won:this.won}))}
 save(){this.history.push(this.snapshot());if(this.history.length>150)this.history.shift()}
 undo(){const s=this.history.pop();if(!s)return false;Object.assign(this,s);return true}
 roomAt(pos){return this.rooms.find(r=>r.pos===pos)}
 doors(id){const r=this.rooms[id];return r.doors.map(d=>(d+r.rot)%4)}
 neighbor(pos,dir){let x=pos%3,z=Math.floor(pos/3);const ds=[[0,-1],[1,0],[0,1],[-1,0]];x+=ds[dir][0];z+=ds[dir][1];return x<0||x>2||z<0||z>2?-1:z*3+x}
 isActive(id){return !this.config.spectral?.includes(id)||this.phase===1}
 neighbors(id){const r=this.rooms[id];if(!this.isActive(id))return [];return this.doors(id).map(d=>({d,n:this.roomAt(this.neighbor(r.pos,d))})).filter(({d,n})=>n&&this.isActive(n.id)&&this.doors(n.id).includes((d+2)%4)&&!(this.config.lock===n.id&&!this.key)).map(v=>v.n.id)}
 path(target){const queue=[[this.player]],seen=new Set([this.player]);while(queue.length){const path=queue.shift(),n=path.at(-1);if(n===target)return path;for(const id of this.neighbors(n)){if(!seen.has(id)){seen.add(id);queue.push([...path,id])}}}return null}
 rotate(amount=1){if(this.won)return false;this.save();const r=this.rooms[this.selected];r.rot=(r.rot+amount+4)%4;this.moves++;return true}
 move(target){if(this.won)return {ok:false,message:'梦境已完成'};const path=this.path(target);if(!path)return {ok:false,message:this.config.lock===target&&!this.key?'出口封印尚未解除，先寻找钥匙。':'光路尚未连通。旋转房间，让两侧的光路相接。'};if(path.length===1)return {ok:false,message:'旅人已在这个房间。'};this.save();let gained=0;for(const id of path.slice(1)){this.player=id;if(this.config.shards.includes(id)&&!this.collected.includes(id)){this.collected.push(id);gained++}if(this.config.key===id)this.key=true;}this.moves+=path.length-1;this.won=this.player===this.config.exit&&this.collected.length===this.config.shards.length;return {ok:true,path,gained,message:this.won?'你找到了醒来的路。':gained?'记忆碎片已找回。梦境又清晰了一些。':this.player===this.config.exit?'还有记忆遗落在梦里。收齐碎片后再回来。':'光路延伸，梦境流转。'}}
 shift(){if(!this.config.phase||this.won)return false;this.save();this.phase=1-this.phase;this.moves++;return true}
 swap(target){const a=this.rooms[this.selected],b=this.rooms[target];if(!this.config.swap||this.won||!b||Math.abs(a.pos%3-b.pos%3)+Math.abs(Math.floor(a.pos/3)-Math.floor(b.pos/3))!==1)return false;this.save();[a.pos,b.pos]=[b.pos,a.pos];this.moves++;return true}
 teleport(){const p=this.config.portals;if(!p?.includes(this.player)||this.won)return false;this.save();this.player=p.find(id=>id!==this.player);if(!this.collected.includes(this.player))this.collected.push(this.player);this.selected=this.player;this.moves++;return true}
}
