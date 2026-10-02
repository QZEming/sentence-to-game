(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const Ga="180",Mc=0,vo=1,Sc=2,Tl=1,bl=2,yn=3,Bn=0,Ne=1,tn=2,Fn=0,wi=1,xo=2,Mo=3,So=4,Ec=5,Qn=100,yc=101,Tc=102,bc=103,Ac=104,wc=200,Rc=201,Cc=202,Pc=203,js=204,Js=205,Dc=206,Lc=207,Uc=208,Ic=209,Nc=210,Fc=211,Oc=212,Bc=213,zc=214,Qs=0,ta=1,ea=2,Ci=3,na=4,ia=5,ra=6,sa=7,Al=0,Hc=1,Vc=2,On=0,Gc=1,kc=2,Wc=3,wl=4,Xc=5,qc=6,Yc=7,Rl=300,Pi=301,Di=302,aa=303,oa=304,ss=306,la=1e3,ei=1001,ca=1002,rn=1003,$c=1004,yr=1005,cn=1006,ms=1007,ni=1008,pn=1009,Cl=1010,Pl=1011,rr=1012,ka=1013,ri=1014,bn=1015,pr=1016,Wa=1017,Xa=1018,sr=1020,Dl=35902,Ll=35899,Ul=1021,Il=1022,nn=1023,ar=1026,or=1027,Nl=1028,qa=1029,Fl=1030,Ya=1031,$a=1033,Yr=33776,$r=33777,Kr=33778,Zr=33779,ua=35840,ha=35841,da=35842,fa=35843,pa=36196,ma=37492,_a=37496,ga=37808,va=37809,xa=37810,Ma=37811,Sa=37812,Ea=37813,ya=37814,Ta=37815,ba=37816,Aa=37817,wa=37818,Ra=37819,Ca=37820,Pa=37821,Da=36492,La=36494,Ua=36495,Ia=36283,Na=36284,Fa=36285,Oa=36286,Kc=3200,Zc=3201,Ol=0,jc=1,Nn="",Ge="srgb",Li="srgb-linear",ts="linear",Jt="srgb",ui=7680,Eo=519,Jc=512,Qc=513,tu=514,Bl=515,eu=516,nu=517,iu=518,ru=519,yo=35044,To="300 es",un=2e3,es=2001;class Ni{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bo=1234567;const ji=Math.PI/180,lr=180/Math.PI;function Fi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(be[i&255]+be[i>>8&255]+be[i>>16&255]+be[i>>24&255]+"-"+be[t&255]+be[t>>8&255]+"-"+be[t>>16&15|64]+be[t>>24&255]+"-"+be[e&63|128]+be[e>>8&255]+"-"+be[e>>16&255]+be[e>>24&255]+be[n&255]+be[n>>8&255]+be[n>>16&255]+be[n>>24&255]).toLowerCase()}function Wt(i,t,e){return Math.max(t,Math.min(e,i))}function Ka(i,t){return(i%t+t)%t}function su(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function au(i,t,e){return i!==t?(e-i)/(t-i):0}function Ji(i,t,e){return(1-e)*i+e*t}function ou(i,t,e,n){return Ji(i,t,1-Math.exp(-e*n))}function lu(i,t=1){return t-Math.abs(Ka(i,t*2)-t)}function cu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function uu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function hu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function du(i,t){return i+Math.random()*(t-i)}function fu(i){return i*(.5-Math.random())}function pu(i){i!==void 0&&(bo=i);let t=bo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function mu(i){return i*ji}function _u(i){return i*lr}function gu(i){return(i&i-1)===0&&i!==0}function vu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function xu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Mu(i,t,e,n,r){const s=Math.cos,a=Math.sin,o=s(e/2),c=a(e/2),l=s((t+n)/2),h=a((t+n)/2),d=s((t-n)/2),f=a((t-n)/2),m=s((n-t)/2),g=a((n-t)/2);switch(r){case"XYX":i.set(o*h,c*d,c*f,o*l);break;case"YZY":i.set(c*f,o*h,c*d,o*l);break;case"ZXZ":i.set(c*d,c*f,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*m,o*l);break;case"YXY":i.set(c*m,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*m,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ti(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Pe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Qi={DEG2RAD:ji,RAD2DEG:lr,generateUUID:Fi,clamp:Wt,euclideanModulo:Ka,mapLinear:su,inverseLerp:au,lerp:Ji,damp:ou,pingpong:lu,smoothstep:cu,smootherstep:uu,randInt:hu,randFloat:du,randFloatSpread:fu,seededRandom:pu,degToRad:mu,radToDeg:_u,isPowerOfTwo:gu,ceilPowerOfTwo:vu,floorPowerOfTwo:xu,setQuaternionFromProperEuler:Mu,normalize:Pe,denormalize:Ti};class Vt{constructor(t=0,e=0){Vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mr{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],h=n[r+2],d=n[r+3];const f=s[a+0],m=s[a+1],g=s[a+2],M=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=f,t[e+1]=m,t[e+2]=g,t[e+3]=M;return}if(d!==M||c!==f||l!==m||h!==g){let p=1-o;const u=c*f+l*m+h*g+d*M,y=u>=0?1:-1,T=1-u*u;if(T>Number.EPSILON){const w=Math.sqrt(T),A=Math.atan2(w,u*y);p=Math.sin(p*A)/w,o=Math.sin(o*A)/w}const S=o*y;if(c=c*p+f*S,l=l*p+m*S,h=h*p+g*S,d=d*p+M*S,p===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=w,l*=w,h*=w,d*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],h=n[r+3],d=s[a],f=s[a+1],m=s[a+2],g=s[a+3];return t[e]=o*g+h*d+c*m-l*f,t[e+1]=c*g+h*f+l*d-o*m,t[e+2]=l*g+h*m+o*f-c*d,t[e+3]=h*g-o*d-c*f-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(r/2),d=o(s/2),f=c(n/2),m=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=f*h*d+l*m*g,this._y=l*m*d-f*h*g,this._z=l*h*g+f*m*d,this._w=l*h*d-f*m*g;break;case"YXZ":this._x=f*h*d+l*m*g,this._y=l*m*d-f*h*g,this._z=l*h*g-f*m*d,this._w=l*h*d+f*m*g;break;case"ZXY":this._x=f*h*d-l*m*g,this._y=l*m*d+f*h*g,this._z=l*h*g+f*m*d,this._w=l*h*d-f*m*g;break;case"ZYX":this._x=f*h*d-l*m*g,this._y=l*m*d+f*h*g,this._z=l*h*g-f*m*d,this._w=l*h*d+f*m*g;break;case"YZX":this._x=f*h*d+l*m*g,this._y=l*m*d+f*h*g,this._z=l*h*g-f*m*d,this._w=l*h*d-f*m*g;break;case"XZY":this._x=f*h*d-l*m*g,this._y=l*m*d-f*h*g,this._z=l*h*g+f*m*d,this._w=l*h*d+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],d=e[10],f=n+o+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-c)*m,this._y=(s-l)*m,this._z=(a-r)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+l)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(s-l)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(a-r)/m,this._x=(s+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Wt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-n*l,this._z=s*h+a*l+n*c-r*o,this._w=a*h-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),d=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=r*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ao.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ao.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),h=2*(o*e-s*r),d=2*(s*n-a*e);return this.x=e+c*l+a*d-o*h,this.y=n+c*h+o*l-s*d,this.z=r+c*d+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return _s.copy(this).projectOnVector(t),this.sub(_s)}reflect(t){return this.sub(_s.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _s=new U,Ao=new mr;class Nt{constructor(t,e,n,r,s,a,o,c,l){Nt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=o,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],m=n[5],g=n[8],M=r[0],p=r[3],u=r[6],y=r[1],T=r[4],S=r[7],w=r[2],A=r[5],C=r[8];return s[0]=a*M+o*y+c*w,s[3]=a*p+o*T+c*A,s[6]=a*u+o*S+c*C,s[1]=l*M+h*y+d*w,s[4]=l*p+h*T+d*A,s[7]=l*u+h*S+d*C,s[2]=f*M+m*y+g*w,s[5]=f*p+m*T+g*A,s[8]=f*u+m*S+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*s*h+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=h*a-o*l,f=o*c-h*s,m=l*s-a*c,g=e*d+n*f+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return t[0]=d*M,t[1]=(r*l-h*n)*M,t[2]=(o*n-r*a)*M,t[3]=f*M,t[4]=(h*e-r*c)*M,t[5]=(r*s-o*e)*M,t[6]=m*M,t[7]=(n*c-l*e)*M,t[8]=(a*e-n*s)*M,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(gs.makeScale(t,e)),this}rotate(t){return this.premultiply(gs.makeRotation(-t)),this}translate(t,e){return this.premultiply(gs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const gs=new Nt;function zl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ns(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Su(){const i=ns("canvas");return i.style.display="block",i}const wo={};function cr(i){i in wo||(wo[i]=!0,console.warn(i))}function Eu(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const Ro=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Co=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yu(){const i={enabled:!0,workingColorSpace:Li,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===Jt&&(r.r=An(r.r),r.g=An(r.g),r.b=An(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Jt&&(r.r=Ri(r.r),r.g=Ri(r.g),r.b=Ri(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Nn?ts:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return cr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return cr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Li]:{primaries:t,whitePoint:n,transfer:ts,toXYZ:Ro,fromXYZ:Co,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ge},outputColorSpaceConfig:{drawingBufferColorSpace:Ge}},[Ge]:{primaries:t,whitePoint:n,transfer:Jt,toXYZ:Ro,fromXYZ:Co,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ge}}}),i}const $t=yu();function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ri(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let hi;class Tu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{hi===void 0&&(hi=ns("canvas")),hi.width=t.width,hi.height=t.height;const r=hi.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=hi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ns("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=An(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let bu=0;class Za{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=Fi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(vs(r[a].image)):s.push(vs(r[a]))}else s=vs(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function vs(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Tu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Au=0;const xs=new U;class Fe extends Ni{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=ei,r=ei,s=cn,a=ni,o=nn,c=pn,l=Fe.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=Fi(),this.name="",this.source=new Za(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Vt(0,0),this.repeat=new Vt(1,1),this.center=new Vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(xs).x}get height(){return this.source.getSize(xs).y}get depth(){return this.source.getSize(xs).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Rl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case la:t.x=t.x-Math.floor(t.x);break;case ei:t.x=t.x<0?0:1;break;case ca:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case la:t.y=t.y-Math.floor(t.y);break;case ei:t.y=t.y<0?0:1;break;case ca:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=Rl;Fe.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,r=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],d=c[8],f=c[1],m=c[5],g=c[9],M=c[2],p=c[6],u=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-M)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+M)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(l+1)/2,S=(m+1)/2,w=(u+1)/2,A=(h+f)/4,C=(d+M)/4,L=(g+p)/4;return T>S&&T>w?T<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(T),r=A/n,s=C/n):S>w?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=A/r,s=L/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=C/s,r=L/s),this.set(n,r,s,e),this}let y=Math.sqrt((p-g)*(p-g)+(d-M)*(d-M)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(d-M)/y,this.z=(f-h)/y,this.w=Math.acos((l+m+u-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this.w=Wt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this.w=Wt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class wu extends Ni{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const r={width:t,height:e,depth:n.depth},s=new Fe(r);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:cn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new Za(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class si extends wu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Hl extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=rn,this.minFilter=rn,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ru extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=rn,this.minFilter=rn,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _r{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,je):je.fromBufferAttribute(s,a),je.applyMatrix4(t.matrixWorld),this.expandByPoint(je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Tr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Tr.copy(n.boundingBox)),Tr.applyMatrix4(t.matrixWorld),this.union(Tr)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,je),je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Gi),br.subVectors(this.max,Gi),di.subVectors(t.a,Gi),fi.subVectors(t.b,Gi),pi.subVectors(t.c,Gi),Cn.subVectors(fi,di),Pn.subVectors(pi,fi),Xn.subVectors(di,pi);let e=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-Xn.z,Xn.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,Xn.z,0,-Xn.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-Xn.y,Xn.x,0];return!Ms(e,di,fi,pi,br)||(e=[1,0,0,0,1,0,0,0,1],!Ms(e,di,fi,pi,br))?!1:(Ar.crossVectors(Cn,Pn),e=[Ar.x,Ar.y,Ar.z],Ms(e,di,fi,pi,br))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const vn=[new U,new U,new U,new U,new U,new U,new U,new U],je=new U,Tr=new _r,di=new U,fi=new U,pi=new U,Cn=new U,Pn=new U,Xn=new U,Gi=new U,br=new U,Ar=new U,qn=new U;function Ms(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){qn.fromArray(i,s);const o=r.x*Math.abs(qn.x)+r.y*Math.abs(qn.y)+r.z*Math.abs(qn.z),c=t.dot(qn),l=e.dot(qn),h=n.dot(qn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Cu=new _r,ki=new U,Ss=new U;class as{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Cu.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ki.subVectors(t,this.center);const e=ki.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(ki,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ss.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ki.copy(t.center).add(Ss)),this.expandByPoint(ki.copy(t.center).sub(Ss))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const xn=new U,Es=new U,wr=new U,Dn=new U,ys=new U,Rr=new U,Ts=new U;class ja{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xn.copy(this.origin).addScaledVector(this.direction,e),xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Es.copy(t).add(e).multiplyScalar(.5),wr.copy(e).sub(t).normalize(),Dn.copy(this.origin).sub(Es);const s=t.distanceTo(e)*.5,a=-this.direction.dot(wr),o=Dn.dot(this.direction),c=-Dn.dot(wr),l=Dn.lengthSq(),h=Math.abs(1-a*a);let d,f,m,g;if(h>0)if(d=a*c-o,f=a*o-c,g=s*h,d>=0)if(f>=-g)if(f<=g){const M=1/h;d*=M,f*=M,m=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f<=-g?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-c),s),m=-d*d+f*(f+2*c)+l):f<=g?(d=0,f=Math.min(Math.max(-s,-c),s),m=f*(f+2*c)+l):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-c),s),m=-d*d+f*(f+2*c)+l);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Es).addScaledVector(wr,f),m}intersectSphere(t,e){xn.subVectors(t.center,this.origin);const n=xn.dot(this.direction),r=xn.dot(xn)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,r=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,r=(t.min.x-f.x)*l),h>=0?(s=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(s=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(t.min.z-f.z)*d,c=(t.max.z-f.z)*d):(o=(t.max.z-f.z)*d,c=(t.min.z-f.z)*d),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,xn)!==null}intersectTriangle(t,e,n,r,s){ys.subVectors(e,t),Rr.subVectors(n,t),Ts.crossVectors(ys,Rr);let a=this.direction.dot(Ts),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Dn.subVectors(this.origin,t);const c=o*this.direction.dot(Rr.crossVectors(Dn,Rr));if(c<0)return null;const l=o*this.direction.dot(ys.cross(Dn));if(l<0||c+l>a)return null;const h=-o*Dn.dot(Ts);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,n,r,s,a,o,c,l,h,d,f,m,g,M,p){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,h,d,f,m,g,M,p)}set(t,e,n,r,s,a,o,c,l,h,d,f,m,g,M,p){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=c,u[2]=l,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=g,u[11]=M,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/mi.setFromMatrixColumn(t,0).length(),s=1/mi.setFromMatrixColumn(t,1).length(),a=1/mi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const f=a*h,m=a*d,g=o*h,M=o*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=m+g*l,e[5]=f-M*l,e[9]=-o*c,e[2]=M-f*l,e[6]=g+m*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,m=c*d,g=l*h,M=l*d;e[0]=f+M*o,e[4]=g*o-m,e[8]=a*l,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=m*o-g,e[6]=M+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,m=c*d,g=l*h,M=l*d;e[0]=f-M*o,e[4]=-a*d,e[8]=g+m*o,e[1]=m+g*o,e[5]=a*h,e[9]=M-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,m=a*d,g=o*h,M=o*d;e[0]=c*h,e[4]=g*l-m,e[8]=f*l+M,e[1]=c*d,e[5]=M*l+f,e[9]=m*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,m=a*l,g=o*c,M=o*l;e[0]=c*h,e[4]=M-f*d,e[8]=g*d+m,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=m*d+g,e[10]=f-M*d}else if(t.order==="XZY"){const f=a*c,m=a*l,g=o*c,M=o*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=f*d+M,e[5]=a*h,e[9]=m*d-g,e[2]=g*d-m,e[6]=o*h,e[10]=M*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Pu,t,Du)}lookAt(t,e,n){const r=this.elements;return He.subVectors(t,e),He.lengthSq()===0&&(He.z=1),He.normalize(),Ln.crossVectors(n,He),Ln.lengthSq()===0&&(Math.abs(n.z)===1?He.x+=1e-4:He.z+=1e-4,He.normalize(),Ln.crossVectors(n,He)),Ln.normalize(),Cr.crossVectors(He,Ln),r[0]=Ln.x,r[4]=Cr.x,r[8]=He.x,r[1]=Ln.y,r[5]=Cr.y,r[9]=He.y,r[2]=Ln.z,r[6]=Cr.z,r[10]=He.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],m=n[13],g=n[2],M=n[6],p=n[10],u=n[14],y=n[3],T=n[7],S=n[11],w=n[15],A=r[0],C=r[4],L=r[8],E=r[12],x=r[1],P=r[5],F=r[9],H=r[13],q=r[2],W=r[6],X=r[10],Z=r[14],V=r[3],at=r[7],ut=r[11],yt=r[15];return s[0]=a*A+o*x+c*q+l*V,s[4]=a*C+o*P+c*W+l*at,s[8]=a*L+o*F+c*X+l*ut,s[12]=a*E+o*H+c*Z+l*yt,s[1]=h*A+d*x+f*q+m*V,s[5]=h*C+d*P+f*W+m*at,s[9]=h*L+d*F+f*X+m*ut,s[13]=h*E+d*H+f*Z+m*yt,s[2]=g*A+M*x+p*q+u*V,s[6]=g*C+M*P+p*W+u*at,s[10]=g*L+M*F+p*X+u*ut,s[14]=g*E+M*H+p*Z+u*yt,s[3]=y*A+T*x+S*q+w*V,s[7]=y*C+T*P+S*W+w*at,s[11]=y*L+T*F+S*X+w*ut,s[15]=y*E+T*H+S*Z+w*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],d=t[6],f=t[10],m=t[14],g=t[3],M=t[7],p=t[11],u=t[15];return g*(+s*c*d-r*l*d-s*o*f+n*l*f+r*o*m-n*c*m)+M*(+e*c*m-e*l*f+s*a*f-r*a*m+r*l*h-s*c*h)+p*(+e*l*d-e*o*m-s*a*d+n*a*m+s*o*h-n*l*h)+u*(-r*o*h-e*c*d+e*o*f+r*a*d-n*a*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=t[9],f=t[10],m=t[11],g=t[12],M=t[13],p=t[14],u=t[15],y=d*p*l-M*f*l+M*c*m-o*p*m-d*c*u+o*f*u,T=g*f*l-h*p*l-g*c*m+a*p*m+h*c*u-a*f*u,S=h*M*l-g*d*l+g*o*m-a*M*m-h*o*u+a*d*u,w=g*d*c-h*M*c-g*o*f+a*M*f+h*o*p-a*d*p,A=e*y+n*T+r*S+s*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return t[0]=y*C,t[1]=(M*f*s-d*p*s-M*r*m+n*p*m+d*r*u-n*f*u)*C,t[2]=(o*p*s-M*c*s+M*r*l-n*p*l-o*r*u+n*c*u)*C,t[3]=(d*c*s-o*f*s-d*r*l+n*f*l+o*r*m-n*c*m)*C,t[4]=T*C,t[5]=(h*p*s-g*f*s+g*r*m-e*p*m-h*r*u+e*f*u)*C,t[6]=(g*c*s-a*p*s-g*r*l+e*p*l+a*r*u-e*c*u)*C,t[7]=(a*f*s-h*c*s+h*r*l-e*f*l-a*r*m+e*c*m)*C,t[8]=S*C,t[9]=(g*d*s-h*M*s-g*n*m+e*M*m+h*n*u-e*d*u)*C,t[10]=(a*M*s-g*o*s+g*n*l-e*M*l-a*n*u+e*o*u)*C,t[11]=(h*o*s-a*d*s-h*n*l+e*d*l+a*n*m-e*o*m)*C,t[12]=w*C,t[13]=(h*M*r-g*d*r+g*n*f-e*M*f-h*n*p+e*d*p)*C,t[14]=(g*o*r-a*M*r-g*n*c+e*M*c+a*n*p-e*o*p)*C,t[15]=(a*d*r-h*o*r+h*n*c-e*d*c-a*n*f+e*o*f)*C,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,h=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+n,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,h=a+a,d=o+o,f=s*l,m=s*h,g=s*d,M=a*h,p=a*d,u=o*d,y=c*l,T=c*h,S=c*d,w=n.x,A=n.y,C=n.z;return r[0]=(1-(M+u))*w,r[1]=(m+S)*w,r[2]=(g-T)*w,r[3]=0,r[4]=(m-S)*A,r[5]=(1-(f+u))*A,r[6]=(p+y)*A,r[7]=0,r[8]=(g+T)*C,r[9]=(p-y)*C,r[10]=(1-(f+M))*C,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=mi.set(r[0],r[1],r[2]).length();const a=mi.set(r[4],r[5],r[6]).length(),o=mi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],Je.copy(this);const l=1/s,h=1/a,d=1/o;return Je.elements[0]*=l,Je.elements[1]*=l,Je.elements[2]*=l,Je.elements[4]*=h,Je.elements[5]*=h,Je.elements[6]*=h,Je.elements[8]*=d,Je.elements[9]*=d,Je.elements[10]*=d,e.setFromRotationMatrix(Je),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=un,c=!1){const l=this.elements,h=2*s/(e-t),d=2*s/(n-r),f=(e+t)/(e-t),m=(n+r)/(n-r);let g,M;if(c)g=s/(a-s),M=a*s/(a-s);else if(o===un)g=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(o===es)g=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=un,c=!1){const l=this.elements,h=2/(e-t),d=2/(n-r),f=-(e+t)/(e-t),m=-(n+r)/(n-r);let g,M;if(c)g=1/(a-s),M=a/(a-s);else if(o===un)g=-2/(a-s),M=-(a+s)/(a-s);else if(o===es)g=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const mi=new U,Je=new ue,Pu=new U(0,0,0),Du=new U(1,1,1),Ln=new U,Cr=new U,He=new U,Po=new ue,Do=new mr;class mn{constructor(t=0,e=0,n=0,r=mn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],d=r[2],f=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Wt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Wt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Po.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Po,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Do.setFromEuler(this),this.setFromQuaternion(Do,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mn.DEFAULT_ORDER="XYZ";class Ja{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Lu=0;const Lo=new U,_i=new mr,Mn=new ue,Pr=new U,Wi=new U,Uu=new U,Iu=new mr,Uo=new U(1,0,0),Io=new U(0,1,0),No=new U(0,0,1),Fo={type:"added"},Nu={type:"removed"},gi={type:"childadded",child:null},bs={type:"childremoved",child:null};class ye extends Ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=Fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new U,e=new mn,n=new mr,r=new U(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ue},normalMatrix:{value:new Nt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ja,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return _i.setFromAxisAngle(t,e),this.quaternion.multiply(_i),this}rotateOnWorldAxis(t,e){return _i.setFromAxisAngle(t,e),this.quaternion.premultiply(_i),this}rotateX(t){return this.rotateOnAxis(Uo,t)}rotateY(t){return this.rotateOnAxis(Io,t)}rotateZ(t){return this.rotateOnAxis(No,t)}translateOnAxis(t,e){return Lo.copy(t).applyQuaternion(this.quaternion),this.position.add(Lo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Uo,t)}translateY(t){return this.translateOnAxis(Io,t)}translateZ(t){return this.translateOnAxis(No,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Pr.copy(t):Pr.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Wi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(Wi,Pr,this.up):Mn.lookAt(Pr,Wi,this.up),this.quaternion.setFromRotationMatrix(Mn),r&&(Mn.extractRotation(r.matrixWorld),_i.setFromRotationMatrix(Mn),this.quaternion.premultiply(_i.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Fo),gi.child=t,this.dispatchEvent(gi),gi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nu),bs.child=t,this.dispatchEvent(bs),bs.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Mn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Fo),gi.child=t,this.dispatchEvent(gi),gi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wi,t,Uu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wi,Iu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];s(t.shapes,d)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),d=a(t.shapes),f=a(t.skeletons),m=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}ye.DEFAULT_UP=new U(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Qe=new U,Sn=new U,As=new U,En=new U,vi=new U,xi=new U,Oo=new U,ws=new U,Rs=new U,Cs=new U,Ps=new te,Ds=new te,Ls=new te;class en{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),Qe.subVectors(t,e),r.cross(Qe);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){Qe.subVectors(r,e),Sn.subVectors(n,e),As.subVectors(t,e);const a=Qe.dot(Qe),o=Qe.dot(Sn),c=Qe.dot(As),l=Sn.dot(Sn),h=Sn.dot(As),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,m=(l*c-o*h)*f,g=(a*h-o*c)*f;return s.set(1-m-g,g,m)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,En)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,En.x),c.addScaledVector(a,En.y),c.addScaledVector(o,En.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return Ps.setScalar(0),Ds.setScalar(0),Ls.setScalar(0),Ps.fromBufferAttribute(t,e),Ds.fromBufferAttribute(t,n),Ls.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(Ps,s.x),a.addScaledVector(Ds,s.y),a.addScaledVector(Ls,s.z),a}static isFrontFacing(t,e,n,r){return Qe.subVectors(n,e),Sn.subVectors(t,e),Qe.cross(Sn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Qe.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),Qe.cross(Sn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return en.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return en.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return en.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return en.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return en.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;vi.subVectors(r,n),xi.subVectors(s,n),ws.subVectors(t,n);const c=vi.dot(ws),l=xi.dot(ws);if(c<=0&&l<=0)return e.copy(n);Rs.subVectors(t,r);const h=vi.dot(Rs),d=xi.dot(Rs);if(h>=0&&d<=h)return e.copy(r);const f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(vi,a);Cs.subVectors(t,s);const m=vi.dot(Cs),g=xi.dot(Cs);if(g>=0&&m<=g)return e.copy(s);const M=m*l-c*g;if(M<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(xi,o);const p=h*g-m*d;if(p<=0&&d-h>=0&&m-g>=0)return Oo.subVectors(s,r),o=(d-h)/(d-h+(m-g)),e.copy(r).addScaledVector(Oo,o);const u=1/(p+M+f);return a=M*u,o=f*u,e.copy(n).addScaledVector(vi,a).addScaledVector(xi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Vl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Dr={h:0,s:0,l:0};function Us(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=$t.workingColorSpace){if(t=Ka(t,1),e=Wt(e,0,1),n=Wt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Us(a,s,t+1/3),this.g=Us(a,s,t),this.b=Us(a,s,t-1/3)}return $t.colorSpaceToWorking(this,r),this}setStyle(t,e=Ge){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ge){const n=Vl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=Ri(t.r),this.g=Ri(t.g),this.b=Ri(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ge){return $t.workingToColorSpace(Ae.copy(this),t),Math.round(Wt(Ae.r*255,0,255))*65536+Math.round(Wt(Ae.g*255,0,255))*256+Math.round(Wt(Ae.b*255,0,255))}getHexString(t=Ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.workingToColorSpace(Ae.copy(this),e);const n=Ae.r,r=Ae.g,s=Ae.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-n)/d+2;break;case s:c=(n-r)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.workingToColorSpace(Ae.copy(this),e),t.r=Ae.r,t.g=Ae.g,t.b=Ae.b,t}getStyle(t=Ge){$t.workingToColorSpace(Ae.copy(this),t);const e=Ae.r,n=Ae.g,r=Ae.b;return t!==Ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(Dr);const n=Ji(Un.h,Dr.h,e),r=Ji(Un.s,Dr.s,e),s=Ji(Un.l,Dr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ae=new Xt;Xt.NAMES=Vl;let Fu=0;class Oi extends Ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Fi(),this.name="",this.type="Material",this.blending=wi,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=js,this.blendDst=Js,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=Ci,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Eo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ui,this.stencilZFail=ui,this.stencilZPass=ui,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==wi&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==js&&(n.blendSrc=this.blendSrc),this.blendDst!==Js&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ci&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Eo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ui&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ui&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ui&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Qa extends Oi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new U,Lr=new Vt;let Ou=0;class sn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ou++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=yo,this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Lr.fromBufferAttribute(this,e),Lr.applyMatrix3(t),this.setXY(e,Lr.x,Lr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ti(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Pe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ti(e,this.array)),e}setX(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ti(e,this.array)),e}setY(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ti(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ti(e,this.array)),e}setW(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),n=Pe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),n=Pe(n,this.array),r=Pe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),n=Pe(n,this.array),r=Pe(r,this.array),s=Pe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==yo&&(t.usage=this.usage),t}}class Gl extends sn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class kl extends sn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ve extends sn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Bu=0;const $e=new ue,Is=new ye,Mi=new U,Ve=new _r,Xi=new _r,Ee=new U;class Xe extends Ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=Fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zl(t)?kl:Gl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Nt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return Is.lookAt(t),Is.updateMatrix(),this.applyMatrix4(Is.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ve(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _r);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];Ve.setFromBufferAttribute(s),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,Ve.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,Ve.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(Ve.min),this.boundingBox.expandByPoint(Ve.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new as);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(Ve.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];Xi.setFromBufferAttribute(o),this.morphTargetsRelative?(Ee.addVectors(Ve.min,Xi.min),Ve.expandByPoint(Ee),Ee.addVectors(Ve.max,Xi.max),Ve.expandByPoint(Ee)):(Ve.expandByPoint(Xi.min),Ve.expandByPoint(Xi.max))}Ve.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Ee.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Ee));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ee.fromBufferAttribute(o,l),c&&(Mi.fromBufferAttribute(t,l),Ee.add(Mi)),r=Math.max(r,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new sn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let L=0;L<n.count;L++)o[L]=new U,c[L]=new U;const l=new U,h=new U,d=new U,f=new Vt,m=new Vt,g=new Vt,M=new U,p=new U;function u(L,E,x){l.fromBufferAttribute(n,L),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,x),f.fromBufferAttribute(s,L),m.fromBufferAttribute(s,E),g.fromBufferAttribute(s,x),h.sub(l),d.sub(l),m.sub(f),g.sub(f);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(P),p.copy(d).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(P),o[L].add(M),o[E].add(M),o[x].add(M),c[L].add(p),c[E].add(p),c[x].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let L=0,E=y.length;L<E;++L){const x=y[L],P=x.start,F=x.count;for(let H=P,q=P+F;H<q;H+=3)u(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const T=new U,S=new U,w=new U,A=new U;function C(L){w.fromBufferAttribute(r,L),A.copy(w);const E=o[L];T.copy(E),T.sub(w.multiplyScalar(w.dot(E))).normalize(),S.crossVectors(A,E);const P=S.dot(c[L])<0?-1:1;a.setXYZW(L,T.x,T.y,T.z,P)}for(let L=0,E=y.length;L<E;++L){const x=y[L],P=x.start,F=x.count;for(let H=P,q=P+F;H<q;H+=3)C(t.getX(H+0)),C(t.getX(H+1)),C(t.getX(H+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new sn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const r=new U,s=new U,a=new U,o=new U,c=new U,l=new U,h=new U,d=new U;if(t)for(let f=0,m=t.count;f<m;f+=3){const g=t.getX(f+0),M=t.getX(f+1),p=t.getX(f+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,M),a.fromBufferAttribute(e,p),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,p),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=e.count;f<m;f+=3)r.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,d=o.normalized,f=new l.constructor(c.length*h);let m=0,g=0;for(let M=0,p=c.length;M<p;M++){o.isInterleavedBufferAttribute?m=c[M]*o.data.stride+o.offset:m=c[M]*h;for(let u=0;u<h;u++)f[g++]=l[m++]}return new sn(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Xe,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,d=l.length;h<d;h++){const f=l[h],m=t(f,n);c.push(m)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){const m=l[d];h.push(m.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],d=s[l];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bo=new ue,Yn=new ja,Ur=new as,zo=new U,Ir=new U,Nr=new U,Fr=new U,Ns=new U,Or=new U,Ho=new U,Br=new U;class hn extends ye{constructor(t=new Xe,e=new Qa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Or.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],d=s[c];h!==0&&(Ns.fromBufferAttribute(d,t),a?Or.addScaledVector(Ns,h):Or.addScaledVector(Ns.sub(e),h))}e.add(Or)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(s),Yn.copy(t.ray).recast(t.near),!(Ur.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(Ur,zo)===null||Yn.origin.distanceToSquared(zo)>(t.far-t.near)**2))&&(Bo.copy(s).invert(),Yn.copy(t.ray).applyMatrix4(Bo),!(n.boundingBox!==null&&Yn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,f=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=f.length;g<M;g++){const p=f[g],u=a[p.materialIndex],y=Math.max(p.start,m.start),T=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=y,w=T;S<w;S+=3){const A=o.getX(S),C=o.getX(S+1),L=o.getX(S+2);r=zr(this,u,t,n,l,h,d,A,C,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let p=g,u=M;p<u;p+=3){const y=o.getX(p),T=o.getX(p+1),S=o.getX(p+2);r=zr(this,a,t,n,l,h,d,y,T,S),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,M=f.length;g<M;g++){const p=f[g],u=a[p.materialIndex],y=Math.max(p.start,m.start),T=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=y,w=T;S<w;S+=3){const A=S,C=S+1,L=S+2;r=zr(this,u,t,n,l,h,d,A,C,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let p=g,u=M;p<u;p+=3){const y=p,T=p+1,S=p+2;r=zr(this,a,t,n,l,h,d,y,T,S),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function zu(i,t,e,n,r,s,a,o){let c;if(t.side===Ne?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===Bn,o),c===null)return null;Br.copy(o),Br.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Br);return l<e.near||l>e.far?null:{distance:l,point:Br.clone(),object:i}}function zr(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,Ir),i.getVertexPosition(c,Nr),i.getVertexPosition(l,Fr);const h=zu(i,t,e,n,Ir,Nr,Fr,Ho);if(h){const d=new U;en.getBarycoord(Ho,Ir,Nr,Fr,d),r&&(h.uv=en.getInterpolatedAttribute(r,o,c,l,d,new Vt)),s&&(h.uv1=en.getInterpolatedAttribute(s,o,c,l,d,new Vt)),a&&(h.normal=en.getInterpolatedAttribute(a,o,c,l,d,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new U,materialIndex:0};en.getNormal(Ir,Nr,Fr,f.normal),h.face=f,h.barycoord=d}return h}class Bi extends Xe{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],d=[];let f=0,m=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,r,a,2),g("x","z","y",1,-1,t,n,-e,r,a,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(h,3)),this.setAttribute("uv",new ve(d,2));function g(M,p,u,y,T,S,w,A,C,L,E){const x=S/C,P=w/L,F=S/2,H=w/2,q=A/2,W=C+1,X=L+1;let Z=0,V=0;const at=new U;for(let ut=0;ut<X;ut++){const yt=ut*P-H;for(let Gt=0;Gt<W;Gt++){const ie=Gt*x-F;at[M]=ie*y,at[p]=yt*T,at[u]=q,l.push(at.x,at.y,at.z),at[M]=0,at[p]=0,at[u]=A>0?1:-1,h.push(at.x,at.y,at.z),d.push(Gt/C),d.push(1-ut/L),Z+=1}}for(let ut=0;ut<L;ut++)for(let yt=0;yt<C;yt++){const Gt=f+yt+W*ut,ie=f+yt+W*(ut+1),ae=f+(yt+1)+W*(ut+1),Kt=f+(yt+1)+W*ut;c.push(Gt,ie,Kt),c.push(ie,ae,Kt),V+=6}o.addGroup(m,V,E),m+=V,f+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ui(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function De(i){const t={};for(let e=0;e<i.length;e++){const n=Ui(i[e]);for(const r in n)t[r]=n[r]}return t}function Hu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Wl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const Vu={clone:Ui,merge:De};var Gu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ku=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zn extends Oi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gu,this.fragmentShader=ku,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ui(t.uniforms),this.uniformsGroups=Hu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Xl extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const In=new U,Vo=new Vt,Go=new Vt;class ke extends Xl{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=lr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ji*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lr*2*Math.atan(Math.tan(ji*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(In.x,In.y).multiplyScalar(-t/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(In.x,In.y).multiplyScalar(-t/In.z)}getViewSize(t,e){return this.getViewBounds(t,Vo,Go),e.subVectors(Go,Vo)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ji*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Si=-90,Ei=1;class Wu extends ye{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new ke(Si,Ei,t,e);r.layers=this.layers,this.add(r);const s=new ke(Si,Ei,t,e);s.layers=this.layers,this.add(s);const a=new ke(Si,Ei,t,e);a.layers=this.layers,this.add(a);const o=new ke(Si,Ei,t,e);o.layers=this.layers,this.add(o);const c=new ke(Si,Ei,t,e);c.layers=this.layers,this.add(c);const l=new ke(Si,Ei,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===un)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===es)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(d,f,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ql extends Fe{constructor(t=[],e=Pi,n,r,s,a,o,c,l,h){super(t,e,n,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Xu extends si{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new ql(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Bi(5,5,5),s=new zn({name:"CubemapFromEquirect",uniforms:Ui(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ne,blending:Fn});s.uniforms.tEquirect.value=e;const a=new hn(r,s),o=e.minFilter;return e.minFilter===ni&&(e.minFilter=cn),new Wu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}class Ke extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qu={type:"move"};class Fs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ke,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ke,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ke,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const M of t.hand.values()){const p=e.getJointPose(M,n),u=this._getHandJoint(l,M);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,g=.005;l.inputState.pinching&&f>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qu)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ke;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class to{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Xt(t),this.density=e}clone(){return new to(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Yu extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Os=new U,$u=new U,Ku=new Nt;class jn{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Os.subVectors(n,e).cross($u.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Os),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ku.getNormalMatrix(t),r=this.coplanarPoint(Os).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $n=new as,Zu=new Vt(.5,.5),Hr=new U;class eo{constructor(t=new jn,e=new jn,n=new jn,r=new jn,s=new jn,a=new jn){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=un,n=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],c=s[2],l=s[3],h=s[4],d=s[5],f=s[6],m=s[7],g=s[8],M=s[9],p=s[10],u=s[11],y=s[12],T=s[13],S=s[14],w=s[15];if(r[0].setComponents(l-a,m-h,u-g,w-y).normalize(),r[1].setComponents(l+a,m+h,u+g,w+y).normalize(),r[2].setComponents(l+o,m+d,u+M,w+T).normalize(),r[3].setComponents(l-o,m-d,u-M,w-T).normalize(),n)r[4].setComponents(c,f,p,S).normalize(),r[5].setComponents(l-c,m-f,u-p,w-S).normalize();else if(r[4].setComponents(l-c,m-f,u-p,w-S).normalize(),e===un)r[5].setComponents(l+c,m+f,u+p,w+S).normalize();else if(e===es)r[5].setComponents(c,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(t){$n.center.set(0,0,0);const e=Zu.distanceTo(t.center);return $n.radius=.7071067811865476+e,$n.applyMatrix4(t.matrixWorld),this.intersectsSphere($n)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Hr.x=r.normal.x>0?t.max.x:t.min.x,Hr.y=r.normal.y>0?t.max.y:t.min.y,Hr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Hr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Yl extends Oi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const ko=new ue,Ba=new ja,Vr=new as,Gr=new U;class ju extends ye{constructor(t=new Xe,e=new Yl){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(r),Vr.radius+=s,t.ray.intersectsSphere(Vr)===!1)return;ko.copy(r).invert(),Ba.copy(t.ray).applyMatrix4(ko);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),m=Math.min(l.count,a.start+a.count);for(let g=f,M=m;g<M;g++){const p=l.getX(g);Gr.fromBufferAttribute(d,p),Wo(Gr,p,c,r,t,e,this)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let g=f,M=m;g<M;g++)Gr.fromBufferAttribute(d,g),Wo(Gr,g,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Wo(i,t,e,n,r,s,a){const o=Ba.distanceSqToPoint(i);if(o<e){const c=new U;Ba.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class $l extends Fe{constructor(t,e,n=ri,r,s,a,o=rn,c=rn,l,h=ar,d=1){if(h!==ar&&h!==or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:d};super(f,r,s,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Za(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Kl extends Fe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class no extends Xe{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],d=[],f=[],m=[];let g=0;const M=[],p=n/2;let u=0;y(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new ve(d,3)),this.setAttribute("normal",new ve(f,3)),this.setAttribute("uv",new ve(m,2));function y(){const S=new U,w=new U;let A=0;const C=(e-t)/n;for(let L=0;L<=s;L++){const E=[],x=L/s,P=x*(e-t)+t;for(let F=0;F<=r;F++){const H=F/r,q=H*c+o,W=Math.sin(q),X=Math.cos(q);w.x=P*W,w.y=-x*n+p,w.z=P*X,d.push(w.x,w.y,w.z),S.set(W,C,X).normalize(),f.push(S.x,S.y,S.z),m.push(H,1-x),E.push(g++)}M.push(E)}for(let L=0;L<r;L++)for(let E=0;E<s;E++){const x=M[E][L],P=M[E+1][L],F=M[E+1][L+1],H=M[E][L+1];(t>0||E!==0)&&(h.push(x,P,H),A+=3),(e>0||E!==s-1)&&(h.push(P,F,H),A+=3)}l.addGroup(u,A,0),u+=A}function T(S){const w=g,A=new Vt,C=new U;let L=0;const E=S===!0?t:e,x=S===!0?1:-1;for(let F=1;F<=r;F++)d.push(0,p*x,0),f.push(0,x,0),m.push(.5,.5),g++;const P=g;for(let F=0;F<=r;F++){const q=F/r*c+o,W=Math.cos(q),X=Math.sin(q);C.x=E*X,C.y=p*x,C.z=E*W,d.push(C.x,C.y,C.z),f.push(0,x,0),A.x=W*.5+.5,A.y=X*.5*x+.5,m.push(A.x,A.y),g++}for(let F=0;F<r;F++){const H=w+F,q=P+F;S===!0?h.push(q,q+1,H):h.push(q+1,q,H),L+=3}l.addGroup(u,L,S===!0?1:2),u+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new no(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class os extends Xe{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],a=[];o(r),l(n),h(),this.setAttribute("position",new ve(s,3)),this.setAttribute("normal",new ve(s.slice(),3)),this.setAttribute("uv",new ve(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const T=new U,S=new U,w=new U;for(let A=0;A<e.length;A+=3)m(e[A+0],T),m(e[A+1],S),m(e[A+2],w),c(T,S,w,y)}function c(y,T,S,w){const A=w+1,C=[];for(let L=0;L<=A;L++){C[L]=[];const E=y.clone().lerp(S,L/A),x=T.clone().lerp(S,L/A),P=A-L;for(let F=0;F<=P;F++)F===0&&L===A?C[L][F]=E:C[L][F]=E.clone().lerp(x,F/P)}for(let L=0;L<A;L++)for(let E=0;E<2*(A-L)-1;E++){const x=Math.floor(E/2);E%2===0?(f(C[L][x+1]),f(C[L+1][x]),f(C[L][x])):(f(C[L][x+1]),f(C[L+1][x+1]),f(C[L+1][x]))}}function l(y){const T=new U;for(let S=0;S<s.length;S+=3)T.x=s[S+0],T.y=s[S+1],T.z=s[S+2],T.normalize().multiplyScalar(y),s[S+0]=T.x,s[S+1]=T.y,s[S+2]=T.z}function h(){const y=new U;for(let T=0;T<s.length;T+=3){y.x=s[T+0],y.y=s[T+1],y.z=s[T+2];const S=p(y)/2/Math.PI+.5,w=u(y)/Math.PI+.5;a.push(S,1-w)}g(),d()}function d(){for(let y=0;y<a.length;y+=6){const T=a[y+0],S=a[y+2],w=a[y+4],A=Math.max(T,S,w),C=Math.min(T,S,w);A>.9&&C<.1&&(T<.2&&(a[y+0]+=1),S<.2&&(a[y+2]+=1),w<.2&&(a[y+4]+=1))}}function f(y){s.push(y.x,y.y,y.z)}function m(y,T){const S=y*3;T.x=t[S+0],T.y=t[S+1],T.z=t[S+2]}function g(){const y=new U,T=new U,S=new U,w=new U,A=new Vt,C=new Vt,L=new Vt;for(let E=0,x=0;E<s.length;E+=9,x+=6){y.set(s[E+0],s[E+1],s[E+2]),T.set(s[E+3],s[E+4],s[E+5]),S.set(s[E+6],s[E+7],s[E+8]),A.set(a[x+0],a[x+1]),C.set(a[x+2],a[x+3]),L.set(a[x+4],a[x+5]),w.copy(y).add(T).add(S).divideScalar(3);const P=p(w);M(A,x+0,y,P),M(C,x+2,T,P),M(L,x+4,S,P)}}function M(y,T,S,w){w<0&&y.x===1&&(a[T]=y.x-1),S.x===0&&S.z===0&&(a[T]=w/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new os(t.vertices,t.indices,t.radius,t.details)}}class ls extends os{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ls(t.radius,t.detail)}}class ur extends os{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,r,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ur(t.radius,t.detail)}}class gr extends Xe{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,h=c+1,d=t/o,f=e/c,m=[],g=[],M=[],p=[];for(let u=0;u<h;u++){const y=u*f-a;for(let T=0;T<l;T++){const S=T*d-s;g.push(S,-y,0),M.push(0,0,1),p.push(T/o),p.push(1-u/c)}}for(let u=0;u<c;u++)for(let y=0;y<o;y++){const T=y+l*u,S=y+l*(u+1),w=y+1+l*(u+1),A=y+1+l*u;m.push(T,S,A),m.push(S,w,A)}this.setIndex(m),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(M,3)),this.setAttribute("uv",new ve(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gr(t.width,t.height,t.widthSegments,t.heightSegments)}}class io extends Xe{constructor(t=.5,e=1,n=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);const o=[],c=[],l=[],h=[];let d=t;const f=(e-t)/r,m=new U,g=new Vt;for(let M=0;M<=r;M++){for(let p=0;p<=n;p++){const u=s+p/n*a;m.x=d*Math.cos(u),m.y=d*Math.sin(u),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/e+1)/2,g.y=(m.y/e+1)/2,h.push(g.x,g.y)}d+=f}for(let M=0;M<r;M++){const p=M*(n+1);for(let u=0;u<n;u++){const y=u+p,T=y,S=y+n+1,w=y+n+2,A=y+1;o.push(T,S,A),o.push(S,w,A)}}this.setIndex(o),this.setAttribute("position",new ve(c,3)),this.setAttribute("normal",new ve(l,3)),this.setAttribute("uv",new ve(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new io(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ai extends Xe{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new U,f=new U,m=[],g=[],M=[],p=[];for(let u=0;u<=n;u++){const y=[],T=u/n;let S=0;u===0&&a===0?S=.5/e:u===n&&c===Math.PI&&(S=-.5/e);for(let w=0;w<=e;w++){const A=w/e;d.x=-t*Math.cos(r+A*s)*Math.sin(a+T*o),d.y=t*Math.cos(a+T*o),d.z=t*Math.sin(r+A*s)*Math.sin(a+T*o),g.push(d.x,d.y,d.z),f.copy(d).normalize(),M.push(f.x,f.y,f.z),p.push(A+S,1-T),y.push(l++)}h.push(y)}for(let u=0;u<n;u++)for(let y=0;y<e;y++){const T=h[u][y+1],S=h[u][y],w=h[u+1][y],A=h[u+1][y+1];(u!==0||a>0)&&m.push(T,S,A),(u!==n-1||c<Math.PI)&&m.push(S,w,A)}this.setIndex(m),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(M,3)),this.setAttribute("uv",new ve(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ro extends Oi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ol,this.normalScale=new Vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ju extends Oi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Kc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Qu extends Oi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class so extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class th extends so{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Bs=new ue,Xo=new U,qo=new U;class Zl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Vt(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new eo,this._frameExtents=new Vt(1,1),this._viewportCount=1,this._viewports=[new te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Xo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Xo),qo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(qo),e.updateMatrixWorld(),Bs.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bs,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bs)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Yo=new ue,qi=new U,zs=new U;class eh extends Zl{constructor(){super(new ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Vt(4,2),this._viewportCount=6,this._viewports=[new te(2,1,1,1),new te(0,1,1,1),new te(3,1,1,1),new te(1,1,1,1),new te(3,0,1,1),new te(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),qi.setFromMatrixPosition(t.matrixWorld),n.position.copy(qi),zs.copy(n.position),zs.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(zs),n.updateMatrixWorld(),r.makeTranslation(-qi.x,-qi.y,-qi.z),Yo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yo,n.coordinateSystem,n.reversedDepth)}}class nh extends so{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new eh}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class jl extends Xl{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class ih extends Zl{constructor(){super(new jl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rh extends so{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new ih}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class sh extends ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const $o=new ue;class ah{constructor(t,e,n=0,r=1/0){this.ray=new ja(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new Ja,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return $o.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($o),this}intersectObject(t,e=!0,n=[]){return za(t,this,n,e),n.sort(Ko),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)za(t[r],this,n,e);return n.sort(Ko),n}}function Ko(i,t){return i.distance-t.distance}function za(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let a=0,o=s.length;a<o;a++)za(s[a],t,e,!0)}}function Zo(i,t,e,n){const r=oh(n);switch(e){case Ul:return i*t;case Nl:return i*t/r.components*r.byteLength;case qa:return i*t/r.components*r.byteLength;case Fl:return i*t*2/r.components*r.byteLength;case Ya:return i*t*2/r.components*r.byteLength;case Il:return i*t*3/r.components*r.byteLength;case nn:return i*t*4/r.components*r.byteLength;case $a:return i*t*4/r.components*r.byteLength;case Yr:case $r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Kr:case Zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ha:case fa:return Math.max(i,16)*Math.max(t,8)/4;case ua:case da:return Math.max(i,8)*Math.max(t,8)/2;case pa:case ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case _a:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ga:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case va:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case xa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ma:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Sa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ea:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ya:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ta:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ba:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case wa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ra:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ca:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Pa:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Da:case La:case Ua:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ia:case Na:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Fa:case Oa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function oh(i){switch(i){case pn:case Cl:return{byteLength:1,components:1};case rr:case Pl:case pr:return{byteLength:2,components:1};case Wa:case Xa:return{byteLength:2,components:4};case ri:case ka:case bn:return{byteLength:4,components:1};case Dl:case Ll:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ga}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ga);function Jl(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function lh(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,d=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<d.length;m++){const g=d[f],M=d[m];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++f,d[f]=M)}d.length=f+1;for(let m=0,g=d.length;m<g;m++){const M=d[m];i.bufferSubData(l,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var ch=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uh=`#ifdef USE_ALPHAHASH
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
#endif`,hh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ph=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mh=`#ifdef USE_AOMAP
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
#endif`,_h=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gh=`#ifdef USE_BATCHING
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
#endif`,vh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Eh=`#ifdef USE_IRIDESCENCE
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
#endif`,yh=`#ifdef USE_BUMPMAP
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
#endif`,Th=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ah=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ch=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ph=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Lh=`#define PI 3.141592653589793
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
} // validated`,Uh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ih=`vec3 transformedNormal = objectNormal;
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
#endif`,Nh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Oh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vh=`#ifdef USE_ENVMAP
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
#endif`,Gh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kh=`#ifdef USE_ENVMAP
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
#endif`,Wh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xh=`#ifdef USE_ENVMAP
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
#endif`,qh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$h=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zh=`#ifdef USE_GRADIENTMAP
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
}`,jh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,td=`uniform bool receiveShadow;
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
#endif`,ed=`#ifdef USE_ENVMAP
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
#endif`,nd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,id=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ad=`PhysicalMaterial material;
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
#endif`,od=`struct PhysicalMaterial {
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
}`,ld=`
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
#endif`,cd=`#if defined( RE_IndirectDiffuse )
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
#endif`,ud=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,md=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_d=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vd=`#if defined( USE_POINTS_UV )
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
#endif`,xd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Md=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ed=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Td=`#ifdef USE_MORPHTARGETS
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
#endif`,bd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ad=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,wd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Rd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dd=`#ifdef USE_NORMALMAP
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
#endif`,Ld=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ud=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Id=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Od=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Yd=`float getShadowMask() {
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
}`,$d=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kd=`#ifdef USE_SKINNING
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
#endif`,Zd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jd=`#ifdef USE_SKINNING
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
#endif`,Jd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ef=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,nf=`#ifdef USE_TRANSMISSION
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
#endif`,rf=`#ifdef USE_TRANSMISSION
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
#endif`,sf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,af=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,of=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,uf=`uniform sampler2D t2D;
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
}`,hf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,df=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ff=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mf=`#include <common>
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
}`,_f=`#if DEPTH_PACKING == 3200
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
}`,gf=`#define DISTANCE
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
}`,vf=`#define DISTANCE
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
}`,xf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sf=`uniform float scale;
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
}`,Ef=`uniform vec3 diffuse;
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
}`,yf=`#include <common>
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
}`,Tf=`uniform vec3 diffuse;
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
}`,bf=`#define LAMBERT
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
}`,Af=`#define LAMBERT
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
}`,wf=`#define MATCAP
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
}`,Rf=`#define MATCAP
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
}`,Cf=`#define NORMAL
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
}`,Pf=`#define NORMAL
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
}`,Df=`#define PHONG
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
}`,Lf=`#define PHONG
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
}`,Uf=`#define STANDARD
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
}`,If=`#define STANDARD
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
}`,Nf=`#define TOON
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
}`,Ff=`#define TOON
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
}`,Of=`uniform float size;
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
}`,Bf=`uniform vec3 diffuse;
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
}`,zf=`#include <common>
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
}`,Hf=`uniform vec3 color;
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
}`,Vf=`uniform float rotation;
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
}`,Gf=`uniform vec3 diffuse;
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
}`,Ot={alphahash_fragment:ch,alphahash_pars_fragment:uh,alphamap_fragment:hh,alphamap_pars_fragment:dh,alphatest_fragment:fh,alphatest_pars_fragment:ph,aomap_fragment:mh,aomap_pars_fragment:_h,batching_pars_vertex:gh,batching_vertex:vh,begin_vertex:xh,beginnormal_vertex:Mh,bsdfs:Sh,iridescence_fragment:Eh,bumpmap_pars_fragment:yh,clipping_planes_fragment:Th,clipping_planes_pars_fragment:bh,clipping_planes_pars_vertex:Ah,clipping_planes_vertex:wh,color_fragment:Rh,color_pars_fragment:Ch,color_pars_vertex:Ph,color_vertex:Dh,common:Lh,cube_uv_reflection_fragment:Uh,defaultnormal_vertex:Ih,displacementmap_pars_vertex:Nh,displacementmap_vertex:Fh,emissivemap_fragment:Oh,emissivemap_pars_fragment:Bh,colorspace_fragment:zh,colorspace_pars_fragment:Hh,envmap_fragment:Vh,envmap_common_pars_fragment:Gh,envmap_pars_fragment:kh,envmap_pars_vertex:Wh,envmap_physical_pars_fragment:ed,envmap_vertex:Xh,fog_vertex:qh,fog_pars_vertex:Yh,fog_fragment:$h,fog_pars_fragment:Kh,gradientmap_pars_fragment:Zh,lightmap_pars_fragment:jh,lights_lambert_fragment:Jh,lights_lambert_pars_fragment:Qh,lights_pars_begin:td,lights_toon_fragment:nd,lights_toon_pars_fragment:id,lights_phong_fragment:rd,lights_phong_pars_fragment:sd,lights_physical_fragment:ad,lights_physical_pars_fragment:od,lights_fragment_begin:ld,lights_fragment_maps:cd,lights_fragment_end:ud,logdepthbuf_fragment:hd,logdepthbuf_pars_fragment:dd,logdepthbuf_pars_vertex:fd,logdepthbuf_vertex:pd,map_fragment:md,map_pars_fragment:_d,map_particle_fragment:gd,map_particle_pars_fragment:vd,metalnessmap_fragment:xd,metalnessmap_pars_fragment:Md,morphinstance_vertex:Sd,morphcolor_vertex:Ed,morphnormal_vertex:yd,morphtarget_pars_vertex:Td,morphtarget_vertex:bd,normal_fragment_begin:Ad,normal_fragment_maps:wd,normal_pars_fragment:Rd,normal_pars_vertex:Cd,normal_vertex:Pd,normalmap_pars_fragment:Dd,clearcoat_normal_fragment_begin:Ld,clearcoat_normal_fragment_maps:Ud,clearcoat_pars_fragment:Id,iridescence_pars_fragment:Nd,opaque_fragment:Fd,packing:Od,premultiplied_alpha_fragment:Bd,project_vertex:zd,dithering_fragment:Hd,dithering_pars_fragment:Vd,roughnessmap_fragment:Gd,roughnessmap_pars_fragment:kd,shadowmap_pars_fragment:Wd,shadowmap_pars_vertex:Xd,shadowmap_vertex:qd,shadowmask_pars_fragment:Yd,skinbase_vertex:$d,skinning_pars_vertex:Kd,skinning_vertex:Zd,skinnormal_vertex:jd,specularmap_fragment:Jd,specularmap_pars_fragment:Qd,tonemapping_fragment:tf,tonemapping_pars_fragment:ef,transmission_fragment:nf,transmission_pars_fragment:rf,uv_pars_fragment:sf,uv_pars_vertex:af,uv_vertex:of,worldpos_vertex:lf,background_vert:cf,background_frag:uf,backgroundCube_vert:hf,backgroundCube_frag:df,cube_vert:ff,cube_frag:pf,depth_vert:mf,depth_frag:_f,distanceRGBA_vert:gf,distanceRGBA_frag:vf,equirect_vert:xf,equirect_frag:Mf,linedashed_vert:Sf,linedashed_frag:Ef,meshbasic_vert:yf,meshbasic_frag:Tf,meshlambert_vert:bf,meshlambert_frag:Af,meshmatcap_vert:wf,meshmatcap_frag:Rf,meshnormal_vert:Cf,meshnormal_frag:Pf,meshphong_vert:Df,meshphong_frag:Lf,meshphysical_vert:Uf,meshphysical_frag:If,meshtoon_vert:Nf,meshtoon_frag:Ff,points_vert:Of,points_frag:Bf,shadow_vert:zf,shadow_frag:Hf,sprite_vert:Vf,sprite_frag:Gf},st={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new Vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new Vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},ln={basic:{uniforms:De([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:De([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:De([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:De([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:De([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:De([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:De([st.points,st.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:De([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:De([st.common,st.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:De([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:De([st.sprite,st.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distanceRGBA:{uniforms:De([st.common,st.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distanceRGBA_vert,fragmentShader:Ot.distanceRGBA_frag},shadow:{uniforms:De([st.lights,st.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};ln.physical={uniforms:De([ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new Vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new Vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new Vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};const kr={r:0,b:0,g:0},Kn=new mn,kf=new ue;function Wf(i,t,e,n,r,s,a){const o=new Xt(0);let c=s===!0?0:1,l,h,d=null,f=0,m=null;function g(T){let S=T.isScene===!0?T.background:null;return S&&S.isTexture&&(S=(T.backgroundBlurriness>0?e:t).get(S)),S}function M(T){let S=!1;const w=g(T);w===null?u(o,c):w&&w.isColor&&(u(w,1),S=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(T,S){const w=g(S);w&&(w.isCubeTexture||w.mapping===ss)?(h===void 0&&(h=new hn(new Bi(1,1,1),new zn({name:"BackgroundCubeMaterial",uniforms:Ui(ln.backgroundCube.uniforms),vertexShader:ln.backgroundCube.vertexShader,fragmentShader:ln.backgroundCube.fragmentShader,side:Ne,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Kn.copy(S.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(kf.makeRotationFromEuler(Kn)),h.material.toneMapped=$t.getTransfer(w.colorSpace)!==Jt,(d!==w||f!==w.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=w,f=w.version,m=i.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new hn(new gr(2,2),new zn({name:"BackgroundMaterial",uniforms:Ui(ln.background.uniforms),vertexShader:ln.background.vertexShader,fragmentShader:ln.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=$t.getTransfer(w.colorSpace)!==Jt,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||f!==w.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=w,f=w.version,m=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function u(T,S){T.getRGB(kr,Wl(i)),n.buffers.color.setClear(kr.r,kr.g,kr.b,S,a)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,S=1){o.set(T),c=S,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,u(o,c)},render:M,addToRenderList:p,dispose:y}}function Xf(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=f(null);let s=r,a=!1;function o(x,P,F,H,q){let W=!1;const X=d(H,F,P);s!==X&&(s=X,l(s.object)),W=m(x,H,F,q),W&&g(x,H,F,q),q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,S(x,P,F,H),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function d(x,P,F){const H=F.wireframe===!0;let q=n[x.id];q===void 0&&(q={},n[x.id]=q);let W=q[P.id];W===void 0&&(W={},q[P.id]=W);let X=W[H];return X===void 0&&(X=f(c()),W[H]=X),X}function f(x){const P=[],F=[],H=[];for(let q=0;q<e;q++)P[q]=0,F[q]=0,H[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:H,object:x,attributes:{},index:null}}function m(x,P,F,H){const q=s.attributes,W=P.attributes;let X=0;const Z=F.getAttributes();for(const V in Z)if(Z[V].location>=0){const ut=q[V];let yt=W[V];if(yt===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(yt=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(yt=x.instanceColor)),ut===void 0||ut.attribute!==yt||yt&&ut.data!==yt.data)return!0;X++}return s.attributesNum!==X||s.index!==H}function g(x,P,F,H){const q={},W=P.attributes;let X=0;const Z=F.getAttributes();for(const V in Z)if(Z[V].location>=0){let ut=W[V];ut===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ut=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ut=x.instanceColor));const yt={};yt.attribute=ut,ut&&ut.data&&(yt.data=ut.data),q[V]=yt,X++}s.attributes=q,s.attributesNum=X,s.index=H}function M(){const x=s.newAttributes;for(let P=0,F=x.length;P<F;P++)x[P]=0}function p(x){u(x,0)}function u(x,P){const F=s.newAttributes,H=s.enabledAttributes,q=s.attributeDivisors;F[x]=1,H[x]===0&&(i.enableVertexAttribArray(x),H[x]=1),q[x]!==P&&(i.vertexAttribDivisor(x,P),q[x]=P)}function y(){const x=s.newAttributes,P=s.enabledAttributes;for(let F=0,H=P.length;F<H;F++)P[F]!==x[F]&&(i.disableVertexAttribArray(F),P[F]=0)}function T(x,P,F,H,q,W,X){X===!0?i.vertexAttribIPointer(x,P,F,q,W):i.vertexAttribPointer(x,P,F,H,q,W)}function S(x,P,F,H){M();const q=H.attributes,W=F.getAttributes(),X=P.defaultAttributeValues;for(const Z in W){const V=W[Z];if(V.location>=0){let at=q[Z];if(at===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(at=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(at=x.instanceColor)),at!==void 0){const ut=at.normalized,yt=at.itemSize,Gt=t.get(at);if(Gt===void 0)continue;const ie=Gt.buffer,ae=Gt.type,Kt=Gt.bytesPerElement,Y=ae===i.INT||ae===i.UNSIGNED_INT||at.gpuType===ka;if(at.isInterleavedBufferAttribute){const j=at.data,ft=j.stride,Dt=at.offset;if(j.isInstancedInterleavedBuffer){for(let Et=0;Et<V.locationSize;Et++)u(V.location+Et,j.meshPerAttribute);x.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Et=0;Et<V.locationSize;Et++)p(V.location+Et);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let Et=0;Et<V.locationSize;Et++)T(V.location+Et,yt/V.locationSize,ae,ut,ft*Kt,(Dt+yt/V.locationSize*Et)*Kt,Y)}else{if(at.isInstancedBufferAttribute){for(let j=0;j<V.locationSize;j++)u(V.location+j,at.meshPerAttribute);x.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let j=0;j<V.locationSize;j++)p(V.location+j);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let j=0;j<V.locationSize;j++)T(V.location+j,yt/V.locationSize,ae,ut,yt*Kt,yt/V.locationSize*j*Kt,Y)}}else if(X!==void 0){const ut=X[Z];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(V.location,ut);break;case 3:i.vertexAttrib3fv(V.location,ut);break;case 4:i.vertexAttrib4fv(V.location,ut);break;default:i.vertexAttrib1fv(V.location,ut)}}}}y()}function w(){L();for(const x in n){const P=n[x];for(const F in P){const H=P[F];for(const q in H)h(H[q].object),delete H[q];delete P[F]}delete n[x]}}function A(x){if(n[x.id]===void 0)return;const P=n[x.id];for(const F in P){const H=P[F];for(const q in H)h(H[q].object),delete H[q];delete P[F]}delete n[x.id]}function C(x){for(const P in n){const F=n[P];if(F[x.id]===void 0)continue;const H=F[x.id];for(const q in H)h(H[q].object),delete H[q];delete F[x.id]}}function L(){E(),a=!0,s!==r&&(s=r,l(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:L,resetDefaultState:E,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:p,disableUnusedAttributes:y}}function qf(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),e.update(h,n,d))}function o(l,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let m=0;for(let g=0;g<d;g++)m+=h[g];e.update(m,n,1)}function c(l,h,d,f){if(d===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)a(l[g],h[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,d);let g=0;for(let M=0;M<d;M++)g+=h[M]*f[M];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Yf(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==nn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const L=C===pr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==pn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==bn&&!L)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:y,maxVaryings:T,maxFragmentUniforms:S,vertexTextures:w,maxSamples:A}}function $f(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new jn,o=new Nt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||n!==0||r;return r=f,n=d.length,m},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,m){const g=d.clippingPlanes,M=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!r||g===null||g.length===0||s&&!p)s?h(null):l();else{const y=s?0:n,T=y*4;let S=u.clippingState||null;c.value=S,S=h(g,f,T,m);for(let w=0;w!==T;++w)S[w]=e[w];u.clippingState=S,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,m,g){const M=d!==null?d.length:0;let p=null;if(M!==0){if(p=c.value,g!==!0||p===null){const u=m+M*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<u)&&(p=new Float32Array(u));for(let T=0,S=m;T!==M;++T,S+=4)a.copy(d[T]).applyMatrix4(y,o),a.normal.toArray(p,S),p[S+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,p}}function Kf(i){let t=new WeakMap;function e(a,o){return o===aa?a.mapping=Pi:o===oa&&(a.mapping=Di),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===aa||o===oa)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Xu(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const bi=4,jo=[.125,.215,.35,.446,.526,.582],ti=20,Hs=new jl,Jo=new Xt;let Vs=null,Gs=0,ks=0,Ws=!1;const Jn=(1+Math.sqrt(5))/2,yi=1/Jn,Qo=[new U(-Jn,yi,0),new U(Jn,yi,0),new U(-yi,0,Jn),new U(yi,0,Jn),new U(0,Jn,-yi),new U(0,Jn,yi),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],Zf=new U;class tl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:a=256,position:o=Zf}=s;Vs=this._renderer.getRenderTarget(),Gs=this._renderer.getActiveCubeFace(),ks=this._renderer.getActiveMipmapLevel(),Ws=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=il(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Vs,Gs,ks),this._renderer.xr.enabled=Ws,t.scissorTest=!1,Wr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Pi||t.mapping===Di?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Vs=this._renderer.getRenderTarget(),Gs=this._renderer.getActiveCubeFace(),ks=this._renderer.getActiveMipmapLevel(),Ws=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:cn,minFilter:cn,generateMipmaps:!1,type:pr,format:nn,colorSpace:Li,depthBuffer:!1},r=el(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=el(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jf(s)),this._blurMaterial=Jf(s,t,e)}return r}_compileMaterial(t){const e=new hn(this._lodPlanes[0],t);this._renderer.compile(e,Hs)}_sceneToCubeUV(t,e,n,r,s){const c=new ke(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,m=d.toneMapping;d.getClearColor(Jo),d.toneMapping=On,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null));const M=new Qa({name:"PMREM.Background",side:Ne,depthWrite:!1,depthTest:!1}),p=new hn(new Bi,M);let u=!1;const y=t.background;y?y.isColor&&(M.color.copy(y),t.background=null,u=!0):(M.color.copy(Jo),u=!0);for(let T=0;T<6;T++){const S=T%3;S===0?(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[T],s.y,s.z)):S===1?(c.up.set(0,0,l[T]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[T],s.z)):(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[T]));const w=this._cubeSize;Wr(r,S*w,T>2?w:0,w,w),d.setRenderTarget(r),u&&d.render(p,c),d.render(t,c)}p.geometry.dispose(),p.material.dispose(),d.toneMapping=m,d.autoClear=f,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Pi||t.mapping===Di;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=il()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new hn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;Wr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Hs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Qo[(r-s-1)%Qo.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new hn(this._lodPlanes[r],l),f=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*ti-1),M=s/g,p=isFinite(s)?1+Math.floor(h*M):ti;p>ti&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ti}`);const u=[];let y=0;for(let C=0;C<ti;++C){const L=C/M,E=Math.exp(-L*L/2);u.push(E),C===0?y+=E:C<p&&(y+=2*E)}for(let C=0;C<u.length;C++)u[C]=u[C]/y;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:T}=this;f.dTheta.value=g,f.mipInt.value=T-n;const S=this._sizeLods[r],w=3*S*(r>T-bi?r-T+bi:0),A=4*(this._cubeSize-S);Wr(e,w,A,3*S,2*S),c.setRenderTarget(e),c.render(d,Hs)}}function jf(i){const t=[],e=[],n=[];let r=i;const s=i-bi+1+jo.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-bi?c=jo[a-i+bi-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,g=6,M=3,p=2,u=1,y=new Float32Array(M*g*m),T=new Float32Array(p*g*m),S=new Float32Array(u*g*m);for(let A=0;A<m;A++){const C=A%3*2/3-1,L=A>2?0:-1,E=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];y.set(E,M*g*A),T.set(f,p*g*A);const x=[A,A,A,A,A,A];S.set(x,u*g*A)}const w=new Xe;w.setAttribute("position",new sn(y,M)),w.setAttribute("uv",new sn(T,p)),w.setAttribute("faceIndex",new sn(S,u)),t.push(w),r>bi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function el(i,t,e){const n=new si(i,t,e);return n.texture.mapping=ss,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wr(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Jf(i,t,e){const n=new Float32Array(ti),r=new U(0,1,0);return new zn({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ao(),fragmentShader:`

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
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function nl(){return new zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ao(),fragmentShader:`

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
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function il(){return new zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ao(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function ao(){return`

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
	`}function Qf(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===aa||c===oa,h=c===Pi||c===Di;if(l||h){let d=t.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new tl(i)),d=l?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const m=o.image;return l&&m&&m.height>0||h&&m&&r(m)?(e===null&&(e=new tl(i)),d=l?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function tp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&cr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function ep(i,t,e,n){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete r[f.id];const m=s.get(f);m&&(t.remove(m),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,e.memory.geometries++),f}function c(d){const f=d.attributes;for(const m in f)t.update(f[m],i.ARRAY_BUFFER)}function l(d){const f=[],m=d.index,g=d.attributes.position;let M=0;if(m!==null){const y=m.array;M=m.version;for(let T=0,S=y.length;T<S;T+=3){const w=y[T+0],A=y[T+1],C=y[T+2];f.push(w,A,A,C,C,w)}}else if(g!==void 0){const y=g.array;M=g.version;for(let T=0,S=y.length/3-1;T<S;T+=3){const w=T+0,A=T+1,C=T+2;f.push(w,A,A,C,C,w)}}else return;const p=new(zl(f)?kl:Gl)(f,1);p.version=M;const u=s.get(d);u&&t.remove(u),s.set(d,p)}function h(d){const f=s.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function np(i,t,e){let n;function r(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function c(f,m){i.drawElements(n,m,s,f*a),e.update(m,n,1)}function l(f,m,g){g!==0&&(i.drawElementsInstanced(n,m,s,f*a,g),e.update(m,n,g))}function h(f,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,s,f,0,g);let p=0;for(let u=0;u<g;u++)p+=m[u];e.update(p,n,1)}function d(f,m,g,M){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<f.length;u++)l(f[u]/a,m[u],M[u]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,s,f,0,M,0,g);let u=0;for(let y=0;y<g;y++)u+=m[y]*M[y];e.update(u,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function ip(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function rp(i,t,e){const n=new WeakMap,r=new te;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let x=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var m=x;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),M===!0&&(S=2),p===!0&&(S=3);let w=o.attributes.position.count*S,A=1;w>t.maxTextureSize&&(A=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const C=new Float32Array(w*A*4*d),L=new Hl(C,w,A,d);L.type=bn,L.needsUpdate=!0;const E=S*4;for(let P=0;P<d;P++){const F=u[P],H=y[P],q=T[P],W=w*A*4*P;for(let X=0;X<F.count;X++){const Z=X*E;g===!0&&(r.fromBufferAttribute(F,X),C[W+Z+0]=r.x,C[W+Z+1]=r.y,C[W+Z+2]=r.z,C[W+Z+3]=0),M===!0&&(r.fromBufferAttribute(H,X),C[W+Z+4]=r.x,C[W+Z+5]=r.y,C[W+Z+6]=r.z,C[W+Z+7]=0),p===!0&&(r.fromBufferAttribute(q,X),C[W+Z+8]=r.x,C[W+Z+9]=r.y,C[W+Z+10]=r.z,C[W+Z+11]=q.itemSize===4?r.w:1)}}f={count:d,texture:L,size:new Vt(w,A)},n.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const M=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",M),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:s}}function sp(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,d=t.get(c,h);if(r.get(d)!==l&&(t.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return d}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const Ql=new Fe,rl=new $l(1,1),tc=new Hl,ec=new Ru,nc=new ql,sl=[],al=[],ol=new Float32Array(16),ll=new Float32Array(9),cl=new Float32Array(4);function zi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=sl[r];if(s===void 0&&(s=new Float32Array(r),sl[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function xe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Me(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function cs(i,t){let e=al[t];e===void 0&&(e=new Int32Array(t),al[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ap(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function op(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2fv(this.addr,t),Me(e,t)}}function lp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(xe(e,t))return;i.uniform3fv(this.addr,t),Me(e,t)}}function cp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4fv(this.addr,t),Me(e,t)}}function up(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;cl.set(n),i.uniformMatrix2fv(this.addr,!1,cl),Me(e,n)}}function hp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;ll.set(n),i.uniformMatrix3fv(this.addr,!1,ll),Me(e,n)}}function dp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;ol.set(n),i.uniformMatrix4fv(this.addr,!1,ol),Me(e,n)}}function fp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function pp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2iv(this.addr,t),Me(e,t)}}function mp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3iv(this.addr,t),Me(e,t)}}function _p(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4iv(this.addr,t),Me(e,t)}}function gp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function vp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2uiv(this.addr,t),Me(e,t)}}function xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3uiv(this.addr,t),Me(e,t)}}function Mp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4uiv(this.addr,t),Me(e,t)}}function Sp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(rl.compareFunction=Bl,s=rl):s=Ql,e.setTexture2D(t||s,r)}function Ep(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||ec,r)}function yp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||nc,r)}function Tp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||tc,r)}function bp(i){switch(i){case 5126:return ap;case 35664:return op;case 35665:return lp;case 35666:return cp;case 35674:return up;case 35675:return hp;case 35676:return dp;case 5124:case 35670:return fp;case 35667:case 35671:return pp;case 35668:case 35672:return mp;case 35669:case 35673:return _p;case 5125:return gp;case 36294:return vp;case 36295:return xp;case 36296:return Mp;case 35678:case 36198:case 36298:case 36306:case 35682:return Sp;case 35679:case 36299:case 36307:return Ep;case 35680:case 36300:case 36308:case 36293:return yp;case 36289:case 36303:case 36311:case 36292:return Tp}}function Ap(i,t){i.uniform1fv(this.addr,t)}function wp(i,t){const e=zi(t,this.size,2);i.uniform2fv(this.addr,e)}function Rp(i,t){const e=zi(t,this.size,3);i.uniform3fv(this.addr,e)}function Cp(i,t){const e=zi(t,this.size,4);i.uniform4fv(this.addr,e)}function Pp(i,t){const e=zi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Dp(i,t){const e=zi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Lp(i,t){const e=zi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Up(i,t){i.uniform1iv(this.addr,t)}function Ip(i,t){i.uniform2iv(this.addr,t)}function Np(i,t){i.uniform3iv(this.addr,t)}function Fp(i,t){i.uniform4iv(this.addr,t)}function Op(i,t){i.uniform1uiv(this.addr,t)}function Bp(i,t){i.uniform2uiv(this.addr,t)}function zp(i,t){i.uniform3uiv(this.addr,t)}function Hp(i,t){i.uniform4uiv(this.addr,t)}function Vp(i,t,e){const n=this.cache,r=t.length,s=cs(e,r);xe(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||Ql,s[a])}function Gp(i,t,e){const n=this.cache,r=t.length,s=cs(e,r);xe(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||ec,s[a])}function kp(i,t,e){const n=this.cache,r=t.length,s=cs(e,r);xe(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||nc,s[a])}function Wp(i,t,e){const n=this.cache,r=t.length,s=cs(e,r);xe(n,s)||(i.uniform1iv(this.addr,s),Me(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||tc,s[a])}function Xp(i){switch(i){case 5126:return Ap;case 35664:return wp;case 35665:return Rp;case 35666:return Cp;case 35674:return Pp;case 35675:return Dp;case 35676:return Lp;case 5124:case 35670:return Up;case 35667:case 35671:return Ip;case 35668:case 35672:return Np;case 35669:case 35673:return Fp;case 5125:return Op;case 36294:return Bp;case 36295:return zp;case 36296:return Hp;case 35678:case 36198:case 36298:case 36306:case 35682:return Vp;case 35679:case 36299:case 36307:return Gp;case 35680:case 36300:case 36308:case 36293:return kp;case 36289:case 36303:case 36311:case 36292:return Wp}}class qp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=bp(e.type)}}class Yp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xp(e.type)}}class $p{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const Xs=/(\w+)(\])?(\[|\.)?/g;function ul(i,t){i.seq.push(t),i.map[t.id]=t}function Kp(i,t,e){const n=i.name,r=n.length;for(Xs.lastIndex=0;;){const s=Xs.exec(n),a=Xs.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){ul(e,l===void 0?new qp(o,i,t):new Yp(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new $p(o),ul(e,d)),e=d}}}class jr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Kp(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function hl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Zp=37297;let jp=0;function Jp(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const dl=new Nt;function Qp(i){$t._getMatrix(dl,$t.workingColorSpace,i);const t=`mat3( ${dl.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(i)){case ts:return[t,"LinearTransferOETF"];case Jt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function fl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=(i.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Jp(i.getShaderSource(t),o)}else return s}function tm(i,t){const e=Qp(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function em(i,t){let e;switch(t){case Gc:e="Linear";break;case kc:e="Reinhard";break;case Wc:e="Cineon";break;case wl:e="ACESFilmic";break;case qc:e="AgX";break;case Yc:e="Neutral";break;case Xc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Xr=new U;function nm(){$t.getLuminanceCoefficients(Xr);const i=Xr.x.toFixed(4),t=Xr.y.toFixed(4),e=Xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function im(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($i).join(`
`)}function rm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function sm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function $i(i){return i!==""}function pl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ml(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const am=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ha(i){return i.replace(am,lm)}const om=new Map;function lm(i,t){let e=Ot[t];if(e===void 0){const n=om.get(t);if(n!==void 0)e=Ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ha(e)}const cm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _l(i){return i.replace(cm,um)}function um(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function gl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function hm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Tl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===bl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yn&&(t="SHADOWMAP_TYPE_VSM"),t}function dm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Pi:case Di:t="ENVMAP_TYPE_CUBE";break;case ss:t="ENVMAP_TYPE_CUBE_UV";break}return t}function fm(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Di&&(t="ENVMAP_MODE_REFRACTION"),t}function pm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Al:t="ENVMAP_BLENDING_MULTIPLY";break;case Hc:t="ENVMAP_BLENDING_MIX";break;case Vc:t="ENVMAP_BLENDING_ADD";break}return t}function mm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function _m(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=hm(e),l=dm(e),h=fm(e),d=pm(e),f=mm(e),m=im(e),g=rm(s),M=r.createProgram();let p,u,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($i).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter($i).join(`
`),u.length>0&&(u+=`
`)):(p=[gl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($i).join(`
`),u=[gl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==On?"#define TONE_MAPPING":"",e.toneMapping!==On?Ot.tonemapping_pars_fragment:"",e.toneMapping!==On?em("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,tm("linearToOutputTexel",e.outputColorSpace),nm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter($i).join(`
`)),a=Ha(a),a=pl(a,e),a=ml(a,e),o=Ha(o),o=pl(o,e),o=ml(o,e),a=_l(a),o=_l(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",e.glslVersion===To?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===To?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const T=y+p+a,S=y+u+o,w=hl(r,r.VERTEX_SHADER,T),A=hl(r,r.FRAGMENT_SHADER,S);r.attachShader(M,w),r.attachShader(M,A),e.index0AttributeName!==void 0?r.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function C(P){if(i.debug.checkShaderErrors){const F=r.getProgramInfoLog(M)||"",H=r.getShaderInfoLog(w)||"",q=r.getShaderInfoLog(A)||"",W=F.trim(),X=H.trim(),Z=q.trim();let V=!0,at=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,M,w,A);else{const ut=fl(r,w,"vertex"),yt=fl(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+W+`
`+ut+`
`+yt)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(X===""||Z==="")&&(at=!1);at&&(P.diagnostics={runnable:V,programLog:W,vertexShader:{log:X,prefix:p},fragmentShader:{log:Z,prefix:u}})}r.deleteShader(w),r.deleteShader(A),L=new jr(r,M),E=sm(r,M)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(M,Zp)),x},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jp++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=w,this.fragmentShader=A,this}let gm=0;class vm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new xm(t),e.set(t,n)),n}}class xm{constructor(t){this.id=gm++,this.code=t,this.usedTimes=0}}function Mm(i,t,e,n,r,s,a){const o=new Ja,c=new vm,l=new Set,h=[],d=r.logarithmicDepthBuffer,f=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(E){return l.add(E),E===0?"uv":`uv${E}`}function p(E,x,P,F,H){const q=F.fog,W=H.geometry,X=E.isMeshStandardMaterial?F.environment:null,Z=(E.isMeshStandardMaterial?e:t).get(E.envMap||X),V=Z&&Z.mapping===ss?Z.image.height:null,at=g[E.type];E.precision!==null&&(m=r.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const ut=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,yt=ut!==void 0?ut.length:0;let Gt=0;W.morphAttributes.position!==void 0&&(Gt=1),W.morphAttributes.normal!==void 0&&(Gt=2),W.morphAttributes.color!==void 0&&(Gt=3);let ie,ae,Kt,Y;if(at){const Zt=ln[at];ie=Zt.vertexShader,ae=Zt.fragmentShader}else ie=E.vertexShader,ae=E.fragmentShader,c.update(E),Kt=c.getVertexShaderID(E),Y=c.getFragmentShaderID(E);const j=i.getRenderTarget(),ft=i.state.buffers.depth.getReversed(),Dt=H.isInstancedMesh===!0,Et=H.isBatchedMesh===!0,qt=!!E.map,Te=!!E.matcap,R=!!Z,oe=!!E.aoMap,Ut=!!E.lightMap,Ct=!!E.bumpMap,_t=!!E.normalMap,le=!!E.displacementMap,gt=!!E.emissiveMap,Ft=!!E.metalnessMap,Se=!!E.roughnessMap,pe=E.anisotropy>0,b=E.clearcoat>0,_=E.dispersion>0,O=E.iridescence>0,k=E.sheen>0,K=E.transmission>0,G=pe&&!!E.anisotropyMap,St=b&&!!E.clearcoatMap,nt=b&&!!E.clearcoatNormalMap,vt=b&&!!E.clearcoatRoughnessMap,xt=O&&!!E.iridescenceMap,tt=O&&!!E.iridescenceThicknessMap,ct=k&&!!E.sheenColorMap,Rt=k&&!!E.sheenRoughnessMap,Mt=!!E.specularMap,ot=!!E.specularColorMap,It=!!E.specularIntensityMap,D=K&&!!E.transmissionMap,et=K&&!!E.thicknessMap,it=!!E.gradientMap,dt=!!E.alphaMap,J=E.alphaTest>0,$=!!E.alphaHash,mt=!!E.extensions;let Lt=On;E.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Lt=i.toneMapping);const re={shaderID:at,shaderType:E.type,shaderName:E.name,vertexShader:ie,fragmentShader:ae,defines:E.defines,customVertexShaderID:Kt,customFragmentShaderID:Y,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:Et,batchingColor:Et&&H._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&H.instanceColor!==null,instancingMorph:Dt&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Li,alphaToCoverage:!!E.alphaToCoverage,map:qt,matcap:Te,envMap:R,envMapMode:R&&Z.mapping,envMapCubeUVHeight:V,aoMap:oe,lightMap:Ut,bumpMap:Ct,normalMap:_t,displacementMap:f&&le,emissiveMap:gt,normalMapObjectSpace:_t&&E.normalMapType===jc,normalMapTangentSpace:_t&&E.normalMapType===Ol,metalnessMap:Ft,roughnessMap:Se,anisotropy:pe,anisotropyMap:G,clearcoat:b,clearcoatMap:St,clearcoatNormalMap:nt,clearcoatRoughnessMap:vt,dispersion:_,iridescence:O,iridescenceMap:xt,iridescenceThicknessMap:tt,sheen:k,sheenColorMap:ct,sheenRoughnessMap:Rt,specularMap:Mt,specularColorMap:ot,specularIntensityMap:It,transmission:K,transmissionMap:D,thicknessMap:et,gradientMap:it,opaque:E.transparent===!1&&E.blending===wi&&E.alphaToCoverage===!1,alphaMap:dt,alphaTest:J,alphaHash:$,combine:E.combine,mapUv:qt&&M(E.map.channel),aoMapUv:oe&&M(E.aoMap.channel),lightMapUv:Ut&&M(E.lightMap.channel),bumpMapUv:Ct&&M(E.bumpMap.channel),normalMapUv:_t&&M(E.normalMap.channel),displacementMapUv:le&&M(E.displacementMap.channel),emissiveMapUv:gt&&M(E.emissiveMap.channel),metalnessMapUv:Ft&&M(E.metalnessMap.channel),roughnessMapUv:Se&&M(E.roughnessMap.channel),anisotropyMapUv:G&&M(E.anisotropyMap.channel),clearcoatMapUv:St&&M(E.clearcoatMap.channel),clearcoatNormalMapUv:nt&&M(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&M(E.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&M(E.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&M(E.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&M(E.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&M(E.sheenRoughnessMap.channel),specularMapUv:Mt&&M(E.specularMap.channel),specularColorMapUv:ot&&M(E.specularColorMap.channel),specularIntensityMapUv:It&&M(E.specularIntensityMap.channel),transmissionMapUv:D&&M(E.transmissionMap.channel),thicknessMapUv:et&&M(E.thicknessMap.channel),alphaMapUv:dt&&M(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(_t||pe),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!W.attributes.uv&&(qt||dt),fog:!!q,useFog:E.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ft,skinning:H.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Gt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Lt,decodeVideoTexture:qt&&E.map.isVideoTexture===!0&&$t.getTransfer(E.map.colorSpace)===Jt,decodeVideoTextureEmissive:gt&&E.emissiveMap.isVideoTexture===!0&&$t.getTransfer(E.emissiveMap.colorSpace)===Jt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===tn,flipSided:E.side===Ne,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:mt&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&E.extensions.multiDraw===!0||Et)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return re.vertexUv1s=l.has(1),re.vertexUv2s=l.has(2),re.vertexUv3s=l.has(3),l.clear(),re}function u(E){const x=[];if(E.shaderID?x.push(E.shaderID):(x.push(E.customVertexShaderID),x.push(E.customFragmentShaderID)),E.defines!==void 0)for(const P in E.defines)x.push(P),x.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(y(x,E),T(x,E),x.push(i.outputColorSpace)),x.push(E.customProgramCacheKey),x.join()}function y(E,x){E.push(x.precision),E.push(x.outputColorSpace),E.push(x.envMapMode),E.push(x.envMapCubeUVHeight),E.push(x.mapUv),E.push(x.alphaMapUv),E.push(x.lightMapUv),E.push(x.aoMapUv),E.push(x.bumpMapUv),E.push(x.normalMapUv),E.push(x.displacementMapUv),E.push(x.emissiveMapUv),E.push(x.metalnessMapUv),E.push(x.roughnessMapUv),E.push(x.anisotropyMapUv),E.push(x.clearcoatMapUv),E.push(x.clearcoatNormalMapUv),E.push(x.clearcoatRoughnessMapUv),E.push(x.iridescenceMapUv),E.push(x.iridescenceThicknessMapUv),E.push(x.sheenColorMapUv),E.push(x.sheenRoughnessMapUv),E.push(x.specularMapUv),E.push(x.specularColorMapUv),E.push(x.specularIntensityMapUv),E.push(x.transmissionMapUv),E.push(x.thicknessMapUv),E.push(x.combine),E.push(x.fogExp2),E.push(x.sizeAttenuation),E.push(x.morphTargetsCount),E.push(x.morphAttributeCount),E.push(x.numDirLights),E.push(x.numPointLights),E.push(x.numSpotLights),E.push(x.numSpotLightMaps),E.push(x.numHemiLights),E.push(x.numRectAreaLights),E.push(x.numDirLightShadows),E.push(x.numPointLightShadows),E.push(x.numSpotLightShadows),E.push(x.numSpotLightShadowsWithMaps),E.push(x.numLightProbes),E.push(x.shadowMapType),E.push(x.toneMapping),E.push(x.numClippingPlanes),E.push(x.numClipIntersection),E.push(x.depthPacking)}function T(E,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),E.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),E.push(o.mask)}function S(E){const x=g[E.type];let P;if(x){const F=ln[x];P=Vu.clone(F.uniforms)}else P=E.uniforms;return P}function w(E,x){let P;for(let F=0,H=h.length;F<H;F++){const q=h[F];if(q.cacheKey===x){P=q,++P.usedTimes;break}}return P===void 0&&(P=new _m(i,x,E,s),h.push(P)),P}function A(E){if(--E.usedTimes===0){const x=h.indexOf(E);h[x]=h[h.length-1],h.pop(),E.destroy()}}function C(E){c.remove(E)}function L(){c.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:S,acquireProgram:w,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:L}}function Sm(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Em(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function vl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function xl(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(d,f,m,g,M,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:g,renderOrder:d.renderOrder,z:M,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=g,u.renderOrder=d.renderOrder,u.z=M,u.group=p),t++,u}function o(d,f,m,g,M,p){const u=a(d,f,m,g,M,p);m.transmission>0?n.push(u):m.transparent===!0?r.push(u):e.push(u)}function c(d,f,m,g,M,p){const u=a(d,f,m,g,M,p);m.transmission>0?n.unshift(u):m.transparent===!0?r.unshift(u):e.unshift(u)}function l(d,f){e.length>1&&e.sort(d||Em),n.length>1&&n.sort(f||vl),r.length>1&&r.sort(f||vl)}function h(){for(let d=t,f=i.length;d<f;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function ym(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new xl,i.set(n,[a])):r>=s.length?(a=new xl,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Tm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new Xt};break;case"SpotLight":e={position:new U,direction:new U,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function bm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Am=0;function wm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Rm(i){const t=new Tm,e=bm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const r=new U,s=new ue,a=new ue;function o(l){let h=0,d=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let m=0,g=0,M=0,p=0,u=0,y=0,T=0,S=0,w=0,A=0,C=0;l.sort(wm);for(let E=0,x=l.length;E<x;E++){const P=l[E],F=P.color,H=P.intensity,q=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=F.r*H,d+=F.g*H,f+=F.b*H;else if(P.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(P.sh.coefficients[X],H);C++}else if(P.isDirectionalLight){const X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Z=P.shadow,V=e.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[m]=V,n.directionalShadowMap[m]=W,n.directionalShadowMatrix[m]=P.shadow.matrix,y++}n.directional[m]=X,m++}else if(P.isSpotLight){const X=t.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(F).multiplyScalar(H),X.distance=q,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,n.spot[M]=X;const Z=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,Z.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[M]=Z.matrix,P.castShadow){const V=e.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[M]=V,n.spotShadowMap[M]=W,S++}M++}else if(P.isRectAreaLight){const X=t.get(P);X.color.copy(F).multiplyScalar(H),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=X,p++}else if(P.isPointLight){const X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){const Z=P.shadow,V=e.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=P.shadow.matrix,T++}n.point[g]=X,g++}else if(P.isHemisphereLight){const X=t.get(P);X.skyColor.copy(P.color).multiplyScalar(H),X.groundColor.copy(P.groundColor).multiplyScalar(H),n.hemi[u]=X,u++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=st.LTC_FLOAT_1,n.rectAreaLTC2=st.LTC_FLOAT_2):(n.rectAreaLTC1=st.LTC_HALF_1,n.rectAreaLTC2=st.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;const L=n.hash;(L.directionalLength!==m||L.pointLength!==g||L.spotLength!==M||L.rectAreaLength!==p||L.hemiLength!==u||L.numDirectionalShadows!==y||L.numPointShadows!==T||L.numSpotShadows!==S||L.numSpotMaps!==w||L.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=M,n.rectArea.length=p,n.point.length=g,n.hemi.length=u,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=S+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,L.directionalLength=m,L.pointLength=g,L.spotLength=M,L.rectAreaLength=p,L.hemiLength=u,L.numDirectionalShadows=y,L.numPointShadows=T,L.numSpotShadows=S,L.numSpotMaps=w,L.numLightProbes=C,n.version=Am++)}function c(l,h){let d=0,f=0,m=0,g=0,M=0;const p=h.matrixWorldInverse;for(let u=0,y=l.length;u<y;u++){const T=l[u];if(T.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),d++}else if(T.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),m++}else if(T.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),a.identity(),s.copy(T.matrixWorld),s.premultiply(p),a.extractRotation(s),S.halfWidth.set(T.width*.5,0,0),S.halfHeight.set(0,T.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(T.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),f++}else if(T.isHemisphereLight){const S=n.hemi[M];S.direction.setFromMatrixPosition(T.matrixWorld),S.direction.transformDirection(p),M++}}}return{setup:o,setupView:c,state:n}}function Ml(i){const t=new Rm(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function Cm(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Ml(i),t.set(r,[o])):s>=a.length?(o=new Ml(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Pm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dm=`uniform sampler2D shadow_pass;
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
}`;function Lm(i,t,e){let n=new eo;const r=new Vt,s=new Vt,a=new te,o=new Ju({depthPacking:Zc}),c=new Qu,l={},h=e.maxTextureSize,d={[Bn]:Ne,[Ne]:Bn,[tn]:tn},f=new zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vt},radius:{value:4}},vertexShader:Pm,fragmentShader:Dm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new Xe;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new hn(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Tl;let u=this.type;this.render=function(A,C,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;const E=i.getRenderTarget(),x=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Fn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const H=u!==yn&&this.type===yn,q=u===yn&&this.type!==yn;for(let W=0,X=A.length;W<X;W++){const Z=A[W],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const at=V.getFrameExtents();if(r.multiply(at),s.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/at.x),r.x=s.x*at.x,V.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/at.y),r.y=s.y*at.y,V.mapSize.y=s.y)),V.map===null||H===!0||q===!0){const yt=this.type!==yn?{minFilter:rn,magFilter:rn}:{};V.map!==null&&V.map.dispose(),V.map=new si(r.x,r.y,yt),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ut=V.getViewportCount();for(let yt=0;yt<ut;yt++){const Gt=V.getViewport(yt);a.set(s.x*Gt.x,s.y*Gt.y,s.x*Gt.z,s.y*Gt.w),F.viewport(a),V.updateMatrices(Z,yt),n=V.getFrustum(),S(C,L,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===yn&&y(V,L),V.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(E,x,P)};function y(A,C){const L=t.update(M);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new si(r.x,r.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,L,f,M,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,L,m,M,null)}function T(A,C,L,E){let x=null;const P=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)x=P;else if(x=L.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=x.uuid,H=C.uuid;let q=l[F];q===void 0&&(q={},l[F]=q);let W=q[H];W===void 0&&(W=x.clone(),q[H]=W,C.addEventListener("dispose",w)),x=W}if(x.visible=C.visible,x.wireframe=C.wireframe,E===yn?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:d[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,L.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const F=i.properties.get(x);F.light=L}return x}function S(A,C,L,E,x){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&x===yn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const H=t.update(A),q=A.material;if(Array.isArray(q)){const W=H.groups;for(let X=0,Z=W.length;X<Z;X++){const V=W[X],at=q[V.materialIndex];if(at&&at.visible){const ut=T(A,at,E,x);A.onBeforeShadow(i,A,C,L,H,ut,V),i.renderBufferDirect(L,null,H,ut,A,V),A.onAfterShadow(i,A,C,L,H,ut,V)}}}else if(q.visible){const W=T(A,q,E,x);A.onBeforeShadow(i,A,C,L,H,W,null),i.renderBufferDirect(L,null,H,W,A,null),A.onAfterShadow(i,A,C,L,H,W,null)}}const F=A.children;for(let H=0,q=F.length;H<q;H++)S(F[H],C,L,E,x)}function w(A){A.target.removeEventListener("dispose",w);for(const L in l){const E=l[L],x=A.target.uuid;x in E&&(E[x].dispose(),delete E[x])}}}const Um={[Qs]:ta,[ea]:ra,[na]:sa,[Ci]:ia,[ta]:Qs,[ra]:ea,[sa]:na,[ia]:Ci};function Im(i,t){function e(){let D=!1;const et=new te;let it=null;const dt=new te(0,0,0,0);return{setMask:function(J){it!==J&&!D&&(i.colorMask(J,J,J,J),it=J)},setLocked:function(J){D=J},setClear:function(J,$,mt,Lt,re){re===!0&&(J*=Lt,$*=Lt,mt*=Lt),et.set(J,$,mt,Lt),dt.equals(et)===!1&&(i.clearColor(J,$,mt,Lt),dt.copy(et))},reset:function(){D=!1,it=null,dt.set(-1,0,0,0)}}}function n(){let D=!1,et=!1,it=null,dt=null,J=null;return{setReversed:function($){if(et!==$){const mt=t.get("EXT_clip_control");$?mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.ZERO_TO_ONE_EXT):mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.NEGATIVE_ONE_TO_ONE_EXT),et=$;const Lt=J;J=null,this.setClear(Lt)}},getReversed:function(){return et},setTest:function($){$?j(i.DEPTH_TEST):ft(i.DEPTH_TEST)},setMask:function($){it!==$&&!D&&(i.depthMask($),it=$)},setFunc:function($){if(et&&($=Um[$]),dt!==$){switch($){case Qs:i.depthFunc(i.NEVER);break;case ta:i.depthFunc(i.ALWAYS);break;case ea:i.depthFunc(i.LESS);break;case Ci:i.depthFunc(i.LEQUAL);break;case na:i.depthFunc(i.EQUAL);break;case ia:i.depthFunc(i.GEQUAL);break;case ra:i.depthFunc(i.GREATER);break;case sa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}dt=$}},setLocked:function($){D=$},setClear:function($){J!==$&&(et&&($=1-$),i.clearDepth($),J=$)},reset:function(){D=!1,it=null,dt=null,J=null,et=!1}}}function r(){let D=!1,et=null,it=null,dt=null,J=null,$=null,mt=null,Lt=null,re=null;return{setTest:function(Zt){D||(Zt?j(i.STENCIL_TEST):ft(i.STENCIL_TEST))},setMask:function(Zt){et!==Zt&&!D&&(i.stencilMask(Zt),et=Zt)},setFunc:function(Zt,gn,on){(it!==Zt||dt!==gn||J!==on)&&(i.stencilFunc(Zt,gn,on),it=Zt,dt=gn,J=on)},setOp:function(Zt,gn,on){($!==Zt||mt!==gn||Lt!==on)&&(i.stencilOp(Zt,gn,on),$=Zt,mt=gn,Lt=on)},setLocked:function(Zt){D=Zt},setClear:function(Zt){re!==Zt&&(i.clearStencil(Zt),re=Zt)},reset:function(){D=!1,et=null,it=null,dt=null,J=null,$=null,mt=null,Lt=null,re=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let h={},d={},f=new WeakMap,m=[],g=null,M=!1,p=null,u=null,y=null,T=null,S=null,w=null,A=null,C=new Xt(0,0,0),L=0,E=!1,x=null,P=null,F=null,H=null,q=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),X=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),X=Z>=2);let at=null,ut={};const yt=i.getParameter(i.SCISSOR_BOX),Gt=i.getParameter(i.VIEWPORT),ie=new te().fromArray(yt),ae=new te().fromArray(Gt);function Kt(D,et,it,dt){const J=new Uint8Array(4),$=i.createTexture();i.bindTexture(D,$),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let mt=0;mt<it;mt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(et,0,i.RGBA,1,1,dt,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(et+mt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return $}const Y={};Y[i.TEXTURE_2D]=Kt(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Kt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Kt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Kt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(i.DEPTH_TEST),a.setFunc(Ci),Ct(!1),_t(vo),j(i.CULL_FACE),oe(Fn);function j(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function ft(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function Dt(D,et){return d[D]!==et?(i.bindFramebuffer(D,et),d[D]=et,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=et),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=et),!0):!1}function Et(D,et){let it=m,dt=!1;if(D){it=f.get(et),it===void 0&&(it=[],f.set(et,it));const J=D.textures;if(it.length!==J.length||it[0]!==i.COLOR_ATTACHMENT0){for(let $=0,mt=J.length;$<mt;$++)it[$]=i.COLOR_ATTACHMENT0+$;it.length=J.length,dt=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,dt=!0);dt&&i.drawBuffers(it)}function qt(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Te={[Qn]:i.FUNC_ADD,[yc]:i.FUNC_SUBTRACT,[Tc]:i.FUNC_REVERSE_SUBTRACT};Te[bc]=i.MIN,Te[Ac]=i.MAX;const R={[wc]:i.ZERO,[Rc]:i.ONE,[Cc]:i.SRC_COLOR,[js]:i.SRC_ALPHA,[Nc]:i.SRC_ALPHA_SATURATE,[Uc]:i.DST_COLOR,[Dc]:i.DST_ALPHA,[Pc]:i.ONE_MINUS_SRC_COLOR,[Js]:i.ONE_MINUS_SRC_ALPHA,[Ic]:i.ONE_MINUS_DST_COLOR,[Lc]:i.ONE_MINUS_DST_ALPHA,[Fc]:i.CONSTANT_COLOR,[Oc]:i.ONE_MINUS_CONSTANT_COLOR,[Bc]:i.CONSTANT_ALPHA,[zc]:i.ONE_MINUS_CONSTANT_ALPHA};function oe(D,et,it,dt,J,$,mt,Lt,re,Zt){if(D===Fn){M===!0&&(ft(i.BLEND),M=!1);return}if(M===!1&&(j(i.BLEND),M=!0),D!==Ec){if(D!==p||Zt!==E){if((u!==Qn||S!==Qn)&&(i.blendEquation(i.FUNC_ADD),u=Qn,S=Qn),Zt)switch(D){case wi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xo:i.blendFunc(i.ONE,i.ONE);break;case Mo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case So:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case wi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Mo:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case So:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}y=null,T=null,w=null,A=null,C.set(0,0,0),L=0,p=D,E=Zt}return}J=J||et,$=$||it,mt=mt||dt,(et!==u||J!==S)&&(i.blendEquationSeparate(Te[et],Te[J]),u=et,S=J),(it!==y||dt!==T||$!==w||mt!==A)&&(i.blendFuncSeparate(R[it],R[dt],R[$],R[mt]),y=it,T=dt,w=$,A=mt),(Lt.equals(C)===!1||re!==L)&&(i.blendColor(Lt.r,Lt.g,Lt.b,re),C.copy(Lt),L=re),p=D,E=!1}function Ut(D,et){D.side===tn?ft(i.CULL_FACE):j(i.CULL_FACE);let it=D.side===Ne;et&&(it=!it),Ct(it),D.blending===wi&&D.transparent===!1?oe(Fn):oe(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const dt=D.stencilWrite;o.setTest(dt),dt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),gt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(D){x!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),x=D)}function _t(D){D!==Mc?(j(i.CULL_FACE),D!==P&&(D===vo?i.cullFace(i.BACK):D===Sc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ft(i.CULL_FACE),P=D}function le(D){D!==F&&(X&&i.lineWidth(D),F=D)}function gt(D,et,it){D?(j(i.POLYGON_OFFSET_FILL),(H!==et||q!==it)&&(i.polygonOffset(et,it),H=et,q=it)):ft(i.POLYGON_OFFSET_FILL)}function Ft(D){D?j(i.SCISSOR_TEST):ft(i.SCISSOR_TEST)}function Se(D){D===void 0&&(D=i.TEXTURE0+W-1),at!==D&&(i.activeTexture(D),at=D)}function pe(D,et,it){it===void 0&&(at===null?it=i.TEXTURE0+W-1:it=at);let dt=ut[it];dt===void 0&&(dt={type:void 0,texture:void 0},ut[it]=dt),(dt.type!==D||dt.texture!==et)&&(at!==it&&(i.activeTexture(it),at=it),i.bindTexture(D,et||Y[D]),dt.type=D,dt.texture=et)}function b(){const D=ut[at];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function k(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function K(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function St(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function vt(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xt(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function tt(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ct(D){ie.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ie.copy(D))}function Rt(D){ae.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),ae.copy(D))}function Mt(D,et){let it=l.get(et);it===void 0&&(it=new WeakMap,l.set(et,it));let dt=it.get(D);dt===void 0&&(dt=i.getUniformBlockIndex(et,D.name),it.set(D,dt))}function ot(D,et){const dt=l.get(et).get(D);c.get(et)!==dt&&(i.uniformBlockBinding(et,dt,D.__bindingPointIndex),c.set(et,dt))}function It(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},at=null,ut={},d={},f=new WeakMap,m=[],g=null,M=!1,p=null,u=null,y=null,T=null,S=null,w=null,A=null,C=new Xt(0,0,0),L=0,E=!1,x=null,P=null,F=null,H=null,q=null,ie.set(0,0,i.canvas.width,i.canvas.height),ae.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:j,disable:ft,bindFramebuffer:Dt,drawBuffers:Et,useProgram:qt,setBlending:oe,setMaterial:Ut,setFlipSided:Ct,setCullFace:_t,setLineWidth:le,setPolygonOffset:gt,setScissorTest:Ft,activeTexture:Se,bindTexture:pe,unbindTexture:b,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:xt,texImage3D:tt,updateUBOMapping:Mt,uniformBlockBinding:ot,texStorage2D:nt,texStorage3D:vt,texSubImage2D:k,texSubImage3D:K,compressedTexSubImage2D:G,compressedTexSubImage3D:St,scissor:ct,viewport:Rt,reset:It}}function Nm(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Vt,h=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,_){return m?new OffscreenCanvas(b,_):ns("canvas")}function M(b,_,O){let k=1;const K=pe(b);if((K.width>O||K.height>O)&&(k=O/Math.max(K.width,K.height)),k<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const G=Math.floor(k*K.width),St=Math.floor(k*K.height);d===void 0&&(d=g(G,St));const nt=_?g(G,St):d;return nt.width=G,nt.height=St,nt.getContext("2d").drawImage(b,0,0,G,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+G+"x"+St+")."),nt}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),b;return b}function p(b){return b.generateMipmaps}function u(b){i.generateMipmap(b)}function y(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(b,_,O,k,K=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let G=_;if(_===i.RED&&(O===i.FLOAT&&(G=i.R32F),O===i.HALF_FLOAT&&(G=i.R16F),O===i.UNSIGNED_BYTE&&(G=i.R8)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.R8UI),O===i.UNSIGNED_SHORT&&(G=i.R16UI),O===i.UNSIGNED_INT&&(G=i.R32UI),O===i.BYTE&&(G=i.R8I),O===i.SHORT&&(G=i.R16I),O===i.INT&&(G=i.R32I)),_===i.RG&&(O===i.FLOAT&&(G=i.RG32F),O===i.HALF_FLOAT&&(G=i.RG16F),O===i.UNSIGNED_BYTE&&(G=i.RG8)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RG8UI),O===i.UNSIGNED_SHORT&&(G=i.RG16UI),O===i.UNSIGNED_INT&&(G=i.RG32UI),O===i.BYTE&&(G=i.RG8I),O===i.SHORT&&(G=i.RG16I),O===i.INT&&(G=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGB8UI),O===i.UNSIGNED_SHORT&&(G=i.RGB16UI),O===i.UNSIGNED_INT&&(G=i.RGB32UI),O===i.BYTE&&(G=i.RGB8I),O===i.SHORT&&(G=i.RGB16I),O===i.INT&&(G=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(G=i.RGBA16UI),O===i.UNSIGNED_INT&&(G=i.RGBA32UI),O===i.BYTE&&(G=i.RGBA8I),O===i.SHORT&&(G=i.RGBA16I),O===i.INT&&(G=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(G=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(G=i.R11F_G11F_B10F)),_===i.RGBA){const St=K?ts:$t.getTransfer(k);O===i.FLOAT&&(G=i.RGBA32F),O===i.HALF_FLOAT&&(G=i.RGBA16F),O===i.UNSIGNED_BYTE&&(G=St===Jt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(G=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(G=i.RGB5_A1)}return(G===i.R16F||G===i.R32F||G===i.RG16F||G===i.RG32F||G===i.RGBA16F||G===i.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function S(b,_){let O;return b?_===null||_===ri||_===sr?O=i.DEPTH24_STENCIL8:_===bn?O=i.DEPTH32F_STENCIL8:_===rr&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ri||_===sr?O=i.DEPTH_COMPONENT24:_===bn?O=i.DEPTH_COMPONENT32F:_===rr&&(O=i.DEPTH_COMPONENT16),O}function w(b,_){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==rn&&b.minFilter!==cn?Math.log2(Math.max(_.width,_.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?_.mipmaps.length:1}function A(b){const _=b.target;_.removeEventListener("dispose",A),L(_),_.isVideoTexture&&h.delete(_)}function C(b){const _=b.target;_.removeEventListener("dispose",C),x(_)}function L(b){const _=n.get(b);if(_.__webglInit===void 0)return;const O=b.source,k=f.get(O);if(k){const K=k[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&E(b),Object.keys(k).length===0&&f.delete(O)}n.remove(b)}function E(b){const _=n.get(b);i.deleteTexture(_.__webglTexture);const O=b.source,k=f.get(O);delete k[_.__cacheKey],a.memory.textures--}function x(b){const _=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(_.__webglFramebuffer[k]))for(let K=0;K<_.__webglFramebuffer[k].length;K++)i.deleteFramebuffer(_.__webglFramebuffer[k][K]);else i.deleteFramebuffer(_.__webglFramebuffer[k]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[k])}else{if(Array.isArray(_.__webglFramebuffer))for(let k=0;k<_.__webglFramebuffer.length;k++)i.deleteFramebuffer(_.__webglFramebuffer[k]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let k=0;k<_.__webglColorRenderbuffer.length;k++)_.__webglColorRenderbuffer[k]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[k]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=b.textures;for(let k=0,K=O.length;k<K;k++){const G=n.get(O[k]);G.__webglTexture&&(i.deleteTexture(G.__webglTexture),a.memory.textures--),n.remove(O[k])}n.remove(b)}let P=0;function F(){P=0}function H(){const b=P;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),P+=1,b}function q(b){const _=[];return _.push(b.wrapS),_.push(b.wrapT),_.push(b.wrapR||0),_.push(b.magFilter),_.push(b.minFilter),_.push(b.anisotropy),_.push(b.internalFormat),_.push(b.format),_.push(b.type),_.push(b.generateMipmaps),_.push(b.premultiplyAlpha),_.push(b.flipY),_.push(b.unpackAlignment),_.push(b.colorSpace),_.join()}function W(b,_){const O=n.get(b);if(b.isVideoTexture&&Ft(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&O.__version!==b.version){const k=b.image;if(k===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,b,_);return}}else b.isExternalTexture&&(O.__webglTexture=b.sourceTexture?b.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function X(b,_){const O=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&O.__version!==b.version){Y(O,b,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function Z(b,_){const O=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&O.__version!==b.version){Y(O,b,_);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function V(b,_){const O=n.get(b);if(b.version>0&&O.__version!==b.version){j(O,b,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}const at={[la]:i.REPEAT,[ei]:i.CLAMP_TO_EDGE,[ca]:i.MIRRORED_REPEAT},ut={[rn]:i.NEAREST,[$c]:i.NEAREST_MIPMAP_NEAREST,[yr]:i.NEAREST_MIPMAP_LINEAR,[cn]:i.LINEAR,[ms]:i.LINEAR_MIPMAP_NEAREST,[ni]:i.LINEAR_MIPMAP_LINEAR},yt={[Jc]:i.NEVER,[ru]:i.ALWAYS,[Qc]:i.LESS,[Bl]:i.LEQUAL,[tu]:i.EQUAL,[iu]:i.GEQUAL,[eu]:i.GREATER,[nu]:i.NOTEQUAL};function Gt(b,_){if(_.type===bn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===cn||_.magFilter===ms||_.magFilter===yr||_.magFilter===ni||_.minFilter===cn||_.minFilter===ms||_.minFilter===yr||_.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,at[_.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,at[_.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,at[_.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,ut[_.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,ut[_.minFilter]),_.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,yt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===rn||_.minFilter!==yr&&_.minFilter!==ni||_.type===bn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(b,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ie(b,_){let O=!1;b.__webglInit===void 0&&(b.__webglInit=!0,_.addEventListener("dispose",A));const k=_.source;let K=f.get(k);K===void 0&&(K={},f.set(k,K));const G=q(_);if(G!==b.__cacheKey){K[G]===void 0&&(K[G]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[G].usedTimes++;const St=K[b.__cacheKey];St!==void 0&&(K[b.__cacheKey].usedTimes--,St.usedTimes===0&&E(_)),b.__cacheKey=G,b.__webglTexture=K[G].texture}return O}function ae(b,_,O){return Math.floor(Math.floor(b/O)/_)}function Kt(b,_,O,k){const G=b.updateRanges;if(G.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,k,_.data);else{G.sort((tt,ct)=>tt.start-ct.start);let St=0;for(let tt=1;tt<G.length;tt++){const ct=G[St],Rt=G[tt],Mt=ct.start+ct.count,ot=ae(Rt.start,_.width,4),It=ae(ct.start,_.width,4);Rt.start<=Mt+1&&ot===It&&ae(Rt.start+Rt.count-1,_.width,4)===ot?ct.count=Math.max(ct.count,Rt.start+Rt.count-ct.start):(++St,G[St]=Rt)}G.length=St+1;const nt=i.getParameter(i.UNPACK_ROW_LENGTH),vt=i.getParameter(i.UNPACK_SKIP_PIXELS),xt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let tt=0,ct=G.length;tt<ct;tt++){const Rt=G[tt],Mt=Math.floor(Rt.start/4),ot=Math.ceil(Rt.count/4),It=Mt%_.width,D=Math.floor(Mt/_.width),et=ot,it=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,It),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,It,D,et,it,O,k,_.data)}b.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,nt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,xt)}}function Y(b,_,O){let k=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(k=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(k=i.TEXTURE_3D);const K=ie(b,_),G=_.source;e.bindTexture(k,b.__webglTexture,i.TEXTURE0+O);const St=n.get(G);if(G.version!==St.__version||K===!0){e.activeTexture(i.TEXTURE0+O);const nt=$t.getPrimaries($t.workingColorSpace),vt=_.colorSpace===Nn?null:$t.getPrimaries(_.colorSpace),xt=_.colorSpace===Nn||nt===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let tt=M(_.image,!1,r.maxTextureSize);tt=Se(_,tt);const ct=s.convert(_.format,_.colorSpace),Rt=s.convert(_.type);let Mt=T(_.internalFormat,ct,Rt,_.colorSpace,_.isVideoTexture);Gt(k,_);let ot;const It=_.mipmaps,D=_.isVideoTexture!==!0,et=St.__version===void 0||K===!0,it=G.dataReady,dt=w(_,tt);if(_.isDepthTexture)Mt=S(_.format===or,_.type),et&&(D?e.texStorage2D(i.TEXTURE_2D,1,Mt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,Mt,tt.width,tt.height,0,ct,Rt,null));else if(_.isDataTexture)if(It.length>0){D&&et&&e.texStorage2D(i.TEXTURE_2D,dt,Mt,It[0].width,It[0].height);for(let J=0,$=It.length;J<$;J++)ot=It[J],D?it&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ot.width,ot.height,ct,Rt,ot.data):e.texImage2D(i.TEXTURE_2D,J,Mt,ot.width,ot.height,0,ct,Rt,ot.data);_.generateMipmaps=!1}else D?(et&&e.texStorage2D(i.TEXTURE_2D,dt,Mt,tt.width,tt.height),it&&Kt(_,tt,ct,Rt)):e.texImage2D(i.TEXTURE_2D,0,Mt,tt.width,tt.height,0,ct,Rt,tt.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Mt,It[0].width,It[0].height,tt.depth);for(let J=0,$=It.length;J<$;J++)if(ot=It[J],_.format!==nn)if(ct!==null)if(D){if(it)if(_.layerUpdates.size>0){const mt=Zo(ot.width,ot.height,_.format,_.type);for(const Lt of _.layerUpdates){const re=ot.data.subarray(Lt*mt/ot.data.BYTES_PER_ELEMENT,(Lt+1)*mt/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Lt,ot.width,ot.height,1,ct,re)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ot.width,ot.height,tt.depth,ct,ot.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,Mt,ot.width,ot.height,tt.depth,0,ot.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?it&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ot.width,ot.height,tt.depth,ct,Rt,ot.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,Mt,ot.width,ot.height,tt.depth,0,ct,Rt,ot.data)}else{D&&et&&e.texStorage2D(i.TEXTURE_2D,dt,Mt,It[0].width,It[0].height);for(let J=0,$=It.length;J<$;J++)ot=It[J],_.format!==nn?ct!==null?D?it&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,ot.width,ot.height,ct,ot.data):e.compressedTexImage2D(i.TEXTURE_2D,J,Mt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?it&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ot.width,ot.height,ct,Rt,ot.data):e.texImage2D(i.TEXTURE_2D,J,Mt,ot.width,ot.height,0,ct,Rt,ot.data)}else if(_.isDataArrayTexture)if(D){if(et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Mt,tt.width,tt.height,tt.depth),it)if(_.layerUpdates.size>0){const J=Zo(tt.width,tt.height,_.format,_.type);for(const $ of _.layerUpdates){const mt=tt.data.subarray($*J/tt.data.BYTES_PER_ELEMENT,($+1)*J/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,tt.width,tt.height,1,ct,Rt,mt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ct,Rt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Mt,tt.width,tt.height,tt.depth,0,ct,Rt,tt.data);else if(_.isData3DTexture)D?(et&&e.texStorage3D(i.TEXTURE_3D,dt,Mt,tt.width,tt.height,tt.depth),it&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ct,Rt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,Mt,tt.width,tt.height,tt.depth,0,ct,Rt,tt.data);else if(_.isFramebufferTexture){if(et)if(D)e.texStorage2D(i.TEXTURE_2D,dt,Mt,tt.width,tt.height);else{let J=tt.width,$=tt.height;for(let mt=0;mt<dt;mt++)e.texImage2D(i.TEXTURE_2D,mt,Mt,J,$,0,ct,Rt,null),J>>=1,$>>=1}}else if(It.length>0){if(D&&et){const J=pe(It[0]);e.texStorage2D(i.TEXTURE_2D,dt,Mt,J.width,J.height)}for(let J=0,$=It.length;J<$;J++)ot=It[J],D?it&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ct,Rt,ot):e.texImage2D(i.TEXTURE_2D,J,Mt,ct,Rt,ot);_.generateMipmaps=!1}else if(D){if(et){const J=pe(tt);e.texStorage2D(i.TEXTURE_2D,dt,Mt,J.width,J.height)}it&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct,Rt,tt)}else e.texImage2D(i.TEXTURE_2D,0,Mt,ct,Rt,tt);p(_)&&u(k),St.__version=G.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function j(b,_,O){if(_.image.length!==6)return;const k=ie(b,_),K=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+O);const G=n.get(K);if(K.version!==G.__version||k===!0){e.activeTexture(i.TEXTURE0+O);const St=$t.getPrimaries($t.workingColorSpace),nt=_.colorSpace===Nn?null:$t.getPrimaries(_.colorSpace),vt=_.colorSpace===Nn||St===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const xt=_.isCompressedTexture||_.image[0].isCompressedTexture,tt=_.image[0]&&_.image[0].isDataTexture,ct=[];for(let $=0;$<6;$++)!xt&&!tt?ct[$]=M(_.image[$],!0,r.maxCubemapSize):ct[$]=tt?_.image[$].image:_.image[$],ct[$]=Se(_,ct[$]);const Rt=ct[0],Mt=s.convert(_.format,_.colorSpace),ot=s.convert(_.type),It=T(_.internalFormat,Mt,ot,_.colorSpace),D=_.isVideoTexture!==!0,et=G.__version===void 0||k===!0,it=K.dataReady;let dt=w(_,Rt);Gt(i.TEXTURE_CUBE_MAP,_);let J;if(xt){D&&et&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,It,Rt.width,Rt.height);for(let $=0;$<6;$++){J=ct[$].mipmaps;for(let mt=0;mt<J.length;mt++){const Lt=J[mt];_.format!==nn?Mt!==null?D?it&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,0,0,Lt.width,Lt.height,Mt,Lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,It,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,0,0,Lt.width,Lt.height,Mt,ot,Lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt,It,Lt.width,Lt.height,0,Mt,ot,Lt.data)}}}else{if(J=_.mipmaps,D&&et){J.length>0&&dt++;const $=pe(ct[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,It,$.width,$.height)}for(let $=0;$<6;$++)if(tt){D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ct[$].width,ct[$].height,Mt,ot,ct[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,It,ct[$].width,ct[$].height,0,Mt,ot,ct[$].data);for(let mt=0;mt<J.length;mt++){const re=J[mt].image[$].image;D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,0,0,re.width,re.height,Mt,ot,re.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,It,re.width,re.height,0,Mt,ot,re.data)}}else{D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Mt,ot,ct[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,It,Mt,ot,ct[$]);for(let mt=0;mt<J.length;mt++){const Lt=J[mt];D?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,0,0,Mt,ot,Lt.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,mt+1,It,Mt,ot,Lt.image[$])}}}p(_)&&u(i.TEXTURE_CUBE_MAP),G.__version=K.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function ft(b,_,O,k,K,G){const St=s.convert(O.format,O.colorSpace),nt=s.convert(O.type),vt=T(O.internalFormat,St,nt,O.colorSpace),xt=n.get(_),tt=n.get(O);if(tt.__renderTarget=_,!xt.__hasExternalTextures){const ct=Math.max(1,_.width>>G),Rt=Math.max(1,_.height>>G);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,G,vt,ct,Rt,_.depth,0,St,nt,null):e.texImage2D(K,G,vt,ct,Rt,0,St,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),gt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,k,K,tt.__webglTexture,0,le(_)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,k,K,tt.__webglTexture,G),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(b,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,b),_.depthBuffer){const k=_.depthTexture,K=k&&k.isDepthTexture?k.type:null,G=S(_.stencilBuffer,K),St=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=le(_);gt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,G,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,G,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,G,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,St,i.RENDERBUFFER,b)}else{const k=_.textures;for(let K=0;K<k.length;K++){const G=k[K],St=s.convert(G.format,G.colorSpace),nt=s.convert(G.type),vt=T(G.internalFormat,St,nt,G.colorSpace),xt=le(_);O&&gt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt,vt,_.width,_.height):gt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt,vt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,vt,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Et(b,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const k=n.get(_.depthTexture);k.__renderTarget=_,(!k.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W(_.depthTexture,0);const K=k.__webglTexture,G=le(_);if(_.depthTexture.format===ar)gt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(_.depthTexture.format===or)gt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function qt(b){const _=n.get(b),O=b.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==b.depthTexture){const k=b.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),k){const K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,k.removeEventListener("dispose",K)};k.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=k}if(b.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const k=b.texture.mipmaps;k&&k.length>0?Et(_.__webglFramebuffer[0],b):Et(_.__webglFramebuffer,b)}else if(O){_.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[k]),_.__webglDepthbuffer[k]===void 0)_.__webglDepthbuffer[k]=i.createRenderbuffer(),Dt(_.__webglDepthbuffer[k],b,!1);else{const K=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=_.__webglDepthbuffer[k];i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,G)}}else{const k=b.texture.mipmaps;if(k&&k.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Dt(_.__webglDepthbuffer,b,!1);else{const K=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,G)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Te(b,_,O){const k=n.get(b);_!==void 0&&ft(k.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&qt(b)}function R(b){const _=b.texture,O=n.get(b),k=n.get(_);b.addEventListener("dispose",C);const K=b.textures,G=b.isWebGLCubeRenderTarget===!0,St=K.length>1;if(St||(k.__webglTexture===void 0&&(k.__webglTexture=i.createTexture()),k.__version=_.version,a.memory.textures++),G){O.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[nt]=[];for(let vt=0;vt<_.mipmaps.length;vt++)O.__webglFramebuffer[nt][vt]=i.createFramebuffer()}else O.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let nt=0;nt<_.mipmaps.length;nt++)O.__webglFramebuffer[nt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(St)for(let nt=0,vt=K.length;nt<vt;nt++){const xt=n.get(K[nt]);xt.__webglTexture===void 0&&(xt.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&gt(b)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let nt=0;nt<K.length;nt++){const vt=K[nt];O.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[nt]);const xt=s.convert(vt.format,vt.colorSpace),tt=s.convert(vt.type),ct=T(vt.internalFormat,xt,tt,vt.colorSpace,b.isXRRenderTarget===!0),Rt=le(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,ct,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,O.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Dt(O.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(G){e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture),Gt(i.TEXTURE_CUBE_MAP,_);for(let nt=0;nt<6;nt++)if(_.mipmaps&&_.mipmaps.length>0)for(let vt=0;vt<_.mipmaps.length;vt++)ft(O.__webglFramebuffer[nt][vt],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt);else ft(O.__webglFramebuffer[nt],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);p(_)&&u(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let nt=0,vt=K.length;nt<vt;nt++){const xt=K[nt],tt=n.get(xt);let ct=i.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ct=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,tt.__webglTexture),Gt(ct,xt),ft(O.__webglFramebuffer,b,xt,i.COLOR_ATTACHMENT0+nt,ct,0),p(xt)&&u(ct)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(nt=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,k.__webglTexture),Gt(nt,_),_.mipmaps&&_.mipmaps.length>0)for(let vt=0;vt<_.mipmaps.length;vt++)ft(O.__webglFramebuffer[vt],b,_,i.COLOR_ATTACHMENT0,nt,vt);else ft(O.__webglFramebuffer,b,_,i.COLOR_ATTACHMENT0,nt,0);p(_)&&u(nt),e.unbindTexture()}b.depthBuffer&&qt(b)}function oe(b){const _=b.textures;for(let O=0,k=_.length;O<k;O++){const K=_[O];if(p(K)){const G=y(b),St=n.get(K).__webglTexture;e.bindTexture(G,St),u(G),e.unbindTexture()}}}const Ut=[],Ct=[];function _t(b){if(b.samples>0){if(gt(b)===!1){const _=b.textures,O=b.width,k=b.height;let K=i.COLOR_BUFFER_BIT;const G=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(b),nt=_.length>1;if(nt)for(let xt=0;xt<_.length;xt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer);const vt=b.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let xt=0;xt<_.length;xt++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[xt]);const tt=n.get(_[xt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,tt,0)}i.blitFramebuffer(0,0,O,k,0,0,O,k,K,i.NEAREST),c===!0&&(Ut.length=0,Ct.length=0,Ut.push(i.COLOR_ATTACHMENT0+xt),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Ut.push(G),Ct.push(G),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ct)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let xt=0;xt<_.length;xt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,St.__webglColorRenderbuffer[xt]);const tt=n.get(_[xt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,tt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&c){const _=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function le(b){return Math.min(r.maxSamples,b.samples)}function gt(b){const _=n.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ft(b){const _=a.render.frame;h.get(b)!==_&&(h.set(b,_),b.update())}function Se(b,_){const O=b.colorSpace,k=b.format,K=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||O!==Li&&O!==Nn&&($t.getTransfer(O)===Jt?(k!==nn||K!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function pe(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(l.width=b.naturalWidth||b.width,l.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(l.width=b.displayWidth,l.height=b.displayHeight):(l.width=b.width,l.height=b.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=X,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=Te,this.setupRenderTarget=R,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=gt}function Fm(i,t){function e(n,r=Nn){let s;const a=$t.getTransfer(r);if(n===pn)return i.UNSIGNED_BYTE;if(n===Wa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Dl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ll)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Cl)return i.BYTE;if(n===Pl)return i.SHORT;if(n===rr)return i.UNSIGNED_SHORT;if(n===ka)return i.INT;if(n===ri)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===pr)return i.HALF_FLOAT;if(n===Ul)return i.ALPHA;if(n===Il)return i.RGB;if(n===nn)return i.RGBA;if(n===ar)return i.DEPTH_COMPONENT;if(n===or)return i.DEPTH_STENCIL;if(n===Nl)return i.RED;if(n===qa)return i.RED_INTEGER;if(n===Fl)return i.RG;if(n===Ya)return i.RG_INTEGER;if(n===$a)return i.RGBA_INTEGER;if(n===Yr||n===$r||n===Kr||n===Zr)if(a===Jt)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Yr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$r)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Kr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Yr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$r)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Kr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Zr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ua||n===ha||n===da||n===fa)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ua)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ha)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===da)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===fa)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===pa||n===ma||n===_a)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===pa||n===ma)return a===Jt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===_a)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ga||n===va||n===xa||n===Ma||n===Sa||n===Ea||n===ya||n===Ta||n===ba||n===Aa||n===wa||n===Ra||n===Ca||n===Pa)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===ga)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===va)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===xa)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ma)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Sa)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ea)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ya)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ta)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ba)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Aa)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wa)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ra)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ca)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pa)return a===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Da||n===La||n===Ua)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Da)return a===Jt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===La)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ua)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ia||n===Na||n===Fa||n===Oa)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ia)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Na)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Oa)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===sr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Om=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bm=`
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

}`;class zm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Kl(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new zn({vertexShader:Om,fragmentShader:Bm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new hn(new gr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hm extends Ni{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,f=null,m=null,g=null;const M=typeof XRWebGLBinding<"u",p=new zm,u={},y=e.getContextAttributes();let T=null,S=null;const w=[],A=[],C=new Vt;let L=null;const E=new ke;E.viewport=new te;const x=new ke;x.viewport=new te;const P=[E,x],F=new sh;let H=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let j=w[Y];return j===void 0&&(j=new Fs,w[Y]=j),j.getTargetRaySpace()},this.getControllerGrip=function(Y){let j=w[Y];return j===void 0&&(j=new Fs,w[Y]=j),j.getGripSpace()},this.getHand=function(Y){let j=w[Y];return j===void 0&&(j=new Fs,w[Y]=j),j.getHandSpace()};function W(Y){const j=A.indexOf(Y.inputSource);if(j===-1)return;const ft=w[j];ft!==void 0&&(ft.update(Y.inputSource,Y.frame,l||a),ft.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",Z);for(let Y=0;Y<w.length;Y++){const j=A[Y];j!==null&&(A[Y]=null,w[Y].disconnect(j))}H=null,q=null,p.reset();for(const Y in u)delete u[Y];t.setRenderTarget(T),m=null,f=null,d=null,r=null,S=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(L),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d===null&&M&&(d=new XRWebGLBinding(r,e)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(T=t.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",X),r.addEventListener("inputsourceschange",Z),y.xrCompatible!==!0&&await e.makeXRCompatible(),L=t.getPixelRatio(),t.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let ft=null,Dt=null,Et=null;y.depth&&(Et=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ft=y.stencil?or:ar,Dt=y.stencil?sr:ri);const qt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(qt),r.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),S=new si(f.textureWidth,f.textureHeight,{format:nn,type:pn,depthTexture:new $l(f.textureWidth,f.textureHeight,Dt,void 0,void 0,void 0,void 0,void 0,void 0,ft),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const ft={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,ft),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new si(m.framebufferWidth,m.framebufferHeight,{format:nn,type:pn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Kt.setContext(r),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Z(Y){for(let j=0;j<Y.removed.length;j++){const ft=Y.removed[j],Dt=A.indexOf(ft);Dt>=0&&(A[Dt]=null,w[Dt].disconnect(ft))}for(let j=0;j<Y.added.length;j++){const ft=Y.added[j];let Dt=A.indexOf(ft);if(Dt===-1){for(let qt=0;qt<w.length;qt++)if(qt>=A.length){A.push(ft),Dt=qt;break}else if(A[qt]===null){A[qt]=ft,Dt=qt;break}if(Dt===-1)break}const Et=w[Dt];Et&&Et.connect(ft)}}const V=new U,at=new U;function ut(Y,j,ft){V.setFromMatrixPosition(j.matrixWorld),at.setFromMatrixPosition(ft.matrixWorld);const Dt=V.distanceTo(at),Et=j.projectionMatrix.elements,qt=ft.projectionMatrix.elements,Te=Et[14]/(Et[10]-1),R=Et[14]/(Et[10]+1),oe=(Et[9]+1)/Et[5],Ut=(Et[9]-1)/Et[5],Ct=(Et[8]-1)/Et[0],_t=(qt[8]+1)/qt[0],le=Te*Ct,gt=Te*_t,Ft=Dt/(-Ct+_t),Se=Ft*-Ct;if(j.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Se),Y.translateZ(Ft),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Et[10]===-1)Y.projectionMatrix.copy(j.projectionMatrix),Y.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const pe=Te+Ft,b=R+Ft,_=le-Se,O=gt+(Dt-Se),k=oe*R/b*pe,K=Ut*R/b*pe;Y.projectionMatrix.makePerspective(_,O,k,K,pe,b),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function yt(Y,j){j===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(j.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let j=Y.near,ft=Y.far;p.texture!==null&&(p.depthNear>0&&(j=p.depthNear),p.depthFar>0&&(ft=p.depthFar)),F.near=x.near=E.near=j,F.far=x.far=E.far=ft,(H!==F.near||q!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),H=F.near,q=F.far),F.layers.mask=Y.layers.mask|6,E.layers.mask=F.layers.mask&3,x.layers.mask=F.layers.mask&5;const Dt=Y.parent,Et=F.cameras;yt(F,Dt);for(let qt=0;qt<Et.length;qt++)yt(Et[qt],Dt);Et.length===2?ut(F,E,x):F.projectionMatrix.copy(E.projectionMatrix),Gt(Y,F,Dt)};function Gt(Y,j,ft){ft===null?Y.matrix.copy(j.matrixWorld):(Y.matrix.copy(ft.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(j.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(j.projectionMatrix),Y.projectionMatrixInverse.copy(j.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=lr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(Y){c=Y,f!==null&&(f.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(F)},this.getCameraTexture=function(Y){return u[Y]};let ie=null;function ae(Y,j){if(h=j.getViewerPose(l||a),g=j,h!==null){const ft=h.views;m!==null&&(t.setRenderTargetFramebuffer(S,m.framebuffer),t.setRenderTarget(S));let Dt=!1;ft.length!==F.cameras.length&&(F.cameras.length=0,Dt=!0);for(let R=0;R<ft.length;R++){const oe=ft[R];let Ut=null;if(m!==null)Ut=m.getViewport(oe);else{const _t=d.getViewSubImage(f,oe);Ut=_t.viewport,R===0&&(t.setRenderTargetTextures(S,_t.colorTexture,_t.depthStencilTexture),t.setRenderTarget(S))}let Ct=P[R];Ct===void 0&&(Ct=new ke,Ct.layers.enable(R),Ct.viewport=new te,P[R]=Ct),Ct.matrix.fromArray(oe.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(oe.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),R===0&&(F.matrix.copy(Ct.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Dt===!0&&F.cameras.push(Ct)}const Et=r.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){d=n.getBinding();const R=d.getDepthInformation(ft[0]);R&&R.isValid&&R.texture&&p.init(R,r.renderState)}if(Et&&Et.includes("camera-access")&&M){t.state.unbindTexture(),d=n.getBinding();for(let R=0;R<ft.length;R++){const oe=ft[R].camera;if(oe){let Ut=u[oe];Ut||(Ut=new Kl,u[oe]=Ut);const Ct=d.getCameraImage(oe);Ut.sourceTexture=Ct}}}}for(let ft=0;ft<w.length;ft++){const Dt=A[ft],Et=w[ft];Dt!==null&&Et!==void 0&&Et.update(Dt,j,l||a)}ie&&ie(Y,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}const Kt=new Jl;Kt.setAnimationLoop(ae),this.setAnimationLoop=function(Y){ie=Y},this.dispose=function(){}}}const Zn=new mn,Vm=new ue;function Gm(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Wl(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function r(p,u,y,T,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(p,u):u.isMeshToonMaterial?(s(p,u),d(p,u)):u.isMeshPhongMaterial?(s(p,u),h(p,u)):u.isMeshStandardMaterial?(s(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,S)):u.isMeshMatcapMaterial?(s(p,u),g(p,u)):u.isMeshDepthMaterial?s(p,u):u.isMeshDistanceMaterial?(s(p,u),M(p,u)):u.isMeshNormalMaterial?s(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?c(p,u,y,T):u.isSpriteMaterial?l(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Ne&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Ne&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const y=t.get(u),T=y.envMap,S=y.envMapRotation;T&&(p.envMap.value=T,Zn.copy(S),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),p.envMapRotation.value.setFromMatrix4(Vm.makeRotationFromEuler(Zn)),p.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function c(p,u,y,T){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*y,p.scale.value=T*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function l(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,y){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ne&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,u){u.matcap&&(p.matcap.value=u.matcap)}function M(p,u){const y=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function km(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,T){const S=T.program;n.uniformBlockBinding(y,S)}function l(y,T){let S=r[y.id];S===void 0&&(g(y),S=h(y),r[y.id]=S,y.addEventListener("dispose",p));const w=T.program;n.updateUBOMapping(y,w);const A=t.render.frame;s[y.id]!==A&&(f(y),s[y.id]=A)}function h(y){const T=d();y.__bindingPointIndex=T;const S=i.createBuffer(),w=y.__size,A=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,w,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,S),S}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const T=r[y.id],S=y.uniforms,w=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let A=0,C=S.length;A<C;A++){const L=Array.isArray(S[A])?S[A]:[S[A]];for(let E=0,x=L.length;E<x;E++){const P=L[E];if(m(P,A,E,w)===!0){const F=P.__offset,H=Array.isArray(P.value)?P.value:[P.value];let q=0;for(let W=0;W<H.length;W++){const X=H[W],Z=M(X);typeof X=="number"||typeof X=="boolean"?(P.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,F+q,P.__data)):X.isMatrix3?(P.__data[0]=X.elements[0],P.__data[1]=X.elements[1],P.__data[2]=X.elements[2],P.__data[3]=0,P.__data[4]=X.elements[3],P.__data[5]=X.elements[4],P.__data[6]=X.elements[5],P.__data[7]=0,P.__data[8]=X.elements[6],P.__data[9]=X.elements[7],P.__data[10]=X.elements[8],P.__data[11]=0):(X.toArray(P.__data,q),q+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,T,S,w){const A=y.value,C=T+"_"+S;if(w[C]===void 0)return typeof A=="number"||typeof A=="boolean"?w[C]=A:w[C]=A.clone(),!0;{const L=w[C];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return w[C]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function g(y){const T=y.uniforms;let S=0;const w=16;for(let C=0,L=T.length;C<L;C++){const E=Array.isArray(T[C])?T[C]:[T[C]];for(let x=0,P=E.length;x<P;x++){const F=E[x],H=Array.isArray(F.value)?F.value:[F.value];for(let q=0,W=H.length;q<W;q++){const X=H[q],Z=M(X),V=S%w,at=V%Z.boundary,ut=V+at;S+=at,ut!==0&&w-ut<Z.storage&&(S+=w-ut),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=S,S+=Z.storage}}}const A=S%w;return A>0&&(S+=w-A),y.__size=S,y.__cache={},this}function M(y){const T={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(T.boundary=4,T.storage=4):y.isVector2?(T.boundary=8,T.storage=8):y.isVector3||y.isColor?(T.boundary=16,T.storage=12):y.isVector4?(T.boundary=16,T.storage=16):y.isMatrix3?(T.boundary=48,T.storage=48):y.isMatrix4?(T.boundary=64,T.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),T}function p(y){const T=y.target;T.removeEventListener("dispose",p);const S=a.indexOf(T.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function u(){for(const y in r)i.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:c,update:l,dispose:u}}class Wm{constructor(t={}){const{canvas:e=Su(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),M=new Int32Array(4);let p=null,u=null;const y=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=On,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let w=!1;this._outputColorSpace=Ge;let A=0,C=0,L=null,E=-1,x=null;const P=new te,F=new te;let H=null;const q=new Xt(0);let W=0,X=e.width,Z=e.height,V=1,at=null,ut=null;const yt=new te(0,0,X,Z),Gt=new te(0,0,X,Z);let ie=!1;const ae=new eo;let Kt=!1,Y=!1;const j=new ue,ft=new U,Dt=new te,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function Te(){return L===null?V:1}let R=n;function oe(v,I){return e.getContext(v,I)}try{const v={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ga}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",dt,!1),e.addEventListener("webglcontextcreationerror",J,!1),R===null){const I="webgl2";if(R=oe(I,v),R===null)throw oe(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw console.error("THREE.WebGLRenderer: "+v.message),v}let Ut,Ct,_t,le,gt,Ft,Se,pe,b,_,O,k,K,G,St,nt,vt,xt,tt,ct,Rt,Mt,ot,It;function D(){Ut=new tp(R),Ut.init(),Mt=new Fm(R,Ut),Ct=new Yf(R,Ut,t,Mt),_t=new Im(R,Ut),Ct.reversedDepthBuffer&&f&&_t.buffers.depth.setReversed(!0),le=new ip(R),gt=new Sm,Ft=new Nm(R,Ut,_t,gt,Ct,Mt,le),Se=new Kf(S),pe=new Qf(S),b=new lh(R),ot=new Xf(R,b),_=new ep(R,b,le,ot),O=new sp(R,_,b,le),tt=new rp(R,Ct,Ft),nt=new $f(gt),k=new Mm(S,Se,pe,Ut,Ct,ot,nt),K=new Gm(S,gt),G=new ym,St=new Cm(Ut),xt=new Wf(S,Se,pe,_t,O,m,c),vt=new Lm(S,O,Ct),It=new km(R,le,Ct,_t),ct=new qf(R,Ut,le),Rt=new np(R,Ut,le),le.programs=k.programs,S.capabilities=Ct,S.extensions=Ut,S.properties=gt,S.renderLists=G,S.shadowMap=vt,S.state=_t,S.info=le}D();const et=new Hm(S,R);this.xr=et,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const v=Ut.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ut.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(v){v!==void 0&&(V=v,this.setSize(X,Z,!1))},this.getSize=function(v){return v.set(X,Z)},this.setSize=function(v,I,B=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=v,Z=I,e.width=Math.floor(v*V),e.height=Math.floor(I*V),B===!0&&(e.style.width=v+"px",e.style.height=I+"px"),this.setViewport(0,0,v,I)},this.getDrawingBufferSize=function(v){return v.set(X*V,Z*V).floor()},this.setDrawingBufferSize=function(v,I,B){X=v,Z=I,V=B,e.width=Math.floor(v*B),e.height=Math.floor(I*B),this.setViewport(0,0,v,I)},this.getCurrentViewport=function(v){return v.copy(P)},this.getViewport=function(v){return v.copy(yt)},this.setViewport=function(v,I,B,z){v.isVector4?yt.set(v.x,v.y,v.z,v.w):yt.set(v,I,B,z),_t.viewport(P.copy(yt).multiplyScalar(V).round())},this.getScissor=function(v){return v.copy(Gt)},this.setScissor=function(v,I,B,z){v.isVector4?Gt.set(v.x,v.y,v.z,v.w):Gt.set(v,I,B,z),_t.scissor(F.copy(Gt).multiplyScalar(V).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(v){_t.setScissorTest(ie=v)},this.setOpaqueSort=function(v){at=v},this.setTransparentSort=function(v){ut=v},this.getClearColor=function(v){return v.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(v=!0,I=!0,B=!0){let z=0;if(v){let N=!1;if(L!==null){const Q=L.texture.format;N=Q===$a||Q===Ya||Q===qa}if(N){const Q=L.texture.type,lt=Q===pn||Q===ri||Q===rr||Q===sr||Q===Wa||Q===Xa,pt=xt.getClearColor(),ht=xt.getClearAlpha(),wt=pt.r,Pt=pt.g,Tt=pt.b;lt?(g[0]=wt,g[1]=Pt,g[2]=Tt,g[3]=ht,R.clearBufferuiv(R.COLOR,0,g)):(M[0]=wt,M[1]=Pt,M[2]=Tt,M[3]=ht,R.clearBufferiv(R.COLOR,0,M))}else z|=R.COLOR_BUFFER_BIT}I&&(z|=R.DEPTH_BUFFER_BIT),B&&(z|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",dt,!1),e.removeEventListener("webglcontextcreationerror",J,!1),xt.dispose(),G.dispose(),St.dispose(),gt.dispose(),Se.dispose(),pe.dispose(),O.dispose(),ot.dispose(),It.dispose(),k.dispose(),et.dispose(),et.removeEventListener("sessionstart",on),et.removeEventListener("sessionend",ho),kn.stop()};function it(v){v.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function dt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const v=le.autoReset,I=vt.enabled,B=vt.autoUpdate,z=vt.needsUpdate,N=vt.type;D(),le.autoReset=v,vt.enabled=I,vt.autoUpdate=B,vt.needsUpdate=z,vt.type=N}function J(v){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function $(v){const I=v.target;I.removeEventListener("dispose",$),mt(I)}function mt(v){Lt(v),gt.remove(v)}function Lt(v){const I=gt.get(v).programs;I!==void 0&&(I.forEach(function(B){k.releaseProgram(B)}),v.isShaderMaterial&&k.releaseShaderCache(v))}this.renderBufferDirect=function(v,I,B,z,N,Q){I===null&&(I=Et);const lt=N.isMesh&&N.matrixWorld.determinant()<0,pt=pc(v,I,B,z,N);_t.setMaterial(z,lt);let ht=B.index,wt=1;if(z.wireframe===!0){if(ht=_.getWireframeAttribute(B),ht===void 0)return;wt=2}const Pt=B.drawRange,Tt=B.attributes.position;let kt=Pt.start*wt,jt=(Pt.start+Pt.count)*wt;Q!==null&&(kt=Math.max(kt,Q.start*wt),jt=Math.min(jt,(Q.start+Q.count)*wt)),ht!==null?(kt=Math.max(kt,0),jt=Math.min(jt,ht.count)):Tt!=null&&(kt=Math.max(kt,0),jt=Math.min(jt,Tt.count));const fe=jt-kt;if(fe<0||fe===1/0)return;ot.setup(N,z,pt,B,ht);let se,ee=ct;if(ht!==null&&(se=b.get(ht),ee=Rt,ee.setIndex(se)),N.isMesh)z.wireframe===!0?(_t.setLineWidth(z.wireframeLinewidth*Te()),ee.setMode(R.LINES)):ee.setMode(R.TRIANGLES);else if(N.isLine){let At=z.linewidth;At===void 0&&(At=1),_t.setLineWidth(At*Te()),N.isLineSegments?ee.setMode(R.LINES):N.isLineLoop?ee.setMode(R.LINE_LOOP):ee.setMode(R.LINE_STRIP)}else N.isPoints?ee.setMode(R.POINTS):N.isSprite&&ee.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)cr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ee.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ut.get("WEBGL_multi_draw"))ee.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const At=N._multiDrawStarts,he=N._multiDrawCounts,Yt=N._multiDrawCount,Be=ht?b.get(ht).bytesPerElement:1,ci=gt.get(z).currentProgram.getUniforms();for(let ze=0;ze<Yt;ze++)ci.setValue(R,"_gl_DrawID",ze),ee.render(At[ze]/Be,he[ze])}else if(N.isInstancedMesh)ee.renderInstances(kt,fe,N.count);else if(B.isInstancedBufferGeometry){const At=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,he=Math.min(B.instanceCount,At);ee.renderInstances(kt,fe,he)}else ee.render(kt,fe)};function re(v,I,B){v.transparent===!0&&v.side===tn&&v.forceSinglePass===!1?(v.side=Ne,v.needsUpdate=!0,Er(v,I,B),v.side=Bn,v.needsUpdate=!0,Er(v,I,B),v.side=tn):Er(v,I,B)}this.compile=function(v,I,B=null){B===null&&(B=v),u=St.get(B),u.init(I),T.push(u),B.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(u.pushLight(N),N.castShadow&&u.pushShadow(N))}),v!==B&&v.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(u.pushLight(N),N.castShadow&&u.pushShadow(N))}),u.setupLights();const z=new Set;return v.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const Q=N.material;if(Q)if(Array.isArray(Q))for(let lt=0;lt<Q.length;lt++){const pt=Q[lt];re(pt,B,N),z.add(pt)}else re(Q,B,N),z.add(Q)}),u=T.pop(),z},this.compileAsync=function(v,I,B=null){const z=this.compile(v,I,B);return new Promise(N=>{function Q(){if(z.forEach(function(lt){gt.get(lt).currentProgram.isReady()&&z.delete(lt)}),z.size===0){N(v);return}setTimeout(Q,10)}Ut.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Zt=null;function gn(v){Zt&&Zt(v)}function on(){kn.stop()}function ho(){kn.start()}const kn=new Jl;kn.setAnimationLoop(gn),typeof self<"u"&&kn.setContext(self),this.setAnimationLoop=function(v){Zt=v,et.setAnimationLoop(v),v===null?kn.stop():kn.start()},et.addEventListener("sessionstart",on),et.addEventListener("sessionend",ho),this.render=function(v,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(I),I=et.getCamera()),v.isScene===!0&&v.onBeforeRender(S,v,I,L),u=St.get(v,T.length),u.init(I),T.push(u),j.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),ae.setFromProjectionMatrix(j,un,I.reversedDepth),Y=this.localClippingEnabled,Kt=nt.init(this.clippingPlanes,Y),p=G.get(v,y.length),p.init(),y.push(p),et.enabled===!0&&et.isPresenting===!0){const Q=S.xr.getDepthSensingMesh();Q!==null&&fs(Q,I,-1/0,S.sortObjects)}fs(v,I,0,S.sortObjects),p.finish(),S.sortObjects===!0&&p.sort(at,ut),qt=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,qt&&xt.addToRenderList(p,v),this.info.render.frame++,Kt===!0&&nt.beginShadows();const B=u.state.shadowsArray;vt.render(B,v,I),Kt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=p.opaque,N=p.transmissive;if(u.setupLights(),I.isArrayCamera){const Q=I.cameras;if(N.length>0)for(let lt=0,pt=Q.length;lt<pt;lt++){const ht=Q[lt];po(z,N,v,ht)}qt&&xt.render(v);for(let lt=0,pt=Q.length;lt<pt;lt++){const ht=Q[lt];fo(p,v,ht,ht.viewport)}}else N.length>0&&po(z,N,v,I),qt&&xt.render(v),fo(p,v,I);L!==null&&C===0&&(Ft.updateMultisampleRenderTarget(L),Ft.updateRenderTargetMipmap(L)),v.isScene===!0&&v.onAfterRender(S,v,I),ot.resetDefaultState(),E=-1,x=null,T.pop(),T.length>0?(u=T[T.length-1],Kt===!0&&nt.setGlobalState(S.clippingPlanes,u.state.camera)):u=null,y.pop(),y.length>0?p=y[y.length-1]:p=null};function fs(v,I,B,z){if(v.visible===!1)return;if(v.layers.test(I.layers)){if(v.isGroup)B=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(I);else if(v.isLight)u.pushLight(v),v.castShadow&&u.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||ae.intersectsSprite(v)){z&&Dt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(j);const lt=O.update(v),pt=v.material;pt.visible&&p.push(v,lt,pt,B,Dt.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||ae.intersectsObject(v))){const lt=O.update(v),pt=v.material;if(z&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Dt.copy(v.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Dt.copy(lt.boundingSphere.center)),Dt.applyMatrix4(v.matrixWorld).applyMatrix4(j)),Array.isArray(pt)){const ht=lt.groups;for(let wt=0,Pt=ht.length;wt<Pt;wt++){const Tt=ht[wt],kt=pt[Tt.materialIndex];kt&&kt.visible&&p.push(v,lt,kt,B,Dt.z,Tt)}}else pt.visible&&p.push(v,lt,pt,B,Dt.z,null)}}const Q=v.children;for(let lt=0,pt=Q.length;lt<pt;lt++)fs(Q[lt],I,B,z)}function fo(v,I,B,z){const N=v.opaque,Q=v.transmissive,lt=v.transparent;u.setupLightsView(B),Kt===!0&&nt.setGlobalState(S.clippingPlanes,B),z&&_t.viewport(P.copy(z)),N.length>0&&Sr(N,I,B),Q.length>0&&Sr(Q,I,B),lt.length>0&&Sr(lt,I,B),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function po(v,I,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[z.id]===void 0&&(u.state.transmissionRenderTarget[z.id]=new si(1,1,{generateMipmaps:!0,type:Ut.has("EXT_color_buffer_half_float")||Ut.has("EXT_color_buffer_float")?pr:pn,minFilter:ni,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const Q=u.state.transmissionRenderTarget[z.id],lt=z.viewport||P;Q.setSize(lt.z*S.transmissionResolutionScale,lt.w*S.transmissionResolutionScale);const pt=S.getRenderTarget(),ht=S.getActiveCubeFace(),wt=S.getActiveMipmapLevel();S.setRenderTarget(Q),S.getClearColor(q),W=S.getClearAlpha(),W<1&&S.setClearColor(16777215,.5),S.clear(),qt&&xt.render(B);const Pt=S.toneMapping;S.toneMapping=On;const Tt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),u.setupLightsView(z),Kt===!0&&nt.setGlobalState(S.clippingPlanes,z),Sr(v,B,z),Ft.updateMultisampleRenderTarget(Q),Ft.updateRenderTargetMipmap(Q),Ut.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let jt=0,fe=I.length;jt<fe;jt++){const se=I[jt],ee=se.object,At=se.geometry,he=se.material,Yt=se.group;if(he.side===tn&&ee.layers.test(z.layers)){const Be=he.side;he.side=Ne,he.needsUpdate=!0,mo(ee,B,z,At,he,Yt),he.side=Be,he.needsUpdate=!0,kt=!0}}kt===!0&&(Ft.updateMultisampleRenderTarget(Q),Ft.updateRenderTargetMipmap(Q))}S.setRenderTarget(pt,ht,wt),S.setClearColor(q,W),Tt!==void 0&&(z.viewport=Tt),S.toneMapping=Pt}function Sr(v,I,B){const z=I.isScene===!0?I.overrideMaterial:null;for(let N=0,Q=v.length;N<Q;N++){const lt=v[N],pt=lt.object,ht=lt.geometry,wt=lt.group;let Pt=lt.material;Pt.allowOverride===!0&&z!==null&&(Pt=z),pt.layers.test(B.layers)&&mo(pt,I,B,ht,Pt,wt)}}function mo(v,I,B,z,N,Q){v.onBeforeRender(S,I,B,z,N,Q),v.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),N.onBeforeRender(S,I,B,z,v,Q),N.transparent===!0&&N.side===tn&&N.forceSinglePass===!1?(N.side=Ne,N.needsUpdate=!0,S.renderBufferDirect(B,I,z,N,v,Q),N.side=Bn,N.needsUpdate=!0,S.renderBufferDirect(B,I,z,N,v,Q),N.side=tn):S.renderBufferDirect(B,I,z,N,v,Q),v.onAfterRender(S,I,B,z,N,Q)}function Er(v,I,B){I.isScene!==!0&&(I=Et);const z=gt.get(v),N=u.state.lights,Q=u.state.shadowsArray,lt=N.state.version,pt=k.getParameters(v,N.state,Q,I,B),ht=k.getProgramCacheKey(pt);let wt=z.programs;z.environment=v.isMeshStandardMaterial?I.environment:null,z.fog=I.fog,z.envMap=(v.isMeshStandardMaterial?pe:Se).get(v.envMap||z.environment),z.envMapRotation=z.environment!==null&&v.envMap===null?I.environmentRotation:v.envMapRotation,wt===void 0&&(v.addEventListener("dispose",$),wt=new Map,z.programs=wt);let Pt=wt.get(ht);if(Pt!==void 0){if(z.currentProgram===Pt&&z.lightsStateVersion===lt)return go(v,pt),Pt}else pt.uniforms=k.getUniforms(v),v.onBeforeCompile(pt,S),Pt=k.acquireProgram(pt,ht),wt.set(ht,Pt),z.uniforms=pt.uniforms;const Tt=z.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Tt.clippingPlanes=nt.uniform),go(v,pt),z.needsLights=_c(v),z.lightsStateVersion=lt,z.needsLights&&(Tt.ambientLightColor.value=N.state.ambient,Tt.lightProbe.value=N.state.probe,Tt.directionalLights.value=N.state.directional,Tt.directionalLightShadows.value=N.state.directionalShadow,Tt.spotLights.value=N.state.spot,Tt.spotLightShadows.value=N.state.spotShadow,Tt.rectAreaLights.value=N.state.rectArea,Tt.ltc_1.value=N.state.rectAreaLTC1,Tt.ltc_2.value=N.state.rectAreaLTC2,Tt.pointLights.value=N.state.point,Tt.pointLightShadows.value=N.state.pointShadow,Tt.hemisphereLights.value=N.state.hemi,Tt.directionalShadowMap.value=N.state.directionalShadowMap,Tt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Tt.spotShadowMap.value=N.state.spotShadowMap,Tt.spotLightMatrix.value=N.state.spotLightMatrix,Tt.spotLightMap.value=N.state.spotLightMap,Tt.pointShadowMap.value=N.state.pointShadowMap,Tt.pointShadowMatrix.value=N.state.pointShadowMatrix),z.currentProgram=Pt,z.uniformsList=null,Pt}function _o(v){if(v.uniformsList===null){const I=v.currentProgram.getUniforms();v.uniformsList=jr.seqWithValue(I.seq,v.uniforms)}return v.uniformsList}function go(v,I){const B=gt.get(v);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function pc(v,I,B,z,N){I.isScene!==!0&&(I=Et),Ft.resetTextureUnits();const Q=I.fog,lt=z.isMeshStandardMaterial?I.environment:null,pt=L===null?S.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Li,ht=(z.isMeshStandardMaterial?pe:Se).get(z.envMap||lt),wt=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Pt=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Tt=!!B.morphAttributes.position,kt=!!B.morphAttributes.normal,jt=!!B.morphAttributes.color;let fe=On;z.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(fe=S.toneMapping);const se=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ee=se!==void 0?se.length:0,At=gt.get(z),he=u.state.lights;if(Kt===!0&&(Y===!0||v!==x)){const Ce=v===x&&z.id===E;nt.setState(z,v,Ce)}let Yt=!1;z.version===At.__version?(At.needsLights&&At.lightsStateVersion!==he.state.version||At.outputColorSpace!==pt||N.isBatchedMesh&&At.batching===!1||!N.isBatchedMesh&&At.batching===!0||N.isBatchedMesh&&At.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&At.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&At.instancing===!1||!N.isInstancedMesh&&At.instancing===!0||N.isSkinnedMesh&&At.skinning===!1||!N.isSkinnedMesh&&At.skinning===!0||N.isInstancedMesh&&At.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&At.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&At.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&At.instancingMorph===!1&&N.morphTexture!==null||At.envMap!==ht||z.fog===!0&&At.fog!==Q||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==nt.numPlanes||At.numIntersection!==nt.numIntersection)||At.vertexAlphas!==wt||At.vertexTangents!==Pt||At.morphTargets!==Tt||At.morphNormals!==kt||At.morphColors!==jt||At.toneMapping!==fe||At.morphTargetsCount!==ee)&&(Yt=!0):(Yt=!0,At.__version=z.version);let Be=At.currentProgram;Yt===!0&&(Be=Er(z,I,N));let ci=!1,ze=!1,Vi=!1;const de=Be.getUniforms(),qe=At.uniforms;if(_t.useProgram(Be.program)&&(ci=!0,ze=!0,Vi=!0),z.id!==E&&(E=z.id,ze=!0),ci||x!==v){_t.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),de.setValue(R,"projectionMatrix",v.projectionMatrix),de.setValue(R,"viewMatrix",v.matrixWorldInverse);const Ue=de.map.cameraPosition;Ue!==void 0&&Ue.setValue(R,ft.setFromMatrixPosition(v.matrixWorld)),Ct.logarithmicDepthBuffer&&de.setValue(R,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&de.setValue(R,"isOrthographic",v.isOrthographicCamera===!0),x!==v&&(x=v,ze=!0,Vi=!0)}if(N.isSkinnedMesh){de.setOptional(R,N,"bindMatrix"),de.setOptional(R,N,"bindMatrixInverse");const Ce=N.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),de.setValue(R,"boneTexture",Ce.boneTexture,Ft))}N.isBatchedMesh&&(de.setOptional(R,N,"batchingTexture"),de.setValue(R,"batchingTexture",N._matricesTexture,Ft),de.setOptional(R,N,"batchingIdTexture"),de.setValue(R,"batchingIdTexture",N._indirectTexture,Ft),de.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&de.setValue(R,"batchingColorTexture",N._colorsTexture,Ft));const Ye=B.morphAttributes;if((Ye.position!==void 0||Ye.normal!==void 0||Ye.color!==void 0)&&tt.update(N,B,Be),(ze||At.receiveShadow!==N.receiveShadow)&&(At.receiveShadow=N.receiveShadow,de.setValue(R,"receiveShadow",N.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(qe.envMap.value=ht,qe.flipEnvMap.value=ht.isCubeTexture&&ht.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&I.environment!==null&&(qe.envMapIntensity.value=I.environmentIntensity),ze&&(de.setValue(R,"toneMappingExposure",S.toneMappingExposure),At.needsLights&&mc(qe,Vi),Q&&z.fog===!0&&K.refreshFogUniforms(qe,Q),K.refreshMaterialUniforms(qe,z,V,Z,u.state.transmissionRenderTarget[v.id]),jr.upload(R,_o(At),qe,Ft)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(jr.upload(R,_o(At),qe,Ft),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&de.setValue(R,"center",N.center),de.setValue(R,"modelViewMatrix",N.modelViewMatrix),de.setValue(R,"normalMatrix",N.normalMatrix),de.setValue(R,"modelMatrix",N.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Ce=z.uniformsGroups;for(let Ue=0,ps=Ce.length;Ue<ps;Ue++){const Wn=Ce[Ue];It.update(Wn,Be),It.bind(Wn,Be)}}return Be}function mc(v,I){v.ambientLightColor.needsUpdate=I,v.lightProbe.needsUpdate=I,v.directionalLights.needsUpdate=I,v.directionalLightShadows.needsUpdate=I,v.pointLights.needsUpdate=I,v.pointLightShadows.needsUpdate=I,v.spotLights.needsUpdate=I,v.spotLightShadows.needsUpdate=I,v.rectAreaLights.needsUpdate=I,v.hemisphereLights.needsUpdate=I}function _c(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(v,I,B){const z=gt.get(v);z.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),gt.get(v.texture).__webglTexture=I,gt.get(v.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,I){const B=gt.get(v);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0};const gc=R.createFramebuffer();this.setRenderTarget=function(v,I=0,B=0){L=v,A=I,C=B;let z=!0,N=null,Q=!1,lt=!1;if(v){const ht=gt.get(v);if(ht.__useDefaultFramebuffer!==void 0)_t.bindFramebuffer(R.FRAMEBUFFER,null),z=!1;else if(ht.__webglFramebuffer===void 0)Ft.setupRenderTarget(v);else if(ht.__hasExternalTextures)Ft.rebindTextures(v,gt.get(v.texture).__webglTexture,gt.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Tt=v.depthTexture;if(ht.__boundDepthTexture!==Tt){if(Tt!==null&&gt.has(Tt)&&(v.width!==Tt.image.width||v.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ft.setupDepthRenderbuffer(v)}}const wt=v.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(lt=!0);const Pt=gt.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Pt[I])?N=Pt[I][B]:N=Pt[I],Q=!0):v.samples>0&&Ft.useMultisampledRTT(v)===!1?N=gt.get(v).__webglMultisampledFramebuffer:Array.isArray(Pt)?N=Pt[B]:N=Pt,P.copy(v.viewport),F.copy(v.scissor),H=v.scissorTest}else P.copy(yt).multiplyScalar(V).floor(),F.copy(Gt).multiplyScalar(V).floor(),H=ie;if(B!==0&&(N=gc),_t.bindFramebuffer(R.FRAMEBUFFER,N)&&z&&_t.drawBuffers(v,N),_t.viewport(P),_t.scissor(F),_t.setScissorTest(H),Q){const ht=gt.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,ht.__webglTexture,B)}else if(lt){const ht=I;for(let wt=0;wt<v.textures.length;wt++){const Pt=gt.get(v.textures[wt]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+wt,Pt.__webglTexture,B,ht)}}else if(v!==null&&B!==0){const ht=gt.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,ht.__webglTexture,B)}E=-1},this.readRenderTargetPixels=function(v,I,B,z,N,Q,lt,pt=0){if(!(v&&v.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ht=gt.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&lt!==void 0&&(ht=ht[lt]),ht){_t.bindFramebuffer(R.FRAMEBUFFER,ht);try{const wt=v.textures[pt],Pt=wt.format,Tt=wt.type;if(!Ct.textureFormatReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=v.width-z&&B>=0&&B<=v.height-N&&(v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+pt),R.readPixels(I,B,z,N,Mt.convert(Pt),Mt.convert(Tt),Q))}finally{const wt=L!==null?gt.get(L).__webglFramebuffer:null;_t.bindFramebuffer(R.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(v,I,B,z,N,Q,lt,pt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ht=gt.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&lt!==void 0&&(ht=ht[lt]),ht)if(I>=0&&I<=v.width-z&&B>=0&&B<=v.height-N){_t.bindFramebuffer(R.FRAMEBUFFER,ht);const wt=v.textures[pt],Pt=wt.format,Tt=wt.type;if(!Ct.textureFormatReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const kt=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,kt),R.bufferData(R.PIXEL_PACK_BUFFER,Q.byteLength,R.STREAM_READ),v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+pt),R.readPixels(I,B,z,N,Mt.convert(Pt),Mt.convert(Tt),0);const jt=L!==null?gt.get(L).__webglFramebuffer:null;_t.bindFramebuffer(R.FRAMEBUFFER,jt);const fe=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Eu(R,fe,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,kt),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,Q),R.deleteBuffer(kt),R.deleteSync(fe),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,I=null,B=0){const z=Math.pow(2,-B),N=Math.floor(v.image.width*z),Q=Math.floor(v.image.height*z),lt=I!==null?I.x:0,pt=I!==null?I.y:0;Ft.setTexture2D(v,0),R.copyTexSubImage2D(R.TEXTURE_2D,B,0,0,lt,pt,N,Q),_t.unbindTexture()};const vc=R.createFramebuffer(),xc=R.createFramebuffer();this.copyTextureToTexture=function(v,I,B=null,z=null,N=0,Q=null){Q===null&&(N!==0?(cr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=N,N=0):Q=0);let lt,pt,ht,wt,Pt,Tt,kt,jt,fe;const se=v.isCompressedTexture?v.mipmaps[Q]:v.image;if(B!==null)lt=B.max.x-B.min.x,pt=B.max.y-B.min.y,ht=B.isBox3?B.max.z-B.min.z:1,wt=B.min.x,Pt=B.min.y,Tt=B.isBox3?B.min.z:0;else{const Ye=Math.pow(2,-N);lt=Math.floor(se.width*Ye),pt=Math.floor(se.height*Ye),v.isDataArrayTexture?ht=se.depth:v.isData3DTexture?ht=Math.floor(se.depth*Ye):ht=1,wt=0,Pt=0,Tt=0}z!==null?(kt=z.x,jt=z.y,fe=z.z):(kt=0,jt=0,fe=0);const ee=Mt.convert(I.format),At=Mt.convert(I.type);let he;I.isData3DTexture?(Ft.setTexture3D(I,0),he=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Ft.setTexture2DArray(I,0),he=R.TEXTURE_2D_ARRAY):(Ft.setTexture2D(I,0),he=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const Yt=R.getParameter(R.UNPACK_ROW_LENGTH),Be=R.getParameter(R.UNPACK_IMAGE_HEIGHT),ci=R.getParameter(R.UNPACK_SKIP_PIXELS),ze=R.getParameter(R.UNPACK_SKIP_ROWS),Vi=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,se.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,se.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,wt),R.pixelStorei(R.UNPACK_SKIP_ROWS,Pt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Tt);const de=v.isDataArrayTexture||v.isData3DTexture,qe=I.isDataArrayTexture||I.isData3DTexture;if(v.isDepthTexture){const Ye=gt.get(v),Ce=gt.get(I),Ue=gt.get(Ye.__renderTarget),ps=gt.get(Ce.__renderTarget);_t.bindFramebuffer(R.READ_FRAMEBUFFER,Ue.__webglFramebuffer),_t.bindFramebuffer(R.DRAW_FRAMEBUFFER,ps.__webglFramebuffer);for(let Wn=0;Wn<ht;Wn++)de&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,gt.get(v).__webglTexture,N,Tt+Wn),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,gt.get(I).__webglTexture,Q,fe+Wn)),R.blitFramebuffer(wt,Pt,lt,pt,kt,jt,lt,pt,R.DEPTH_BUFFER_BIT,R.NEAREST);_t.bindFramebuffer(R.READ_FRAMEBUFFER,null),_t.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(N!==0||v.isRenderTargetTexture||gt.has(v)){const Ye=gt.get(v),Ce=gt.get(I);_t.bindFramebuffer(R.READ_FRAMEBUFFER,vc),_t.bindFramebuffer(R.DRAW_FRAMEBUFFER,xc);for(let Ue=0;Ue<ht;Ue++)de?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ye.__webglTexture,N,Tt+Ue):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ye.__webglTexture,N),qe?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ce.__webglTexture,Q,fe+Ue):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ce.__webglTexture,Q),N!==0?R.blitFramebuffer(wt,Pt,lt,pt,kt,jt,lt,pt,R.COLOR_BUFFER_BIT,R.NEAREST):qe?R.copyTexSubImage3D(he,Q,kt,jt,fe+Ue,wt,Pt,lt,pt):R.copyTexSubImage2D(he,Q,kt,jt,wt,Pt,lt,pt);_t.bindFramebuffer(R.READ_FRAMEBUFFER,null),_t.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else qe?v.isDataTexture||v.isData3DTexture?R.texSubImage3D(he,Q,kt,jt,fe,lt,pt,ht,ee,At,se.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(he,Q,kt,jt,fe,lt,pt,ht,ee,se.data):R.texSubImage3D(he,Q,kt,jt,fe,lt,pt,ht,ee,At,se):v.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,Q,kt,jt,lt,pt,ee,At,se.data):v.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,Q,kt,jt,se.width,se.height,ee,se.data):R.texSubImage2D(R.TEXTURE_2D,Q,kt,jt,lt,pt,ee,At,se);R.pixelStorei(R.UNPACK_ROW_LENGTH,Yt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Be),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ci),R.pixelStorei(R.UNPACK_SKIP_ROWS,ze),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Vi),Q===0&&I.generateMipmaps&&R.generateMipmap(he),_t.unbindTexture()},this.initRenderTarget=function(v){gt.get(v).__webglFramebuffer===void 0&&Ft.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Ft.setTextureCube(v,0):v.isData3DTexture?Ft.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Ft.setTexture2DArray(v,0):Ft.setTexture2D(v,0),_t.unbindTexture()},this.resetState=function(){A=0,C=0,L=null,_t.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}const zt=i=>document.querySelector(i),oi={iron:"铁矿",crystal:"晶体",fiber:"纤维",ice:"冰矿",alloy:"合金",food:"口粮",water:"饮用水",oxygen:"氧气罐"},oo={iron:"⬡",crystal:"◈",fiber:"♧",ice:"❖",alloy:"▱",food:"◉",water:"◍",oxygen:"◎"},us=[{id:"shelter",name:"紧急避难舱",icon:"⌂",desc:"抵御沙暴，恢复体温与氧气。每一段旅程都需要归处。",cost:{iron:12,fiber:6},type:"build"},{id:"solar",name:"太阳能阵列",icon:"▥",desc:"白昼发电，为生命维持和信标提供能源。",cost:{iron:8,crystal:4},type:"build"},{id:"extractor",name:"冰矿提取器",icon:"♧",desc:"自动凝结水分，每 30 秒生产一份饮用水。",cost:{iron:10,crystal:3},type:"build"},{id:"garden",name:"生态种植舱",icon:"♧",desc:"培育异星植物，每 30 秒生产一份口粮。",cost:{iron:8,fiber:10,ice:4},type:"build"},{id:"beacon",name:"深空通讯信标",icon:"⚑",desc:"需要避难舱和太阳能阵列。连接家园，完成生存协议。",cost:{alloy:6,crystal:10,iron:12},type:"build"},{id:"lamp",name:"勘探照明灯",icon:"☼",desc:"照亮异星长夜，为前哨站增添温暖。",cost:{iron:3,crystal:1},type:"build"},{id:"alloy",name:"精炼合金 ×2",icon:"▱",desc:"精炼铁矿与晶体，用于高级结构。",cost:{iron:4,crystal:1},give:2,type:"craft"},{id:"water",name:"净化饮用水",icon:"◍",desc:"融化并过滤冰矿。使用后恢复 38 点水分。",cost:{ice:3},give:1,type:"craft"},{id:"food",name:"压缩口粮",icon:"◉",desc:"提取可食用的植物纤维。恢复 35 点饱食度。",cost:{fiber:4},give:1,type:"craft"},{id:"oxygen",name:"应急氧气罐",icon:"◎",desc:"从冰矿中电解氧气，恢复 50 点氧气。",cost:{ice:4,crystal:1},give:1,type:"craft"},{id:"tool",name:"等离子采集器升级",icon:"⚒",desc:"永久提高采集效率，每次采集额外获得 2 份资源。",cost:{alloy:3,crystal:5},type:"craft"}];let lo;try{lo=JSON.parse(localStorage.getItem("outpost-echo-v1"))}catch{}const bt=Object.assign({inv:{iron:8,crystal:2,fiber:3,ice:3,alloy:0,food:2,water:2,oxygen:1},stats:{health:100,oxygen:94,food:86,water:82},time:0,x:0,z:4,buildings:[],harvested:0,upgraded:!1,won:!1},lo||{});let wn=!1,dn=null,_n=null,fn=null,hr=0,ce=null,ic=0,qs=0,we=!1,Hn=!1,Ys=0,$s=0;const Le={},_e=new Yu;_e.background=new Xt("#7f9d9b");_e.fog=new to("#849d98",.008);const Re=new Wm({canvas:zt("#world"),antialias:!0});Re.setPixelRatio(Math.min(devicePixelRatio,2));Re.setSize(innerWidth,innerHeight);Re.shadowMap.enabled=!0;Re.shadowMap.type=bl;Re.outputColorSpace=Ge;Re.toneMapping=wl;Re.toneMappingExposure=1.12;const ii=new ke(43,innerWidth/innerHeight,.1,600);let Ki=.58,tr=.68,er=33;const Yi=new U(0,0,0),rc=new th("#d6efdf","#654a43",2.4);_e.add(rc);const li=new rh("#ffe3b4",3.8);li.position.set(-25,45,-20);li.castShadow=!0;li.shadow.mapSize.set(2048,2048);Object.assign(li.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:140});li.shadow.bias=-.001;_e.add(li);const rt={sand:Ie("#b59c7c"),rock:Ie("#716d60"),rock2:Ie("#918475"),white:Ie("#e4e4cd"),trim:Ie("#536c68"),dark:Ie("#253a3c"),orange:Ie("#c96e40"),crystal:Ie("#74d3bd",.25,.35),fiber:Ie("#527767"),ice:Ie("#b7dce0",.22,.2),solar:Ie("#234c60",.23,.5),glow:new ro({color:"#a5f5dc",emissive:"#66d9bf",emissiveIntensity:1.7})};function Ie(i,t=.88,e=.05){return new ro({color:i,roughness:t,metalness:e,flatShading:!0})}function Oe(i,t,e=_e,n=0,r=0,s=0){const a=new hn(i,t);return a.position.set(n,r,s),a.castShadow=!0,a.receiveShadow=!0,e.add(a),a}function Bt(i,t,e,n,r,s=0,a=0,o=0){return Oe(new Bi(t,e,n),r,i,s,a,o)}function ne(i,t,e,n,r,s=0,a=0,o=0,c=8){return Oe(new no(t,e,n,c),r,i,s,a,o)}let Ks=83;function Qt(){return Ks=Ks*16807%2147483647,(Ks-1)/2147483646}function Rn(i,t){return Math.sin(i*.075)*Math.cos(t*.06)*.7+Math.sin(i*.22+t*.09)*.21}const hs=new gr(340,340,140,140);hs.rotateX(-Math.PI/2);const qr=hs.attributes.position;for(let i=0;i<qr.count;i++)qr.setY(i,Rn(qr.getX(i),qr.getZ(i)));hs.computeVertexNormals();const sc=Oe(hs,rt.sand);sc.castShadow=!1;for(let i=0;i<62;i++){const t=i/62*Math.PI*2,e=92+Qt()*64,n=Math.cos(t)*e,r=Math.sin(t)*e,s=7+Qt()*26,a=ne(_e,2+Qt()*8,9+Qt()*12,s,Ie(i%3===0?"#7e8175":"#938777"),n,s/2-2,r,5+Math.floor(Qt()*3));a.rotation.y=Qt()*4}for(let i=0;i<220;i++){let t=(Qt()-.5)*150,e=(Qt()-.5)*150;if(Math.hypot(t,e)<8)continue;const n=.12+Qt()*.55,r=Oe(new ls(n,0),i%3===0?rt.rock2:rt.rock,_e,t,Rn(t,e)+n*.35,e);r.scale.set(1.6,.7,1),r.rotation.set(Qt(),Qt()*5,Qt())}const We=new Ke;We.position.set(-5,Rn(-5,-5),-5);_e.add(We);ne(We,3.7,3.9,.18,rt.trim,0,.05,0,12);ne(We,2.1,2.5,.22,rt.dark,0,.2,0,8);ne(We,1.35,1.85,1.2,rt.white,0,.95,0,8);ne(We,1.12,1.35,1.7,rt.white,0,2.3,0,8);ne(We,.5,1.15,.8,rt.trim,0,3.55,0,8);Bt(We,1.25,.72,.11,rt.dark,0,2.6,1.25);Bt(We,1.32,.1,.13,rt.orange,0,2.08,1.29);for(let i=0;i<4;i++){const t=i*Math.PI/2+.75,e=Bt(We,.22,1.8,.22,rt.trim,Math.sin(t)*1.9,.9,Math.cos(t)*1.9);e.rotation.z=Math.cos(t)*.5,e.rotation.x=-Math.sin(t)*.5,ne(We,.5,.5,.1,rt.dark,Math.sin(t)*2.3,.1,Math.cos(t)*2.3)}Bt(We,.13,2,.13,rt.dark,.6,4.1,0);Oe(new ai(.14),rt.glow,We,.6,5.1,0);const co=new Ke;co.position.set(-1.6,Rn(-1.6,-4),-4);_e.add(co);for(let i=0;i<3;i++){let t=Bt(co,.7,.55,.6,i===1?rt.orange:rt.white,i*.83,.28,0);Bt(t,.74,.1,.62,rt.trim,0,.08,0)}const vr=[];function xr(i,t,e,n){let r=new Ke;if(r.position.set(t,Rn(t,e),e),_e.add(r),i==="fiber")for(let a=0;a<5;a++){const o=Qt()*6.28;let c=ne(r,.03,.1,.8+Qt(),rt.fiber,Math.sin(o)*.35,.55,Math.cos(o)*.35,5);c.rotation.z=(Qt()-.5)*.6,Oe(new ur(.4),Ie(a%2?"#98aa79":"#648b77"),r,c.position.x,1+Qt()*.3,c.position.z).scale.set(.5,1.4,.5)}else if(i==="crystal"||i==="ice"){for(let a=0;a<4;a++){const o=.4+Qt()*.6,c=ne(r,0,o*.45,o*2,i==="ice"?rt.ice:rt.crystal,Qt()-.5,o*.85,Qt()-.5,5);c.rotation.z=(Qt()-.5)*.55}ne(r,.65,.8,.18,rt.rock,0,.1,0)}else for(let a=0;a<3;a++){const o=Oe(new ls(.55+Qt()*.4),rt.rock,r,(Qt()-.5)*.8,.35,(Qt()-.5)*.8);o.scale.y=.7,Oe(new ur(.18),rt.orange,r,o.position.x,.8,o.position.z)}const s={type:i,x:t,z:e,group:r,left:4,respawn:0,id:n};vr.push(s)}const Xm=["iron","crystal","fiber","ice"];for(let i=0;i<100;i++){let t=Qt()*6.28,e=9+Qt()*62;xr(Xm[i%4],Math.sin(t)*e,Math.cos(t)*e,i)}xr("iron",4,3,100);xr("fiber",-3,7,101);xr("crystal",7,-3,102);xr("ice",-8,5,103);const Gn=new Ke;Gn.position.set(5,Rn(5,-6),-6);Gn.rotation.y=-.4;_e.add(Gn);Bt(Gn,1.7,.45,2.1,rt.white,0,.7,0);Bt(Gn,1.2,.18,1.2,rt.solar,0,1.02,-.25);for(let i of[-1,1])for(let t of[-.7,.7]){let e=ne(Gn,.35,.35,.3,rt.dark,i,.35,t);e.rotation.z=Math.PI/2}Bt(Gn,.07,1.4,.07,rt.trim,.4,1.3,.6);Bt(Gn,.4,.2,.2,rt.orange,.4,2,.6);const Ht=new Ke;_e.add(Ht);Ht.position.set(bt.x,0,bt.z);const an=new Ke;Ht.add(an);Bt(an,.65,.75,.4,rt.white,0,1.2,0);Bt(an,.46,.42,.25,rt.trim,0,1.2,-.3);Bt(an,.43,.18,.05,rt.orange,0,1.3,.23);Oe(new ai(.39,12,10),rt.white,an,0,1.88,0);const qm=Oe(new ai(.33,12,8,0,Math.PI*2,0,Math.PI/2),Ie("#162f39",.15,.6),an,0,1.9,.1);qm.rotation.x=Math.PI/2;Bt(an,.7,.08,.45,rt.orange,0,.93,0);const dr=[],Va=[];for(let i of[-1,1]){let t=Bt(an,.2,.7,.23,rt.white,i*.45,1.13,0);dr.push(t),Bt(t,.23,.17,.26,rt.trim,0,-.28,0);let e=Bt(an,.25,.65,.28,rt.white,i*.2,.54,0);Va.push(e),Bt(e,.28,.19,.4,rt.dark,0,-.28,.06)}const Ym=Bt(dr[1],.13,.13,.62,rt.trim,0,-.25,.22);Bt(Ym,.25,.22,.17,rt.glow,0,0,.32);const Ze=[];function uo(i,t,e,n=0,r=!1){const s=new Ke;if(s.position.set(t,Rn(t,e),e),s.rotation.y=n,i==="shelter"){Bt(s,4.7,.24,4.3,rt.trim,0,.18,0);for(let a of[-1.8,1.8])for(let o of[-1.6,1.6])ne(s,.13,.2,.7,rt.dark,a,0,o);Bt(s,4,2.2,3.5,rt.white,0,1.35,0);for(const a of[-1,1]){const o=Bt(s,4.2,.16,1.95,rt.white,0,2.58,a*.9);o.rotation.x=a*.24}Bt(s,4.1,.17,3.6,rt.orange,0,2.3,0),Bt(s,1.05,1.65,.08,rt.dark,.7,1.13,1.79),Bt(s,.07,1.65,.12,rt.glow,.13,1.13,1.86),Bt(s,1.2,.65,.1,rt.solar,-1,1.65,1.79),Bt(s,1.4,.12,.9,rt.trim,.7,.32,2.15),Bt(s,1.6,.15,.65,rt.white,.7,.12,2.8),ne(s,.24,.24,2.4,rt.trim,-2.2,1.2,-.8),ne(s,.24,.24,2.4,rt.trim,-2.2,1.2,0)}if(i==="solar"){const a=new Ke;a.position.y=1.65,a.rotation.x=-.3,s.add(a),Bt(a,4.05,.13,2.65,rt.trim,0,-.08,0),Bt(a,3.9,.09,2.5,rt.solar);for(let o=-1.9;o<=1.9;o+=.48)Bt(a,.025,.015,2.5,rt.white,o,.052,0);for(let o=-1.2;o<=1.2;o+=.4)Bt(a,3.9,.015,.02,rt.trim,0,.053,o);for(let o of[-1.3,1.3])ne(s,.08,.13,1.6,rt.trim,o,.8,0);Bt(s,.6,.5,.6,rt.white,0,.3,0)}if(i==="extractor"&&(ne(s,.8,1.1,.3,rt.trim,0,.15,0),ne(s,.65,.65,1.7,rt.white,0,1.15,0),ne(s,.7,.7,.18,rt.orange,0,1.3,0),ne(s,.2,.4,1.8,rt.trim,0,2.3,0),ne(s,1.5,.2,.5,rt.white,0,3.2,0),Bt(s,.5,.6,.1,rt.glow,0,1.3,.66)),i==="garden"){Bt(s,3.4,.5,2.5,rt.white,0,.3,0),Bt(s,3.1,.1,2.2,rt.dark,0,.58,0);for(let c=-1;c<=1;c++)for(let l of[-.6,.6])ne(s,.04,.07,.7,rt.fiber,c,.95,l),Oe(new ur(.35),rt.fiber,s,c,1.3,l);const a=new ro({color:"#a3ded0",transparent:!0,opacity:.22,roughness:.2,side:tn}),o=Oe(new ai(1.8,16,8,0,Math.PI*2,0,Math.PI/2),a,s,0,.6,0);o.scale.z=.75}if(i==="beacon"){ne(s,1.4,1.6,.3,rt.trim,0,.15,0),ne(s,.4,.8,2,rt.white,0,1.3,0),ne(s,.1,.22,4,rt.trim,0,3.2,0);let a=ne(s,1.2,.1,.5,rt.white,0,4.4,0,16);a.rotation.z=.5,Oe(new ai(.17),rt.glow,s,0,5.3,0);for(let o=0;o<6.3;o+=2.1){let c=Bt(s,.1,3,.1,rt.orange,Math.cos(o)*.6,1.8,Math.sin(o)*.6);c.rotation.z=Math.cos(o)*.3,c.rotation.x=Math.sin(o)*.3}}if(i==="lamp"){ne(s,.4,.5,.15,rt.trim,0,.1,0),ne(s,.05,.08,3,rt.trim,0,1.6,0),Bt(s,.8,.15,.5,rt.white,0,3.1,0),Bt(s,.65,.08,.4,rt.glow,0,3,0);const a=new nh("#c3ffdc",9,12,2);a.position.set(0,2.8,0),s.add(a)}return _e.add(s),r?s.traverse(a=>{a.isMesh&&(a.material=a.material.clone(),a.material.transparent=!0,a.material.opacity=.4,a.castShadow=!1)}):Ze.push({type:i,x:t,z:e,rot:n,group:s}),s}for(const i of bt.buildings)uo(i.type,i.x,i.z,i.rot);const ac=new Xe,Zi=new Float32Array(600*3);for(let i=0;i<Zi.length;i+=3)Zi[i]=(Qt()-.5)*140,Zi[i+1]=Qt()*18,Zi[i+2]=(Qt()-.5)*140;ac.setAttribute("position",new sn(Zi,3));const Jr=new ju(ac,new Yl({color:"#e0d4b5",size:.045,transparent:!0,opacity:.5}));_e.add(Jr);const Ai=Oe(new io(.9,1,48),new Qa({color:"#b4eed8",transparent:!0,opacity:.8,side:tn}));Ai.rotation.x=-Math.PI/2;Ai.visible=!1;const Sl=new ah,El=new Vt;let nr=null,ir=null,is=!1;function oc(i){return El.set(i.clientX/innerWidth*2-1,-i.clientY/innerHeight*2+1),Sl.setFromCamera(El,ii),Sl.intersectObject(sc)[0]?.point}Re.domElement.addEventListener("pointerdown",i=>{nr={x:i.clientX,y:i.clientY},ir={x:i.clientX,y:i.clientY},is=!1,Re.domElement.setPointerCapture(i.pointerId)});Re.domElement.addEventListener("pointermove",i=>{if(nr){const t=i.clientX-ir.x,e=i.clientY-ir.y;Math.hypot(i.clientX-nr.x,i.clientY-nr.y)>4&&(is=!0),is&&!_n&&(Ki-=t*.006,tr=Qi.clamp(tr+e*.004,.3,1.2)),ir={x:i.clientX,y:i.clientY}}if(_n&&fn){const t=oc(i);t&&(fn.position.copy(t),fn.rotation.y=hr)}});Re.domElement.addEventListener("pointerup",i=>{if(!is&&_n){const t=oc(i);t&&Km(t)}nr=null,ir=null});Re.domElement.addEventListener("wheel",i=>{er=Qi.clamp(er+i.deltaY*.018,12,58)},{passive:!0});window.addEventListener("resize",()=>{Re.setSize(innerWidth,innerHeight),ii.aspect=innerWidth/innerHeight,ii.updateProjectionMatrix()});function ge(i,t=!1){const e=document.createElement("div");e.className="toast"+(t?" error":""),e.textContent=i,zt("#toast-stack").append(e),setTimeout(()=>e.remove(),3600)}function rs(i){return Object.entries(i).every(([t,e])=>(bt.inv[t]||0)>=e)}function lc(i){for(const[t,e]of Object.entries(i))bt.inv[t]-=e}function cc(i){return Object.entries(i).map(([t,e])=>`${oi[t]} ${bt.inv[t]||0}/${e}`).join(" · ")}function Ii(){zt("#drawer").classList.add("hidden"),dn=null,document.querySelectorAll(".slot").forEach(i=>i.classList.toggle("active",i.dataset.action==="tool"))}function Qr(i){if(dn===i){Ii();return}fr(),dn=i,ds(),zt("#drawer").classList.remove("hidden"),document.querySelectorAll(".slot").forEach(t=>t.classList.toggle("active",t.dataset.action===i))}function ds(){const i={build:["前哨站蓝图","将荒野变成家园。选择蓝图，在身边的空地放置建筑。"],craft:["便携制造终端","把发现变成可能。消耗原料，制造生存物资与装备。"],inventory:["旅行者的行囊","每一份资源，都让你离家更近一步。点击补给立即使用。"]};let t=`<div class="drawer-head"><h2>${i[dn][0]}</h2><button class="close" aria-label="关闭">×</button></div><p class="drawer-intro">${i[dn][1]}</p>`;dn==="inventory"?t+='<div class="inventory-grid">'+Object.entries(oi).map(([e,n])=>`<div class="inventory-item"><span>${oo[e]}</span>${n}<b>${bt.inv[e]||0}</b>${["food","water","oxygen"].includes(e)?`<button class="primary use" data-id="${e}" style="margin-top:14px;padding:7px 12px" ${(bt.inv[e]||0)<1?"disabled":""}>使用</button>`:""}</div>`).join("")+"</div>":t+=us.filter(e=>e.type===dn).map(e=>`<button class="recipe" data-id="${e.id}"><span class="recipe-icon">${e.icon}</span><div><span class="tag">${e.id==="tool"&&bt.upgraded?"已升级":rs(e.cost)?"可制作":"资源不足"}</span><h3>${e.name}</h3><p>${e.desc}</p><span class="cost ${rs(e.cost)?"":"lack"}">${cc(e.cost)}</span></div></button>`).join(""),zt("#drawer").innerHTML=t,zt(".close").onclick=Ii,document.querySelectorAll(".recipe").forEach(e=>e.onclick=()=>$m(e.dataset.id)),document.querySelectorAll(".use").forEach(e=>e.onclick=()=>Zm(e.dataset.id))}function $m(i){const t=us.find(e=>e.id===i);if(!rs(t.cost)){ge("资源不足："+cc(t.cost),!0);return}if(i==="tool"&&bt.upgraded){ge("采集器已经升级");return}if(i==="beacon"&&(!Tn("shelter")||!Tn("solar"))){ge("请先建造避难舱与太阳能阵列",!0);return}t.type==="build"?(Ii(),_n=t,fn=uo(i,Ht.position.x+4,Ht.position.z,hr,!0),zt("#build-hint").classList.remove("hidden"),zt("#build-name").textContent=t.name,ge("选择附近的空地，点击放置建筑")):(lc(t.cost),i==="tool"?bt.upgraded=!0:bt.inv[i]=(bt.inv[i]||0)+t.give,ge("制造完成 · "+t.name),Hi(),ds(),Vn())}function fr(){_n=null,fn&&(_e.remove(fn),fn.traverse(i=>{i.isMesh&&i.material.dispose()}),fn=null),zt("#build-hint").classList.add("hidden")}function Km(i){if(wn||Hn)return;if(Math.hypot(i.x-Ht.position.x,i.z-Ht.position.z)>14){ge("建造位置太远，请在 14 米以内放置",!0);return}if(Math.hypot(i.x+5,i.z+5)<6||Ze.some(e=>Math.hypot(i.x-e.x,i.z-e.z)<4.8)||vr.some(e=>e.group.visible&&Math.hypot(i.x-e.x,i.z-e.z)<2.1)){ge("此处空间不足，请选择一片空地",!0);return}if(!rs(_n.cost)){ge("资源不足",!0);return}const t=_n;lc(t.cost),uo(t.id,i.x,i.z,hr),fr(),ge("建造完成 · "+t.name),t.id==="beacon"&&(bt.won=!0,Mr("signal")),Hi(),Vn()}function Tn(i){return Ze.some(t=>t.type===i)}function Zm(i){if(!bt.inv[i])return;const t={food:35,water:38,oxygen:50};if(bt.stats[i]>=99){ge("当前状态良好，无需补充");return}bt.inv[i]--,bt.stats[i]=Math.min(100,bt.stats[i]+t[i]),ge(`已使用${oi[i]} · +${t[i]}`),Hi(),dn&&ds(),Vn()}function uc(){if(wn||Hn||_n||performance.now()<qs)return;if(!ce){ge("靠近矿石、晶体或植物后按 E 采集");return}if(ce.kind==="base"){bt.stats.oxygen=Math.min(100,bt.stats.oxygen+30),ge("着陆舱氧气补充完成"),qs=performance.now()+3e3;return}const i=bt.upgraded?5:3;bt.inv[ce.type]=(bt.inv[ce.type]||0)+i,bt.harvested+=i,ce.left--,ce.group.scale.setScalar(.85);const t=ce.group;setTimeout(()=>t.scale.setScalar(1),150),ce.left<=0&&(ce.group.visible=!1,ce.respawn=bt.time+120),ge(`+${i} ${oi[ce.type]} · 已存入背包`),qs=performance.now()+650,dr[1].rotation.x=-1.1,setTimeout(()=>dr[1].rotation.x=0,250),Hi(),dn&&ds()}function hc(){wn||Hn||(ic=bt.time+15,ge("扫描完成 · 附近资源已标记 15 秒"))}const jm=[()=>[bt.harvested>=12,"采集基础资源",`${Math.min(12,bt.harvested)} / 12`],()=>[Tn("shelter"),"建造紧急避难舱",Tn("shelter")?"1 / 1":"0 / 1"],()=>[Tn("solar"),"部署太阳能阵列",Tn("solar")?"1 / 1":"0 / 1"],()=>[Tn("beacon"),"建立深空通讯",Tn("beacon")?"1 / 1":"0 / 1"]];function Hi(){zt("#objectives").innerHTML=jm.map(i=>{const[t,e,n]=i();return`<div class="objective ${t?"done":""}"><span class="check">${t?"✓":""}</span><span>${e}</span><span class="count">${n}</span></div>`}).join(""),zt("#resource-strip").innerHTML=["iron","crystal","fiber","ice","alloy","food"].map(i=>`<div class="resource"><span>${oo[i]}</span><div><b>${bt.inv[i]||0}</b><small>${oi[i]}</small></div></div>`).join(""),zt("#level").textContent=1+Math.floor(bt.harvested/40)+Ze.length,dc(),bt.won&&(zt("#mission-title").textContent="信号已抵达，旅程仍继续",zt("#mission-status").textContent="救援信号已发送 · 继续扩建你的异星家园")}function dc(){const i={health:"生命",oxygen:"氧气",food:"饱食",water:"水分"};zt("#vital-bars").innerHTML=Object.entries(i).map(([t,e])=>`<div class="vital"><label>${e}</label><div class="bar"><i style="width:${bt.stats[t]}%;background:${bt.stats[t]<25?"#ec936e":t==="oxygen"?"#9ecbd2":t==="food"?"#c7c594":"#b4eed8"}"></i></div><b>${Math.ceil(bt.stats[t])}</b></div>`).join("")}function Vn(){bt.x=Ht.position.x,bt.z=Ht.position.z,bt.buildings=Ze.map(({type:i,x:t,z:e,rot:n})=>({type:i,x:t,z:e,rot:n}));try{localStorage.setItem("outpost-echo-v1",JSON.stringify(bt)),zt("#save-label").textContent="已保存 · "+new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}catch{zt("#save-label").textContent="存档不可用 · 浏览器存储受限"}}function Mr(i){wn=!0;const t={help:'<span class="eyebrow">FIELD GUIDE / 生存手册</span><h2>你好，旅行者。</h2><p>你的着陆舱停在一颗无名星球。采集散落的资源，建立避难所，制造合金，最终点亮深空通讯信标。</p><div class="help-grid"><span><kbd>WASD / ↑↓←→</kbd> 移动</span><span><kbd>SHIFT</kbd> 奔跑</span><span><kbd>E</kbd> 采集 / 着陆舱补氧</span><span><kbd>B</kbd> 建造蓝图</span><span><kbd>C</kbd> 制造物资</span><span><kbd>I</kbd> 背包 / 使用补给</span><span><kbd>F</kbd> 扫描周围资源</span><span><kbd>R</kbd> 旋转建筑</span><span><kbd>ESC</kbd> 取消 / 暂停</span><span>拖动视角 · 滚轮缩放</span></div><p>靠近避难舱可持续恢复氧气与生命；太阳能增强恢复效率。沙暴时尽快回到避难舱。用冰矿制水、用纤维制造食物。进度每 15 秒自动保存。</p>',pause:'<span class="eyebrow">MISSION ON HOLD</span><h2>宇宙可以等一会儿。</h2><p>游戏已暂停，生命维持与风暴计时已停止。你的探索进度已保存在此浏览器。</p>',signal:'<span class="eyebrow">TRANSMISSION SUCCESSFUL</span><h2>有人听见了你的声音。</h2><p>深空信标已上线。穿过漫长的星际寂静，一条回音终于抵达：<br>「我们收到你的坐标了，旅行者。」<br>生存协议完成。你可以继续探索、制造、扩建这个属于你的前哨站。</p>',dead:'<span class="eyebrow">EMERGENCY RECOVERY</span><h2>生命维持系统已离线。</h2><p>着陆舱已记录你最后的生命信号。启动应急复苏后，返回着陆点，保留建筑与资源。</p>'};zt("#modal").innerHTML=`<div class="modal-card">${t[i]}<button class="primary" id="resume">${i==="dead"?"启动应急复苏":i==="help"?"继续探索 →":"返回星球 →"}</button>${i==="pause"?'<button class="secondary" id="manual-save">保存进度</button>':""}</div>`,zt("#modal").classList.remove("hidden"),zt("#resume").onclick=()=>{Hn&&(Hn=!1,bt.stats={health:100,oxygen:100,food:70,water:70},Ht.position.set(0,0,4),Vn()),wn=!1,zt("#modal").classList.add("hidden")},zt("#manual-save")&&(zt("#manual-save").onclick=()=>{Vn(),ge("探索进度已保存")})}zt("#help-btn").onclick=()=>Mr("help");zt("#pause-btn").onclick=()=>{Vn(),Mr("pause")};document.querySelectorAll(".slot").forEach(i=>i.onclick=()=>{const t=i.dataset.action;t==="tool"?(Ii(),fr()):t==="scan"?hc():Qr(t)});window.addEventListener("keydown",i=>{if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Tab"].includes(i.code)&&i.preventDefault(),Le[i.code]=!0,i.repeat)return;if(i.code==="Escape"){_n?fr():dn?Ii():wn&&!Hn?(wn=!1,zt("#modal").classList.add("hidden")):Mr("pause");return}if(wn)return;({KeyE:uc,KeyB:()=>Qr("build"),KeyC:()=>Qr("craft"),KeyI:()=>Qr("inventory"),KeyF:hc,Digit1:()=>{fr(),Ii()},KeyR:()=>{hr+=Math.PI/2,fn&&(fn.rotation.y=hr)}})[i.code]?.()});window.addEventListener("keyup",i=>Le[i.code]=!1);window.addEventListener("blur",()=>{Object.keys(Le).forEach(i=>Le[i]=!1)});window.addEventListener("beforeunload",Vn);function Jm(){const i=zt("#minimap").getContext("2d"),t=190,e=150;i.clearRect(0,0,t,e),i.save(),i.translate(t/2,e/2),i.strokeStyle="#8db7a61b",i.lineWidth=1;for(let r=25;r<100;r+=25)i.beginPath(),i.arc(0,0,r,0,Math.PI*2),i.stroke();i.beginPath(),i.moveTo(-95,0),i.lineTo(95,0),i.moveTo(0,-75),i.lineTo(0,75),i.stroke();const n=1.6;for(const r of vr){if(!r.group.visible)continue;const s=(r.x-Ht.position.x)*n,a=(r.z-Ht.position.z)*n;Math.abs(s)>90||Math.abs(a)>70||(i.fillStyle=r.type==="crystal"?"#a0e1d1":r.type==="ice"?"#9bbfcc":r.type==="fiber"?"#a2aa78":"#ba9982",i.fillRect(s-1.5,a-1.5,3,3))}for(const r of[...Ze,{x:-5,z:-5}])i.strokeStyle="#dde6c6",i.strokeRect((r.x-Ht.position.x)*n-3,(r.z-Ht.position.z)*n-3,6,6);i.rotate(-Ht.rotation.y),i.fillStyle="#c5f6de",i.beginPath(),i.moveTo(0,-6),i.lineTo(-4,5),i.lineTo(0,3),i.lineTo(4,5),i.closePath(),i.fill(),i.restore(),i.fillStyle="#a3c1b4",i.font="8px monospace",i.fillText("N",92,11)}function Qm(){const i=[],t=new U(-5,5.8,-5);if(i.push({p:t,text:"⌂ 着陆舱 · 氧气补给"}),ic>bt.time)for(const e of vr)e.group.visible&&Math.hypot(e.x-Ht.position.x,e.z-Ht.position.z)<25&&i.push({p:e.group.position.clone().add(new U(0,2,0)),text:oo[e.type]+" "+oi[e.type]});for(const e of Ze)Math.hypot(e.x-Ht.position.x,e.z-Ht.position.z)<25&&i.push({p:e.group.position.clone().add(new U(0,e.type==="beacon"?6:4,0)),text:us.find(n=>n.id===e.type).name});zt("#world-labels").innerHTML=i.map(({p:e,text:n})=>(e.project(ii),e.z>1||Math.abs(e.x)>1||Math.abs(e.y)>1?"":`<div class="world-label" style="left:${(e.x*.5+.5)*innerWidth}px;top:${(-e.y*.5+.5)*innerHeight}px">${n}</div>`)).join("")}let yl=performance.now(),Zs=0;function fc(i){requestAnimationFrame(fc);const t=Math.min((i-yl)/1e3,.05);if(yl=i,!wn&&!Hn){bt.time+=t;const s=(Le.KeyW||Le.ArrowUp?1:0)-(Le.KeyS||Le.ArrowDown?1:0),a=(Le.KeyD||Le.ArrowRight?1:0)-(Le.KeyA||Le.ArrowLeft?1:0),o=Le.ShiftLeft||Le.ShiftRight;let c=s||a;if(c){const g=Math.atan2(-a,s),M=Math.sin(Ki+g),p=Math.cos(Ki+g),u=o?6:3.4;let y=Qi.clamp(Ht.position.x-M*u*t,-78,78),T=Qi.clamp(Ht.position.z-p*u*t,-78,78);Math.hypot(y+5,T+5)<2.4||Ze.some(w=>w.type==="shelter"&&Math.abs(y-w.x)<2.1&&Math.abs(T-w.z)<1.8)||(Ht.position.x=y,Ht.position.z=T),Ht.rotation.y=Math.atan2(-M,-p),Va.forEach((w,A)=>w.rotation.x=Math.sin(i*.012*(o?1.5:1)+A*Math.PI)*.45),dr.forEach((w,A)=>w.rotation.x=Math.sin(i*.012+A*Math.PI+Math.PI)*.3),an.position.y=Math.abs(Math.sin(i*.012))*.045}else Va.forEach(g=>g.rotation.x=0),an.position.y=0;Ht.position.y=Rn(Ht.position.x,Ht.position.z)+.06;const l=Ze.some(g=>g.type==="shelter"&&Math.hypot(Ht.position.x-g.x,Ht.position.z-g.z)<5.8),h=Math.hypot(Ht.position.x+5,Ht.position.z+5)<4.8,d=bt.time%300>=240;d!==we&&(we=d,ge(we?"警告：离子风暴抵达，立即返回避难舱！":"风暴已离开 · 地表恢复安全",we),zt("#storm-overlay").style.opacity=we?1:0);const f=bt.stats;if(f.oxygen=Qi.clamp(f.oxygen+t*(l?Tn("solar")?3:1.6:h?1:-(o&&c?.18:.09)*(we?2.5:1)),0,100),f.food=Math.max(0,f.food-t*.035),f.water=Math.max(0,f.water-t*(o&&c?.09:.05)),we&&!l&&(f.health=Math.max(0,f.health-t*.4)),f.oxygen<=0||f.food<=0||f.water<=0?f.health=Math.max(0,f.health-t*1.8):l&&(f.health=Math.min(100,f.health+t*.5)),zt("#safety").textContent=l?"避难舱范围 · 生命维持恢复中":we?"离子风暴 · 请立即寻找掩护":"太空服生命维持正常",f.health<=0&&(Hn=!0,Mr("dead")),$s+=t,$s>30){$s=0;const g=Ze.filter(p=>p.type==="extractor").length;g&&(bt.inv.water+=g,ge(`提取器生产完成 · +${g} 饮用水`));const M=Ze.filter(p=>p.type==="garden").length;M&&(bt.inv.food+=M,ge(`种植舱收获 · +${M} 口粮`)),Hi()}ce=null;let m=2.7;for(const g of vr){if(!g.group.visible&&bt.time>g.respawn&&(g.left=4,g.group.visible=!0,g.group.scale.setScalar(1)),!g.group.visible)continue;const M=Math.hypot(g.x-Ht.position.x,g.z-Ht.position.z);M<m&&(m=M,ce=g)}!ce&&h&&(ce={kind:"base"}),ce&&!_n?(zt("#interaction").classList.remove("hidden"),zt("#interaction span").textContent=ce.kind==="base"?"着陆舱 · 补充氧气":"采集"+oi[ce.type],zt("#interaction small").textContent=ce.kind==="base"?"安全补给点":bt.upgraded?"等离子采集器 · +5":"地质采集器 · +3",Ai.visible=ce.kind!=="base",Ai.visible&&Ai.position.set(ce.x,Rn(ce.x,ce.z)+.05,ce.z)):(zt("#interaction").classList.add("hidden"),Ai.visible=!1),Le.KeyE&&uc(),Ys+=t,Ys>=15&&(Vn(),Ys=0)}const e=(bt.time/600+.405)%1,n=.25+Math.max(0,Math.sin((e-.25)*Math.PI*2))*.75;rc.intensity=.6+n*1.8,li.intensity=n*3.8,_e.background.set(we?"#8d9282":"#7f9d9b").multiplyScalar(.38+n*.62),_e.fog.color.copy(_e.background),_e.fog.density=we?.025:.008,Yi.lerp(new U(Ht.position.x,1,Ht.position.z),.055),ii.position.set(Yi.x+Math.sin(Ki)*Math.cos(tr)*er,Yi.y+Math.sin(tr)*er,Yi.z+Math.cos(Ki)*Math.cos(tr)*er),ii.lookAt(Yi);const r=Jr.geometry.attributes.position;for(let s=0;s<r.count;s++)r.setX(s,r.getX(s)+t*(we?16:1.1)),r.getX(s)>70&&r.setX(s,-70);if(r.needsUpdate=!0,Jr.material.opacity=we?.85:.35,Jr.material.size=we?.08:.045,Re.render(_e,ii),Zs+=t,Zs>.2){Zs=0,dc(),Jm(),Qm();const s=1+Math.floor(bt.time/600),a=Math.floor(e*24),o=Math.floor(e*24*60)%60;zt("#clock").innerHTML=`SOL ${String(s).padStart(2,"0")} <small>${String(a).padStart(2,"0")}:${String(o).padStart(2,"0")}</small>`,zt("#weather").textContent=we?"离子风暴 · 危险":n<.4?"静谧夜晚 · 低温":"晴朗 · 能见度良好",zt("#temp").textContent=`${Math.round(-38+n*23)}°C`,zt("#day-progress").style.width=e*100+"%";const c=we?300-bt.time%300:240-bt.time%300;zt("#storm-info").textContent=we?`风暴将在 ${Math.ceil(c)} 秒后结束`:`下一场离子风暴预计 ${Math.floor(c/60).toString().padStart(2,"0")}:${Math.floor(c%60).toString().padStart(2,"0")} 后抵达`,zt("#coords").textContent=`${(24.8+Ht.position.z*.01).toFixed(2)}° N · ${(68.2+Ht.position.x*.01).toFixed(2)}° E`}}Hi();requestAnimationFrame(fc);setTimeout(()=>ge(lo?"欢迎回来，旅行者。已恢复上次探索进度。":"着陆成功 · WASD 移动，靠近资源按 E 采集 · 按 ? 查看手册"),1100);window.__outpost={getState:()=>JSON.parse(JSON.stringify({...bt,x:Ht.position.x,z:Ht.position.z,buildings:Ze.map(({type:i,x:t,z:e})=>({type:i,x:t,z:e}))})),getRenderer:()=>({triangles:Re.info.render.triangles,calls:Re.info.render.calls}),recipes:us};
