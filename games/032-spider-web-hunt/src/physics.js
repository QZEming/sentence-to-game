export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,dz=(b.z||0)-(a.z||0);const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy+((p.z||0)-(a.z||0))*dz)/(dx*dx+dy*dy+dz*dz||1)));return {distance:Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t,(p.z||0)-(a.z||0)-dz*t),t};}
export class SilkPhysics {
 constructor(){this.nodes=[];this.edges=[];this.nextId=0;}
 addNode(x,y,z=0,fixed=false){const n={id:this.nextId++,x,y,z,px:x,py:y,pz:z,ox:x,oy:y,oz:z,fixed};this.nodes.push(n);return n;}
 connect(a,b,reinforced=false){if(!a||!b||a===b||this.edges.some(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a)))return null;const e={a,b,rest:Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z),reinforced,health:1,tension:0};this.edges.push(e);return e;}
 remove(e){this.edges=this.edges.filter(v=>v!==e);}
 step(dt,time,wind=1,strength=1){dt=Math.min(dt,.033);for(const n of this.nodes){if(n.fixed)continue;const vx=(n.x-n.px)*.965,vy=(n.y-n.py)*.965,vz=(n.z-n.pz)*.955;n.px=n.x;n.py=n.y;n.pz=n.z;n.x+=vx+Math.sin(time*1.7+n.oy)*wind*dt*dt*.8;n.y+=vy-.3*dt*dt;n.z+=vz+Math.sin(time*2+n.ox*1.2)*wind*dt*dt*2.8;n.z+=(n.oz-n.z)*.006;}
 for(let i=0;i<7;i++)for(const e of this.edges){const dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,dz=e.b.z-e.a.z;const d=Math.hypot(dx,dy,dz)||.001;e.tension=d/e.rest;const f=(d-e.rest)/d*(e.reinforced?.85:.7);const weight=(e.a.fixed||e.b.fixed)?1:.5;if(!e.a.fixed){e.a.x+=dx*f*weight;e.a.y+=dy*f*weight;e.a.z+=dz*f*weight;}if(!e.b.fixed){e.b.x-=dx*f*weight;e.b.y-=dy*f*weight;e.b.z-=dz*f*weight;}}
 for(const e of this.edges){if(e.tension>1.4+(strength-1)*.2)e.health-=dt*(e.tension-1.4)*.4;}this.edges=this.edges.filter(e=>e.health>0);}
 impact(e,weight){if(!e)return;for(const n of [e.a,e.b])if(!n.fixed){n.z+=weight*.12;n.y-=weight*.018;}e.health-=weight*.045/(e.reinforced?2.5:1);}
}
