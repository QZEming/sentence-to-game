(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const Zo="180",Jc=0,Da=1,$c=2,Xl=1,ql=2,Mn=3,Hn=0,Ne=1,Je=2,Bn=0,Ri=1,Ua=2,Ia=3,Na=4,Kc=5,ti=100,jc=101,Qc=102,tu=103,eu=104,nu=200,iu=201,ru=202,su=203,Qs=204,to=205,ou=206,au=207,lu=208,cu=209,uu=210,hu=211,fu=212,du=213,pu=214,eo=0,no=1,io=2,Li=3,ro=4,so=5,oo=6,ao=7,Yl=0,mu=1,gu=2,zn=0,_u=1,vu=2,xu=3,Zl=4,Mu=5,Su=6,yu=7,Jl=300,Di=301,Ui=302,lo=303,co=304,cs=306,uo=1e3,ni=1001,ho=1002,nn=1003,Eu=1004,wr=1005,an=1006,vs=1007,ii=1008,hn=1009,$l=1010,Kl=1011,ar=1012,Jo=1013,oi=1014,yn=1015,vr=1016,$o=1017,Ko=1018,lr=1020,jl=35902,Ql=35899,tc=1021,ec=1022,en=1023,cr=1026,ur=1027,nc=1028,jo=1029,ic=1030,Qo=1031,ta=1033,jr=33776,Qr=33777,ts=33778,es=33779,fo=35840,po=35841,mo=35842,go=35843,_o=36196,vo=37492,xo=37496,Mo=37808,So=37809,yo=37810,Eo=37811,To=37812,Ao=37813,bo=37814,wo=37815,Ro=37816,Co=37817,Po=37818,Lo=37819,Do=37820,Uo=37821,Io=36492,No=36494,Fo=36495,Oo=36283,Bo=36284,zo=36285,Ho=36286,Tu=3200,Au=3201,rc=0,bu=1,On="",Ve="srgb",Ii="srgb-linear",is="linear",Kt="srgb",fi=7680,Fa=519,wu=512,Ru=513,Cu=514,sc=515,Pu=516,Lu=517,Du=518,Uu=519,Oa=35044,Ba="300 es",ln=2e3,rs=2001;class Bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Ae=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let za=1234567;const tr=Math.PI/180,hr=180/Math.PI;function ci(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ae[i&255]+Ae[i>>8&255]+Ae[i>>16&255]+Ae[i>>24&255]+"-"+Ae[t&255]+Ae[t>>8&255]+"-"+Ae[t>>16&15|64]+Ae[t>>24&255]+"-"+Ae[e&63|128]+Ae[e>>8&255]+"-"+Ae[e>>16&255]+Ae[e>>24&255]+Ae[n&255]+Ae[n>>8&255]+Ae[n>>16&255]+Ae[n>>24&255]).toLowerCase()}function zt(i,t,e){return Math.max(t,Math.min(e,i))}function ea(i,t){return(i%t+t)%t}function Iu(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function Nu(i,t,e){return i!==t?(e-i)/(t-i):0}function er(i,t,e){return(1-e)*i+e*t}function Fu(i,t,e,n){return er(i,t,1-Math.exp(-e*n))}function Ou(i,t=1){return t-Math.abs(ea(i,t*2)-t)}function Bu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function zu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Hu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Vu(i,t){return i+Math.random()*(t-i)}function ku(i){return i*(.5-Math.random())}function Gu(i){i!==void 0&&(za=i);let t=za+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Wu(i){return i*tr}function Xu(i){return i*hr}function qu(i){return(i&i-1)===0&&i!==0}function Yu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Zu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ju(i,t,e,n,r){const s=Math.cos,o=Math.sin,a=s(e/2),l=o(e/2),c=s((t+n)/2),u=o((t+n)/2),h=s((t-n)/2),d=o((t-n)/2),p=s((n-t)/2),g=o((n-t)/2);switch(r){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function bi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Re(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ci={DEG2RAD:tr,RAD2DEG:hr,generateUUID:ci,clamp:zt,euclideanModulo:ea,mapLinear:Iu,inverseLerp:Nu,lerp:er,damp:Fu,pingpong:Ou,smoothstep:Bu,smootherstep:zu,randInt:Hu,randFloat:Vu,randFloatSpread:ku,seededRandom:Gu,degToRad:Wu,radToDeg:Xu,isPowerOfTwo:qu,ceilPowerOfTwo:Yu,floorPowerOfTwo:Zu,setQuaternionFromProperEuler:Ju,normalize:Re,denormalize:bi};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xr{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let l=n[r+0],c=n[r+1],u=n[r+2],h=n[r+3];const d=s[o+0],p=s[o+1],g=s[o+2],S=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=S;return}if(h!==S||l!==d||c!==p||u!==g){let m=1-a;const f=l*d+c*p+u*g+h*S,T=f>=0?1:-1,E=1-f*f;if(E>Number.EPSILON){const C=Math.sqrt(E),w=Math.atan2(C,f*T);m=Math.sin(m*w)/C,a=Math.sin(a*w)/C}const v=a*T;if(l=l*m+d*v,c=c*m+p*v,u=u*m+g*v,h=h*m+S*v,m===1-a){const C=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=C,c*=C,u*=C,h*=C}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],l=n[r+1],c=n[r+2],u=n[r+3],h=s[o],d=s[o+1],p=s[o+2],g=s[o+3];return t[e]=a*g+u*h+l*p-c*d,t[e+1]=l*g+u*d+c*h-a*p,t[e+2]=c*g+u*p+a*d-l*h,t[e+3]=u*g-a*h-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(r/2),h=a(s/2),d=l(n/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"YZX":this._x=d*u*h+c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h-d*p*g;break;case"XZY":this._x=d*u*h-c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(n>a&&n>h){const p=2*Math.sqrt(1+n-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-n-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-n-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(zt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-r*a,this._w=o*u-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*r+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ha.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ha.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*r-a*n),u=2*(a*e-s*r),h=2*(s*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this.z=zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this.z=zt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xs.copy(this).projectOnVector(t),this.sub(xs)}reflect(t){return this.sub(xs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xs=new L,Ha=new xr;class Nt{constructor(t,e,n,r,s,o,a,l,c){Nt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c)}set(t,e,n,r,s,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=a,u[3]=e,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],p=n[5],g=n[8],S=r[0],m=r[3],f=r[6],T=r[1],E=r[4],v=r[7],C=r[2],w=r[5],R=r[8];return s[0]=o*S+a*T+l*C,s[3]=o*m+a*E+l*w,s[6]=o*f+a*v+l*R,s[1]=c*S+u*T+h*C,s[4]=c*m+u*E+h*w,s[7]=c*f+u*v+h*R,s[2]=d*S+p*T+g*C,s[5]=d*m+p*E+g*w,s[8]=d*f+p*v+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*s*u+n*a*l+r*s*c-r*o*l}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*s,p=c*s-o*l,g=e*h+n*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return t[0]=h*S,t[1]=(r*c-u*n)*S,t[2]=(a*n-r*o)*S,t[3]=d*S,t[4]=(u*e-r*l)*S,t[5]=(r*s-a*e)*S,t[6]=p*S,t[7]=(n*l-c*e)*S,t[8]=(o*e-n*s)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-r*c,r*l,-r*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ms.makeScale(t,e)),this}rotate(t){return this.premultiply(Ms.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ms.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ms=new Nt;function oc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ss(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $u(){const i=ss("canvas");return i.style.display="block",i}const Va={};function fr(i){i in Va||(Va[i]=!0,console.warn(i))}function Ku(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const ka=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ga=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ju(){const i={enabled:!0,workingColorSpace:Ii,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Kt&&(r.r=Tn(r.r),r.g=Tn(r.g),r.b=Tn(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Kt&&(r.r=Pi(r.r),r.g=Pi(r.g),r.b=Pi(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===On?is:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return fr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return fr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ii]:{primaries:t,whitePoint:n,transfer:is,toXYZ:ka,fromXYZ:Ga,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ve},outputColorSpaceConfig:{drawingBufferColorSpace:Ve}},[Ve]:{primaries:t,whitePoint:n,transfer:Kt,toXYZ:ka,fromXYZ:Ga,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ve}}}),i}const qt=ju();function Tn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Pi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let di;class Qu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{di===void 0&&(di=ss("canvas")),di.width=t.width,di.height=t.height;const r=di.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=di}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ss("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Tn(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Tn(e[n]/255)*255):e[n]=Tn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let th=0;class na{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=ci(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ss(r[o].image)):s.push(Ss(r[o]))}else s=Ss(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Ss(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Qu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let eh=0;const ys=new L;class Fe extends Bi{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=ni,r=ni,s=an,o=ii,a=en,l=hn,c=Fe.DEFAULT_ANISOTROPY,u=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=ci(),this.name="",this.source=new na(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ys).x}get height(){return this.source.getSize(ys).y}get depth(){return this.source.getSize(ys).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case uo:t.x=t.x-Math.floor(t.x);break;case ni:t.x=t.x<0?0:1;break;case ho:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case uo:t.y=t.y-Math.floor(t.y);break;case ni:t.y=t.y<0?0:1;break;case ho:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=Jl;Fe.DEFAULT_ANISOTROPY=1;class jt{constructor(t=0,e=0,n=0,r=1){jt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],g=l[9],S=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-S)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+S)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,v=(p+1)/2,C=(f+1)/2,w=(u+d)/4,R=(h+S)/4,U=(g+m)/4;return E>v&&E>C?E<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(E),r=w/n,s=R/n):v>C?v<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),n=w/r,s=U/r):C<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(C),n=R/s,r=U/s),this.set(n,r,s,e),this}let T=Math.sqrt((m-g)*(m-g)+(h-S)*(h-S)+(d-u)*(d-u));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(h-S)/T,this.z=(d-u)/T,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this.z=zt(this.z,t.z,e.z),this.w=zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this.z=zt(this.z,t,e),this.w=zt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nh extends Bi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new jt(0,0,t,e),this.scissorTest=!1,this.viewport=new jt(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Fe(r);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new na(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ai extends nh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ac extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=nn,this.minFilter=nn,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ih extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=nn,this.minFilter=nn,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Mr{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint($e.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint($e.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=$e.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,$e):$e.fromBufferAttribute(s,o),$e.applyMatrix4(t.matrixWorld),this.expandByPoint($e);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(t.matrixWorld),this.union(Rr)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,$e),$e.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),Cr.subVectors(this.max,Wi),pi.subVectors(t.a,Wi),mi.subVectors(t.b,Wi),gi.subVectors(t.c,Wi),Cn.subVectors(mi,pi),Pn.subVectors(gi,mi),qn.subVectors(pi,gi);let e=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-qn.z,qn.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,qn.z,0,-qn.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-qn.y,qn.x,0];return!Es(e,pi,mi,gi,Cr)||(e=[1,0,0,0,1,0,0,0,1],!Es(e,pi,mi,gi,Cr))?!1:(Pr.crossVectors(Cn,Pn),e=[Pr.x,Pr.y,Pr.z],Es(e,pi,mi,gi,Cr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,$e).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize($e).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const mn=[new L,new L,new L,new L,new L,new L,new L,new L],$e=new L,Rr=new Mr,pi=new L,mi=new L,gi=new L,Cn=new L,Pn=new L,qn=new L,Wi=new L,Cr=new L,Pr=new L,Yn=new L;function Es(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Yn.fromArray(i,s);const a=r.x*Math.abs(Yn.x)+r.y*Math.abs(Yn.y)+r.z*Math.abs(Yn.z),l=t.dot(Yn),c=e.dot(Yn),u=n.dot(Yn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const rh=new Mr,Xi=new L,Ts=new L;class ia{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):rh.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);const e=Xi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Xi,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ts.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(Ts)),this.expandByPoint(Xi.copy(t.center).sub(Ts))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const gn=new L,As=new L,Lr=new L,Ln=new L,bs=new L,Dr=new L,ws=new L;class lc{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=gn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gn.copy(this.origin).addScaledVector(this.direction,e),gn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){As.copy(t).add(e).multiplyScalar(.5),Lr.copy(e).sub(t).normalize(),Ln.copy(this.origin).sub(As);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Lr),a=Ln.dot(this.direction),l=-Ln.dot(Lr),c=Ln.lengthSq(),u=Math.abs(1-o*o);let h,d,p,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const S=1/u;h*=S,d*=S,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(As).addScaledVector(Lr,d),p}intersectSphere(t,e){gn.subVectors(t.center,this.origin);const n=gn.dot(this.direction),r=gn.dot(gn)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,r=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,r=(t.min.x-d.x)*c),u>=0?(s=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(s=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,gn)!==null}intersectTriangle(t,e,n,r,s){bs.subVectors(e,t),Dr.subVectors(n,t),ws.crossVectors(bs,Dr);let o=this.direction.dot(ws),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ln.subVectors(this.origin,t);const l=a*this.direction.dot(Dr.crossVectors(Ln,Dr));if(l<0)return null;const c=a*this.direction.dot(bs.cross(Ln));if(c<0||l+c>o)return null;const u=-a*Ln.dot(ws);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class le{constructor(t,e,n,r,s,o,a,l,c,u,h,d,p,g,S,m){le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c,u,h,d,p,g,S,m)}set(t,e,n,r,s,o,a,l,c,u,h,d,p,g,S,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=g,f[11]=S,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new le().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/_i.setFromMatrixColumn(t,0).length(),s=1/_i.setFromMatrixColumn(t,1).length(),o=1/_i.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const d=o*u,p=o*h,g=a*u,S=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=p+g*c,e[5]=d-S*c,e[9]=-a*l,e[2]=S-d*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,p=l*h,g=c*u,S=c*h;e[0]=d+S*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=p*a-g,e[6]=S+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,p=l*h,g=c*u,S=c*h;e[0]=d-S*a,e[4]=-o*h,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*u,e[9]=S-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,p=o*h,g=a*u,S=a*h;e[0]=l*u,e[4]=g*c-p,e[8]=d*c+S,e[1]=l*h,e[5]=S*c+d,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,p=o*c,g=a*l,S=a*c;e[0]=l*u,e[4]=S-d*h,e[8]=g*h+p,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=p*h+g,e[10]=d-S*h}else if(t.order==="XZY"){const d=o*l,p=o*c,g=a*l,S=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+S,e[5]=o*u,e[9]=p*h-g,e[2]=g*h-p,e[6]=a*u,e[10]=S*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(sh,t,oh)}lookAt(t,e,n){const r=this.elements;return ze.subVectors(t,e),ze.lengthSq()===0&&(ze.z=1),ze.normalize(),Dn.crossVectors(n,ze),Dn.lengthSq()===0&&(Math.abs(n.z)===1?ze.x+=1e-4:ze.z+=1e-4,ze.normalize(),Dn.crossVectors(n,ze)),Dn.normalize(),Ur.crossVectors(ze,Dn),r[0]=Dn.x,r[4]=Ur.x,r[8]=ze.x,r[1]=Dn.y,r[5]=Ur.y,r[9]=ze.y,r[2]=Dn.z,r[6]=Ur.z,r[10]=ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],p=n[13],g=n[2],S=n[6],m=n[10],f=n[14],T=n[3],E=n[7],v=n[11],C=n[15],w=r[0],R=r[4],U=r[8],y=r[12],M=r[1],P=r[5],F=r[9],H=r[13],q=r[2],W=r[6],X=r[10],$=r[14],V=r[3],st=r[7],ut=r[11],Tt=r[15];return s[0]=o*w+a*M+l*q+c*V,s[4]=o*R+a*P+l*W+c*st,s[8]=o*U+a*F+l*X+c*ut,s[12]=o*y+a*H+l*$+c*Tt,s[1]=u*w+h*M+d*q+p*V,s[5]=u*R+h*P+d*W+p*st,s[9]=u*U+h*F+d*X+p*ut,s[13]=u*y+h*H+d*$+p*Tt,s[2]=g*w+S*M+m*q+f*V,s[6]=g*R+S*P+m*W+f*st,s[10]=g*U+S*F+m*X+f*ut,s[14]=g*y+S*H+m*$+f*Tt,s[3]=T*w+E*M+v*q+C*V,s[7]=T*R+E*P+v*W+C*st,s[11]=T*U+E*F+v*X+C*ut,s[15]=T*y+E*H+v*$+C*Tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],p=t[14],g=t[3],S=t[7],m=t[11],f=t[15];return g*(+s*l*h-r*c*h-s*a*d+n*c*d+r*a*p-n*l*p)+S*(+e*l*p-e*c*d+s*o*d-r*o*p+r*c*u-s*l*u)+m*(+e*c*h-e*a*p-s*o*h+n*o*p+s*a*u-n*c*u)+f*(-r*a*u-e*l*h+e*a*d+r*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],p=t[11],g=t[12],S=t[13],m=t[14],f=t[15],T=h*m*c-S*d*c+S*l*p-a*m*p-h*l*f+a*d*f,E=g*d*c-u*m*c-g*l*p+o*m*p+u*l*f-o*d*f,v=u*S*c-g*h*c+g*a*p-o*S*p-u*a*f+o*h*f,C=g*h*l-u*S*l-g*a*d+o*S*d+u*a*m-o*h*m,w=e*T+n*E+r*v+s*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return t[0]=T*R,t[1]=(S*d*s-h*m*s-S*r*p+n*m*p+h*r*f-n*d*f)*R,t[2]=(a*m*s-S*l*s+S*r*c-n*m*c-a*r*f+n*l*f)*R,t[3]=(h*l*s-a*d*s-h*r*c+n*d*c+a*r*p-n*l*p)*R,t[4]=E*R,t[5]=(u*m*s-g*d*s+g*r*p-e*m*p-u*r*f+e*d*f)*R,t[6]=(g*l*s-o*m*s-g*r*c+e*m*c+o*r*f-e*l*f)*R,t[7]=(o*d*s-u*l*s+u*r*c-e*d*c-o*r*p+e*l*p)*R,t[8]=v*R,t[9]=(g*h*s-u*S*s-g*n*p+e*S*p+u*n*f-e*h*f)*R,t[10]=(o*S*s-g*a*s+g*n*c-e*S*c-o*n*f+e*a*f)*R,t[11]=(u*a*s-o*h*s-u*n*c+e*h*c+o*n*p-e*a*p)*R,t[12]=C*R,t[13]=(u*S*r-g*h*r+g*n*d-e*S*d-u*n*m+e*h*m)*R,t[14]=(g*a*r-o*S*r-g*n*l+e*S*l+o*n*m-e*a*m)*R,t[15]=(o*h*r-u*a*r+u*n*l-e*h*l-o*n*d+e*a*d)*R,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+n,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,u=o+o,h=a+a,d=s*c,p=s*u,g=s*h,S=o*u,m=o*h,f=a*h,T=l*c,E=l*u,v=l*h,C=n.x,w=n.y,R=n.z;return r[0]=(1-(S+f))*C,r[1]=(p+v)*C,r[2]=(g-E)*C,r[3]=0,r[4]=(p-v)*w,r[5]=(1-(d+f))*w,r[6]=(m+T)*w,r[7]=0,r[8]=(g+E)*R,r[9]=(m-T)*R,r[10]=(1-(d+S))*R,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=_i.set(r[0],r[1],r[2]).length();const o=_i.set(r[4],r[5],r[6]).length(),a=_i.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],Ke.copy(this);const c=1/s,u=1/o,h=1/a;return Ke.elements[0]*=c,Ke.elements[1]*=c,Ke.elements[2]*=c,Ke.elements[4]*=u,Ke.elements[5]*=u,Ke.elements[6]*=u,Ke.elements[8]*=h,Ke.elements[9]*=h,Ke.elements[10]*=h,e.setFromRotationMatrix(Ke),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=ln,l=!1){const c=this.elements,u=2*s/(e-t),h=2*s/(n-r),d=(e+t)/(e-t),p=(n+r)/(n-r);let g,S;if(l)g=s/(o-s),S=o*s/(o-s);else if(a===ln)g=-(o+s)/(o-s),S=-2*o*s/(o-s);else if(a===rs)g=-o/(o-s),S=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=ln,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-r),d=-(e+t)/(e-t),p=-(n+r)/(n-r);let g,S;if(l)g=1/(o-s),S=o/(o-s);else if(a===ln)g=-2/(o-s),S=-(o+s)/(o-s);else if(a===rs)g=-1/(o-s),S=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const _i=new L,Ke=new le,sh=new L(0,0,0),oh=new L(1,1,1),Dn=new L,Ur=new L,ze=new L,Wa=new le,Xa=new xr;class fn{constructor(t=0,e=0,n=0,r=fn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],p=r[10];switch(e){case"XYZ":this._y=Math.asin(zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-zt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Wa.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Wa,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xa.setFromEuler(this),this.setFromQuaternion(Xa,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fn.DEFAULT_ORDER="XYZ";class ra{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ah=0;const qa=new L,vi=new xr,_n=new le,Ir=new L,qi=new L,lh=new L,ch=new xr,Ya=new L(1,0,0),Za=new L(0,1,0),Ja=new L(0,0,1),$a={type:"added"},uh={type:"removed"},xi={type:"childadded",child:null},Rs={type:"childremoved",child:null};class Ee extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ah++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ee.DEFAULT_UP.clone();const t=new L,e=new fn,n=new xr,r=new L(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new le},normalMatrix:{value:new Nt}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=Ee.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ra,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.multiply(vi),this}rotateOnWorldAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.premultiply(vi),this}rotateX(t){return this.rotateOnAxis(Ya,t)}rotateY(t){return this.rotateOnAxis(Za,t)}rotateZ(t){return this.rotateOnAxis(Ja,t)}translateOnAxis(t,e){return qa.copy(t).applyQuaternion(this.quaternion),this.position.add(qa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ya,t)}translateY(t){return this.translateOnAxis(Za,t)}translateZ(t){return this.translateOnAxis(Ja,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ir.copy(t):Ir.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(qi,Ir,this.up):_n.lookAt(Ir,qi,this.up),this.quaternion.setFromRotationMatrix(_n),r&&(_n.extractRotation(r.matrixWorld),vi.setFromRotationMatrix(_n),this.quaternion.premultiply(vi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($a),xi.child=t,this.dispatchEvent(xi),xi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(uh),Rs.child=t,this.dispatchEvent(Rs),Rs.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),_n.multiply(t.parent.matrixWorld)),t.applyMatrix4(_n),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($a),xi.child=t,this.dispatchEvent(xi),xi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,t,lh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,ch,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Ee.DEFAULT_UP=new L(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const je=new L,vn=new L,Cs=new L,xn=new L,Mi=new L,Si=new L,Ka=new L,Ps=new L,Ls=new L,Ds=new L,Us=new jt,Is=new jt,Ns=new jt;class tn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),je.subVectors(t,e),r.cross(je);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){je.subVectors(r,e),vn.subVectors(n,e),Cs.subVectors(t,e);const o=je.dot(je),a=je.dot(vn),l=je.dot(Cs),c=vn.dot(vn),u=vn.dot(Cs),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,p=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-p-g,g,p)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(t,e,n,r,s,o,a,l){return this.getBarycoord(t,e,n,r,xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,xn.x),l.addScaledVector(o,xn.y),l.addScaledVector(a,xn.z),l)}static getInterpolatedAttribute(t,e,n,r,s,o){return Us.setScalar(0),Is.setScalar(0),Ns.setScalar(0),Us.fromBufferAttribute(t,e),Is.fromBufferAttribute(t,n),Ns.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(Us,s.x),o.addScaledVector(Is,s.y),o.addScaledVector(Ns,s.z),o}static isFrontFacing(t,e,n,r){return je.subVectors(n,e),vn.subVectors(t,e),je.cross(vn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return je.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),je.cross(vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return tn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return tn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;Mi.subVectors(r,n),Si.subVectors(s,n),Ps.subVectors(t,n);const l=Mi.dot(Ps),c=Si.dot(Ps);if(l<=0&&c<=0)return e.copy(n);Ls.subVectors(t,r);const u=Mi.dot(Ls),h=Si.dot(Ls);if(u>=0&&h<=u)return e.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Mi,o);Ds.subVectors(t,s);const p=Mi.dot(Ds),g=Si.dot(Ds);if(g>=0&&p<=g)return e.copy(s);const S=p*c-l*g;if(S<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Si,a);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return Ka.subVectors(s,r),a=(h-u)/(h-u+(p-g)),e.copy(r).addScaledVector(Ka,a);const f=1/(m+S+d);return o=S*f,a=d*f,e.copy(n).addScaledVector(Mi,o).addScaledVector(Si,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const cc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function Fs(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ve){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,qt.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=qt.workingColorSpace){if(t=ea(t,1),e=zt(e,0,1),n=zt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Fs(o,s,t+1/3),this.g=Fs(o,s,t),this.b=Fs(o,s,t-1/3)}return qt.colorSpaceToWorking(this,r),this}setStyle(t,e=Ve){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ve){const n=cc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Tn(t.r),this.g=Tn(t.g),this.b=Tn(t.b),this}copyLinearToSRGB(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ve){return qt.workingToColorSpace(be.copy(this),t),Math.round(zt(be.r*255,0,255))*65536+Math.round(zt(be.g*255,0,255))*256+Math.round(zt(be.b*255,0,255))}getHexString(t=Ve){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qt.workingColorSpace){qt.workingToColorSpace(be.copy(this),e);const n=be.r,r=be.g,s=be.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-n)/h+2;break;case s:l=(n-r)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=qt.workingColorSpace){return qt.workingToColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=Ve){qt.workingToColorSpace(be.copy(this),t);const e=be.r,n=be.g,r=be.b;return t!==Ve?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(Nr);const n=er(Un.h,Nr.h,e),r=er(Un.s,Nr.s,e),s=er(Un.l,Nr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new Wt;Wt.NAMES=cc;let hh=0;class Sr extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hh++}),this.uuid=ci(),this.name="",this.type="Material",this.blending=Ri,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qs,this.blendDst=to,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Li,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ri&&(n.blending=this.blending),this.side!==Hn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Qs&&(n.blendSrc=this.blendSrc),this.blendDst!==to&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Li&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class uc extends Sr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=Yl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ge=new L,Fr=new ft;let fh=0;class un{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:fh++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Oa,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fr.fromBufferAttribute(this,e),Fr.applyMatrix3(t),this.setXY(e,Fr.x,Fr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=bi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Re(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=bi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=bi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=bi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=bi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),n=Re(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),n=Re(n,this.array),r=Re(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),n=Re(n,this.array),r=Re(r,this.array),s=Re(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Oa&&(t.usage=this.usage),t}}class hc extends un{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class fc extends un{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class me extends un{constructor(t,e,n){super(new Float32Array(t),e,n)}}let dh=0;const qe=new le,Os=new Ee,yi=new L,He=new Mr,Yi=new Mr,Se=new L;class Ge extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:dh++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(oc(t)?fc:hc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Nt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return qe.makeRotationFromQuaternion(t),this.applyMatrix4(qe),this}rotateX(t){return qe.makeRotationX(t),this.applyMatrix4(qe),this}rotateY(t){return qe.makeRotationY(t),this.applyMatrix4(qe),this}rotateZ(t){return qe.makeRotationZ(t),this.applyMatrix4(qe),this}translate(t,e,n){return qe.makeTranslation(t,e,n),this.applyMatrix4(qe),this}scale(t,e,n){return qe.makeScale(t,e,n),this.applyMatrix4(qe),this}lookAt(t){return Os.lookAt(t),Os.updateMatrix(),this.applyMatrix4(Os.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yi).negate(),this.translate(yi.x,yi.y,yi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new me(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];He.setFromBufferAttribute(s),this.morphTargetsRelative?(Se.addVectors(this.boundingBox.min,He.min),this.boundingBox.expandByPoint(Se),Se.addVectors(this.boundingBox.max,He.max),this.boundingBox.expandByPoint(Se)):(this.boundingBox.expandByPoint(He.min),this.boundingBox.expandByPoint(He.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ia);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(He.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Yi.setFromBufferAttribute(a),this.morphTargetsRelative?(Se.addVectors(He.min,Yi.min),He.expandByPoint(Se),Se.addVectors(He.max,Yi.max),He.expandByPoint(Se)):(He.expandByPoint(Yi.min),He.expandByPoint(Yi.max))}He.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)Se.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Se));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Se.fromBufferAttribute(a,c),l&&(yi.fromBufferAttribute(t,c),Se.add(yi)),r=Math.max(r,n.distanceToSquared(Se))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new un(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let U=0;U<n.count;U++)a[U]=new L,l[U]=new L;const c=new L,u=new L,h=new L,d=new ft,p=new ft,g=new ft,S=new L,m=new L;function f(U,y,M){c.fromBufferAttribute(n,U),u.fromBufferAttribute(n,y),h.fromBufferAttribute(n,M),d.fromBufferAttribute(s,U),p.fromBufferAttribute(s,y),g.fromBufferAttribute(s,M),u.sub(c),h.sub(c),p.sub(d),g.sub(d);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(S.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(P),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(P),a[U].add(S),a[y].add(S),a[M].add(S),l[U].add(m),l[y].add(m),l[M].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let U=0,y=T.length;U<y;++U){const M=T[U],P=M.start,F=M.count;for(let H=P,q=P+F;H<q;H+=3)f(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const E=new L,v=new L,C=new L,w=new L;function R(U){C.fromBufferAttribute(r,U),w.copy(C);const y=a[U];E.copy(y),E.sub(C.multiplyScalar(C.dot(y))).normalize(),v.crossVectors(w,y);const P=v.dot(l[U])<0?-1:1;o.setXYZW(U,E.x,E.y,E.z,P)}for(let U=0,y=T.length;U<y;++U){const M=T[U],P=M.start,F=M.count;for(let H=P,q=P+F;H<q;H+=3)R(t.getX(H+0)),R(t.getX(H+1)),R(t.getX(H+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new un(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const r=new L,s=new L,o=new L,a=new L,l=new L,c=new L,u=new L,h=new L;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),S=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,S),o.fromBufferAttribute(e,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Se.fromBufferAttribute(t,e),Se.normalize(),t.setXYZ(e,Se.x,Se.y,Se.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let p=0,g=0;for(let S=0,m=l.length;S<m;S++){a.isInterleavedBufferAttribute?p=l[S]*a.data.stride+a.offset:p=l[S]*u;for(let f=0;f<u;f++)d[g++]=c[p++]}return new un(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ge,n=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=t(d,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(r[l]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ja=new le,Zn=new lc,Or=new ia,Qa=new L,Br=new L,zr=new L,Hr=new L,Bs=new L,Vr=new L,tl=new L,kr=new L;class cn extends Ee{constructor(t=new Ge,e=new uc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){Vr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Bs.fromBufferAttribute(h,t),o?Vr.addScaledVector(Bs,u):Vr.addScaledVector(Bs.sub(e),u))}e.add(Vr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(s),Zn.copy(t.ray).recast(t.near),!(Or.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Or,Qa)===null||Zn.origin.distanceToSquared(Qa)>(t.far-t.near)**2))&&(ja.copy(s).invert(),Zn.copy(t.ray).applyMatrix4(ja),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,S=d.length;g<S;g++){const m=d[g],f=o[m.materialIndex],T=Math.max(m.start,p.start),E=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let v=T,C=E;v<C;v+=3){const w=a.getX(v),R=a.getX(v+1),U=a.getX(v+2);r=Gr(this,f,t,n,c,u,h,w,R,U),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,p.start),S=Math.min(a.count,p.start+p.count);for(let m=g,f=S;m<f;m+=3){const T=a.getX(m),E=a.getX(m+1),v=a.getX(m+2);r=Gr(this,o,t,n,c,u,h,T,E,v),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,S=d.length;g<S;g++){const m=d[g],f=o[m.materialIndex],T=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=T,C=E;v<C;v+=3){const w=v,R=v+1,U=v+2;r=Gr(this,f,t,n,c,u,h,w,R,U),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,p.start),S=Math.min(l.count,p.start+p.count);for(let m=g,f=S;m<f;m+=3){const T=m,E=m+1,v=m+2;r=Gr(this,o,t,n,c,u,h,T,E,v),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function ph(i,t,e,n,r,s,o,a){let l;if(t.side===Ne?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,t.side===Hn,a),l===null)return null;kr.copy(a),kr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(kr);return c<e.near||c>e.far?null:{distance:c,point:kr.clone(),object:i}}function Gr(i,t,e,n,r,s,o,a,l,c){i.getVertexPosition(a,Br),i.getVertexPosition(l,zr),i.getVertexPosition(c,Hr);const u=ph(i,t,e,n,Br,zr,Hr,tl);if(u){const h=new L;tn.getBarycoord(tl,Br,zr,Hr,h),r&&(u.uv=tn.getInterpolatedAttribute(r,a,l,c,h,new ft)),s&&(u.uv1=tn.getInterpolatedAttribute(s,a,l,c,h,new ft)),o&&(u.normal=tn.getInterpolatedAttribute(o,a,l,c,h,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new L,materialIndex:0};tn.getNormal(Br,zr,Hr,d.normal),u.face=d,u.barycoord=h}return u}class zi extends Ge{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,p=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(u,3)),this.setAttribute("uv",new me(h,2));function g(S,m,f,T,E,v,C,w,R,U,y){const M=v/R,P=C/U,F=v/2,H=C/2,q=w/2,W=R+1,X=U+1;let $=0,V=0;const st=new L;for(let ut=0;ut<X;ut++){const Tt=ut*P-H;for(let Ht=0;Ht<W;Ht++){const ne=Ht*M-F;st[S]=ne*T,st[m]=Tt*E,st[f]=q,c.push(st.x,st.y,st.z),st[S]=0,st[m]=0,st[f]=w>0?1:-1,u.push(st.x,st.y,st.z),h.push(Ht/R),h.push(1-ut/U),$+=1}}for(let ut=0;ut<U;ut++)for(let Tt=0;Tt<R;Tt++){const Ht=d+Tt+W*ut,ne=d+Tt+W*(ut+1),se=d+(Tt+1)+W*(ut+1),Zt=d+(Tt+1)+W*ut;l.push(Ht,ne,Zt),l.push(ne,se,Zt),V+=6}a.addGroup(p,V,y),p+=V,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ni(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Ce(i){const t={};for(let e=0;e<i.length;e++){const n=Ni(i[e]);for(const r in n)t[r]=n[r]}return t}function mh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function dc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}const gh={clone:Ni,merge:Ce};var _h=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends Sr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_h,this.fragmentShader=vh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ni(t.uniforms),this.uniformsGroups=mh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class pc extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const In=new L,el=new ft,nl=new ft;class ke extends pc{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=hr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(tr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return hr*2*Math.atan(Math.tan(tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(In.x,In.y).multiplyScalar(-t/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(In.x,In.y).multiplyScalar(-t/In.z)}getViewSize(t,e){return this.getViewBounds(t,el,nl),e.subVectors(nl,el)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(tr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,e-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ei=-90,Ti=1;class xh extends Ee{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new ke(Ei,Ti,t,e);r.layers=this.layers,this.add(r);const s=new ke(Ei,Ti,t,e);s.layers=this.layers,this.add(s);const o=new ke(Ei,Ti,t,e);o.layers=this.layers,this.add(o);const a=new ke(Ei,Ti,t,e);a.layers=this.layers,this.add(a);const l=new ke(Ei,Ti,t,e);l.layers=this.layers,this.add(l);const c=new ke(Ei,Ti,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===ln)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===rs)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=S,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(h,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class mc extends Fe{constructor(t=[],e=Di,n,r,s,o,a,l,c,u){super(t,e,n,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Mh extends ai{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new mc(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new zi(5,5,5),s=new Vn({name:"CubemapFromEquirect",uniforms:Ni(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ne,blending:Bn});s.uniforms.tEquirect.value=e;const o=new cn(r,s),a=e.minFilter;return e.minFilter===ii&&(e.minFilter=an),new xh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}class Ie extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Sh={type:"move"};class zs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const S of t.hand.values()){const m=e.getJointPose(S,n),f=this._getHandJoint(c,S);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Sh)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ie;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class sa{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Wt(t),this.density=e}clone(){return new sa(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class yh extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Hs=new L,Eh=new L,Th=new Nt;class jn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Hs.subVectors(n,e).cross(Eh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Hs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Th.getNormalMatrix(t),r=this.coplanarPoint(Hs).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new ia,Ah=new ft(.5,.5),Wr=new L;class oa{constructor(t=new jn,e=new jn,n=new jn,r=new jn,s=new jn,o=new jn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ln,n=!1){const r=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],p=s[7],g=s[8],S=s[9],m=s[10],f=s[11],T=s[12],E=s[13],v=s[14],C=s[15];if(r[0].setComponents(c-o,p-u,f-g,C-T).normalize(),r[1].setComponents(c+o,p+u,f+g,C+T).normalize(),r[2].setComponents(c+a,p+h,f+S,C+E).normalize(),r[3].setComponents(c-a,p-h,f-S,C-E).normalize(),n)r[4].setComponents(l,d,m,v).normalize(),r[5].setComponents(c-l,p-d,f-m,C-v).normalize();else if(r[4].setComponents(c-l,p-d,f-m,C-v).normalize(),e===ln)r[5].setComponents(c+l,p+d,f+m,C+v).normalize();else if(e===rs)r[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(t){Jn.center.set(0,0,0);const e=Ah.distanceTo(t.center);return Jn.radius=.7071067811865476+e,Jn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Wr.x=r.normal.x>0?t.max.x:t.min.x,Wr.y=r.normal.y>0?t.max.y:t.min.y,Wr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class gc extends Fe{constructor(t,e,n=oi,r,s,o,a=nn,l=nn,c,u=cr,h=1){if(u!==cr&&u!==ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,r,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new na(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class _c extends Fe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class us extends Ge{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],p=[];let g=0;const S=[],m=n/2;let f=0;T(),o===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new me(h,3)),this.setAttribute("normal",new me(d,3)),this.setAttribute("uv",new me(p,2));function T(){const v=new L,C=new L;let w=0;const R=(e-t)/n;for(let U=0;U<=s;U++){const y=[],M=U/s,P=M*(e-t)+t;for(let F=0;F<=r;F++){const H=F/r,q=H*l+a,W=Math.sin(q),X=Math.cos(q);C.x=P*W,C.y=-M*n+m,C.z=P*X,h.push(C.x,C.y,C.z),v.set(W,R,X).normalize(),d.push(v.x,v.y,v.z),p.push(H,1-M),y.push(g++)}S.push(y)}for(let U=0;U<r;U++)for(let y=0;y<s;y++){const M=S[y][U],P=S[y+1][U],F=S[y+1][U+1],H=S[y][U+1];(t>0||y!==0)&&(u.push(M,P,H),w+=3),(e>0||y!==s-1)&&(u.push(P,F,H),w+=3)}c.addGroup(f,w,0),f+=w}function E(v){const C=g,w=new ft,R=new L;let U=0;const y=v===!0?t:e,M=v===!0?1:-1;for(let F=1;F<=r;F++)h.push(0,m*M,0),d.push(0,M,0),p.push(.5,.5),g++;const P=g;for(let F=0;F<=r;F++){const q=F/r*l+a,W=Math.cos(q),X=Math.sin(q);R.x=y*X,R.y=m*M,R.z=y*W,h.push(R.x,R.y,R.z),d.push(0,M,0),w.x=W*.5+.5,w.y=X*.5*M+.5,p.push(w.x,w.y),g++}for(let F=0;F<r;F++){const H=C+F,q=P+F;v===!0?u.push(q,q+1,H):u.push(q+1,q,H),U+=3}c.addGroup(f,U,v===!0?1:2),f+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new us(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class An extends us{constructor(t=1,e=1,n=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new An(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class aa extends Ge{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],o=[];a(r),c(n),u(),this.setAttribute("position",new me(s,3)),this.setAttribute("normal",new me(s.slice(),3)),this.setAttribute("uv",new me(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(T){const E=new L,v=new L,C=new L;for(let w=0;w<e.length;w+=3)p(e[w+0],E),p(e[w+1],v),p(e[w+2],C),l(E,v,C,T)}function l(T,E,v,C){const w=C+1,R=[];for(let U=0;U<=w;U++){R[U]=[];const y=T.clone().lerp(v,U/w),M=E.clone().lerp(v,U/w),P=w-U;for(let F=0;F<=P;F++)F===0&&U===w?R[U][F]=y:R[U][F]=y.clone().lerp(M,F/P)}for(let U=0;U<w;U++)for(let y=0;y<2*(w-U)-1;y++){const M=Math.floor(y/2);y%2===0?(d(R[U][M+1]),d(R[U+1][M]),d(R[U][M])):(d(R[U][M+1]),d(R[U+1][M+1]),d(R[U+1][M]))}}function c(T){const E=new L;for(let v=0;v<s.length;v+=3)E.x=s[v+0],E.y=s[v+1],E.z=s[v+2],E.normalize().multiplyScalar(T),s[v+0]=E.x,s[v+1]=E.y,s[v+2]=E.z}function u(){const T=new L;for(let E=0;E<s.length;E+=3){T.x=s[E+0],T.y=s[E+1],T.z=s[E+2];const v=m(T)/2/Math.PI+.5,C=f(T)/Math.PI+.5;o.push(v,1-C)}g(),h()}function h(){for(let T=0;T<o.length;T+=6){const E=o[T+0],v=o[T+2],C=o[T+4],w=Math.max(E,v,C),R=Math.min(E,v,C);w>.9&&R<.1&&(E<.2&&(o[T+0]+=1),v<.2&&(o[T+2]+=1),C<.2&&(o[T+4]+=1))}}function d(T){s.push(T.x,T.y,T.z)}function p(T,E){const v=T*3;E.x=t[v+0],E.y=t[v+1],E.z=t[v+2]}function g(){const T=new L,E=new L,v=new L,C=new L,w=new ft,R=new ft,U=new ft;for(let y=0,M=0;y<s.length;y+=9,M+=6){T.set(s[y+0],s[y+1],s[y+2]),E.set(s[y+3],s[y+4],s[y+5]),v.set(s[y+6],s[y+7],s[y+8]),w.set(o[M+0],o[M+1]),R.set(o[M+2],o[M+3]),U.set(o[M+4],o[M+5]),C.copy(T).add(E).add(v).divideScalar(3);const P=m(C);S(w,M+0,T,P),S(R,M+2,E,P),S(U,M+4,v,P)}}function S(T,E,v,C){C<0&&T.x===1&&(o[E]=T.x-1),v.x===0&&v.z===0&&(o[E]=C/2/Math.PI+.5)}function m(T){return Math.atan2(T.z,-T.x)}function f(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new aa(t.vertices,t.indices,t.radius,t.details)}}class dn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=n[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===o)return r/(s-1);const u=n[r],d=n[r+1]-u,p=(o-u)/d;return(r+p)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=e||(o.isVector2?new ft:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new L,r=[],s=[],o=[],a=new L,l=new le;for(let p=0;p<=t;p++){const g=p/t;r[p]=this.getTangentAt(g,new L)}s[0]=new L,o[0]=new L;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let p=1;p<=t;p++){if(s[p]=s[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(r[p-1],r[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(zt(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(r[p],s[p])}if(e===!0){let p=Math.acos(zt(s[0].dot(s[t]),-1,1));p/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(p=-p);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],p*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class la extends dn{constructor(t=0,e=0,n=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ft){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*u-p*h+this.aX,c=d*h+p*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class bh extends la{constructor(t,e,n,r,s,o){super(t,e,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ca(){let i=0,t=0,e=0,n=0;function r(s,o,a,l){i=s,t=a,e=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let d=(o-s)/c-(a-s)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,p*=u,r(o,a,d,p)},calc:function(s){const o=s*s,a=o*s;return i+t*s+e*o+n*a}}}const Xr=new L,Vs=new ca,ks=new ca,Gs=new ca;class wh extends dn{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new L){const n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(Xr.subVectors(r[0],r[1]).add(r[0]),c=Xr);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Xr.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Xr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),p),S=Math.pow(h.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(u),p);S<1e-4&&(S=1),g<1e-4&&(g=S),m<1e-4&&(m=S),Vs.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,S,m),ks.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,S,m),Gs.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,S,m)}else this.curveType==="catmullrom"&&(Vs.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),ks.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Gs.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(Vs.calc(l),ks.calc(l),Gs.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new L().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function il(i,t,e,n,r){const s=(n-t)*.5,o=(r-e)*.5,a=i*i,l=i*a;return(2*e-2*n+s+o)*l+(-3*e+3*n-2*s-o)*a+s*i+e}function Rh(i,t){const e=1-i;return e*e*t}function Ch(i,t){return 2*(1-i)*i*t}function Ph(i,t){return i*i*t}function nr(i,t,e,n){return Rh(i,t)+Ch(i,e)+Ph(i,n)}function Lh(i,t){const e=1-i;return e*e*e*t}function Dh(i,t){const e=1-i;return 3*e*e*i*t}function Uh(i,t){return 3*(1-i)*i*i*t}function Ih(i,t){return i*i*i*t}function ir(i,t,e,n,r){return Lh(i,t)+Dh(i,e)+Uh(i,n)+Ih(i,r)}class vc extends dn{constructor(t=new ft,e=new ft,n=new ft,r=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new ft){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(ir(t,r.x,s.x,o.x,a.x),ir(t,r.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Nh extends dn{constructor(t=new L,e=new L,n=new L,r=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new L){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(ir(t,r.x,s.x,o.x,a.x),ir(t,r.y,s.y,o.y,a.y),ir(t,r.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class xc extends dn{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fh extends dn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mc extends dn{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(nr(t,r.x,s.x,o.x),nr(t,r.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Oh extends dn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(nr(t,r.x,s.x,o.x),nr(t,r.y,s.y,o.y),nr(t,r.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sc extends dn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return n.set(il(a,l.x,c.x,u.x,h.x),il(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new ft().fromArray(r))}return this}}var rl=Object.freeze({__proto__:null,ArcCurve:bh,CatmullRomCurve3:wh,CubicBezierCurve:vc,CubicBezierCurve3:Nh,EllipseCurve:la,LineCurve:xc,LineCurve3:Fh,QuadraticBezierCurve:Mc,QuadraticBezierCurve3:Oh,SplineCurve:Sc});class Bh extends dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new rl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const o=r[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new rl[r.type]().fromJSON(r))}return this}}class sl extends Bh{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new xc(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new Mc(this.currentPoint.clone(),new ft(t,e),new ft(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,o){const a=new vc(this.currentPoint.clone(),new ft(t,e),new ft(n,r),new ft(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Sc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,r,s,o),this}absarc(t,e,n,r,s,o){return this.absellipse(t,e,n,n,r,s,o),this}ellipse(t,e,n,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,r,s,o,a,l),this}absellipse(t,e,n,r,s,o,a,l){const c=new la(t,e,n,r,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class yc extends sl{constructor(t){super(t),this.uuid=ci(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new sl().fromJSON(r))}return this}}function zh(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=Ec(i,0,r,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(n&&(s=Wh(i,t,s,e)),i.length>80*e){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=e;d<r;d+=e){const p=i[d],g=i[d+1];p<a&&(a=p),g<l&&(l=g),p>u&&(u=p),g>h&&(h=g)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return dr(s,o,e,a,l,c,0),o}function Ec(i,t,e,n,r){let s;if(r===ef(i,t,e,n)>0)for(let o=t;o<e;o+=n)s=ol(o/n|0,i[o],i[o+1],s);else for(let o=e-n;o>=t;o-=n)s=ol(o/n|0,i[o],i[o+1],s);return s&&Fi(s,s.next)&&(mr(s),s=s.next),s}function li(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Fi(e,e.next)||he(e.prev,e,e.next)===0)){if(mr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function dr(i,t,e,n,r,s,o){if(!i)return;!o&&s&&Jh(i,n,r,s);let a=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(s?Vh(i,n,r,s):Hh(i)){t.push(l.i,i.i,c.i),mr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=kh(li(i),t),dr(i,t,e,n,r,s,2)):o===2&&Gh(i,t,e,n,r,s):dr(li(i),t,e,n,r,s,1);break}}}function Hh(i){const t=i.prev,e=i,n=i.next;if(he(t,e,n)>=0)return!1;const r=t.x,s=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=Math.min(r,s,o),h=Math.min(a,l,c),d=Math.max(r,s,o),p=Math.max(a,l,c);let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=p&&$i(r,a,s,l,o,c,g.x,g.y)&&he(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Vh(i,t,e,n){const r=i.prev,s=i,o=i.next;if(he(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,d=o.y,p=Math.min(a,l,c),g=Math.min(u,h,d),S=Math.max(a,l,c),m=Math.max(u,h,d),f=Vo(p,g,t,e,n),T=Vo(S,m,t,e,n);let E=i.prevZ,v=i.nextZ;for(;E&&E.z>=f&&v&&v.z<=T;){if(E.x>=p&&E.x<=S&&E.y>=g&&E.y<=m&&E!==r&&E!==o&&$i(a,u,l,h,c,d,E.x,E.y)&&he(E.prev,E,E.next)>=0||(E=E.prevZ,v.x>=p&&v.x<=S&&v.y>=g&&v.y<=m&&v!==r&&v!==o&&$i(a,u,l,h,c,d,v.x,v.y)&&he(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;E&&E.z>=f;){if(E.x>=p&&E.x<=S&&E.y>=g&&E.y<=m&&E!==r&&E!==o&&$i(a,u,l,h,c,d,E.x,E.y)&&he(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;v&&v.z<=T;){if(v.x>=p&&v.x<=S&&v.y>=g&&v.y<=m&&v!==r&&v!==o&&$i(a,u,l,h,c,d,v.x,v.y)&&he(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function kh(i,t){let e=i;do{const n=e.prev,r=e.next.next;!Fi(n,r)&&Ac(n,e,e.next,r)&&pr(n,r)&&pr(r,n)&&(t.push(n.i,e.i,r.i),mr(e),mr(e.next),e=i=r),e=e.next}while(e!==i);return li(e)}function Gh(i,t,e,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&jh(o,a)){let l=bc(o,a);o=li(o,o.next),l=li(l,l.next),dr(o,t,e,n,r,s,0),dr(l,t,e,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function Wh(i,t,e,n){const r=[];for(let s=0,o=t.length;s<o;s++){const a=t[s]*n,l=s<o-1?t[s+1]*n:i.length,c=Ec(i,a,l,n,!1);c===c.next&&(c.steiner=!0),r.push(Kh(c))}r.sort(Xh);for(let s=0;s<r.length;s++)e=qh(r[s],e);return e}function Xh(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(t.next.y-t.y)/(t.next.x-t.x);e=n-r}return e}function qh(i,t){const e=Yh(i,t);if(!e)return t;const n=bc(e,i);return li(n,n.next),li(e,e.next)}function Yh(i,t){let e=t;const n=i.x,r=i.y;let s=-1/0,o;if(Fi(i,e))return e;do{if(Fi(i,e.next))return e.next;if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const h=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>s&&(s=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let u=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Tc(r<c?n:s,r,l,c,r<c?s:n,r,e.x,e.y)){const h=Math.abs(r-e.y)/(n-e.x);pr(e,i)&&(h<u||h===u&&(e.x>o.x||e.x===o.x&&Zh(o,e)))&&(o=e,u=h)}e=e.next}while(e!==a);return o}function Zh(i,t){return he(i.prev,i,t.prev)<0&&he(t.next,i,i.next)<0}function Jh(i,t,e,n){let r=i;do r.z===0&&(r.z=Vo(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,$h(r)}function $h(i){let t,e=1;do{let n=i,r;i=null;let s=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(r=n,n=n.nextZ,a--):(r=o,o=o.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=o}s.nextZ=null,e*=2}while(t>1);return i}function Vo(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Kh(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Tc(i,t,e,n,r,s,o,a){return(r-o)*(t-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(n-a)}function $i(i,t,e,n,r,s,o,a){return!(i===o&&t===a)&&Tc(i,t,e,n,r,s,o,a)}function jh(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Qh(i,t)&&(pr(i,t)&&pr(t,i)&&tf(i,t)&&(he(i.prev,i,t.prev)||he(i,t.prev,t))||Fi(i,t)&&he(i.prev,i,i.next)>0&&he(t.prev,t,t.next)>0)}function he(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Fi(i,t){return i.x===t.x&&i.y===t.y}function Ac(i,t,e,n){const r=Yr(he(i,t,e)),s=Yr(he(i,t,n)),o=Yr(he(e,n,i)),a=Yr(he(e,n,t));return!!(r!==s&&o!==a||r===0&&qr(i,e,t)||s===0&&qr(i,n,t)||o===0&&qr(e,i,n)||a===0&&qr(e,t,n))}function qr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Yr(i){return i>0?1:i<0?-1:0}function Qh(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Ac(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function pr(i,t){return he(i.prev,i,i.next)<0?he(i,t,i.next)>=0&&he(i,i.prev,t)>=0:he(i,t,i.prev)<0||he(i,i.next,t)<0}function tf(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function bc(i,t){const e=ko(i.i,i.x,i.y),n=ko(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function ol(i,t,e,n){const r=ko(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function mr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ko(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ef(i,t,e,n){let r=0;for(let s=t,o=e-n;s<e;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}class nf{static triangulate(t,e,n=2){return zh(t,e,n)}}class rr{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return rr.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];al(t),ll(n,t);let o=t.length;e.forEach(al);for(let l=0;l<e.length;l++)r.push(o),o+=e[l].length,ll(n,e[l]);const a=nf.triangulate(n,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function al(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function ll(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class ua extends aa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ua(t.radius,t.detail)}}class yr extends Ge{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(r),c=a+1,u=l+1,h=t/a,d=e/l,p=[],g=[],S=[],m=[];for(let f=0;f<u;f++){const T=f*d-o;for(let E=0;E<c;E++){const v=E*h-s;g.push(v,-T,0),S.push(0,0,1),m.push(E/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let T=0;T<a;T++){const E=T+c*f,v=T+c*(f+1),C=T+1+c*(f+1),w=T+1+c*f;p.push(E,v,w),p.push(v,C,w)}this.setIndex(p),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(S,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yr(t.width,t.height,t.widthSegments,t.heightSegments)}}class ha extends Ge{constructor(t=new yc([new ft(0,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],r=[],s=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let u=0;u<t.length;u++)c(t[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new me(r,3)),this.setAttribute("normal",new me(s,3)),this.setAttribute("uv",new me(o,2));function c(u){const h=r.length/3,d=u.extractPoints(e);let p=d.shape;const g=d.holes;rr.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,f=g.length;m<f;m++){const T=g[m];rr.isClockWise(T)===!0&&(g[m]=T.reverse())}const S=rr.triangulateShape(p,g);for(let m=0,f=g.length;m<f;m++){const T=g[m];p=p.concat(T)}for(let m=0,f=p.length;m<f;m++){const T=p[m];r.push(T.x,T.y,0),s.push(0,0,1),o.push(T.x,T.y)}for(let m=0,f=S.length;m<f;m++){const T=S[m],E=T[0]+h,v=T[1]+h,C=T[2]+h;n.push(E,v,C),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return rf(e,t)}static fromJSON(t,e){const n=[];for(let r=0,s=t.shapes.length;r<s;r++){const o=e[t.shapes[r]];n.push(o)}return new ha(n,t.curveSegments)}}function rf(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const r=i[e];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t}class fa extends Ge{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const o=[],a=[],l=[],c=[],u=new L,h=new L,d=new L;for(let p=0;p<=n;p++)for(let g=0;g<=r;g++){const S=g/r*s,m=p/n*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(S),h.y=(t+e*Math.cos(m))*Math.sin(S),h.z=e*Math.sin(m),a.push(h.x,h.y,h.z),u.x=t*Math.cos(S),u.y=t*Math.sin(S),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/r),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=r;g++){const S=(r+1)*p+g-1,m=(r+1)*(p-1)+g-1,f=(r+1)*(p-1)+g,T=(r+1)*p+g;o.push(S,m,T),o.push(m,f,T)}this.setIndex(o),this.setAttribute("position",new me(a,3)),this.setAttribute("normal",new me(l,3)),this.setAttribute("uv",new me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fa(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class sf extends Sr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class of extends Sr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Tu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class af extends Sr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class hs extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class lf extends hs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ws=new le,cl=new L,ul=new L;class wc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.mapType=hn,this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new oa,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;cl.setFromMatrixPosition(t.matrixWorld),e.position.copy(cl),ul.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ul),e.updateMatrixWorld(),Ws.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ws,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ws)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const hl=new le,Zi=new L,Xs=new L;class cf extends wc{constructor(){super(new ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ft(4,2),this._viewportCount=6,this._viewports=[new jt(2,1,1,1),new jt(0,1,1,1),new jt(3,1,1,1),new jt(1,1,1,1),new jt(3,0,1,1),new jt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Zi.setFromMatrixPosition(t.matrixWorld),n.position.copy(Zi),Xs.copy(n.position),Xs.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Xs),n.updateMatrixWorld(),r.makeTranslation(-Zi.x,-Zi.y,-Zi.z),hl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hl,n.coordinateSystem,n.reversedDepth)}}class uf extends hs{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new cf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Rc extends pc{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class hf extends wc{constructor(){super(new Rc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ff extends hs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new hf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class df extends hs{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class pf extends ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class mf{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const fl=new le;class gf{constructor(t,e,n=0,r=1/0){this.ray=new lc(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new ra,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return fl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fl),this}intersectObject(t,e=!0,n=[]){return Go(t,this,n,e),n.sort(dl),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)Go(t[r],this,n,e);return n.sort(dl),n}}function dl(i,t){return i.distance-t.distance}function Go(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)Go(s[o],t,e,!0)}}function pl(i,t,e,n){const r=_f(n);switch(e){case tc:return i*t;case nc:return i*t/r.components*r.byteLength;case jo:return i*t/r.components*r.byteLength;case ic:return i*t*2/r.components*r.byteLength;case Qo:return i*t*2/r.components*r.byteLength;case ec:return i*t*3/r.components*r.byteLength;case en:return i*t*4/r.components*r.byteLength;case ta:return i*t*4/r.components*r.byteLength;case jr:case Qr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ts:case es:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case po:case go:return Math.max(i,16)*Math.max(t,8)/4;case fo:case mo:return Math.max(i,8)*Math.max(t,8)/2;case _o:case vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case So:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case yo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case To:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ao:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case bo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case wo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ro:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Co:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Po:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Lo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Do:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Uo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Io:case No:case Fo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Oo:case Bo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case zo:case Ho:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function _f(i){switch(i){case hn:case $l:return{byteLength:1,components:1};case ar:case Kl:case vr:return{byteLength:2,components:1};case $o:case Ko:return{byteLength:2,components:4};case oi:case Jo:case yn:return{byteLength:4,components:1};case jl:case Ql:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zo);function Cc(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function vf(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<h.length;p++){const g=h[d],S=h[p];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++d,h[d]=S)}h.length=d+1;for(let p=0,g=h.length;p<g;p++){const S=h[p];i.bufferSubData(c,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var xf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Sf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ef=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Af=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,bf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Rf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Df=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Uf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ff=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,kf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Gf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Wf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Yf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jf="gl_FragColor = linearToOutputTexel( gl_FragColor );",$f=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,jf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Qf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,td=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ed=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,id=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,od=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ad=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ld=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ud=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,hd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,md=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_d=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Md=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ed=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Td=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ad=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Rd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ld=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Dd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ud=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Id=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Nd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Od=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Bd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Vd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,kd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Yd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Zd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$d=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Qd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ep=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,np=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ip=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,rp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,op=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ap=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,up=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,dp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,_p=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ap=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,bp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,wp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Rp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Up=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ip=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Np=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Op=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Hp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Gp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Yp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$p=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Kp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ot={alphahash_fragment:xf,alphahash_pars_fragment:Mf,alphamap_fragment:Sf,alphamap_pars_fragment:yf,alphatest_fragment:Ef,alphatest_pars_fragment:Tf,aomap_fragment:Af,aomap_pars_fragment:bf,batching_pars_vertex:wf,batching_vertex:Rf,begin_vertex:Cf,beginnormal_vertex:Pf,bsdfs:Lf,iridescence_fragment:Df,bumpmap_pars_fragment:Uf,clipping_planes_fragment:If,clipping_planes_pars_fragment:Nf,clipping_planes_pars_vertex:Ff,clipping_planes_vertex:Of,color_fragment:Bf,color_pars_fragment:zf,color_pars_vertex:Hf,color_vertex:Vf,common:kf,cube_uv_reflection_fragment:Gf,defaultnormal_vertex:Wf,displacementmap_pars_vertex:Xf,displacementmap_vertex:qf,emissivemap_fragment:Yf,emissivemap_pars_fragment:Zf,colorspace_fragment:Jf,colorspace_pars_fragment:$f,envmap_fragment:Kf,envmap_common_pars_fragment:jf,envmap_pars_fragment:Qf,envmap_pars_vertex:td,envmap_physical_pars_fragment:hd,envmap_vertex:ed,fog_vertex:nd,fog_pars_vertex:id,fog_fragment:rd,fog_pars_fragment:sd,gradientmap_pars_fragment:od,lightmap_pars_fragment:ad,lights_lambert_fragment:ld,lights_lambert_pars_fragment:cd,lights_pars_begin:ud,lights_toon_fragment:fd,lights_toon_pars_fragment:dd,lights_phong_fragment:pd,lights_phong_pars_fragment:md,lights_physical_fragment:gd,lights_physical_pars_fragment:_d,lights_fragment_begin:vd,lights_fragment_maps:xd,lights_fragment_end:Md,logdepthbuf_fragment:Sd,logdepthbuf_pars_fragment:yd,logdepthbuf_pars_vertex:Ed,logdepthbuf_vertex:Td,map_fragment:Ad,map_pars_fragment:bd,map_particle_fragment:wd,map_particle_pars_fragment:Rd,metalnessmap_fragment:Cd,metalnessmap_pars_fragment:Pd,morphinstance_vertex:Ld,morphcolor_vertex:Dd,morphnormal_vertex:Ud,morphtarget_pars_vertex:Id,morphtarget_vertex:Nd,normal_fragment_begin:Fd,normal_fragment_maps:Od,normal_pars_fragment:Bd,normal_pars_vertex:zd,normal_vertex:Hd,normalmap_pars_fragment:Vd,clearcoat_normal_fragment_begin:kd,clearcoat_normal_fragment_maps:Gd,clearcoat_pars_fragment:Wd,iridescence_pars_fragment:Xd,opaque_fragment:qd,packing:Yd,premultiplied_alpha_fragment:Zd,project_vertex:Jd,dithering_fragment:$d,dithering_pars_fragment:Kd,roughnessmap_fragment:jd,roughnessmap_pars_fragment:Qd,shadowmap_pars_fragment:tp,shadowmap_pars_vertex:ep,shadowmap_vertex:np,shadowmask_pars_fragment:ip,skinbase_vertex:rp,skinning_pars_vertex:sp,skinning_vertex:op,skinnormal_vertex:ap,specularmap_fragment:lp,specularmap_pars_fragment:cp,tonemapping_fragment:up,tonemapping_pars_fragment:hp,transmission_fragment:fp,transmission_pars_fragment:dp,uv_pars_fragment:pp,uv_pars_vertex:mp,uv_vertex:gp,worldpos_vertex:_p,background_vert:vp,background_frag:xp,backgroundCube_vert:Mp,backgroundCube_frag:Sp,cube_vert:yp,cube_frag:Ep,depth_vert:Tp,depth_frag:Ap,distanceRGBA_vert:bp,distanceRGBA_frag:wp,equirect_vert:Rp,equirect_frag:Cp,linedashed_vert:Pp,linedashed_frag:Lp,meshbasic_vert:Dp,meshbasic_frag:Up,meshlambert_vert:Ip,meshlambert_frag:Np,meshmatcap_vert:Fp,meshmatcap_frag:Op,meshnormal_vert:Bp,meshnormal_frag:zp,meshphong_vert:Hp,meshphong_frag:Vp,meshphysical_vert:kp,meshphysical_frag:Gp,meshtoon_vert:Wp,meshtoon_frag:Xp,points_vert:qp,points_frag:Yp,shadow_vert:Zp,shadow_frag:Jp,sprite_vert:$p,sprite_frag:Kp},rt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},on={basic:{uniforms:Ce([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:Ce([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:Ce([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:Ce([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:Ce([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:Ce([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:Ce([rt.points,rt.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:Ce([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:Ce([rt.common,rt.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:Ce([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:Ce([rt.sprite,rt.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distanceRGBA:{uniforms:Ce([rt.common,rt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distanceRGBA_vert,fragmentShader:Ot.distanceRGBA_frag},shadow:{uniforms:Ce([rt.lights,rt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};on.physical={uniforms:Ce([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};const Zr={r:0,b:0,g:0},$n=new fn,jp=new le;function Qp(i,t,e,n,r,s,o){const a=new Wt(0);let l=s===!0?0:1,c,u,h=null,d=0,p=null;function g(E){let v=E.isScene===!0?E.background:null;return v&&v.isTexture&&(v=(E.backgroundBlurriness>0?e:t).get(v)),v}function S(E){let v=!1;const C=g(E);C===null?f(a,l):C&&C.isColor&&(f(C,1),v=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,v){const C=g(v);C&&(C.isCubeTexture||C.mapping===cs)?(u===void 0&&(u=new cn(new zi(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Ni(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:Ne,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,R,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),$n.copy(v.backgroundRotation),$n.x*=-1,$n.y*=-1,$n.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(jp.makeRotationFromEuler($n)),u.material.toneMapped=qt.getTransfer(C.colorSpace)!==Kt,(h!==C||d!==C.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,p=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new cn(new yr(2,2),new Vn({name:"BackgroundMaterial",uniforms:Ni(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=qt.getTransfer(C.colorSpace)!==Kt,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,v){E.getRGB(Zr,dc(i)),n.buffers.color.setClear(Zr.r,Zr.g,Zr.b,v,o)}function T(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,v=1){a.set(E),l=v,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,f(a,l)},render:S,addToRenderList:m,dispose:T}}function tm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,o=!1;function a(M,P,F,H,q){let W=!1;const X=h(H,F,P);s!==X&&(s=X,c(s.object)),W=p(M,H,F,q),W&&g(M,H,F,q),q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,v(M,P,F,H),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,P,F){const H=F.wireframe===!0;let q=n[M.id];q===void 0&&(q={},n[M.id]=q);let W=q[P.id];W===void 0&&(W={},q[P.id]=W);let X=W[H];return X===void 0&&(X=d(l()),W[H]=X),X}function d(M){const P=[],F=[],H=[];for(let q=0;q<e;q++)P[q]=0,F[q]=0,H[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:H,object:M,attributes:{},index:null}}function p(M,P,F,H){const q=s.attributes,W=P.attributes;let X=0;const $=F.getAttributes();for(const V in $)if($[V].location>=0){const ut=q[V];let Tt=W[V];if(Tt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(Tt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(Tt=M.instanceColor)),ut===void 0||ut.attribute!==Tt||Tt&&ut.data!==Tt.data)return!0;X++}return s.attributesNum!==X||s.index!==H}function g(M,P,F,H){const q={},W=P.attributes;let X=0;const $=F.getAttributes();for(const V in $)if($[V].location>=0){let ut=W[V];ut===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(ut=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(ut=M.instanceColor));const Tt={};Tt.attribute=ut,ut&&ut.data&&(Tt.data=ut.data),q[V]=Tt,X++}s.attributes=q,s.attributesNum=X,s.index=H}function S(){const M=s.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function m(M){f(M,0)}function f(M,P){const F=s.newAttributes,H=s.enabledAttributes,q=s.attributeDivisors;F[M]=1,H[M]===0&&(i.enableVertexAttribArray(M),H[M]=1),q[M]!==P&&(i.vertexAttribDivisor(M,P),q[M]=P)}function T(){const M=s.newAttributes,P=s.enabledAttributes;for(let F=0,H=P.length;F<H;F++)P[F]!==M[F]&&(i.disableVertexAttribArray(F),P[F]=0)}function E(M,P,F,H,q,W,X){X===!0?i.vertexAttribIPointer(M,P,F,q,W):i.vertexAttribPointer(M,P,F,H,q,W)}function v(M,P,F,H){S();const q=H.attributes,W=F.getAttributes(),X=P.defaultAttributeValues;for(const $ in W){const V=W[$];if(V.location>=0){let st=q[$];if(st===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(st=M.instanceColor)),st!==void 0){const ut=st.normalized,Tt=st.itemSize,Ht=t.get(st);if(Ht===void 0)continue;const ne=Ht.buffer,se=Ht.type,Zt=Ht.bytesPerElement,Y=se===i.INT||se===i.UNSIGNED_INT||st.gpuType===Jo;if(st.isInterleavedBufferAttribute){const K=st.data,pt=K.stride,Lt=st.offset;if(K.isInstancedInterleavedBuffer){for(let Et=0;Et<V.locationSize;Et++)f(V.location+Et,K.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Et=0;Et<V.locationSize;Et++)m(V.location+Et);i.bindBuffer(i.ARRAY_BUFFER,ne);for(let Et=0;Et<V.locationSize;Et++)E(V.location+Et,Tt/V.locationSize,se,ut,pt*Zt,(Lt+Tt/V.locationSize*Et)*Zt,Y)}else{if(st.isInstancedBufferAttribute){for(let K=0;K<V.locationSize;K++)f(V.location+K,st.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let K=0;K<V.locationSize;K++)m(V.location+K);i.bindBuffer(i.ARRAY_BUFFER,ne);for(let K=0;K<V.locationSize;K++)E(V.location+K,Tt/V.locationSize,se,ut,Tt*Zt,Tt/V.locationSize*K*Zt,Y)}}else if(X!==void 0){const ut=X[$];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(V.location,ut);break;case 3:i.vertexAttrib3fv(V.location,ut);break;case 4:i.vertexAttrib4fv(V.location,ut);break;default:i.vertexAttrib1fv(V.location,ut)}}}}T()}function C(){U();for(const M in n){const P=n[M];for(const F in P){const H=P[F];for(const q in H)u(H[q].object),delete H[q];delete P[F]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const P=n[M.id];for(const F in P){const H=P[F];for(const q in H)u(H[q].object),delete H[q];delete P[F]}delete n[M.id]}function R(M){for(const P in n){const F=n[P];if(F[M.id]===void 0)continue;const H=F[M.id];for(const q in H)u(H[q].object),delete H[q];delete F[M.id]}}function U(){y(),o=!0,s!==r&&(s=r,c(s.object))}function y(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:U,resetDefaultState:y,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:S,enableAttribute:m,disableUnusedAttributes:T}}function em(i,t,e){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];e.update(p,n,1)}function l(c,u,h,d){if(h===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let S=0;S<h;S++)g+=u[S]*d[S];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function nm(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==en&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const U=R===vr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==hn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==yn&&!U)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:T,maxVaryings:E,maxFragmentUniforms:v,vertexTextures:C,maxSamples:w}}function im(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new jn,a=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||n!==0||r;return r=d,n=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,p){const g=h.clippingPlanes,S=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const T=s?0:n,E=T*4;let v=f.clippingState||null;l.value=v,v=u(g,d,E,p);for(let C=0;C!==E;++C)v[C]=e[C];f.clippingState=v,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,p,g){const S=h!==null?h.length:0;let m=null;if(S!==0){if(m=l.value,g!==!0||m===null){const f=p+S*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<f)&&(m=new Float32Array(f));for(let E=0,v=p;E!==S;++E,v+=4)o.copy(h[E]).applyMatrix4(T,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,m}}function rm(i){let t=new WeakMap;function e(o,a){return a===lo?o.mapping=Di:a===co&&(o.mapping=Ui),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===lo||a===co)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Mh(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",r),e(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const wi=4,ml=[.125,.215,.35,.446,.526,.582],ei=20,qs=new Rc,gl=new Wt;let Ys=null,Zs=0,Js=0,$s=!1;const Qn=(1+Math.sqrt(5))/2,Ai=1/Qn,_l=[new L(-Qn,Ai,0),new L(Qn,Ai,0),new L(-Ai,0,Qn),new L(Ai,0,Qn),new L(0,Qn,-Ai),new L(0,Qn,Ai),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],sm=new L;class vl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:o=256,position:a=sm}=s;Ys=this._renderer.getRenderTarget(),Zs=this._renderer.getActiveCubeFace(),Js=this._renderer.getActiveMipmapLevel(),$s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,r,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ml(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ys,Zs,Js),this._renderer.xr.enabled=$s,t.scissorTest=!1,Jr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Di||t.mapping===Ui?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ys=this._renderer.getRenderTarget(),Zs=this._renderer.getActiveCubeFace(),Js=this._renderer.getActiveMipmapLevel(),$s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:an,minFilter:an,generateMipmaps:!1,type:vr,format:en,colorSpace:Ii,depthBuffer:!1},r=xl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xl(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=om(s)),this._blurMaterial=am(s,t,e)}return r}_compileMaterial(t){const e=new cn(this._lodPlanes[0],t);this._renderer.compile(e,qs)}_sceneToCubeUV(t,e,n,r,s){const l=new ke(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(gl),h.toneMapping=zn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const S=new uc({name:"PMREM.Background",side:Ne,depthWrite:!1,depthTest:!1}),m=new cn(new zi,S);let f=!1;const T=t.background;T?T.isColor&&(S.color.copy(T),t.background=null,f=!0):(S.color.copy(gl),f=!0);for(let E=0;E<6;E++){const v=E%3;v===0?(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[E],s.y,s.z)):v===1?(l.up.set(0,0,c[E]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[E],s.z)):(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[E]));const C=this._cubeSize;Jr(r,v*C,E>2?C:0,C,C),h.setRenderTarget(r),f&&h.render(m,l),h.render(t,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=d,t.background=T}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Di||t.mapping===Ui;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ml());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new cn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;Jr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,qs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=_l[(r-s-1)%_l.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new cn(this._lodPlanes[r],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*ei-1),S=s/g,m=isFinite(s)?1+Math.floor(u*S):ei;m>ei&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ei}`);const f=[];let T=0;for(let R=0;R<ei;++R){const U=R/S,y=Math.exp(-U*U/2);f.push(y),R===0?T+=y:R<m&&(T+=2*y)}for(let R=0;R<f.length;R++)f[R]=f[R]/T;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const v=this._sizeLods[r],C=3*v*(r>E-wi?r-E+wi:0),w=4*(this._cubeSize-v);Jr(e,C,w,3*v,2*v),l.setRenderTarget(e),l.render(h,qs)}}function om(i){const t=[],e=[],n=[];let r=i;const s=i-wi+1+ml.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>i-wi?l=ml[o-i+wi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,S=3,m=2,f=1,T=new Float32Array(S*g*p),E=new Float32Array(m*g*p),v=new Float32Array(f*g*p);for(let w=0;w<p;w++){const R=w%3*2/3-1,U=w>2?0:-1,y=[R,U,0,R+2/3,U,0,R+2/3,U+1,0,R,U,0,R+2/3,U+1,0,R,U+1,0];T.set(y,S*g*w),E.set(d,m*g*w);const M=[w,w,w,w,w,w];v.set(M,f*g*w)}const C=new Ge;C.setAttribute("position",new un(T,S)),C.setAttribute("uv",new un(E,m)),C.setAttribute("faceIndex",new un(v,f)),t.push(C),r>wi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function xl(i,t,e){const n=new ai(i,t,e);return n.texture.mapping=cs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Jr(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function am(i,t,e){const n=new Float32Array(ei),r=new L(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Ml(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Sl(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function da(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function lm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===lo||l===co,u=l===Di||l===Ui;if(c||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new vl(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(e===null&&(e=new vl(i)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function cm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&fr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function um(i,t,e,n){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(t.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const p in d)t.update(d[p],i.ARRAY_BUFFER)}function c(h){const d=[],p=h.index,g=h.attributes.position;let S=0;if(p!==null){const T=p.array;S=p.version;for(let E=0,v=T.length;E<v;E+=3){const C=T[E+0],w=T[E+1],R=T[E+2];d.push(C,w,w,R,R,C)}}else if(g!==void 0){const T=g.array;S=g.version;for(let E=0,v=T.length/3-1;E<v;E+=3){const C=E+0,w=E+1,R=E+2;d.push(C,w,w,R,R,C)}}else return;const m=new(oc(d)?fc:hc)(d,1);m.version=S;const f=s.get(h);f&&t.remove(f),s.set(h,m)}function u(h){const d=s.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function hm(i,t,e){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,s,d*o),e.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,s,d*o,g),e.update(p,n,g))}function u(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function h(d,p,g,S){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],S[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,d,0,S,0,g);let f=0;for(let T=0;T<g;T++)f+=p[T]*S[T];e.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function fm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function dm(i,t,e){const n=new WeakMap,r=new jt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let M=function(){U.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var p=M;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,S=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],T=a.morphAttributes.normal||[],E=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),S===!0&&(v=2),m===!0&&(v=3);let C=a.attributes.position.count*v,w=1;C>t.maxTextureSize&&(w=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const R=new Float32Array(C*w*4*h),U=new ac(R,C,w,h);U.type=yn,U.needsUpdate=!0;const y=v*4;for(let P=0;P<h;P++){const F=f[P],H=T[P],q=E[P],W=C*w*4*P;for(let X=0;X<F.count;X++){const $=X*y;g===!0&&(r.fromBufferAttribute(F,X),R[W+$+0]=r.x,R[W+$+1]=r.y,R[W+$+2]=r.z,R[W+$+3]=0),S===!0&&(r.fromBufferAttribute(H,X),R[W+$+4]=r.x,R[W+$+5]=r.y,R[W+$+6]=r.z,R[W+$+7]=0),m===!0&&(r.fromBufferAttribute(q,X),R[W+$+8]=r.x,R[W+$+9]=r.y,R[W+$+10]=r.z,R[W+$+11]=q.itemSize===4?r.w:1)}}d={count:h,texture:U,size:new ft(C,w)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const S=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",S),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function pm(i,t,e,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(r.get(h)!==c&&(t.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}const Pc=new Fe,yl=new gc(1,1),Lc=new ac,Dc=new ih,Uc=new mc,El=[],Tl=[],Al=new Float32Array(16),bl=new Float32Array(9),wl=new Float32Array(4);function Hi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=El[r];if(s===void 0&&(s=new Float32Array(r),El[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function fs(i,t){let e=Tl[t];e===void 0&&(e=new Int32Array(t),Tl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function mm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),ve(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),ve(e,t)}}function vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),ve(e,t)}}function xm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ve(e,t)}else{if(_e(e,n))return;wl.set(n),i.uniformMatrix2fv(this.addr,!1,wl),ve(e,n)}}function Mm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ve(e,t)}else{if(_e(e,n))return;bl.set(n),i.uniformMatrix3fv(this.addr,!1,bl),ve(e,n)}}function Sm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ve(e,t)}else{if(_e(e,n))return;Al.set(n),i.uniformMatrix4fv(this.addr,!1,Al),ve(e,n)}}function ym(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),ve(e,t)}}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),ve(e,t)}}function Am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),ve(e,t)}}function bm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),ve(e,t)}}function Rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),ve(e,t)}}function Cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),ve(e,t)}}function Pm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(yl.compareFunction=sc,s=yl):s=Pc,e.setTexture2D(t||s,r)}function Lm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Dc,r)}function Dm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Uc,r)}function Um(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Lc,r)}function Im(i){switch(i){case 5126:return mm;case 35664:return gm;case 35665:return _m;case 35666:return vm;case 35674:return xm;case 35675:return Mm;case 35676:return Sm;case 5124:case 35670:return ym;case 35667:case 35671:return Em;case 35668:case 35672:return Tm;case 35669:case 35673:return Am;case 5125:return bm;case 36294:return wm;case 36295:return Rm;case 36296:return Cm;case 35678:case 36198:case 36298:case 36306:case 35682:return Pm;case 35679:case 36299:case 36307:return Lm;case 35680:case 36300:case 36308:case 36293:return Dm;case 36289:case 36303:case 36311:case 36292:return Um}}function Nm(i,t){i.uniform1fv(this.addr,t)}function Fm(i,t){const e=Hi(t,this.size,2);i.uniform2fv(this.addr,e)}function Om(i,t){const e=Hi(t,this.size,3);i.uniform3fv(this.addr,e)}function Bm(i,t){const e=Hi(t,this.size,4);i.uniform4fv(this.addr,e)}function zm(i,t){const e=Hi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Hm(i,t){const e=Hi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Vm(i,t){const e=Hi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function km(i,t){i.uniform1iv(this.addr,t)}function Gm(i,t){i.uniform2iv(this.addr,t)}function Wm(i,t){i.uniform3iv(this.addr,t)}function Xm(i,t){i.uniform4iv(this.addr,t)}function qm(i,t){i.uniform1uiv(this.addr,t)}function Ym(i,t){i.uniform2uiv(this.addr,t)}function Zm(i,t){i.uniform3uiv(this.addr,t)}function Jm(i,t){i.uniform4uiv(this.addr,t)}function $m(i,t,e){const n=this.cache,r=t.length,s=fs(e,r);_e(n,s)||(i.uniform1iv(this.addr,s),ve(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Pc,s[o])}function Km(i,t,e){const n=this.cache,r=t.length,s=fs(e,r);_e(n,s)||(i.uniform1iv(this.addr,s),ve(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Dc,s[o])}function jm(i,t,e){const n=this.cache,r=t.length,s=fs(e,r);_e(n,s)||(i.uniform1iv(this.addr,s),ve(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Uc,s[o])}function Qm(i,t,e){const n=this.cache,r=t.length,s=fs(e,r);_e(n,s)||(i.uniform1iv(this.addr,s),ve(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Lc,s[o])}function tg(i){switch(i){case 5126:return Nm;case 35664:return Fm;case 35665:return Om;case 35666:return Bm;case 35674:return zm;case 35675:return Hm;case 35676:return Vm;case 5124:case 35670:return km;case 35667:case 35671:return Gm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return qm;case 36294:return Ym;case 36295:return Zm;case 36296:return Jm;case 35678:case 36198:case 36298:case 36306:case 35682:return $m;case 35679:case 36299:case 36307:return Km;case 35680:case 36300:case 36308:case 36293:return jm;case 36289:case 36303:case 36311:case 36292:return Qm}}class eg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Im(e.type)}}class ng{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tg(e.type)}}class ig{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const Ks=/(\w+)(\])?(\[|\.)?/g;function Rl(i,t){i.seq.push(t),i.map[t.id]=t}function rg(i,t,e){const n=i.name,r=n.length;for(Ks.lastIndex=0;;){const s=Ks.exec(n),o=Ks.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Rl(e,c===void 0?new eg(a,i,t):new ng(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new ig(a),Rl(e,h)),e=h}}}class ns{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);rg(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function Cl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const sg=37297;let og=0;function ag(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Pl=new Nt;function lg(i){qt._getMatrix(Pl,qt.workingColorSpace,i);const t=`mat3( ${Pl.elements.map(e=>e.toFixed(4))} )`;switch(qt.getTransfer(i)){case is:return[t,"LinearTransferOETF"];case Kt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ll(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+ag(i.getShaderSource(t),a)}else return s}function cg(i,t){const e=lg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function ug(i,t){let e;switch(t){case _u:e="Linear";break;case vu:e="Reinhard";break;case xu:e="Cineon";break;case Zl:e="ACESFilmic";break;case Su:e="AgX";break;case yu:e="Neutral";break;case Mu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const $r=new L;function hg(){qt.getLuminanceCoefficients($r);const i=$r.x.toFixed(4),t=$r.y.toFixed(4),e=$r.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ki).join(`
`)}function dg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function pg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ki(i){return i!==""}function Dl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ul(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wo(i){return i.replace(mg,_g)}const gg=new Map;function _g(i,t){let e=Ot[t];if(e===void 0){const n=gg.get(t);if(n!==void 0)e=Ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Wo(e)}const vg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Il(i){return i.replace(vg,xg)}function xg(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Nl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Mg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ql?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(t="SHADOWMAP_TYPE_VSM"),t}function Sg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Di:case Ui:t="ENVMAP_TYPE_CUBE";break;case cs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function yg(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ui&&(t="ENVMAP_MODE_REFRACTION"),t}function Eg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yl:t="ENVMAP_BLENDING_MULTIPLY";break;case mu:t="ENVMAP_BLENDING_MIX";break;case gu:t="ENVMAP_BLENDING_ADD";break}return t}function Tg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Ag(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Mg(e),c=Sg(e),u=yg(e),h=Eg(e),d=Tg(e),p=fg(e),g=dg(s),S=r.createProgram();let m,f,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ki).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ki).join(`
`),f.length>0&&(f+=`
`)):(m=[Nl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ki).join(`
`),f=[Nl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==zn?"#define TONE_MAPPING":"",e.toneMapping!==zn?Ot.tonemapping_pars_fragment:"",e.toneMapping!==zn?ug("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,cg("linearToOutputTexel",e.outputColorSpace),hg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ki).join(`
`)),o=Wo(o),o=Dl(o,e),o=Ul(o,e),a=Wo(a),a=Dl(a,e),a=Ul(a,e),o=Il(o),a=Il(a),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const E=T+m+o,v=T+f+a,C=Cl(r,r.VERTEX_SHADER,E),w=Cl(r,r.FRAGMENT_SHADER,v);r.attachShader(S,C),r.attachShader(S,w),e.index0AttributeName!==void 0?r.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function R(P){if(i.debug.checkShaderErrors){const F=r.getProgramInfoLog(S)||"",H=r.getShaderInfoLog(C)||"",q=r.getShaderInfoLog(w)||"",W=F.trim(),X=H.trim(),$=q.trim();let V=!0,st=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,S,C,w);else{const ut=Ll(r,C,"vertex"),Tt=Ll(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+W+`
`+ut+`
`+Tt)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(X===""||$==="")&&(st=!1);st&&(P.diagnostics={runnable:V,programLog:W,vertexShader:{log:X,prefix:m},fragmentShader:{log:$,prefix:f}})}r.deleteShader(C),r.deleteShader(w),U=new ns(r,S),y=pg(r,S)}let U;this.getUniforms=function(){return U===void 0&&R(this),U};let y;this.getAttributes=function(){return y===void 0&&R(this),y};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(S,sg)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=og++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=C,this.fragmentShader=w,this}let bg=0;class wg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Rg(t),e.set(t,n)),n}}class Rg{constructor(t){this.id=bg++,this.code=t,this.usedTimes=0}}function Cg(i,t,e,n,r,s,o){const a=new ra,l=new wg,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,M,P,F,H){const q=F.fog,W=H.geometry,X=y.isMeshStandardMaterial?F.environment:null,$=(y.isMeshStandardMaterial?e:t).get(y.envMap||X),V=$&&$.mapping===cs?$.image.height:null,st=g[y.type];y.precision!==null&&(p=r.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const ut=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Tt=ut!==void 0?ut.length:0;let Ht=0;W.morphAttributes.position!==void 0&&(Ht=1),W.morphAttributes.normal!==void 0&&(Ht=2),W.morphAttributes.color!==void 0&&(Ht=3);let ne,se,Zt,Y;if(st){const Jt=on[st];ne=Jt.vertexShader,se=Jt.fragmentShader}else ne=y.vertexShader,se=y.fragmentShader,l.update(y),Zt=l.getVertexShaderID(y),Y=l.getFragmentShaderID(y);const K=i.getRenderTarget(),pt=i.state.buffers.depth.getReversed(),Lt=H.isInstancedMesh===!0,Et=H.isBatchedMesh===!0,Gt=!!y.map,Te=!!y.matcap,b=!!$,oe=!!y.aoMap,Ut=!!y.lightMap,Ct=!!y.bumpMap,_t=!!y.normalMap,ae=!!y.displacementMap,vt=!!y.emissiveMap,Ft=!!y.metalnessMap,Me=!!y.roughnessMap,pe=y.anisotropy>0,A=y.clearcoat>0,_=y.dispersion>0,O=y.iridescence>0,G=y.sheen>0,J=y.transmission>0,k=pe&&!!y.anisotropyMap,yt=A&&!!y.clearcoatMap,nt=A&&!!y.clearcoatNormalMap,xt=A&&!!y.clearcoatRoughnessMap,Mt=O&&!!y.iridescenceMap,tt=O&&!!y.iridescenceThicknessMap,lt=G&&!!y.sheenColorMap,Rt=G&&!!y.sheenRoughnessMap,St=!!y.specularMap,ot=!!y.specularColorMap,It=!!y.specularIntensityMap,D=J&&!!y.transmissionMap,et=J&&!!y.thicknessMap,it=!!y.gradientMap,dt=!!y.alphaMap,j=y.alphaTest>0,Z=!!y.alphaHash,gt=!!y.extensions;let Dt=zn;y.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Dt=i.toneMapping);const ie={shaderID:st,shaderType:y.type,shaderName:y.name,vertexShader:ne,fragmentShader:se,defines:y.defines,customVertexShaderID:Zt,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Et,batchingColor:Et&&H._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&H.instanceColor!==null,instancingMorph:Lt&&H.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ii,alphaToCoverage:!!y.alphaToCoverage,map:Gt,matcap:Te,envMap:b,envMapMode:b&&$.mapping,envMapCubeUVHeight:V,aoMap:oe,lightMap:Ut,bumpMap:Ct,normalMap:_t,displacementMap:d&&ae,emissiveMap:vt,normalMapObjectSpace:_t&&y.normalMapType===bu,normalMapTangentSpace:_t&&y.normalMapType===rc,metalnessMap:Ft,roughnessMap:Me,anisotropy:pe,anisotropyMap:k,clearcoat:A,clearcoatMap:yt,clearcoatNormalMap:nt,clearcoatRoughnessMap:xt,dispersion:_,iridescence:O,iridescenceMap:Mt,iridescenceThicknessMap:tt,sheen:G,sheenColorMap:lt,sheenRoughnessMap:Rt,specularMap:St,specularColorMap:ot,specularIntensityMap:It,transmission:J,transmissionMap:D,thicknessMap:et,gradientMap:it,opaque:y.transparent===!1&&y.blending===Ri&&y.alphaToCoverage===!1,alphaMap:dt,alphaTest:j,alphaHash:Z,combine:y.combine,mapUv:Gt&&S(y.map.channel),aoMapUv:oe&&S(y.aoMap.channel),lightMapUv:Ut&&S(y.lightMap.channel),bumpMapUv:Ct&&S(y.bumpMap.channel),normalMapUv:_t&&S(y.normalMap.channel),displacementMapUv:ae&&S(y.displacementMap.channel),emissiveMapUv:vt&&S(y.emissiveMap.channel),metalnessMapUv:Ft&&S(y.metalnessMap.channel),roughnessMapUv:Me&&S(y.roughnessMap.channel),anisotropyMapUv:k&&S(y.anisotropyMap.channel),clearcoatMapUv:yt&&S(y.clearcoatMap.channel),clearcoatNormalMapUv:nt&&S(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xt&&S(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&S(y.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&S(y.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&S(y.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&S(y.sheenRoughnessMap.channel),specularMapUv:St&&S(y.specularMap.channel),specularColorMapUv:ot&&S(y.specularColorMap.channel),specularIntensityMapUv:It&&S(y.specularIntensityMap.channel),transmissionMapUv:D&&S(y.transmissionMap.channel),thicknessMapUv:et&&S(y.thicknessMap.channel),alphaMapUv:dt&&S(y.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(_t||pe),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!W.attributes.uv&&(Gt||dt),fog:!!q,useFog:y.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pt,skinning:H.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Tt,morphTextureStride:Ht,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Dt,decodeVideoTexture:Gt&&y.map.isVideoTexture===!0&&qt.getTransfer(y.map.colorSpace)===Kt,decodeVideoTextureEmissive:vt&&y.emissiveMap.isVideoTexture===!0&&qt.getTransfer(y.emissiveMap.colorSpace)===Kt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Je,flipSided:y.side===Ne,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:gt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&y.extensions.multiDraw===!0||Et)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ie.vertexUv1s=c.has(1),ie.vertexUv2s=c.has(2),ie.vertexUv3s=c.has(3),c.clear(),ie}function f(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const P in y.defines)M.push(P),M.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(T(M,y),E(M,y),M.push(i.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function T(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function E(y,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),y.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),y.push(a.mask)}function v(y){const M=g[y.type];let P;if(M){const F=on[M];P=gh.clone(F.uniforms)}else P=y.uniforms;return P}function C(y,M){let P;for(let F=0,H=u.length;F<H;F++){const q=u[F];if(q.cacheKey===M){P=q,++P.usedTimes;break}}return P===void 0&&(P=new Ag(i,M,y,s),u.push(P)),P}function w(y){if(--y.usedTimes===0){const M=u.indexOf(y);u[M]=u[u.length-1],u.pop(),y.destroy()}}function R(y){l.remove(y)}function U(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:v,acquireProgram:C,releaseProgram:w,releaseShaderCache:R,programs:u,dispose:U}}function Pg(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,l){i.get(o)[a]=l}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Lg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Fl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ol(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(h,d,p,g,S,m){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:S,group:m},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=S,f.group=m),t++,f}function a(h,d,p,g,S,m){const f=o(h,d,p,g,S,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):e.push(f)}function l(h,d,p,g,S,m){const f=o(h,d,p,g,S,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):e.unshift(f)}function c(h,d){e.length>1&&e.sort(h||Lg),n.length>1&&n.sort(d||Fl),r.length>1&&r.sort(d||Fl)}function u(){for(let h=t,d=i.length;h<d;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function Dg(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new Ol,i.set(n,[o])):r>=s.length?(o=new Ol,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ug(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Wt};break;case"SpotLight":e={position:new L,direction:new L,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Ig(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Ng=0;function Fg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Og(i){const t=new Ug,e=Ig(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const r=new L,s=new le,o=new le;function a(c){let u=0,h=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let p=0,g=0,S=0,m=0,f=0,T=0,E=0,v=0,C=0,w=0,R=0;c.sort(Fg);for(let y=0,M=c.length;y<M;y++){const P=c[y],F=P.color,H=P.intensity,q=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=F.r*H,h+=F.g*H,d+=F.b*H;else if(P.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(P.sh.coefficients[X],H);R++}else if(P.isDirectionalLight){const X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,V=e.get(P);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=P.shadow.matrix,T++}n.directional[p]=X,p++}else if(P.isSpotLight){const X=t.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(F).multiplyScalar(H),X.distance=q,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,n.spot[S]=X;const $=P.shadow;if(P.map&&(n.spotLightMap[C]=P.map,C++,$.updateMatrices(P),P.castShadow&&w++),n.spotLightMatrix[S]=$.matrix,P.castShadow){const V=e.get(P);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[S]=V,n.spotShadowMap[S]=W,v++}S++}else if(P.isRectAreaLight){const X=t.get(P);X.color.copy(F).multiplyScalar(H),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=X,m++}else if(P.isPointLight){const X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){const $=P.shadow,V=e.get(P);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=P.shadow.matrix,E++}n.point[g]=X,g++}else if(P.isHemisphereLight){const X=t.get(P);X.skyColor.copy(P.color).multiplyScalar(H),X.groundColor.copy(P.groundColor).multiplyScalar(H),n.hemi[f]=X,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=rt.LTC_FLOAT_1,n.rectAreaLTC2=rt.LTC_FLOAT_2):(n.rectAreaLTC1=rt.LTC_HALF_1,n.rectAreaLTC2=rt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const U=n.hash;(U.directionalLength!==p||U.pointLength!==g||U.spotLength!==S||U.rectAreaLength!==m||U.hemiLength!==f||U.numDirectionalShadows!==T||U.numPointShadows!==E||U.numSpotShadows!==v||U.numSpotMaps!==C||U.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=S,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=v+C-w,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,U.directionalLength=p,U.pointLength=g,U.spotLength=S,U.rectAreaLength=m,U.hemiLength=f,U.numDirectionalShadows=T,U.numPointShadows=E,U.numSpotShadows=v,U.numSpotMaps=C,U.numLightProbes=R,n.version=Ng++)}function l(c,u){let h=0,d=0,p=0,g=0,S=0;const m=u.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){const E=c[f];if(E.isDirectionalLight){const v=n.directional[h];v.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),h++}else if(E.isSpotLight){const v=n.spot[p];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),p++}else if(E.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(E.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(E.width*.5,0,0),v.halfHeight.set(0,E.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const v=n.hemi[S];v.direction.setFromMatrixPosition(E.matrixWorld),v.direction.transformDirection(m),S++}}}return{setup:a,setupView:l,state:n}}function Bl(i){const t=new Og(i),e=[],n=[];function r(u){c.camera=u,e.length=0,n.length=0}function s(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function Bg(i){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new Bl(i),t.set(r,[a])):s>=o.length?(a=new Bl(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Vg(i,t,e){let n=new oa;const r=new ft,s=new ft,o=new jt,a=new of({depthPacking:Au}),l=new af,c={},u=e.maxTextureSize,h={[Hn]:Ne,[Ne]:Hn,[Je]:Je},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:zg,fragmentShader:Hg}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ge;g.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new cn(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xl;let f=this.type;this.render=function(w,R,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const y=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Bn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const H=f!==Mn&&this.type===Mn,q=f===Mn&&this.type!==Mn;for(let W=0,X=w.length;W<X;W++){const $=w[W],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const st=V.getFrameExtents();if(r.multiply(st),s.copy(V.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/st.x),r.x=s.x*st.x,V.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/st.y),r.y=s.y*st.y,V.mapSize.y=s.y)),V.map===null||H===!0||q===!0){const Tt=this.type!==Mn?{minFilter:nn,magFilter:nn}:{};V.map!==null&&V.map.dispose(),V.map=new ai(r.x,r.y,Tt),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ut=V.getViewportCount();for(let Tt=0;Tt<ut;Tt++){const Ht=V.getViewport(Tt);o.set(s.x*Ht.x,s.y*Ht.y,s.x*Ht.z,s.y*Ht.w),F.viewport(o),V.updateMatrices($,Tt),n=V.getFrustum(),v(R,U,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===Mn&&T(V,U),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(y,M,P)};function T(w,R){const U=t.update(S);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ai(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,U,d,S,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,U,p,S,null)}function E(w,R,U,y){let M=null;const P=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)M=P;else if(M=U.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=M.uuid,H=R.uuid;let q=c[F];q===void 0&&(q={},c[F]=q);let W=q[H];W===void 0&&(W=M.clone(),q[H]=W,R.addEventListener("dispose",C)),M=W}if(M.visible=R.visible,M.wireframe=R.wireframe,y===Mn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:h[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,U.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=i.properties.get(M);F.light=U}return M}function v(w,R,U,y,M){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Mn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const H=t.update(w),q=w.material;if(Array.isArray(q)){const W=H.groups;for(let X=0,$=W.length;X<$;X++){const V=W[X],st=q[V.materialIndex];if(st&&st.visible){const ut=E(w,st,y,M);w.onBeforeShadow(i,w,R,U,H,ut,V),i.renderBufferDirect(U,null,H,ut,w,V),w.onAfterShadow(i,w,R,U,H,ut,V)}}}else if(q.visible){const W=E(w,q,y,M);w.onBeforeShadow(i,w,R,U,H,W,null),i.renderBufferDirect(U,null,H,W,w,null),w.onAfterShadow(i,w,R,U,H,W,null)}}const F=w.children;for(let H=0,q=F.length;H<q;H++)v(F[H],R,U,y,M)}function C(w){w.target.removeEventListener("dispose",C);for(const U in c){const y=c[U],M=w.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const kg={[eo]:no,[io]:oo,[ro]:ao,[Li]:so,[no]:eo,[oo]:io,[ao]:ro,[so]:Li};function Gg(i,t){function e(){let D=!1;const et=new jt;let it=null;const dt=new jt(0,0,0,0);return{setMask:function(j){it!==j&&!D&&(i.colorMask(j,j,j,j),it=j)},setLocked:function(j){D=j},setClear:function(j,Z,gt,Dt,ie){ie===!0&&(j*=Dt,Z*=Dt,gt*=Dt),et.set(j,Z,gt,Dt),dt.equals(et)===!1&&(i.clearColor(j,Z,gt,Dt),dt.copy(et))},reset:function(){D=!1,it=null,dt.set(-1,0,0,0)}}}function n(){let D=!1,et=!1,it=null,dt=null,j=null;return{setReversed:function(Z){if(et!==Z){const gt=t.get("EXT_clip_control");Z?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),et=Z;const Dt=j;j=null,this.setClear(Dt)}},getReversed:function(){return et},setTest:function(Z){Z?K(i.DEPTH_TEST):pt(i.DEPTH_TEST)},setMask:function(Z){it!==Z&&!D&&(i.depthMask(Z),it=Z)},setFunc:function(Z){if(et&&(Z=kg[Z]),dt!==Z){switch(Z){case eo:i.depthFunc(i.NEVER);break;case no:i.depthFunc(i.ALWAYS);break;case io:i.depthFunc(i.LESS);break;case Li:i.depthFunc(i.LEQUAL);break;case ro:i.depthFunc(i.EQUAL);break;case so:i.depthFunc(i.GEQUAL);break;case oo:i.depthFunc(i.GREATER);break;case ao:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}dt=Z}},setLocked:function(Z){D=Z},setClear:function(Z){j!==Z&&(et&&(Z=1-Z),i.clearDepth(Z),j=Z)},reset:function(){D=!1,it=null,dt=null,j=null,et=!1}}}function r(){let D=!1,et=null,it=null,dt=null,j=null,Z=null,gt=null,Dt=null,ie=null;return{setTest:function(Jt){D||(Jt?K(i.STENCIL_TEST):pt(i.STENCIL_TEST))},setMask:function(Jt){et!==Jt&&!D&&(i.stencilMask(Jt),et=Jt)},setFunc:function(Jt,pn,sn){(it!==Jt||dt!==pn||j!==sn)&&(i.stencilFunc(Jt,pn,sn),it=Jt,dt=pn,j=sn)},setOp:function(Jt,pn,sn){(Z!==Jt||gt!==pn||Dt!==sn)&&(i.stencilOp(Jt,pn,sn),Z=Jt,gt=pn,Dt=sn)},setLocked:function(Jt){D=Jt},setClear:function(Jt){ie!==Jt&&(i.clearStencil(Jt),ie=Jt)},reset:function(){D=!1,et=null,it=null,dt=null,j=null,Z=null,gt=null,Dt=null,ie=null}}}const s=new e,o=new n,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,p=[],g=null,S=!1,m=null,f=null,T=null,E=null,v=null,C=null,w=null,R=new Wt(0,0,0),U=0,y=!1,M=null,P=null,F=null,H=null,q=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,$=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),X=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),X=$>=2);let st=null,ut={};const Tt=i.getParameter(i.SCISSOR_BOX),Ht=i.getParameter(i.VIEWPORT),ne=new jt().fromArray(Tt),se=new jt().fromArray(Ht);function Zt(D,et,it,dt){const j=new Uint8Array(4),Z=i.createTexture();i.bindTexture(D,Z),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let gt=0;gt<it;gt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(et,0,i.RGBA,1,1,dt,0,i.RGBA,i.UNSIGNED_BYTE,j):i.texImage2D(et+gt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,j);return Z}const Y={};Y[i.TEXTURE_2D]=Zt(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Zt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Zt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Zt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(i.DEPTH_TEST),o.setFunc(Li),Ct(!1),_t(Da),K(i.CULL_FACE),oe(Bn);function K(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function pt(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Lt(D,et){return h[D]!==et?(i.bindFramebuffer(D,et),h[D]=et,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=et),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=et),!0):!1}function Et(D,et){let it=p,dt=!1;if(D){it=d.get(et),it===void 0&&(it=[],d.set(et,it));const j=D.textures;if(it.length!==j.length||it[0]!==i.COLOR_ATTACHMENT0){for(let Z=0,gt=j.length;Z<gt;Z++)it[Z]=i.COLOR_ATTACHMENT0+Z;it.length=j.length,dt=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,dt=!0);dt&&i.drawBuffers(it)}function Gt(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Te={[ti]:i.FUNC_ADD,[jc]:i.FUNC_SUBTRACT,[Qc]:i.FUNC_REVERSE_SUBTRACT};Te[tu]=i.MIN,Te[eu]=i.MAX;const b={[nu]:i.ZERO,[iu]:i.ONE,[ru]:i.SRC_COLOR,[Qs]:i.SRC_ALPHA,[uu]:i.SRC_ALPHA_SATURATE,[lu]:i.DST_COLOR,[ou]:i.DST_ALPHA,[su]:i.ONE_MINUS_SRC_COLOR,[to]:i.ONE_MINUS_SRC_ALPHA,[cu]:i.ONE_MINUS_DST_COLOR,[au]:i.ONE_MINUS_DST_ALPHA,[hu]:i.CONSTANT_COLOR,[fu]:i.ONE_MINUS_CONSTANT_COLOR,[du]:i.CONSTANT_ALPHA,[pu]:i.ONE_MINUS_CONSTANT_ALPHA};function oe(D,et,it,dt,j,Z,gt,Dt,ie,Jt){if(D===Bn){S===!0&&(pt(i.BLEND),S=!1);return}if(S===!1&&(K(i.BLEND),S=!0),D!==Kc){if(D!==m||Jt!==y){if((f!==ti||v!==ti)&&(i.blendEquation(i.FUNC_ADD),f=ti,v=ti),Jt)switch(D){case Ri:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ua:i.blendFunc(i.ONE,i.ONE);break;case Ia:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Na:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ri:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ua:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ia:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Na:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}T=null,E=null,C=null,w=null,R.set(0,0,0),U=0,m=D,y=Jt}return}j=j||et,Z=Z||it,gt=gt||dt,(et!==f||j!==v)&&(i.blendEquationSeparate(Te[et],Te[j]),f=et,v=j),(it!==T||dt!==E||Z!==C||gt!==w)&&(i.blendFuncSeparate(b[it],b[dt],b[Z],b[gt]),T=it,E=dt,C=Z,w=gt),(Dt.equals(R)===!1||ie!==U)&&(i.blendColor(Dt.r,Dt.g,Dt.b,ie),R.copy(Dt),U=ie),m=D,y=!1}function Ut(D,et){D.side===Je?pt(i.CULL_FACE):K(i.CULL_FACE);let it=D.side===Ne;et&&(it=!it),Ct(it),D.blending===Ri&&D.transparent===!1?oe(Bn):oe(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),s.setMask(D.colorWrite);const dt=D.stencilWrite;a.setTest(dt),dt&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),vt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(D){M!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),M=D)}function _t(D){D!==Jc?(K(i.CULL_FACE),D!==P&&(D===Da?i.cullFace(i.BACK):D===$c?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pt(i.CULL_FACE),P=D}function ae(D){D!==F&&(X&&i.lineWidth(D),F=D)}function vt(D,et,it){D?(K(i.POLYGON_OFFSET_FILL),(H!==et||q!==it)&&(i.polygonOffset(et,it),H=et,q=it)):pt(i.POLYGON_OFFSET_FILL)}function Ft(D){D?K(i.SCISSOR_TEST):pt(i.SCISSOR_TEST)}function Me(D){D===void 0&&(D=i.TEXTURE0+W-1),st!==D&&(i.activeTexture(D),st=D)}function pe(D,et,it){it===void 0&&(st===null?it=i.TEXTURE0+W-1:it=st);let dt=ut[it];dt===void 0&&(dt={type:void 0,texture:void 0},ut[it]=dt),(dt.type!==D||dt.texture!==et)&&(st!==it&&(i.activeTexture(it),st=it),i.bindTexture(D,et||Y[D]),dt.type=D,dt.texture=et)}function A(){const D=ut[st];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function k(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function yt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xt(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Mt(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function tt(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function lt(D){ne.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ne.copy(D))}function Rt(D){se.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),se.copy(D))}function St(D,et){let it=c.get(et);it===void 0&&(it=new WeakMap,c.set(et,it));let dt=it.get(D);dt===void 0&&(dt=i.getUniformBlockIndex(et,D.name),it.set(D,dt))}function ot(D,et){const dt=c.get(et).get(D);l.get(et)!==dt&&(i.uniformBlockBinding(et,dt,D.__bindingPointIndex),l.set(et,dt))}function It(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},st=null,ut={},h={},d=new WeakMap,p=[],g=null,S=!1,m=null,f=null,T=null,E=null,v=null,C=null,w=null,R=new Wt(0,0,0),U=0,y=!1,M=null,P=null,F=null,H=null,q=null,ne.set(0,0,i.canvas.width,i.canvas.height),se.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:K,disable:pt,bindFramebuffer:Lt,drawBuffers:Et,useProgram:Gt,setBlending:oe,setMaterial:Ut,setFlipSided:Ct,setCullFace:_t,setLineWidth:ae,setPolygonOffset:vt,setScissorTest:Ft,activeTexture:Me,bindTexture:pe,unbindTexture:A,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:Mt,texImage3D:tt,updateUBOMapping:St,uniformBlockBinding:ot,texStorage2D:nt,texStorage3D:xt,texSubImage2D:G,texSubImage3D:J,compressedTexSubImage2D:k,compressedTexSubImage3D:yt,scissor:lt,viewport:Rt,reset:It}}function Wg(i,t,e,n,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,_){return p?new OffscreenCanvas(A,_):ss("canvas")}function S(A,_,O){let G=1;const J=pe(A);if((J.width>O||J.height>O)&&(G=O/Math.max(J.width,J.height)),G<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const k=Math.floor(G*J.width),yt=Math.floor(G*J.height);h===void 0&&(h=g(k,yt));const nt=_?g(k,yt):h;return nt.width=k,nt.height=yt,nt.getContext("2d").drawImage(A,0,0,k,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+k+"x"+yt+")."),nt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function m(A){return A.generateMipmaps}function f(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(A,_,O,G,J=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let k=_;if(_===i.RED&&(O===i.FLOAT&&(k=i.R32F),O===i.HALF_FLOAT&&(k=i.R16F),O===i.UNSIGNED_BYTE&&(k=i.R8)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(k=i.R8UI),O===i.UNSIGNED_SHORT&&(k=i.R16UI),O===i.UNSIGNED_INT&&(k=i.R32UI),O===i.BYTE&&(k=i.R8I),O===i.SHORT&&(k=i.R16I),O===i.INT&&(k=i.R32I)),_===i.RG&&(O===i.FLOAT&&(k=i.RG32F),O===i.HALF_FLOAT&&(k=i.RG16F),O===i.UNSIGNED_BYTE&&(k=i.RG8)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(k=i.RG8UI),O===i.UNSIGNED_SHORT&&(k=i.RG16UI),O===i.UNSIGNED_INT&&(k=i.RG32UI),O===i.BYTE&&(k=i.RG8I),O===i.SHORT&&(k=i.RG16I),O===i.INT&&(k=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(k=i.RGB8UI),O===i.UNSIGNED_SHORT&&(k=i.RGB16UI),O===i.UNSIGNED_INT&&(k=i.RGB32UI),O===i.BYTE&&(k=i.RGB8I),O===i.SHORT&&(k=i.RGB16I),O===i.INT&&(k=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(k=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(k=i.RGBA16UI),O===i.UNSIGNED_INT&&(k=i.RGBA32UI),O===i.BYTE&&(k=i.RGBA8I),O===i.SHORT&&(k=i.RGBA16I),O===i.INT&&(k=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(k=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(k=i.R11F_G11F_B10F)),_===i.RGBA){const yt=J?is:qt.getTransfer(G);O===i.FLOAT&&(k=i.RGBA32F),O===i.HALF_FLOAT&&(k=i.RGBA16F),O===i.UNSIGNED_BYTE&&(k=yt===Kt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(k=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(k=i.RGB5_A1)}return(k===i.R16F||k===i.R32F||k===i.RG16F||k===i.RG32F||k===i.RGBA16F||k===i.RGBA32F)&&t.get("EXT_color_buffer_float"),k}function v(A,_){let O;return A?_===null||_===oi||_===lr?O=i.DEPTH24_STENCIL8:_===yn?O=i.DEPTH32F_STENCIL8:_===ar&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===oi||_===lr?O=i.DEPTH_COMPONENT24:_===yn?O=i.DEPTH_COMPONENT32F:_===ar&&(O=i.DEPTH_COMPONENT16),O}function C(A,_){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==nn&&A.minFilter!==an?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function w(A){const _=A.target;_.removeEventListener("dispose",w),U(_),_.isVideoTexture&&u.delete(_)}function R(A){const _=A.target;_.removeEventListener("dispose",R),M(_)}function U(A){const _=n.get(A);if(_.__webglInit===void 0)return;const O=A.source,G=d.get(O);if(G){const J=G[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&y(A),Object.keys(G).length===0&&d.delete(O)}n.remove(A)}function y(A){const _=n.get(A);i.deleteTexture(_.__webglTexture);const O=A.source,G=d.get(O);delete G[_.__cacheKey],o.memory.textures--}function M(A){const _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let J=0;J<_.__webglFramebuffer[G].length;J++)i.deleteFramebuffer(_.__webglFramebuffer[G][J]);else i.deleteFramebuffer(_.__webglFramebuffer[G]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)i.deleteFramebuffer(_.__webglFramebuffer[G]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let G=0;G<_.__webglColorRenderbuffer.length;G++)_.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[G]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=A.textures;for(let G=0,J=O.length;G<J;G++){const k=n.get(O[G]);k.__webglTexture&&(i.deleteTexture(k.__webglTexture),o.memory.textures--),n.remove(O[G])}n.remove(A)}let P=0;function F(){P=0}function H(){const A=P;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),P+=1,A}function q(A){const _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function W(A,_){const O=n.get(A);if(A.isVideoTexture&&Ft(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&O.__version!==A.version){const G=A.image;if(G===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,A,_);return}}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function X(A,_){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){Y(O,A,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function $(A,_){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){Y(O,A,_);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function V(A,_){const O=n.get(A);if(A.version>0&&O.__version!==A.version){K(O,A,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}const st={[uo]:i.REPEAT,[ni]:i.CLAMP_TO_EDGE,[ho]:i.MIRRORED_REPEAT},ut={[nn]:i.NEAREST,[Eu]:i.NEAREST_MIPMAP_NEAREST,[wr]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[vs]:i.LINEAR_MIPMAP_NEAREST,[ii]:i.LINEAR_MIPMAP_LINEAR},Tt={[wu]:i.NEVER,[Uu]:i.ALWAYS,[Ru]:i.LESS,[sc]:i.LEQUAL,[Cu]:i.EQUAL,[Du]:i.GEQUAL,[Pu]:i.GREATER,[Lu]:i.NOTEQUAL};function Ht(A,_){if(_.type===yn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===an||_.magFilter===vs||_.magFilter===wr||_.magFilter===ii||_.minFilter===an||_.minFilter===vs||_.minFilter===wr||_.minFilter===ii)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,st[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,st[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,st[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ut[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ut[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Tt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===nn||_.minFilter!==wr&&_.minFilter!==ii||_.type===yn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ne(A,_){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",w));const G=_.source;let J=d.get(G);J===void 0&&(J={},d.set(G,J));const k=q(_);if(k!==A.__cacheKey){J[k]===void 0&&(J[k]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),J[k].usedTimes++;const yt=J[A.__cacheKey];yt!==void 0&&(J[A.__cacheKey].usedTimes--,yt.usedTimes===0&&y(_)),A.__cacheKey=k,A.__webglTexture=J[k].texture}return O}function se(A,_,O){return Math.floor(Math.floor(A/O)/_)}function Zt(A,_,O,G){const k=A.updateRanges;if(k.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,G,_.data);else{k.sort((tt,lt)=>tt.start-lt.start);let yt=0;for(let tt=1;tt<k.length;tt++){const lt=k[yt],Rt=k[tt],St=lt.start+lt.count,ot=se(Rt.start,_.width,4),It=se(lt.start,_.width,4);Rt.start<=St+1&&ot===It&&se(Rt.start+Rt.count-1,_.width,4)===ot?lt.count=Math.max(lt.count,Rt.start+Rt.count-lt.start):(++yt,k[yt]=Rt)}k.length=yt+1;const nt=i.getParameter(i.UNPACK_ROW_LENGTH),xt=i.getParameter(i.UNPACK_SKIP_PIXELS),Mt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let tt=0,lt=k.length;tt<lt;tt++){const Rt=k[tt],St=Math.floor(Rt.start/4),ot=Math.ceil(Rt.count/4),It=St%_.width,D=Math.floor(St/_.width),et=ot,it=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,It),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,It,D,et,it,O,G,_.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,nt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,xt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Mt)}}function Y(A,_,O){let G=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(G=i.TEXTURE_3D);const J=ne(A,_),k=_.source;e.bindTexture(G,A.__webglTexture,i.TEXTURE0+O);const yt=n.get(k);if(k.version!==yt.__version||J===!0){e.activeTexture(i.TEXTURE0+O);const nt=qt.getPrimaries(qt.workingColorSpace),xt=_.colorSpace===On?null:qt.getPrimaries(_.colorSpace),Mt=_.colorSpace===On||nt===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);let tt=S(_.image,!1,r.maxTextureSize);tt=Me(_,tt);const lt=s.convert(_.format,_.colorSpace),Rt=s.convert(_.type);let St=E(_.internalFormat,lt,Rt,_.colorSpace,_.isVideoTexture);Ht(G,_);let ot;const It=_.mipmaps,D=_.isVideoTexture!==!0,et=yt.__version===void 0||J===!0,it=k.dataReady,dt=C(_,tt);if(_.isDepthTexture)St=v(_.format===ur,_.type),et&&(D?e.texStorage2D(i.TEXTURE_2D,1,St,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,St,tt.width,tt.height,0,lt,Rt,null));else if(_.isDataTexture)if(It.length>0){D&&et&&e.texStorage2D(i.TEXTURE_2D,dt,St,It[0].width,It[0].height);for(let j=0,Z=It.length;j<Z;j++)ot=It[j],D?it&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ot.width,ot.height,lt,Rt,ot.data):e.texImage2D(i.TEXTURE_2D,j,St,ot.width,ot.height,0,lt,Rt,ot.data);_.generateMipmaps=!1}else D?(et&&e.texStorage2D(i.TEXTURE_2D,dt,St,tt.width,tt.height),it&&Zt(_,tt,lt,Rt)):e.texImage2D(i.TEXTURE_2D,0,St,tt.width,tt.height,0,lt,Rt,tt.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,St,It[0].width,It[0].height,tt.depth);for(let j=0,Z=It.length;j<Z;j++)if(ot=It[j],_.format!==en)if(lt!==null)if(D){if(it)if(_.layerUpdates.size>0){const gt=pl(ot.width,ot.height,_.format,_.type);for(const Dt of _.layerUpdates){const ie=ot.data.subarray(Dt*gt/ot.data.BYTES_PER_ELEMENT,(Dt+1)*gt/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Dt,ot.width,ot.height,1,lt,ie)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ot.width,ot.height,tt.depth,lt,ot.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,St,ot.width,ot.height,tt.depth,0,ot.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?it&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ot.width,ot.height,tt.depth,lt,Rt,ot.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,St,ot.width,ot.height,tt.depth,0,lt,Rt,ot.data)}else{D&&et&&e.texStorage2D(i.TEXTURE_2D,dt,St,It[0].width,It[0].height);for(let j=0,Z=It.length;j<Z;j++)ot=It[j],_.format!==en?lt!==null?D?it&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,ot.width,ot.height,lt,ot.data):e.compressedTexImage2D(i.TEXTURE_2D,j,St,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?it&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ot.width,ot.height,lt,Rt,ot.data):e.texImage2D(i.TEXTURE_2D,j,St,ot.width,ot.height,0,lt,Rt,ot.data)}else if(_.isDataArrayTexture)if(D){if(et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,St,tt.width,tt.height,tt.depth),it)if(_.layerUpdates.size>0){const j=pl(tt.width,tt.height,_.format,_.type);for(const Z of _.layerUpdates){const gt=tt.data.subarray(Z*j/tt.data.BYTES_PER_ELEMENT,(Z+1)*j/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,tt.width,tt.height,1,lt,Rt,gt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,lt,Rt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,St,tt.width,tt.height,tt.depth,0,lt,Rt,tt.data);else if(_.isData3DTexture)D?(et&&e.texStorage3D(i.TEXTURE_3D,dt,St,tt.width,tt.height,tt.depth),it&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,lt,Rt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,St,tt.width,tt.height,tt.depth,0,lt,Rt,tt.data);else if(_.isFramebufferTexture){if(et)if(D)e.texStorage2D(i.TEXTURE_2D,dt,St,tt.width,tt.height);else{let j=tt.width,Z=tt.height;for(let gt=0;gt<dt;gt++)e.texImage2D(i.TEXTURE_2D,gt,St,j,Z,0,lt,Rt,null),j>>=1,Z>>=1}}else if(It.length>0){if(D&&et){const j=pe(It[0]);e.texStorage2D(i.TEXTURE_2D,dt,St,j.width,j.height)}for(let j=0,Z=It.length;j<Z;j++)ot=It[j],D?it&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,lt,Rt,ot):e.texImage2D(i.TEXTURE_2D,j,St,lt,Rt,ot);_.generateMipmaps=!1}else if(D){if(et){const j=pe(tt);e.texStorage2D(i.TEXTURE_2D,dt,St,j.width,j.height)}it&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,lt,Rt,tt)}else e.texImage2D(i.TEXTURE_2D,0,St,lt,Rt,tt);m(_)&&f(G),yt.__version=k.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function K(A,_,O){if(_.image.length!==6)return;const G=ne(A,_),J=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const k=n.get(J);if(J.version!==k.__version||G===!0){e.activeTexture(i.TEXTURE0+O);const yt=qt.getPrimaries(qt.workingColorSpace),nt=_.colorSpace===On?null:qt.getPrimaries(_.colorSpace),xt=_.colorSpace===On||yt===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Mt=_.isCompressedTexture||_.image[0].isCompressedTexture,tt=_.image[0]&&_.image[0].isDataTexture,lt=[];for(let Z=0;Z<6;Z++)!Mt&&!tt?lt[Z]=S(_.image[Z],!0,r.maxCubemapSize):lt[Z]=tt?_.image[Z].image:_.image[Z],lt[Z]=Me(_,lt[Z]);const Rt=lt[0],St=s.convert(_.format,_.colorSpace),ot=s.convert(_.type),It=E(_.internalFormat,St,ot,_.colorSpace),D=_.isVideoTexture!==!0,et=k.__version===void 0||G===!0,it=J.dataReady;let dt=C(_,Rt);Ht(i.TEXTURE_CUBE_MAP,_);let j;if(Mt){D&&et&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,It,Rt.width,Rt.height);for(let Z=0;Z<6;Z++){j=lt[Z].mipmaps;for(let gt=0;gt<j.length;gt++){const Dt=j[gt];_.format!==en?St!==null?D?it&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,0,0,Dt.width,Dt.height,St,Dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,It,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,0,0,Dt.width,Dt.height,St,ot,Dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt,It,Dt.width,Dt.height,0,St,ot,Dt.data)}}}else{if(j=_.mipmaps,D&&et){j.length>0&&dt++;const Z=pe(lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,It,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(tt){D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,lt[Z].width,lt[Z].height,St,ot,lt[Z].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,It,lt[Z].width,lt[Z].height,0,St,ot,lt[Z].data);for(let gt=0;gt<j.length;gt++){const ie=j[gt].image[Z].image;D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,0,0,ie.width,ie.height,St,ot,ie.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,It,ie.width,ie.height,0,St,ot,ie.data)}}else{D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,St,ot,lt[Z]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,It,St,ot,lt[Z]);for(let gt=0;gt<j.length;gt++){const Dt=j[gt];D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,0,0,St,ot,Dt.image[Z]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,gt+1,It,St,ot,Dt.image[Z])}}}m(_)&&f(i.TEXTURE_CUBE_MAP),k.__version=J.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function pt(A,_,O,G,J,k){const yt=s.convert(O.format,O.colorSpace),nt=s.convert(O.type),xt=E(O.internalFormat,yt,nt,O.colorSpace),Mt=n.get(_),tt=n.get(O);if(tt.__renderTarget=_,!Mt.__hasExternalTextures){const lt=Math.max(1,_.width>>k),Rt=Math.max(1,_.height>>k);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,k,xt,lt,Rt,_.depth,0,yt,nt,null):e.texImage2D(J,k,xt,lt,Rt,0,yt,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),vt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,J,tt.__webglTexture,0,ae(_)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,J,tt.__webglTexture,k),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(A,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){const G=_.depthTexture,J=G&&G.isDepthTexture?G.type:null,k=v(_.stencilBuffer,J),yt=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=ae(_);vt(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,k,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,k,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,k,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,yt,i.RENDERBUFFER,A)}else{const G=_.textures;for(let J=0;J<G.length;J++){const k=G[J],yt=s.convert(k.format,k.colorSpace),nt=s.convert(k.type),xt=E(k.internalFormat,yt,nt,k.colorSpace),Mt=ae(_);O&&vt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,xt,_.width,_.height):vt(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,xt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,xt,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Et(A,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const G=n.get(_.depthTexture);G.__renderTarget=_,(!G.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W(_.depthTexture,0);const J=G.__webglTexture,k=ae(_);if(_.depthTexture.format===cr)vt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,k):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(_.depthTexture.format===ur)vt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,k):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Gt(A){const _=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){const G=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),G){const J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",J)};G.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=G}if(A.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const G=A.texture.mipmaps;G&&G.length>0?Et(_.__webglFramebuffer[0],A):Et(_.__webglFramebuffer,A)}else if(O){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=i.createRenderbuffer(),Lt(_.__webglDepthbuffer[G],A,!1);else{const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=_.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,k),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,k)}}else{const G=A.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Lt(_.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,k),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,k)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Te(A,_,O){const G=n.get(A);_!==void 0&&pt(G.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Gt(A)}function b(A){const _=A.texture,O=n.get(A),G=n.get(_);A.addEventListener("dispose",R);const J=A.textures,k=A.isWebGLCubeRenderTarget===!0,yt=J.length>1;if(yt||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=_.version,o.memory.textures++),k){O.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[nt]=[];for(let xt=0;xt<_.mipmaps.length;xt++)O.__webglFramebuffer[nt][xt]=i.createFramebuffer()}else O.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let nt=0;nt<_.mipmaps.length;nt++)O.__webglFramebuffer[nt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(yt)for(let nt=0,xt=J.length;nt<xt;nt++){const Mt=n.get(J[nt]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&vt(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let nt=0;nt<J.length;nt++){const xt=J[nt];O.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[nt]);const Mt=s.convert(xt.format,xt.colorSpace),tt=s.convert(xt.type),lt=E(xt.internalFormat,Mt,tt,xt.colorSpace,A.isXRRenderTarget===!0),Rt=ae(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,lt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,O.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Lt(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(k){e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),Ht(i.TEXTURE_CUBE_MAP,_);for(let nt=0;nt<6;nt++)if(_.mipmaps&&_.mipmaps.length>0)for(let xt=0;xt<_.mipmaps.length;xt++)pt(O.__webglFramebuffer[nt][xt],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt);else pt(O.__webglFramebuffer[nt],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(_)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let nt=0,xt=J.length;nt<xt;nt++){const Mt=J[nt],tt=n.get(Mt);let lt=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(lt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,tt.__webglTexture),Ht(lt,Mt),pt(O.__webglFramebuffer,A,Mt,i.COLOR_ATTACHMENT0+nt,lt,0),m(Mt)&&f(lt)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(nt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,G.__webglTexture),Ht(nt,_),_.mipmaps&&_.mipmaps.length>0)for(let xt=0;xt<_.mipmaps.length;xt++)pt(O.__webglFramebuffer[xt],A,_,i.COLOR_ATTACHMENT0,nt,xt);else pt(O.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,nt,0);m(_)&&f(nt),e.unbindTexture()}A.depthBuffer&&Gt(A)}function oe(A){const _=A.textures;for(let O=0,G=_.length;O<G;O++){const J=_[O];if(m(J)){const k=T(A),yt=n.get(J).__webglTexture;e.bindTexture(k,yt),f(k),e.unbindTexture()}}}const Ut=[],Ct=[];function _t(A){if(A.samples>0){if(vt(A)===!1){const _=A.textures,O=A.width,G=A.height;let J=i.COLOR_BUFFER_BIT;const k=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(A),nt=_.length>1;if(nt)for(let Mt=0;Mt<_.length;Mt++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer);const xt=A.texture.mipmaps;xt&&xt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Mt=0;Mt<_.length;Mt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Mt]);const tt=n.get(_[Mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,tt,0)}i.blitFramebuffer(0,0,O,G,0,0,O,G,J,i.NEAREST),l===!0&&(Ut.length=0,Ct.length=0,Ut.push(i.COLOR_ATTACHMENT0+Mt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Ut.push(k),Ct.push(k),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ct)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let Mt=0;Mt<_.length;Mt++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Mt]);const tt=n.get(_[Mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,tt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ae(A){return Math.min(r.maxSamples,A.samples)}function vt(A){const _=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ft(A){const _=o.render.frame;u.get(A)!==_&&(u.set(A,_),A.update())}function Me(A,_){const O=A.colorSpace,G=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==Ii&&O!==On&&(qt.getTransfer(O)===Kt?(G!==en||J!==hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function pe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=X,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=Te,this.setupRenderTarget=b,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=Gt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=vt}function Xg(i,t){function e(n,r=On){let s;const o=qt.getTransfer(r);if(n===hn)return i.UNSIGNED_BYTE;if(n===$o)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ko)return i.UNSIGNED_SHORT_5_5_5_1;if(n===jl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ql)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===$l)return i.BYTE;if(n===Kl)return i.SHORT;if(n===ar)return i.UNSIGNED_SHORT;if(n===Jo)return i.INT;if(n===oi)return i.UNSIGNED_INT;if(n===yn)return i.FLOAT;if(n===vr)return i.HALF_FLOAT;if(n===tc)return i.ALPHA;if(n===ec)return i.RGB;if(n===en)return i.RGBA;if(n===cr)return i.DEPTH_COMPONENT;if(n===ur)return i.DEPTH_STENCIL;if(n===nc)return i.RED;if(n===jo)return i.RED_INTEGER;if(n===ic)return i.RG;if(n===Qo)return i.RG_INTEGER;if(n===ta)return i.RGBA_INTEGER;if(n===jr||n===Qr||n===ts||n===es)if(o===Kt)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===jr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Qr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ts)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===es)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===jr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Qr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ts)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===es)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===fo||n===po||n===mo||n===go)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===fo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===po)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===mo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===go)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===_o||n===vo||n===xo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===_o||n===vo)return o===Kt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===xo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Mo||n===So||n===yo||n===Eo||n===To||n===Ao||n===bo||n===wo||n===Ro||n===Co||n===Po||n===Lo||n===Do||n===Uo)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Mo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===So)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===yo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Eo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===To)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ao)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===bo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===wo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ro)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Co)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Po)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Lo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Do)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Uo)return o===Kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Io||n===No||n===Fo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Io)return o===Kt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===No)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Oo||n===Bo||n===zo||n===Ho)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Oo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Bo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===zo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ho)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===lr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const qg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Zg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new _c(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Vn({vertexShader:qg,fragmentShader:Yg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new cn(new yr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Jg extends Bi{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,g=null;const S=typeof XRWebGLBinding<"u",m=new Zg,f={},T=e.getContextAttributes();let E=null,v=null;const C=[],w=[],R=new ft;let U=null;const y=new ke;y.viewport=new jt;const M=new ke;M.viewport=new jt;const P=[y,M],F=new pf;let H=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=C[Y];return K===void 0&&(K=new zs,C[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=C[Y];return K===void 0&&(K=new zs,C[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=C[Y];return K===void 0&&(K=new zs,C[Y]=K),K.getHandSpace()};function W(Y){const K=w.indexOf(Y.inputSource);if(K===-1)return;const pt=C[K];pt!==void 0&&(pt.update(Y.inputSource,Y.frame,c||o),pt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",$);for(let Y=0;Y<C.length;Y++){const K=w[Y];K!==null&&(w[Y]=null,C[Y].disconnect(K))}H=null,q=null,m.reset();for(const Y in f)delete f[Y];t.setRenderTarget(E),p=null,d=null,h=null,r=null,v=null,Zt.stop(),n.isPresenting=!1,t.setPixelRatio(U),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h===null&&S&&(h=new XRWebGLBinding(r,e)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(E=t.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",X),r.addEventListener("inputsourceschange",$),T.xrCompatible!==!0&&await e.makeXRCompatible(),U=t.getPixelRatio(),t.getSize(R),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,Lt=null,Et=null;T.depth&&(Et=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,pt=T.stencil?ur:cr,Lt=T.stencil?lr:oi);const Gt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Gt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new ai(d.textureWidth,d.textureHeight,{format:en,type:hn,depthTexture:new gc(d.textureWidth,d.textureHeight,Lt,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const pt={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,e,pt),r.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new ai(p.framebufferWidth,p.framebufferHeight,{format:en,type:hn,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Zt.setContext(r),Zt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(Y){for(let K=0;K<Y.removed.length;K++){const pt=Y.removed[K],Lt=w.indexOf(pt);Lt>=0&&(w[Lt]=null,C[Lt].disconnect(pt))}for(let K=0;K<Y.added.length;K++){const pt=Y.added[K];let Lt=w.indexOf(pt);if(Lt===-1){for(let Gt=0;Gt<C.length;Gt++)if(Gt>=w.length){w.push(pt),Lt=Gt;break}else if(w[Gt]===null){w[Gt]=pt,Lt=Gt;break}if(Lt===-1)break}const Et=C[Lt];Et&&Et.connect(pt)}}const V=new L,st=new L;function ut(Y,K,pt){V.setFromMatrixPosition(K.matrixWorld),st.setFromMatrixPosition(pt.matrixWorld);const Lt=V.distanceTo(st),Et=K.projectionMatrix.elements,Gt=pt.projectionMatrix.elements,Te=Et[14]/(Et[10]-1),b=Et[14]/(Et[10]+1),oe=(Et[9]+1)/Et[5],Ut=(Et[9]-1)/Et[5],Ct=(Et[8]-1)/Et[0],_t=(Gt[8]+1)/Gt[0],ae=Te*Ct,vt=Te*_t,Ft=Lt/(-Ct+_t),Me=Ft*-Ct;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Me),Y.translateZ(Ft),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Et[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const pe=Te+Ft,A=b+Ft,_=ae-Me,O=vt+(Lt-Me),G=oe*b/A*pe,J=Ut*b/A*pe;Y.projectionMatrix.makePerspective(_,O,G,J,pe,A),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Tt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let K=Y.near,pt=Y.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(pt=m.depthFar)),F.near=M.near=y.near=K,F.far=M.far=y.far=pt,(H!==F.near||q!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),H=F.near,q=F.far),F.layers.mask=Y.layers.mask|6,y.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;const Lt=Y.parent,Et=F.cameras;Tt(F,Lt);for(let Gt=0;Gt<Et.length;Gt++)Tt(Et[Gt],Lt);Et.length===2?ut(F,y,M):F.projectionMatrix.copy(y.projectionMatrix),Ht(Y,F,Lt)};function Ht(Y,K,pt){pt===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(pt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=hr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(Y){return f[Y]};let ne=null;function se(Y,K){if(u=K.getViewerPose(c||o),g=K,u!==null){const pt=u.views;p!==null&&(t.setRenderTargetFramebuffer(v,p.framebuffer),t.setRenderTarget(v));let Lt=!1;pt.length!==F.cameras.length&&(F.cameras.length=0,Lt=!0);for(let b=0;b<pt.length;b++){const oe=pt[b];let Ut=null;if(p!==null)Ut=p.getViewport(oe);else{const _t=h.getViewSubImage(d,oe);Ut=_t.viewport,b===0&&(t.setRenderTargetTextures(v,_t.colorTexture,_t.depthStencilTexture),t.setRenderTarget(v))}let Ct=P[b];Ct===void 0&&(Ct=new ke,Ct.layers.enable(b),Ct.viewport=new jt,P[b]=Ct),Ct.matrix.fromArray(oe.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(oe.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),b===0&&(F.matrix.copy(Ct.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Lt===!0&&F.cameras.push(Ct)}const Et=r.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){h=n.getBinding();const b=h.getDepthInformation(pt[0]);b&&b.isValid&&b.texture&&m.init(b,r.renderState)}if(Et&&Et.includes("camera-access")&&S){t.state.unbindTexture(),h=n.getBinding();for(let b=0;b<pt.length;b++){const oe=pt[b].camera;if(oe){let Ut=f[oe];Ut||(Ut=new _c,f[oe]=Ut);const Ct=h.getCameraImage(oe);Ut.sourceTexture=Ct}}}}for(let pt=0;pt<C.length;pt++){const Lt=w[pt],Et=C[pt];Lt!==null&&Et!==void 0&&Et.update(Lt,K,c||o)}ne&&ne(Y,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const Zt=new Cc;Zt.setAnimationLoop(se),this.setAnimationLoop=function(Y){ne=Y},this.dispose=function(){}}}const Kn=new fn,$g=new le;function Kg(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,dc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,T,E,v){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),h(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,v)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),S(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,T,E):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ne&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ne&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const T=t.get(f),E=T.envMap,v=T.envMapRotation;E&&(m.envMap.value=E,Kn.copy(v),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),m.envMapRotation.value.setFromMatrix4($g.makeRotationFromEuler(Kn)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,T,E){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*T,m.scale.value=E*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,T){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ne&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function S(m,f){const T=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function jg(i,t,e,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,E){const v=E.program;n.uniformBlockBinding(T,v)}function c(T,E){let v=r[T.id];v===void 0&&(g(T),v=u(T),r[T.id]=v,T.addEventListener("dispose",m));const C=E.program;n.updateUBOMapping(T,C);const w=t.render.frame;s[T.id]!==w&&(d(T),s[T.id]=w)}function u(T){const E=h();T.__bindingPointIndex=E;const v=i.createBuffer(),C=T.__size,w=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,v),v}function h(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const E=r[T.id],v=T.uniforms,C=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let w=0,R=v.length;w<R;w++){const U=Array.isArray(v[w])?v[w]:[v[w]];for(let y=0,M=U.length;y<M;y++){const P=U[y];if(p(P,w,y,C)===!0){const F=P.__offset,H=Array.isArray(P.value)?P.value:[P.value];let q=0;for(let W=0;W<H.length;W++){const X=H[W],$=S(X);typeof X=="number"||typeof X=="boolean"?(P.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,F+q,P.__data)):X.isMatrix3?(P.__data[0]=X.elements[0],P.__data[1]=X.elements[1],P.__data[2]=X.elements[2],P.__data[3]=0,P.__data[4]=X.elements[3],P.__data[5]=X.elements[4],P.__data[6]=X.elements[5],P.__data[7]=0,P.__data[8]=X.elements[6],P.__data[9]=X.elements[7],P.__data[10]=X.elements[8],P.__data[11]=0):(X.toArray(P.__data,q),q+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(T,E,v,C){const w=T.value,R=E+"_"+v;if(C[R]===void 0)return typeof w=="number"||typeof w=="boolean"?C[R]=w:C[R]=w.clone(),!0;{const U=C[R];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return C[R]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function g(T){const E=T.uniforms;let v=0;const C=16;for(let R=0,U=E.length;R<U;R++){const y=Array.isArray(E[R])?E[R]:[E[R]];for(let M=0,P=y.length;M<P;M++){const F=y[M],H=Array.isArray(F.value)?F.value:[F.value];for(let q=0,W=H.length;q<W;q++){const X=H[q],$=S(X),V=v%C,st=V%$.boundary,ut=V+st;v+=st,ut!==0&&C-ut<$.storage&&(v+=C-ut),F.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=$.storage}}}const w=v%C;return w>0&&(v+=C-w),T.__size=v,T.__cache={},this}function S(T){const E={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(E.boundary=4,E.storage=4):T.isVector2?(E.boundary=8,E.storage=8):T.isVector3||T.isColor?(E.boundary=16,E.storage=12):T.isVector4?(E.boundary=16,E.storage=16):T.isMatrix3?(E.boundary=48,E.storage=48):T.isMatrix4?(E.boundary=64,E.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),E}function m(T){const E=T.target;E.removeEventListener("dispose",m);const v=o.indexOf(E.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(r[E.id]),delete r[E.id],delete s[E.id]}function f(){for(const T in r)i.deleteBuffer(r[T]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}class Qg{constructor(t={}){const{canvas:e=$u(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),S=new Int32Array(4);let m=null,f=null;const T=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let C=!1;this._outputColorSpace=Ve;let w=0,R=0,U=null,y=-1,M=null;const P=new jt,F=new jt;let H=null;const q=new Wt(0);let W=0,X=e.width,$=e.height,V=1,st=null,ut=null;const Tt=new jt(0,0,X,$),Ht=new jt(0,0,X,$);let ne=!1;const se=new oa;let Zt=!1,Y=!1;const K=new le,pt=new L,Lt=new jt,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Gt=!1;function Te(){return U===null?V:1}let b=n;function oe(x,I){return e.getContext(x,I)}try{const x={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Zo}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",dt,!1),e.addEventListener("webglcontextcreationerror",j,!1),b===null){const I="webgl2";if(b=oe(I,x),b===null)throw oe(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Ut,Ct,_t,ae,vt,Ft,Me,pe,A,_,O,G,J,k,yt,nt,xt,Mt,tt,lt,Rt,St,ot,It;function D(){Ut=new cm(b),Ut.init(),St=new Xg(b,Ut),Ct=new nm(b,Ut,t,St),_t=new Gg(b,Ut),Ct.reversedDepthBuffer&&d&&_t.buffers.depth.setReversed(!0),ae=new fm(b),vt=new Pg,Ft=new Wg(b,Ut,_t,vt,Ct,St,ae),Me=new rm(v),pe=new lm(v),A=new vf(b),ot=new tm(b,A),_=new um(b,A,ae,ot),O=new pm(b,_,A,ae),tt=new dm(b,Ct,Ft),nt=new im(vt),G=new Cg(v,Me,pe,Ut,Ct,ot,nt),J=new Kg(v,vt),k=new Dg,yt=new Bg(Ut),Mt=new Qp(v,Me,pe,_t,O,p,l),xt=new Vg(v,O,Ct),It=new jg(b,ae,Ct,_t),lt=new em(b,Ut,ae),Rt=new hm(b,Ut,ae),ae.programs=G.programs,v.capabilities=Ct,v.extensions=Ut,v.properties=vt,v.renderLists=k,v.shadowMap=xt,v.state=_t,v.info=ae}D();const et=new Jg(v,b);this.xr=et,this.getContext=function(){return b},this.getContextAttributes=function(){return b.getContextAttributes()},this.forceContextLoss=function(){const x=Ut.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Ut.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(x){x!==void 0&&(V=x,this.setSize(X,$,!1))},this.getSize=function(x){return x.set(X,$)},this.setSize=function(x,I,B=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=x,$=I,e.width=Math.floor(x*V),e.height=Math.floor(I*V),B===!0&&(e.style.width=x+"px",e.style.height=I+"px"),this.setViewport(0,0,x,I)},this.getDrawingBufferSize=function(x){return x.set(X*V,$*V).floor()},this.setDrawingBufferSize=function(x,I,B){X=x,$=I,V=B,e.width=Math.floor(x*B),e.height=Math.floor(I*B),this.setViewport(0,0,x,I)},this.getCurrentViewport=function(x){return x.copy(P)},this.getViewport=function(x){return x.copy(Tt)},this.setViewport=function(x,I,B,z){x.isVector4?Tt.set(x.x,x.y,x.z,x.w):Tt.set(x,I,B,z),_t.viewport(P.copy(Tt).multiplyScalar(V).round())},this.getScissor=function(x){return x.copy(Ht)},this.setScissor=function(x,I,B,z){x.isVector4?Ht.set(x.x,x.y,x.z,x.w):Ht.set(x,I,B,z),_t.scissor(F.copy(Ht).multiplyScalar(V).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(x){_t.setScissorTest(ne=x)},this.setOpaqueSort=function(x){st=x},this.setTransparentSort=function(x){ut=x},this.getClearColor=function(x){return x.copy(Mt.getClearColor())},this.setClearColor=function(){Mt.setClearColor(...arguments)},this.getClearAlpha=function(){return Mt.getClearAlpha()},this.setClearAlpha=function(){Mt.setClearAlpha(...arguments)},this.clear=function(x=!0,I=!0,B=!0){let z=0;if(x){let N=!1;if(U!==null){const Q=U.texture.format;N=Q===ta||Q===Qo||Q===jo}if(N){const Q=U.texture.type,at=Q===hn||Q===oi||Q===ar||Q===lr||Q===$o||Q===Ko,mt=Mt.getClearColor(),ht=Mt.getClearAlpha(),wt=mt.r,Pt=mt.g,At=mt.b;at?(g[0]=wt,g[1]=Pt,g[2]=At,g[3]=ht,b.clearBufferuiv(b.COLOR,0,g)):(S[0]=wt,S[1]=Pt,S[2]=At,S[3]=ht,b.clearBufferiv(b.COLOR,0,S))}else z|=b.COLOR_BUFFER_BIT}I&&(z|=b.DEPTH_BUFFER_BIT),B&&(z|=b.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),b.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",dt,!1),e.removeEventListener("webglcontextcreationerror",j,!1),Mt.dispose(),k.dispose(),yt.dispose(),vt.dispose(),Me.dispose(),pe.dispose(),O.dispose(),ot.dispose(),It.dispose(),G.dispose(),et.dispose(),et.removeEventListener("sessionstart",sn),et.removeEventListener("sessionend",ba),Wn.stop()};function it(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function dt(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const x=ae.autoReset,I=xt.enabled,B=xt.autoUpdate,z=xt.needsUpdate,N=xt.type;D(),ae.autoReset=x,xt.enabled=I,xt.autoUpdate=B,xt.needsUpdate=z,xt.type=N}function j(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function Z(x){const I=x.target;I.removeEventListener("dispose",Z),gt(I)}function gt(x){Dt(x),vt.remove(x)}function Dt(x){const I=vt.get(x).programs;I!==void 0&&(I.forEach(function(B){G.releaseProgram(B)}),x.isShaderMaterial&&G.releaseShaderCache(x))}this.renderBufferDirect=function(x,I,B,z,N,Q){I===null&&(I=Et);const at=N.isMesh&&N.matrixWorld.determinant()<0,mt=Gc(x,I,B,z,N);_t.setMaterial(z,at);let ht=B.index,wt=1;if(z.wireframe===!0){if(ht=_.getWireframeAttribute(B),ht===void 0)return;wt=2}const Pt=B.drawRange,At=B.attributes.position;let Vt=Pt.start*wt,$t=(Pt.start+Pt.count)*wt;Q!==null&&(Vt=Math.max(Vt,Q.start*wt),$t=Math.min($t,(Q.start+Q.count)*wt)),ht!==null?(Vt=Math.max(Vt,0),$t=Math.min($t,ht.count)):At!=null&&(Vt=Math.max(Vt,0),$t=Math.min($t,At.count));const fe=$t-Vt;if(fe<0||fe===1/0)return;ot.setup(N,z,mt,B,ht);let re,te=lt;if(ht!==null&&(re=A.get(ht),te=Rt,te.setIndex(re)),N.isMesh)z.wireframe===!0?(_t.setLineWidth(z.wireframeLinewidth*Te()),te.setMode(b.LINES)):te.setMode(b.TRIANGLES);else if(N.isLine){let bt=z.linewidth;bt===void 0&&(bt=1),_t.setLineWidth(bt*Te()),N.isLineSegments?te.setMode(b.LINES):N.isLineLoop?te.setMode(b.LINE_LOOP):te.setMode(b.LINE_STRIP)}else N.isPoints?te.setMode(b.POINTS):N.isSprite&&te.setMode(b.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)fr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),te.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ut.get("WEBGL_multi_draw"))te.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const bt=N._multiDrawStarts,ce=N._multiDrawCounts,Xt=N._multiDrawCount,Oe=ht?A.get(ht).bytesPerElement:1,hi=vt.get(z).currentProgram.getUniforms();for(let Be=0;Be<Xt;Be++)hi.setValue(b,"_gl_DrawID",Be),te.render(bt[Be]/Oe,ce[Be])}else if(N.isInstancedMesh)te.renderInstances(Vt,fe,N.count);else if(B.isInstancedBufferGeometry){const bt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,ce=Math.min(B.instanceCount,bt);te.renderInstances(Vt,fe,ce)}else te.render(Vt,fe)};function ie(x,I,B){x.transparent===!0&&x.side===Je&&x.forceSinglePass===!1?(x.side=Ne,x.needsUpdate=!0,br(x,I,B),x.side=Hn,x.needsUpdate=!0,br(x,I,B),x.side=Je):br(x,I,B)}this.compile=function(x,I,B=null){B===null&&(B=x),f=yt.get(B),f.init(I),E.push(f),B.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),x!==B&&x.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const z=new Set;return x.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const Q=N.material;if(Q)if(Array.isArray(Q))for(let at=0;at<Q.length;at++){const mt=Q[at];ie(mt,B,N),z.add(mt)}else ie(Q,B,N),z.add(Q)}),f=E.pop(),z},this.compileAsync=function(x,I,B=null){const z=this.compile(x,I,B);return new Promise(N=>{function Q(){if(z.forEach(function(at){vt.get(at).currentProgram.isReady()&&z.delete(at)}),z.size===0){N(x);return}setTimeout(Q,10)}Ut.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Jt=null;function pn(x){Jt&&Jt(x)}function sn(){Wn.stop()}function ba(){Wn.start()}const Wn=new Cc;Wn.setAnimationLoop(pn),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(x){Jt=x,et.setAnimationLoop(x),x===null?Wn.stop():Wn.start()},et.addEventListener("sessionstart",sn),et.addEventListener("sessionend",ba),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(I),I=et.getCamera()),x.isScene===!0&&x.onBeforeRender(v,x,I,U),f=yt.get(x,E.length),f.init(I),E.push(f),K.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),se.setFromProjectionMatrix(K,ln,I.reversedDepth),Y=this.localClippingEnabled,Zt=nt.init(this.clippingPlanes,Y),m=k.get(x,T.length),m.init(),T.push(m),et.enabled===!0&&et.isPresenting===!0){const Q=v.xr.getDepthSensingMesh();Q!==null&&gs(Q,I,-1/0,v.sortObjects)}gs(x,I,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(st,ut),Gt=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,Gt&&Mt.addToRenderList(m,x),this.info.render.frame++,Zt===!0&&nt.beginShadows();const B=f.state.shadowsArray;xt.render(B,x,I),Zt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,N=m.transmissive;if(f.setupLights(),I.isArrayCamera){const Q=I.cameras;if(N.length>0)for(let at=0,mt=Q.length;at<mt;at++){const ht=Q[at];Ra(z,N,x,ht)}Gt&&Mt.render(x);for(let at=0,mt=Q.length;at<mt;at++){const ht=Q[at];wa(m,x,ht,ht.viewport)}}else N.length>0&&Ra(z,N,x,I),Gt&&Mt.render(x),wa(m,x,I);U!==null&&R===0&&(Ft.updateMultisampleRenderTarget(U),Ft.updateRenderTargetMipmap(U)),x.isScene===!0&&x.onAfterRender(v,x,I),ot.resetDefaultState(),y=-1,M=null,E.pop(),E.length>0?(f=E[E.length-1],Zt===!0&&nt.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function gs(x,I,B,z){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)B=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLight)f.pushLight(x),x.castShadow&&f.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||se.intersectsSprite(x)){z&&Lt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(K);const at=O.update(x),mt=x.material;mt.visible&&m.push(x,at,mt,B,Lt.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||se.intersectsObject(x))){const at=O.update(x),mt=x.material;if(z&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Lt.copy(x.boundingSphere.center)):(at.boundingSphere===null&&at.computeBoundingSphere(),Lt.copy(at.boundingSphere.center)),Lt.applyMatrix4(x.matrixWorld).applyMatrix4(K)),Array.isArray(mt)){const ht=at.groups;for(let wt=0,Pt=ht.length;wt<Pt;wt++){const At=ht[wt],Vt=mt[At.materialIndex];Vt&&Vt.visible&&m.push(x,at,Vt,B,Lt.z,At)}}else mt.visible&&m.push(x,at,mt,B,Lt.z,null)}}const Q=x.children;for(let at=0,mt=Q.length;at<mt;at++)gs(Q[at],I,B,z)}function wa(x,I,B,z){const N=x.opaque,Q=x.transmissive,at=x.transparent;f.setupLightsView(B),Zt===!0&&nt.setGlobalState(v.clippingPlanes,B),z&&_t.viewport(P.copy(z)),N.length>0&&Ar(N,I,B),Q.length>0&&Ar(Q,I,B),at.length>0&&Ar(at,I,B),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function Ra(x,I,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[z.id]===void 0&&(f.state.transmissionRenderTarget[z.id]=new ai(1,1,{generateMipmaps:!0,type:Ut.has("EXT_color_buffer_half_float")||Ut.has("EXT_color_buffer_float")?vr:hn,minFilter:ii,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qt.workingColorSpace}));const Q=f.state.transmissionRenderTarget[z.id],at=z.viewport||P;Q.setSize(at.z*v.transmissionResolutionScale,at.w*v.transmissionResolutionScale);const mt=v.getRenderTarget(),ht=v.getActiveCubeFace(),wt=v.getActiveMipmapLevel();v.setRenderTarget(Q),v.getClearColor(q),W=v.getClearAlpha(),W<1&&v.setClearColor(16777215,.5),v.clear(),Gt&&Mt.render(B);const Pt=v.toneMapping;v.toneMapping=zn;const At=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),f.setupLightsView(z),Zt===!0&&nt.setGlobalState(v.clippingPlanes,z),Ar(x,B,z),Ft.updateMultisampleRenderTarget(Q),Ft.updateRenderTargetMipmap(Q),Ut.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let $t=0,fe=I.length;$t<fe;$t++){const re=I[$t],te=re.object,bt=re.geometry,ce=re.material,Xt=re.group;if(ce.side===Je&&te.layers.test(z.layers)){const Oe=ce.side;ce.side=Ne,ce.needsUpdate=!0,Ca(te,B,z,bt,ce,Xt),ce.side=Oe,ce.needsUpdate=!0,Vt=!0}}Vt===!0&&(Ft.updateMultisampleRenderTarget(Q),Ft.updateRenderTargetMipmap(Q))}v.setRenderTarget(mt,ht,wt),v.setClearColor(q,W),At!==void 0&&(z.viewport=At),v.toneMapping=Pt}function Ar(x,I,B){const z=I.isScene===!0?I.overrideMaterial:null;for(let N=0,Q=x.length;N<Q;N++){const at=x[N],mt=at.object,ht=at.geometry,wt=at.group;let Pt=at.material;Pt.allowOverride===!0&&z!==null&&(Pt=z),mt.layers.test(B.layers)&&Ca(mt,I,B,ht,Pt,wt)}}function Ca(x,I,B,z,N,Q){x.onBeforeRender(v,I,B,z,N,Q),x.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),N.onBeforeRender(v,I,B,z,x,Q),N.transparent===!0&&N.side===Je&&N.forceSinglePass===!1?(N.side=Ne,N.needsUpdate=!0,v.renderBufferDirect(B,I,z,N,x,Q),N.side=Hn,N.needsUpdate=!0,v.renderBufferDirect(B,I,z,N,x,Q),N.side=Je):v.renderBufferDirect(B,I,z,N,x,Q),x.onAfterRender(v,I,B,z,N,Q)}function br(x,I,B){I.isScene!==!0&&(I=Et);const z=vt.get(x),N=f.state.lights,Q=f.state.shadowsArray,at=N.state.version,mt=G.getParameters(x,N.state,Q,I,B),ht=G.getProgramCacheKey(mt);let wt=z.programs;z.environment=x.isMeshStandardMaterial?I.environment:null,z.fog=I.fog,z.envMap=(x.isMeshStandardMaterial?pe:Me).get(x.envMap||z.environment),z.envMapRotation=z.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,wt===void 0&&(x.addEventListener("dispose",Z),wt=new Map,z.programs=wt);let Pt=wt.get(ht);if(Pt!==void 0){if(z.currentProgram===Pt&&z.lightsStateVersion===at)return La(x,mt),Pt}else mt.uniforms=G.getUniforms(x),x.onBeforeCompile(mt,v),Pt=G.acquireProgram(mt,ht),wt.set(ht,Pt),z.uniforms=mt.uniforms;const At=z.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(At.clippingPlanes=nt.uniform),La(x,mt),z.needsLights=Xc(x),z.lightsStateVersion=at,z.needsLights&&(At.ambientLightColor.value=N.state.ambient,At.lightProbe.value=N.state.probe,At.directionalLights.value=N.state.directional,At.directionalLightShadows.value=N.state.directionalShadow,At.spotLights.value=N.state.spot,At.spotLightShadows.value=N.state.spotShadow,At.rectAreaLights.value=N.state.rectArea,At.ltc_1.value=N.state.rectAreaLTC1,At.ltc_2.value=N.state.rectAreaLTC2,At.pointLights.value=N.state.point,At.pointLightShadows.value=N.state.pointShadow,At.hemisphereLights.value=N.state.hemi,At.directionalShadowMap.value=N.state.directionalShadowMap,At.directionalShadowMatrix.value=N.state.directionalShadowMatrix,At.spotShadowMap.value=N.state.spotShadowMap,At.spotLightMatrix.value=N.state.spotLightMatrix,At.spotLightMap.value=N.state.spotLightMap,At.pointShadowMap.value=N.state.pointShadowMap,At.pointShadowMatrix.value=N.state.pointShadowMatrix),z.currentProgram=Pt,z.uniformsList=null,Pt}function Pa(x){if(x.uniformsList===null){const I=x.currentProgram.getUniforms();x.uniformsList=ns.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function La(x,I){const B=vt.get(x);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function Gc(x,I,B,z,N){I.isScene!==!0&&(I=Et),Ft.resetTextureUnits();const Q=I.fog,at=z.isMeshStandardMaterial?I.environment:null,mt=U===null?v.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Ii,ht=(z.isMeshStandardMaterial?pe:Me).get(z.envMap||at),wt=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Pt=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),At=!!B.morphAttributes.position,Vt=!!B.morphAttributes.normal,$t=!!B.morphAttributes.color;let fe=zn;z.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(fe=v.toneMapping);const re=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,te=re!==void 0?re.length:0,bt=vt.get(z),ce=f.state.lights;if(Zt===!0&&(Y===!0||x!==M)){const we=x===M&&z.id===y;nt.setState(z,x,we)}let Xt=!1;z.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==ce.state.version||bt.outputColorSpace!==mt||N.isBatchedMesh&&bt.batching===!1||!N.isBatchedMesh&&bt.batching===!0||N.isBatchedMesh&&bt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&bt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&bt.instancing===!1||!N.isInstancedMesh&&bt.instancing===!0||N.isSkinnedMesh&&bt.skinning===!1||!N.isSkinnedMesh&&bt.skinning===!0||N.isInstancedMesh&&bt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&bt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&bt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&bt.instancingMorph===!1&&N.morphTexture!==null||bt.envMap!==ht||z.fog===!0&&bt.fog!==Q||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==nt.numPlanes||bt.numIntersection!==nt.numIntersection)||bt.vertexAlphas!==wt||bt.vertexTangents!==Pt||bt.morphTargets!==At||bt.morphNormals!==Vt||bt.morphColors!==$t||bt.toneMapping!==fe||bt.morphTargetsCount!==te)&&(Xt=!0):(Xt=!0,bt.__version=z.version);let Oe=bt.currentProgram;Xt===!0&&(Oe=br(z,I,N));let hi=!1,Be=!1,Gi=!1;const ue=Oe.getUniforms(),We=bt.uniforms;if(_t.useProgram(Oe.program)&&(hi=!0,Be=!0,Gi=!0),z.id!==y&&(y=z.id,Be=!0),hi||M!==x){_t.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),ue.setValue(b,"projectionMatrix",x.projectionMatrix),ue.setValue(b,"viewMatrix",x.matrixWorldInverse);const De=ue.map.cameraPosition;De!==void 0&&De.setValue(b,pt.setFromMatrixPosition(x.matrixWorld)),Ct.logarithmicDepthBuffer&&ue.setValue(b,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ue.setValue(b,"isOrthographic",x.isOrthographicCamera===!0),M!==x&&(M=x,Be=!0,Gi=!0)}if(N.isSkinnedMesh){ue.setOptional(b,N,"bindMatrix"),ue.setOptional(b,N,"bindMatrixInverse");const we=N.skeleton;we&&(we.boneTexture===null&&we.computeBoneTexture(),ue.setValue(b,"boneTexture",we.boneTexture,Ft))}N.isBatchedMesh&&(ue.setOptional(b,N,"batchingTexture"),ue.setValue(b,"batchingTexture",N._matricesTexture,Ft),ue.setOptional(b,N,"batchingIdTexture"),ue.setValue(b,"batchingIdTexture",N._indirectTexture,Ft),ue.setOptional(b,N,"batchingColorTexture"),N._colorsTexture!==null&&ue.setValue(b,"batchingColorTexture",N._colorsTexture,Ft));const Xe=B.morphAttributes;if((Xe.position!==void 0||Xe.normal!==void 0||Xe.color!==void 0)&&tt.update(N,B,Oe),(Be||bt.receiveShadow!==N.receiveShadow)&&(bt.receiveShadow=N.receiveShadow,ue.setValue(b,"receiveShadow",N.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(We.envMap.value=ht,We.flipEnvMap.value=ht.isCubeTexture&&ht.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&I.environment!==null&&(We.envMapIntensity.value=I.environmentIntensity),Be&&(ue.setValue(b,"toneMappingExposure",v.toneMappingExposure),bt.needsLights&&Wc(We,Gi),Q&&z.fog===!0&&J.refreshFogUniforms(We,Q),J.refreshMaterialUniforms(We,z,V,$,f.state.transmissionRenderTarget[x.id]),ns.upload(b,Pa(bt),We,Ft)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ns.upload(b,Pa(bt),We,Ft),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ue.setValue(b,"center",N.center),ue.setValue(b,"modelViewMatrix",N.modelViewMatrix),ue.setValue(b,"normalMatrix",N.normalMatrix),ue.setValue(b,"modelMatrix",N.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const we=z.uniformsGroups;for(let De=0,_s=we.length;De<_s;De++){const Xn=we[De];It.update(Xn,Oe),It.bind(Xn,Oe)}}return Oe}function Wc(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I}function Xc(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(x,I,B){const z=vt.get(x);z.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),vt.get(x.texture).__webglTexture=I,vt.get(x.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,I){const B=vt.get(x);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0};const qc=b.createFramebuffer();this.setRenderTarget=function(x,I=0,B=0){U=x,w=I,R=B;let z=!0,N=null,Q=!1,at=!1;if(x){const ht=vt.get(x);if(ht.__useDefaultFramebuffer!==void 0)_t.bindFramebuffer(b.FRAMEBUFFER,null),z=!1;else if(ht.__webglFramebuffer===void 0)Ft.setupRenderTarget(x);else if(ht.__hasExternalTextures)Ft.rebindTextures(x,vt.get(x.texture).__webglTexture,vt.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const At=x.depthTexture;if(ht.__boundDepthTexture!==At){if(At!==null&&vt.has(At)&&(x.width!==At.image.width||x.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ft.setupDepthRenderbuffer(x)}}const wt=x.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(at=!0);const Pt=vt.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Pt[I])?N=Pt[I][B]:N=Pt[I],Q=!0):x.samples>0&&Ft.useMultisampledRTT(x)===!1?N=vt.get(x).__webglMultisampledFramebuffer:Array.isArray(Pt)?N=Pt[B]:N=Pt,P.copy(x.viewport),F.copy(x.scissor),H=x.scissorTest}else P.copy(Tt).multiplyScalar(V).floor(),F.copy(Ht).multiplyScalar(V).floor(),H=ne;if(B!==0&&(N=qc),_t.bindFramebuffer(b.FRAMEBUFFER,N)&&z&&_t.drawBuffers(x,N),_t.viewport(P),_t.scissor(F),_t.setScissorTest(H),Q){const ht=vt.get(x.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_CUBE_MAP_POSITIVE_X+I,ht.__webglTexture,B)}else if(at){const ht=I;for(let wt=0;wt<x.textures.length;wt++){const Pt=vt.get(x.textures[wt]);b.framebufferTextureLayer(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0+wt,Pt.__webglTexture,B,ht)}}else if(x!==null&&B!==0){const ht=vt.get(x.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,ht.__webglTexture,B)}y=-1},this.readRenderTargetPixels=function(x,I,B,z,N,Q,at,mt=0){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ht=vt.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&at!==void 0&&(ht=ht[at]),ht){_t.bindFramebuffer(b.FRAMEBUFFER,ht);try{const wt=x.textures[mt],Pt=wt.format,At=wt.type;if(!Ct.textureFormatReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-z&&B>=0&&B<=x.height-N&&(x.textures.length>1&&b.readBuffer(b.COLOR_ATTACHMENT0+mt),b.readPixels(I,B,z,N,St.convert(Pt),St.convert(At),Q))}finally{const wt=U!==null?vt.get(U).__webglFramebuffer:null;_t.bindFramebuffer(b.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(x,I,B,z,N,Q,at,mt=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ht=vt.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&at!==void 0&&(ht=ht[at]),ht)if(I>=0&&I<=x.width-z&&B>=0&&B<=x.height-N){_t.bindFramebuffer(b.FRAMEBUFFER,ht);const wt=x.textures[mt],Pt=wt.format,At=wt.type;if(!Ct.textureFormatReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Vt=b.createBuffer();b.bindBuffer(b.PIXEL_PACK_BUFFER,Vt),b.bufferData(b.PIXEL_PACK_BUFFER,Q.byteLength,b.STREAM_READ),x.textures.length>1&&b.readBuffer(b.COLOR_ATTACHMENT0+mt),b.readPixels(I,B,z,N,St.convert(Pt),St.convert(At),0);const $t=U!==null?vt.get(U).__webglFramebuffer:null;_t.bindFramebuffer(b.FRAMEBUFFER,$t);const fe=b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE,0);return b.flush(),await Ku(b,fe,4),b.bindBuffer(b.PIXEL_PACK_BUFFER,Vt),b.getBufferSubData(b.PIXEL_PACK_BUFFER,0,Q),b.deleteBuffer(Vt),b.deleteSync(fe),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,I=null,B=0){const z=Math.pow(2,-B),N=Math.floor(x.image.width*z),Q=Math.floor(x.image.height*z),at=I!==null?I.x:0,mt=I!==null?I.y:0;Ft.setTexture2D(x,0),b.copyTexSubImage2D(b.TEXTURE_2D,B,0,0,at,mt,N,Q),_t.unbindTexture()};const Yc=b.createFramebuffer(),Zc=b.createFramebuffer();this.copyTextureToTexture=function(x,I,B=null,z=null,N=0,Q=null){Q===null&&(N!==0?(fr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=N,N=0):Q=0);let at,mt,ht,wt,Pt,At,Vt,$t,fe;const re=x.isCompressedTexture?x.mipmaps[Q]:x.image;if(B!==null)at=B.max.x-B.min.x,mt=B.max.y-B.min.y,ht=B.isBox3?B.max.z-B.min.z:1,wt=B.min.x,Pt=B.min.y,At=B.isBox3?B.min.z:0;else{const Xe=Math.pow(2,-N);at=Math.floor(re.width*Xe),mt=Math.floor(re.height*Xe),x.isDataArrayTexture?ht=re.depth:x.isData3DTexture?ht=Math.floor(re.depth*Xe):ht=1,wt=0,Pt=0,At=0}z!==null?(Vt=z.x,$t=z.y,fe=z.z):(Vt=0,$t=0,fe=0);const te=St.convert(I.format),bt=St.convert(I.type);let ce;I.isData3DTexture?(Ft.setTexture3D(I,0),ce=b.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Ft.setTexture2DArray(I,0),ce=b.TEXTURE_2D_ARRAY):(Ft.setTexture2D(I,0),ce=b.TEXTURE_2D),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,I.flipY),b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),b.pixelStorei(b.UNPACK_ALIGNMENT,I.unpackAlignment);const Xt=b.getParameter(b.UNPACK_ROW_LENGTH),Oe=b.getParameter(b.UNPACK_IMAGE_HEIGHT),hi=b.getParameter(b.UNPACK_SKIP_PIXELS),Be=b.getParameter(b.UNPACK_SKIP_ROWS),Gi=b.getParameter(b.UNPACK_SKIP_IMAGES);b.pixelStorei(b.UNPACK_ROW_LENGTH,re.width),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,re.height),b.pixelStorei(b.UNPACK_SKIP_PIXELS,wt),b.pixelStorei(b.UNPACK_SKIP_ROWS,Pt),b.pixelStorei(b.UNPACK_SKIP_IMAGES,At);const ue=x.isDataArrayTexture||x.isData3DTexture,We=I.isDataArrayTexture||I.isData3DTexture;if(x.isDepthTexture){const Xe=vt.get(x),we=vt.get(I),De=vt.get(Xe.__renderTarget),_s=vt.get(we.__renderTarget);_t.bindFramebuffer(b.READ_FRAMEBUFFER,De.__webglFramebuffer),_t.bindFramebuffer(b.DRAW_FRAMEBUFFER,_s.__webglFramebuffer);for(let Xn=0;Xn<ht;Xn++)ue&&(b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,vt.get(x).__webglTexture,N,At+Xn),b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,vt.get(I).__webglTexture,Q,fe+Xn)),b.blitFramebuffer(wt,Pt,at,mt,Vt,$t,at,mt,b.DEPTH_BUFFER_BIT,b.NEAREST);_t.bindFramebuffer(b.READ_FRAMEBUFFER,null),_t.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else if(N!==0||x.isRenderTargetTexture||vt.has(x)){const Xe=vt.get(x),we=vt.get(I);_t.bindFramebuffer(b.READ_FRAMEBUFFER,Yc),_t.bindFramebuffer(b.DRAW_FRAMEBUFFER,Zc);for(let De=0;De<ht;De++)ue?b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,Xe.__webglTexture,N,At+De):b.framebufferTexture2D(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,Xe.__webglTexture,N),We?b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,we.__webglTexture,Q,fe+De):b.framebufferTexture2D(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,we.__webglTexture,Q),N!==0?b.blitFramebuffer(wt,Pt,at,mt,Vt,$t,at,mt,b.COLOR_BUFFER_BIT,b.NEAREST):We?b.copyTexSubImage3D(ce,Q,Vt,$t,fe+De,wt,Pt,at,mt):b.copyTexSubImage2D(ce,Q,Vt,$t,wt,Pt,at,mt);_t.bindFramebuffer(b.READ_FRAMEBUFFER,null),_t.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else We?x.isDataTexture||x.isData3DTexture?b.texSubImage3D(ce,Q,Vt,$t,fe,at,mt,ht,te,bt,re.data):I.isCompressedArrayTexture?b.compressedTexSubImage3D(ce,Q,Vt,$t,fe,at,mt,ht,te,re.data):b.texSubImage3D(ce,Q,Vt,$t,fe,at,mt,ht,te,bt,re):x.isDataTexture?b.texSubImage2D(b.TEXTURE_2D,Q,Vt,$t,at,mt,te,bt,re.data):x.isCompressedTexture?b.compressedTexSubImage2D(b.TEXTURE_2D,Q,Vt,$t,re.width,re.height,te,re.data):b.texSubImage2D(b.TEXTURE_2D,Q,Vt,$t,at,mt,te,bt,re);b.pixelStorei(b.UNPACK_ROW_LENGTH,Xt),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,Oe),b.pixelStorei(b.UNPACK_SKIP_PIXELS,hi),b.pixelStorei(b.UNPACK_SKIP_ROWS,Be),b.pixelStorei(b.UNPACK_SKIP_IMAGES,Gi),Q===0&&I.generateMipmaps&&b.generateMipmap(ce),_t.unbindTexture()},this.initRenderTarget=function(x){vt.get(x).__webglFramebuffer===void 0&&Ft.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?Ft.setTextureCube(x,0):x.isData3DTexture?Ft.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?Ft.setTexture2DArray(x,0):Ft.setTexture2D(x,0),_t.unbindTexture()},this.resetState=function(){w=0,R=0,U=null,_t.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=qt._getUnpackColorSpace()}}const ct=i=>document.querySelector(i),Oi=ct("#world"),xe=new yh;xe.background=new Wt("#849785");xe.fog=new sa("#8d9d87",.014);const Rn=new Qg({canvas:Oi,antialias:!0});Rn.setPixelRatio(Math.min(devicePixelRatio,2));Rn.setSize(innerWidth,innerHeight);Rn.shadowMap.enabled=!0;Rn.shadowMap.type=ql;Rn.outputColorSpace=Ve;Rn.toneMapping=Zl;Rn.toneMappingExposure=1.24;const si=new ke(42,innerWidth/innerHeight,.1,180);let ji=.68,sr=38;const Ji=new L(0,0,0);xe.add(new lf("#dce7ba","#405e47",2.4));const Vi=new ff("#fff3b7",3.1);Vi.position.set(-18,32,-8);Vi.castShadow=!0;Vi.shadow.mapSize.set(2048,2048);Object.assign(Vi.shadow.camera,{left:-38,right:38,top:38,bottom:-38,far:90});Vi.shadow.normalBias=.06;xe.add(Vi);xe.add(new df("#8bac90",.35));let js=531;function de(){return js=js*16807%2147483647,(js-1)/2147483646}const Bt=(i,t={})=>new sf({color:i,roughness:.95,...t}),Qt={ground:Bt("#5e7650"),bark:Bt("#5b5140"),dark:Bt("#172f34"),roof:Bt("#5b5142"),wood:Bt("#9a8460"),rock:Bt("#8c9980"),path:Bt("#b7b38a")};function Le(i,t,e=0,n=0,r=0,s=xe){const o=new cn(i,t);return o.position.set(e,n,r),o.castShadow=!0,o.receiveShadow=!0,s.add(o),o}function ee(i,t,e,n,r,s,o,a){return Le(new zi(i,t,e),n,r,s,o,a)}function ye(i,t,e,n,r,s){return Le(new ua(i,1),t,e,n,r,s)}function En(i,t,e,n,r,s,o,a,l=8){return Le(new us(i,t,e,l),n,r,s,o,a)}const ds=Le(new yr(150,150),Qt.ground);ds.rotation.x=-Math.PI/2;ds.receiveShadow=!0;ds.name="ground";const Xo=["#344f3b","#456443","#536e44","#617d4b","#768957"].map(i=>Bt(i));function Ic(i,t,e=6){const n=new Ie;n.position.set(i,0,t),xe.add(n),En(.18,.38,e*.7,Qt.bark,0,e*.35,0,n);const r=Xo[Math.floor(de()*Xo.length)];for(let s=0;s<3;s++){const o=Le(new An(e*(.28-s*.055),e*.53,7),r,0,e*(.47+s*.2),0,n);o.rotation.y=de()*6}return n}for(let i=0;i<210;i++){const t=(de()-.5)*90,e=(de()-.5)*85,n=Math.abs(t)<12&&e>-14&&e<15,r=Math.abs(t-(15+Math.sin(e*.13)*3))<3.2;!n&&!r&&Math.hypot(t+12,e+13)>5.2&&Ic(t,e,4+de()*7)}for(const[i,t,e]of[[-10,5,8],[-11,-1,8],[-8,-10,7],[10,-9,7],[9,8,6],[-16,10,9],[21,8,8],[-20,-6,10],[-4,-18,9],[7,-17,7]])Ic(i,t,e);function pa(i,t=1.2){for(let e=0;e<i.length-1;e++){const n=new L(i[e][0],.026,i[e][1]),r=new L(i[e+1][0],.026,i[e+1][1]),s=n.distanceTo(r);for(let o=0;o<s;o+=.55){const a=n.clone().lerp(r,o/s),l=En(t*(.9+de()*.16),t,.035,Qt.path,a.x,.025,a.z,xe,9);l.rotation.y=de()*6}}}pa([[-4,18],[-3,12],[-1,7],[0,3],[2,-2],[0,-6],[-4,-10],[-12,-13]],1.45);pa([[0,3],[6,3],[11,2],[18,1],[23,-6]],1.05);pa([[0,-6],[5,-11],[8,-17]],.8);const gr=new yc;for(let i=0;i<=80;i++){const t=-42+i,e=15+Math.sin(t*.13)*3;i===0?gr.moveTo(e-1.5,t):gr.lineTo(e-1.5,t)}for(let i=80;i>=0;i--){const t=-42+i;gr.lineTo(16.5+Math.sin(t*.13)*3,t)}gr.closePath();const ma=Le(new ha(gr),Bt("#7baba2",{metalness:.25,roughness:.3,transparent:!0,opacity:.9}));ma.rotation.x=Math.PI/2;ma.position.y=.055;ma.material.side=Je;for(let i=0;i<45;i++){let t=de()*70-35,e=15+Math.sin(t*.13)*3,n=ye(.25+de()*.55,Qt.rock,e+(de()>.5?1.8:-1.8),.1,t);n.scale.y=.55}const _r=new Ie;_r.position.set(15,0,1);xe.add(_r);for(let i=0;i<13;i++)ee(.43,.16,2.5,Qt.wood,-2.7+i*.44,.35,0,_r);for(const i of[-1.15,1.15]){for(const t of[-2.7,2.7])ee(.14,1.3,.14,Qt.bark,t,.9,i,_r);ee(5.5,.12,.13,Qt.wood,0,1.3,i,_r)}const rn=new Ie;rn.position.set(-4,0,-6);xe.add(rn);ee(4,2.6,3.5,Bt("#807352"),0,1.3,0,rn);for(let i=0;i<10;i++)ee(4.1,.07,3.6,Qt.bark,0,.2+i*.26,0,rn);const Nc=Le(new An(3.2,1.9,4),Bt("#535d48"),0,3.4,0,rn);Nc.rotation.y=Math.PI/4;Nc.scale.z=.96;ee(.9,1.8,.09,Bt("#354639"),.6,.9,1.79,rn);ee(.9,.7,.1,Bt("#eedca0",{emissive:"#e7c665",emissiveIntensity:.5}),-1,0+1.5,1.81,rn);ee(.06,.7,.12,Qt.bark,-1,1.5,1.85,rn);ee(.9,.06,.12,Qt.bark,-1,1.5,1.85,rn);ee(4.6,.18,1.1,Qt.wood,0,.15,2.1,rn);ee(.5,2,.5,Qt.rock,1.2,3,-.7,rn);const ki=new Ie;ki.position.set(4.6,0,-3);ki.rotation.y=-.4;xe.add(ki);const ga=new Ge;ga.setAttribute("position",new me([-1.5,0,1.8,0,2,1.8,0,2,-1.8,-1.5,0,1.8,0,2,-1.8,-1.5,0,-1.8,1.5,0,1.8,0,2,-1.8,0,2,1.8,1.5,0,1.8,1.5,0,-1.8,0,2,-1.8],3));ga.computeVertexNormals();Le(ga,Bt("#b9a16a",{side:Je}),0,0,0,ki);const _a=new Ge;_a.setAttribute("position",new me([-1.5,0,1.81,0,2,1.81,1.5,0,1.81],3));_a.computeVertexNormals();Le(_a,Bt("#575b3e",{side:Je}),0,0,0,ki);ee(.06,2.15,.06,Qt.bark,0,1,1.85,ki);const Er=new Ie;Er.position.set(1.1,0,1);xe.add(Er);for(let i=0;i<10;i++){const t=i/10*Math.PI*2,e=ye(.25,Qt.rock,Math.cos(t)*.8,.16,Math.sin(t)*.8,Er);e.scale.y=.65}for(let i=0;i<3;i++){const t=En(.13,.13,1.25,Qt.bark,0,.17,0,Er);t.rotation.z=Math.PI/2,t.rotation.y=i*1.1}const t_=Le(new An(.32,.7,6),Bt("#f2bd63",{emissive:"#ec8e37",emissiveIntensity:1}),0,.53,0,Er),va=new uf("#ffbf61",5,7);va.position.set(1,1.1,1);xe.add(va);for(const[i,t]of[[-1.5,1],[2.3,3]]){const e=En(.3,.3,2.2,Qt.bark,i,.3,t);e.rotation.z=Math.PI/2,e.rotation.y=.7}ee(1.2,.8,.9,Qt.wood,5,.4,1);ee(.8,.55,.7,Bt("#898361"),5.2,1.06,1.1);const Gn=new Ie;Gn.position.set(-12,0,-13);xe.add(Gn);ye(3,Bt("#727d64"),0,.65,-1,Gn);ee(2.5,2.6,.15,Bt("#182d29"),0,1.1,1.5,Gn);for(const i of[-1.4,1.4])ee(.4,3,.5,Qt.bark,i,1.4,1.65,Gn);ee(3.25,.4,.5,Qt.bark,0,2.85,1.65,Gn);const Fc=[];for(let i=0;i<4;i++)Fc.push(ee(.12,2.5,.1,Qt.wood,-.95+i*.64,1.3,1.77,Gn));ee(.35,.4,.2,Bt("#bdab67"),0,1.2,1.94,Gn);for(let i=0;i<280;i++){const t=(de()-.5)*54,e=(de()-.5)*48;if(Math.abs(t)<7&&e>-9&&e<10)continue;const n=new Ie;n.position.set(t,.02,e),xe.add(n);const r=Xo[Math.floor(de()*5)];for(let s=0;s<3;s++){const o=Le(new An(.12,.5+de()*.45,3),r,(de()-.5)*.4,.3,(de()-.5)*.4,n);o.rotation.z=(de()-.5)*.8}if(i%8===0){const s=ye(.3+de()*.4,Qt.rock,t,.15,e);s.scale.y=.6}if(i%5===0){En(.04,.05,.25,Bt("#d6cca5"),t,.15,e);const s=ye(.17,Bt(i%10===0?"#c8a576":"#d8cf9b"),t,.3,e);s.scale.y=.45}}function e_(){const i=new Ie;ye(.4,Bt("#233a40"),0,.65,0,i).scale.set(.8,1.15,.85),ye(.3,Qt.dark,0,1.13,-.09,i);const e=Le(new An(.11,.4,4),Bt("#cca76b"),0,1.1,-.48,i);e.rotation.x=-Math.PI/2;for(const s of[-.22,.22])ye(.044,Bt("#f0d996",{emissive:"#ccbb77",emissiveIntensity:.35}),s,1.19,-.3,i);const n=[];for(const s of[-.35,.35]){const o=ye(.29,Bt("#293f43"),s,.7,.04,i);o.scale.set(.4,1.5,.9),n.push(o)}En(.38,.4,.08,Bt("#827652"),0,1.4,0,i),En(.23,.25,.3,Bt("#8c8059"),0,1.57,0,i),En(.247,.255,.065,Bt("#3b4940"),0,1.46,0,i),En(.31,.29,.12,Bt("#bdaa6b"),0,.96,0,i),ee(.12,.4,.08,Bt("#bdaa6b"),.18,.73,-.29,i);for(const s of[-.14,.14])ee(.065,.28,.065,Bt("#a39970"),s,.18,0,i),ee(.09,.045,.22,Bt("#a39970"),s,.05,-.05,i);const r=Le(new An(.25,.55,3),Qt.dark,0,.5,.43,i);return r.rotation.x=.7,i.userData.wings=n,i}const kt=e_();kt.position.set(-1,0,6);xe.add(kt);let Pe=null,Ze=!1,ri=!1,qo=!1;function xa(i,t,e){const n=new Ie;n.position.set(i,0,t),xe.add(n);const r=Bt(e==="fox"?"#b98350":"#a49b76");ye(.55,r,0,.55,0,n),ye(.4,r,0,1.15,0,n);for(const s of[-.25,.25])Le(new An(.18,.45,3),r,s,1.53,0,n),ye(.045,Qt.dark,s*.8,1.2,.35,n);return ye(.12,Qt.dark,0,1.03,.4,n),e==="fox"&&ye(.4,r,.6,.4,-.4,n).scale.set(1.7,.6,.7),n}xa(8,-10,"fox");xa(21,2,"owl");const os=xa(-11,-9,"deer");os.visible=!1;for(const i of[-1,1]){const t=ee(.08,.7,.08,Qt.wood,i*.25,1.85,0,os);t.rotation.z=i*.3;const e=ee(.3,.07,.07,Qt.wood,i*.38,1.95,0,os);e.rotation.z=i*.35}const ui=[{id:"letter",name:"未寄出的信",type:"书面物证",x:-3,z:-3.8,icon:"✉",text:"“今晚七点，去旧矿井寻找失踪的萤火虫。别惊动森林里的孩子们。”落款是守林人鹿先生。信纸背面画着三颗星星。",note:"守林人主动前往旧矿井；密码第一位：3。"},{id:"scarf",name:"挂住的红围巾",type:"现场物证",x:5,z:1.5,icon:"◇",text:"围巾被箱子的木刺挂破了，周围没有打斗痕迹。上面沾着仅在矿井深处生长的银色苔藓。",note:"并非绑架现场；守林人曾接近矿井。"},{id:"tracks",name:"泥地里的脚印",type:"痕迹证据",x:10,z:2.8,icon:"⋰",text:"鹿蹄印和细小的萤火虫荧粉交织在一起。所有足迹都朝向西北，只有去程，没有返回。",note:"他跟随着萤火虫，向旧矿井走去。"},{id:"fox",name:"狐狸的证词",type:"居民证词",x:8,z:-10,icon:"♧",text:"“我看见鹿先生拿着灯往矿井去了！后来山里轰的一声……我太害怕，就跑回来了。矿门标牌上有一弯月亮。”",note:"坍塌发生在进入矿井之后；密码第二位：1。"},{id:"owl",name:"猫头鹰的目击",type:"居民证词",x:21,z:2,icon:"◉",text:"“我从上空看见，矿井里仍有灯光闪烁。那不是求救之外的任何东西。老矿工总说：先数星星，再看月亮，最后数树。”",note:"守林人可能还活着；密码按星、月、树排列。"},{id:"sign",name:"旧矿工的标记",type:"环境线索",x:-10,z:-11,icon:"⌁",text:"一块倒下的木牌刻着：星 → 月 → 树。底部整齐地雕着四棵松树。锁孔旁传来微弱的敲击声。",note:"密码第三位：4。矿井里有幸存者。"}];let Yt={found:[],solved:!1,rescued:!1};try{const i=JSON.parse(localStorage.getItem("ravenwood-v1"));i&&Array.isArray(i.found)&&(Yt={...Yt,...i,found:i.found.filter(t=>ui.some(e=>e.id===t))})}catch{}const as=[],Yo=Bt("#d2e68c",{emissive:"#d0e98b",emissiveIntensity:.7});for(const i of ui){if(i.id==="letter"){const r=ee(.65,.03,.45,Bt("#eee0b0"),i.x,.22,i.z);r.rotation.y=.3}if(i.id==="scarf"&&ee(.6,.06,.3,Bt("#a96d53"),i.x,.06,i.z),i.id==="tracks")for(let r=0;r<5;r++){const s=ye(.13,Bt("#596344"),i.x+r*.19,.07,i.z-r*.3);s.scale.y=.2}i.id==="sign"&&ee(.95,.7,.15,Qt.wood,i.x,.4,i.z);const t=Le(new fa(.48,.025,5,40),Yo,i.x,.1,i.z);t.rotation.x=-Math.PI/2;const e=ye(.075,Yo,i.x,1.9,i.z),n=document.createElement("button");n.className="world-label",n.innerHTML=`<span class="diamond">◇</span>${i.name}`,n.onclick=()=>Sa(i),ct("#world-labels").append(n),as.push({c:i,ring:t,dot:e,el:n})}const Tr=document.createElement("button");Tr.className="world-label";Tr.innerHTML="⌂ 旧矿井 · 密码锁";Tr.onclick=()=>Sa({id:"mine",x:-12,z:-10});ct("#world-labels").append(Tr);const Ma=new Ie;xe.add(Ma);for(let i=0;i<50;i++){const t=ye(.025+de()*.025,Yo,(de()-.5)*40,.6+de()*3,(de()-.5)*30);Ma.add(t),t.userData.origin=t.position.clone()}function ps(){try{localStorage.setItem("ravenwood-v1",JSON.stringify(Yt))}catch{}Oc()}function Oc(){os.visible=Yt.rescued,Fc.forEach(i=>i.visible=!Yt.rescued),ct("#progress").textContent=`${Yt.found.length} / 6`,ct("#progress-bar").style.width=Yt.found.length/6*100+"%",Yt.rescued?(ct("#objective").textContent="案件告破 · 森林重逢",ct("#objective-detail").textContent="你找到了守林人，也守住了森林的秘密。",ct("#mission").textContent="继续探索，聆听森林"):Yt.solved?(ct("#objective").textContent="前往旧矿井，救出守林人",ct("#mission").textContent="按星、月、树顺序解开密码"):Yt.found.length>=4?(ct("#objective").textContent="连接线索，重现真相",ct("#mission").textContent="打开推理之线，验证你的推断"):Yt.found.length>=2&&(ct("#objective").textContent="追踪足迹，询问森林居民",ct("#mission").textContent="寻找狐狸与猫头鹰"),as.forEach(i=>{const t=Yt.found.includes(i.c.id);i.el.classList.toggle("found",t),i.ring.visible=!t,i.dot.visible=!t})}Oc();let zl;function bn(i){ct("#toast").textContent=i,ct("#toast").classList.add("show"),clearTimeout(zl),zl=setTimeout(()=>ct("#toast").classList.remove("show"),4200)}function kn(i){ct("#modal-body").innerHTML=i,ct("#modal").classList.remove("hidden"),Pe=null}function wn(){ct("#modal").classList.add("hidden")}ct("#close-modal").onclick=wn;ct("#modal").onclick=i=>{i.target===ct("#modal")&&wn()};function ls(i){if(i.id==="mine")return n_();const t=Yt.found.includes(i.id);kn(`<div class="eyebrow">${i.type} <span>FOREST EVIDENCE</span></div><h2>${i.icon} ${i.name}</h2><p>${i.text}</p><div class="hint">阿墨的观察：${i.note}</div><button class="primary" id="collect">${t?"已收录 · 继续调查":"记录线索 →"}</button>`),ct("#collect").onclick=()=>{t||(Yt.found.push(i.id),ps(),Aa(),bn(`线索已收录：${i.name} (${Yt.found.length}/6)`)),wn()}}let Sn=null;function Sa(i){if(ri)return bn("请先继续游戏");if(Math.hypot(i.x-kt.position.x,i.z-kt.position.z)<2.6){ls(i);return}Sn=i,Pe=new L(i.x,0,i.z),bn("阿墨正前往调查地点…")}function ya(){kn(`<div class="eyebrow">DETECTIVE'S JOURNAL <span>CASE 001</span></div><h2>每一条线索，都有回声。</h2><p>鹿先生在昨夜失踪。串联物证与证词，找出他去了哪里。</p><div class="clue-grid">${ui.map((i,t)=>`<article class="clue-card ${Yt.found.includes(i.id)?"":"locked"}"><div class="number">EVIDENCE 0${t+1} · ${i.type}</div><h3>${Yt.found.includes(i.id)?i.icon+" "+i.name:"◇ 未发现的线索"}</h3><p>${Yt.found.includes(i.id)?i.note:"探索森林，与发光的物件或居民互动。"}</p></article>`).join("")}</div><button class="primary" id="journal-deduce">连接线索 →</button>`),ct("#journal-deduce").onclick=ms}function ms(){kn(`<div class="eyebrow">THE DEDUCTION BOARD <span>${Yt.found.length}/6 EVIDENCE</span></div><h2>拼出森林的真相</h2><p>物证告诉你发生了什么，证词帮你理解为什么。至少需要四条线索才能验证推理。</p><div class="question">01 / 鹿先生去了哪里？<select id="where"><option value="">选择地点</option><option value="lake">河对岸的湖泊</option><option value="mine">西北方向的旧矿井</option><option value="cabin">守林人小屋</option></select></div><div class="question">02 / 他为什么离开营地？<select id="why"><option value="">选择动机</option><option value="kidnap">被狐狸绑架</option><option value="bugs">寻找失踪的萤火虫</option><option value="run">躲避森林居民</option></select></div><div class="question">03 / 是什么阻止了他回来？<select id="what"><option value="">选择原因</option><option value="lost">在森林迷路</option><option value="collapse">矿井坍塌，困在里面</option><option value="sleep">在小屋睡着了</option></select></div><div id="deduction-result" class="hint">${Yt.solved?"✓ 推理已验证。找到矿井密码，就能完成救援。":"选择三个推断，再用线索验证。"}</div><button id="verify" class="primary">验证推理 →</button>`),ct("#verify").onclick=()=>{let i;Yt.found.length<4?i="证据还不够。再找到 "+(4-Yt.found.length)+" 条线索，才能形成可靠的推断。":!ct("#where").value||!ct("#why").value||!ct("#what").value?i="请完成三个推断。":ct("#where").value==="mine"&&ct("#why").value==="bugs"&&ct("#what").value==="collapse"?(Yt.solved=!0,ps(),Aa(),i="✓ 推理成立！鹿先生为了寻找萤火虫进入旧矿井，随后被坍塌困住。立刻前往西北的旧矿井！"):i="有些推断和证据矛盾。再看看未寄出的信、脚印和狐狸的证词。",ct("#deduction-result").textContent=i}}function n_(){if(Yt.rescued)return Hl();if(!Yt.solved){kn('<div class="eyebrow">THE OLD MINE</div><h2>矿门之后，是谁？</h2><p>石壁后传来敲击声。你需要先弄清发生了什么，才能决定如何安全救援。</p><button class="primary" id="mine-deduce">打开推理之线</button>'),ct("#mine-deduce").onclick=ms;return}kn('<div class="eyebrow">FINAL CHAPTER · THE RESCUE</div><h2>星星、月亮与松树</h2><p>矿井侧门的三位密码锁依然完好。旧矿工留下的提示是：<b>先数星星，再看月亮，最后数树。</b></p><div class="question">输入三位密码<input id="code" inputmode="numeric" maxlength="3" aria-label="矿井三位密码" placeholder="• • •" style="display:block;width:100%;padding:18px;font-size:24px;letter-spacing:20px;margin-top:12px;border:1px solid #aab494;background:#f4f1de;border-radius:5px;color:#354a31"/></div><div id="lock-result" class="hint">回顾信纸、狐狸的证词与旧矿工的标记。</div><button class="primary" id="unlock">打开侧门 →</button>'),ct("#unlock").onclick=()=>{ct("#code").value==="314"?(Yt.rescued=!0,ps(),Aa(),Hl()):ct("#lock-result").textContent="锁没有打开。星星的数量在信纸背面，月亮藏在狐狸的回忆里，树木刻在旧木牌上。"}}function Hl(){kn(`<div class="ending"><div class="eyebrow">CASE CLOSED · NO. 001</div><div class="ending-icon">✧</div><h2>微光，终于回到了森林。</h2><p>侧门缓缓打开。鹿先生抱着一盏装满萤火虫的灯，从碎石后走出来。<br>“我就知道，会有人听见。”</p><p>有时候，最勇敢的事不是独自走进黑暗，<br>而是相信，总有朋友会循着微光而来。</p><div class="hint">案件已侦破 · ${Yt.found.length}/6 条线索 · ${Yt.found.length===6?"无遗漏的森林名侦探":"敏锐的森林调查员"}</div><button class="primary" id="continue">继续漫游森林</button><button class="text-button" id="restart">重新调查本案 ↻</button></div>`),ct("#continue").onclick=wn,ct("#restart").onclick=()=>{Yt={found:[],solved:!1,rescued:!1},ps(),kt.position.set(-1,0,6),ct("#objective").textContent="调查守林人的营地",ct("#objective-detail").textContent="靠近发光的物件，寻找失踪的线索。",ct("#mission").textContent="检查营地里遗留的物品",wn(),bn("新的一页，新的调查。")}}function i_(){kn('<div class="eyebrow">A SMALL GUIDE TO THE FOREST</div><h2>欢迎来到鸦林，侦探。</h2><p>扮演乌鸦侦探阿墨，寻找失踪的守林人。点击任意线索标签，阿墨会自动走过去调查。</p><div class="controls-table"><b>W A S D / 方向键</b><span>在森林中移动</span><b>点击 / 拖动 / 滚轮</b><span>移动 / 旋转视角 / 缩放</span><b>E</b><span>调查附近物品或询问居民</span><b>Q · 鸦之视野</b><span>揭示尚未发现的线索，指引最近目标</span><b>F · 低空飞行</b><span>展开翅膀，更快地越过河流和树林</span><b>J / R / M</b><span>线索手册 / 案件推理 / 森林地图</span><b>Esc</b><span>关闭面板 / 暂停游戏</span></div><div class="hint">调查 → 收集至少 4 条线索 → 验证推理 → 解开矿井密码 → 救出守林人。进度保存在当前浏览器。</div><button class="primary" id="help-go">开始探索 →</button>'),ct("#help-go").onclick=wn}function Ea(){Ze=!Ze,ct("#fly").classList.toggle("active",Ze),ct("#explore").classList.toggle("active",!Ze),ct("#mode").textContent=Ze?"低空飞行中":"步行探索中",bn(Ze?"展开翅膀 · 可以飞越河流，移动速度提升":"轻轻落地 · 继续寻找线索")}let Vl;function Bc(){qo=!0,ct("#scan").classList.add("active"),ct(".vignette").classList.remove("scan-wash"),ct(".vignette").offsetWidth,ct(".vignette").classList.add("scan-wash");const i=ui.filter(t=>!Yt.found.includes(t.id)).sort((t,e)=>Math.hypot(t.x-kt.position.x,t.z-kt.position.z)-Math.hypot(e.x-kt.position.x,e.z-kt.position.z));bn(i.length?`鸦之视野：最近的线索是「${i[0].name}」，距你 ${Math.round(Math.hypot(i[0].x-kt.position.x,i[0].z-kt.position.z))} 米`:"所有线索已发现。前往推理之线，连接真相。"),clearTimeout(Vl),Vl=setTimeout(()=>{qo=!1,ct("#scan").classList.remove("active")},8e3)}ct("#help").onclick=i_;ct("#journal-open").onclick=ya;ct("#clues-open").onclick=ya;ct("#deduce-open").onclick=ms;ct("#scan").onclick=Bc;ct("#fly").onclick=Ea;ct("#explore").onclick=()=>{Ze&&Ea(),wn()};function zc(){ri=!ri,ct("#pause").textContent=ri?"▶":"Ⅱ",bn(ri?"调查暂停 · 点击右上角继续":"调查继续")}ct("#pause").onclick=zc;const Ue={};window.addEventListener("keydown",i=>{if(["INPUT","SELECT"].includes(document.activeElement.tagName)||(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(i.key)&&i.preventDefault(),Ue[i.key.toLowerCase()]=!0,i.repeat))return;if(i.key==="Escape"){ct("#modal").classList.contains("hidden")?zc():wn();return}if(!ct("#modal").classList.contains("hidden"))return;const t=i.key.toLowerCase();t==="j"&&ya(),t==="r"&&ms(),t==="m"&&Vc(),t==="q"&&Bc(),t==="f"&&Ea(),t==="e"&&Fn&&ls(Fn)});window.addEventListener("keyup",i=>Ue[i.key.toLowerCase()]=!1);window.addEventListener("blur",()=>Object.keys(Ue).forEach(i=>Ue[i]=!1));document.querySelectorAll("[data-key]").forEach(i=>{i.onpointerdown=t=>{t.preventDefault(),i.setPointerCapture(t.pointerId),Ue[i.dataset.key]=!0},i.onpointerup=i.onpointercancel=()=>Ue[i.dataset.key]=!1});const kl=new gf,Gl=new ft;let or=null,Ta=!1;Oi.onpointerdown=i=>{or={x:i.clientX,y:i.clientY},Ta=!1,Oi.setPointerCapture(i.pointerId)};Oi.onpointermove=i=>{if(!or)return;const t=i.clientX-or.x;Math.abs(t)>3&&(Ta=!0,ji-=t*.006,or={x:i.clientX,y:i.clientY})};Oi.onpointerup=i=>{if(!Ta&&!ri&&ct("#modal").classList.contains("hidden")){Gl.set(i.clientX/innerWidth*2-1,-i.clientY/innerHeight*2+1),kl.setFromCamera(Gl,si);const t=kl.intersectObject(ds);t[0]&&(Pe=t[0].point.clone(),Pe.x=Ci.clamp(Pe.x,-28,28),Pe.z=Ci.clamp(Pe.z,-27,24),Sn=null)}or=null};Oi.onwheel=i=>{i.preventDefault(),sr=Ci.clamp(sr+i.deltaY*.025,20,65)};let Ye=null,Qi=!1,Nn;ct("#sound").onclick=()=>{Qi=!Qi,ct("#sound span").textContent=Qi?"环境音开启":"环境音关闭",Qi?(Ye??=new(window.AudioContext||window.webkitAudioContext),Ye.resume(),Nn||(Nn=Ye.createGain(),Nn.gain.value=.025,Nn.connect(Ye.destination),[146.83,220,293.66].forEach(i=>{const t=Ye.createOscillator();t.type="sine",t.frequency.value=i,t.connect(Nn),t.start()})),Nn.gain.setTargetAtTime(.025,Ye.currentTime,.3)):Nn&&Nn.gain.setTargetAtTime(0,Ye.currentTime,.3)};function Aa(){!Qi||!Ye||[587,740,880].forEach((i,t)=>{const e=Ye.createOscillator(),n=Ye.createGain(),r=Ye.currentTime+t*.1;e.frequency.value=i,n.gain.setValueAtTime(0,r),n.gain.linearRampToValueAtTime(.08,r+.02),n.gain.exponentialRampToValueAtTime(.001,r+.5),e.connect(n),n.connect(Ye.destination),e.start(r),e.stop(r+.6)})}const r_=ct("#minimap"),s_=r_.getContext("2d");function Hc(i,t,e,n=!1){i.clearRect(0,0,t,e),i.fillStyle="#253e30",i.fillRect(0,0,t,e);const r=o=>t/2+o*t/58,s=o=>e/2+o*e/48;i.strokeStyle="#7f9f8240",i.lineWidth=1;for(let o=0;o<5;o++)i.beginPath(),i.ellipse(t*.48,e*.49,t*(.16+o*.09),e*(.14+o*.085),-.3,0,Math.PI*2),i.stroke();i.strokeStyle="#688f80",i.lineWidth=n?10:4,i.beginPath();for(let o=-24;o<=24;o++)i.lineTo(r(15+Math.sin(o*.13)*3),s(o));i.stroke(),i.strokeStyle="#acae7750",i.lineWidth=n?4:2,i.beginPath(),[[-4,18],[0,3],[0,-6],[-12,-13]].forEach(([o,a])=>i.lineTo(r(o),s(a))),i.stroke(),i.fillStyle="#a8af83",i.fillRect(r(-5),s(-7),n?17:7,n?13:5);for(const o of ui)i.beginPath(),i.arc(r(o.x),s(o.z),n?5:2.2,0,Math.PI*2),i.fillStyle=Yt.found.includes(o.id)?"#6f8764":"#d6df9a",i.fill(),n&&(i.fillStyle="#d6dfbd",i.font="12px sans-serif",i.fillText(o.name,r(o.x)+9,s(o.z)+4));i.fillStyle="#f3f4c4",i.shadowColor="#e2ee9a",i.shadowBlur=10,i.beginPath(),i.arc(r(kt.position.x),s(kt.position.z),n?6:3,0,Math.PI*2),i.fill(),i.shadowBlur=0,n&&(i.fillStyle="#dee5bd",i.font="12px sans-serif",i.fillText("⌂ 旧矿井",r(-16),s(-17)),i.fillText("点击地图标记，前往对应地点",15,e-16))}function Vc(){kn('<div class="eyebrow">THE MISTY WOODLAND</div><h2>森林不会让你迷路。</h2><p>亮点是尚待调查的线索。点击地图中的地点，阿墨会前往那里。</p><canvas id="big-map" class="big-map" width="660" height="340"></canvas>');const i=ct("#big-map");Hc(i.getContext("2d"),660,340,!0),i.onclick=t=>{const e=i.getBoundingClientRect(),n=((t.clientX-e.left)/e.width-.5)*58,r=((t.clientY-e.top)/e.height-.5)*48,s=ui.find(o=>Math.hypot(o.x-n,o.z-r)<3);wn(),s?Sa(s):(Pe=new L(n,0,r),Sn=null)}}ct("#map-open").onclick=Vc;let Fn=null,Qe=0;const o_=new mf,Kr=new L;function Wl(i,t,e,n){Kr.set(t,e,n).project(si);const r=(Kr.x*.5+.5)*innerWidth,s=(-Kr.y*.5+.5)*innerHeight;i.style.left=r+"px",i.style.top=s+"px",i.style.display=Kr.z<1&&r>10&&r<innerWidth-10&&s>95&&s<innerHeight-145?"block":"none"}function kc(){requestAnimationFrame(kc);const i=Math.min(o_.getDelta(),.04),t=!ct("#modal").classList.contains("hidden");if(!ri&&!t){Qe+=i;let n=(Ue.d||Ue.arrowright?1:0)-(Ue.a||Ue.arrowleft?1:0),r=(Ue.s||Ue.arrowdown?1:0)-(Ue.w||Ue.arrowup?1:0),s=!1;if(n||r){Pe=null,Sn=null;const a=Math.cos(ji),l=Math.sin(ji),c=n*a+r*l,u=-n*l+r*a;n=c,r=u,s=!0}else if(Pe)if(n=Pe.x-kt.position.x,r=Pe.z-kt.position.z,Math.hypot(n,r)<(Sn?1.75:.2)){if(Pe=null,Sn){const a=Sn;Sn=null,ls(a)}}else s=!0;if(s){const a=Math.hypot(n,r);let l=kt.position.x+n/a*i*(Ze?7:3.8),c=kt.position.z+r/a*i*(Ze?7:3.8);const u=15+Math.sin(c*.13)*3;Math.abs(l-u)<1.35&&Math.abs(c-1)>1.4&&!Ze?Pe&&(Pe=null,Sn=null,bn("河水有些深。按 F 飞过去，或从木桥通过。")):(kt.position.x=Ci.clamp(l,-28,28),kt.position.z=Ci.clamp(c,-27,24)),kt.rotation.y=Math.atan2(-n,-r)}const o=Ze?2.2+Math.sin(Qe*3)*.12:s?Math.abs(Math.sin(Qe*13))*.12:0;kt.position.y=Ci.lerp(kt.position.y,o,i*9),kt.userData.wings.forEach((a,l)=>a.rotation.z=Ze?(l?1:-1)*(1+Math.sin(Qe*13)*.65):0),t_.scale.setScalar(.9+Math.sin(Qe*11)*.13),va.intensity=4+Math.sin(Qe*11),Ma.children.forEach((a,l)=>{const c=a.userData.origin;a.position.set(c.x+Math.sin(Qe*.5+l)*.3,c.y+Math.sin(Qe+l)*.2,c.z+Math.cos(Qe*.4+l)*.3)}),as.forEach((a,l)=>{a.dot.position.y=1.9+Math.sin(Qe*2+l)*.17,a.ring.scale.setScalar(qo?1.35+Math.sin(Qe*4)*.2:1)})}Ji.lerp(new L(kt.position.x*.68,0,kt.position.z*.65-1),.035),si.position.set(Ji.x+Math.sin(ji)*sr,sr*.78,Ji.z+Math.cos(ji)*sr),si.lookAt(Ji.x,0,Ji.z),as.forEach(n=>Wl(n.el,n.c.x,2.5,n.c.z)),Wl(Tr,-12,3.6,-13),Fn=[...ui,{id:"mine",name:"旧矿井密码锁",x:-12,z:-10}].filter(n=>Math.hypot(n.x-kt.position.x,n.z-kt.position.z)<2.6).sort((n,r)=>Math.hypot(n.x-kt.position.x,n.z-kt.position.z)-Math.hypot(r.x-kt.position.x,r.z-kt.position.z))[0];const e=ct("#interaction");e.style.display=Fn&&!t?"block":"none",Fn&&(e.innerHTML=`<kbd>E</kbd>调查 · ${Fn.name}`),e.onclick=()=>{Fn&&ls(Fn)},ct("#location-name").textContent=kt.position.x>14?"萤光河畔":kt.position.z<-9&&kt.position.x<-5?"废弃的旧矿井":kt.position.z<-7?"低语松林":"守林人营地",Hc(s_,190,150),Rn.render(xe,si)}kc();window.addEventListener("resize",()=>{si.aspect=innerWidth/innerHeight,si.updateProjectionMatrix(),Rn.setSize(innerWidth,innerHeight)});setTimeout(()=>bn(Yt.found.length?"欢迎回来，侦探。你的调查进度已恢复。":"欢迎来到鸦林。点击发光标签开始调查，按 ? 查看指引。"),1800);
