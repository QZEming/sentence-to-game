// Procedural industrial mech and arena. Three.js is supplied by the host.
export function createMech(THREE, options = {}) {
  const color = options.color ?? '#d9ddd8';
  const accent = options.accent ?? '#ff792e';
  const weaponType = options.weapon || 'blade';
  const heavy = /heavy|tank|bulwark/i.test(`${options.legs || ''} ${options.core || ''}`);
  const group = new THREE.Group();
  group.name = 'FORGE / ' + weaponType;
  const rig = new THREE.Group(); group.add(rig);
  const mat = (c, metalness=.65, roughness=.42) => new THREE.MeshStandardMaterial({ color:c, metalness, roughness });
  const armor = mat(color), pale = mat(color,.5,.34), dark = mat('#172126',.75,.4);
  const black = mat('#090f13',.6,.6), steel = mat('#758487',.88,.25), orange = mat(accent,.5,.35);
  const glow = new THREE.MeshStandardMaterial({color:accent,emissive:accent,emissiveIntensity:2.3,metalness:.35,roughness:.3});
  const visor = new THREE.MeshStandardMaterial({color:'#d4f6ff',emissive:'#76dcff',emissiveIntensity:2.2,metalness:.25,roughness:.2});
  function mesh(geo, material, parent, x=0,y=0,z=0) {
    const m = new THREE.Mesh(geo,material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
  }
  const box = (p,w,h,d,m,x=0,y=0,z=0) => mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z);
  function plate(p,w,h,d,m,x=0,y=0,z=0,cut=.1) {
    const a=w/2,b=h/2,c=Math.min(cut,a*.4,b*.4),s=new THREE.Shape();
    s.moveTo(-a+c,-b);s.lineTo(a-c,-b);s.lineTo(a,-b+c);s.lineTo(a,b-c);s.lineTo(a-c,b);s.lineTo(-a+c,b);s.lineTo(-a,b-c);s.lineTo(-a,-b+c);s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.025});g.translate(0,0,-d/2);
    return mesh(g,m,p,x,y,z);
  }
  function cyl(p,rt,rb,h,m,x=0,y=0,z=0,axis='y',n=10) {
    const m1=mesh(new THREE.CylinderGeometry(rt,rb,h,n),m,p,x,y,z);
    if(axis==='x') m1.rotation.z=Math.PI/2; if(axis==='z')m1.rotation.x=Math.PI/2; return m1;
  }
  const torso=new THREE.Group();torso.position.y=2.26;rig.add(torso);
  // The tapered inner chassis stays exposed between separate armor plates.
  plate(torso,heavy?1.15:1.03,.83,.55,dark,0,0,0,.13);
  plate(torso,heavy?1.43:1.3,.58,.29,armor,0,.15,.22,.15);
  plate(torso,1.06,.22,.15,steel,0,-.28,.28,.08);
  plate(torso,.54,.18,.11,orange,0,.44,.28,.045);
  [-1,1].forEach(side=>{
    const breast=plate(torso,.49,.34,.17,pale,side*.36,.1,.43,.09);breast.rotation.z=side*.1;
    plate(torso,.29,.38,.14,armor,side*.62,-.12,.03,.06);
    const intake=plate(torso,.33,.3,.09,black,side*.36,.14,.54,.04);
    for(let i=0;i<3;i++)box(intake,.25,.028,.03,steel,0,-.075+i*.075,.058);
    plate(torso,.33,.55,.22,dark,side*.35,.1,-.44,.07);
    cyl(torso,.09,.09,.22,steel,side*.36,.43,-.43);
  });
  cyl(torso,.24,.24,.14,dark,0,-.055,.5,'z',12);
  cyl(torso,.175,.175,.165,orange,0,-.055,.52,'z',12);
  cyl(torso,.105,.105,.18,glow,0,-.055,.54,'z',6);
  box(torso,.06,.2,.03,pale,0,-.055,.64);
  // Vented backpack and lower abdomen.
  plate(torso,.62,.64,.25,armor,0,.06,-.42,.09);
  box(torso,.4,.075,.05,orange,0,.25,-.58);
  cyl(rig,.27,.32,.3,black,0,1.71,0);
  plate(rig,.8,.29,.49,dark,0,1.5,0,.06);
  plate(rig,.36,.3,.12,armor,0,1.45,.3,.05);
  [-1,1].forEach(s=>{const skirt=plate(rig,.32,.37,.15,armor,s*.44,1.37,.15,.055);skirt.rotation.z=s*.14;});
  const head=new THREE.Group();head.position.set(0,2.96,.025);rig.add(head);
  cyl(head,.19,.22,.2,dark,0,-.15,0);
  plate(head,.56,.39,.4,armor,0,.08,0,.085);
  plate(head,.48,.17,.07,black,0,.055,.245,.04);
  plate(head,.39,.055,.027,visor,0,.073,.292,.013);
  plate(head,.18,.18,.16,dark,0,-.085,.23,.04);
  box(head,.08,.22,.075,orange,0,.26,.05);
  box(head,.035,.31,.035,steel,-.29,.35,-.1);
  const arms=[];
  for(const side of [-1,1]) {
    const arm=new THREE.Group();arm.position.set(side*.78,2.58,0);rig.add(arm);arms.push(arm);
    cyl(arm,.22,.22,.32,dark,side*.03,0,0,'x');
    const shoulder=plate(arm,heavy?.66:.58,.4,.64,armor,side*.1,.065,.01,.085); shoulder.rotation.z=side*.1;
    plate(arm,.44,.075,.06,orange,side*.1,.17,.37,.025);
    plate(arm,.28,.39,.29,steel,0,-.36,0,.045);
    cyl(arm,.145,.145,.34,black,0,-.59,0,'x');
    const fore=plate(arm,.39,.47,.38,armor,0,-.88,.045,.08);fore.rotation.x=-.06;
    plate(arm,.23,.27,.065,dark,0,-.87,.285,.045);
    box(arm,.075,.2,.03,orange,side*.075,-.86,.329);
    cyl(arm,.038,.038,.37,steel,side*.2,-.81,-.13);
    plate(arm,.24,.23,.27,dark,0,-1.21,.075,.03);
  }
  const [leftArm,rightArm]=arms;
  const legs=[];
  for(const side of [-1,1]) {
    const leg=new THREE.Group();leg.position.set(side*.285,1.43,0);rig.add(leg);legs.push(leg);
    cyl(leg,.17,.17,.32,black,0,0,0,'x');
    plate(leg,heavy?.46:.37,.55,.38,armor,0,-.26,.025,.075);
    box(leg,.08,.3,.04,orange,side*.12,-.28,.243);
    cyl(leg,.18,.18,.39,dark,0,-.57,.035,'x');
    plate(leg,.3,.24,.12,steel,0,-.59,.29,.065);
    plate(leg,heavy?.51:.43,.52,.44,armor,0,-.88,.025,.075);
    plate(leg,.25,.33,.065,dark,0,-.91,.285,.04);
    cyl(leg,.034,.034,.39,steel,side*.25,-.9,-.11);
    plate(leg,.48,.22,.69,dark,0,-1.285,.165,.04);
    plate(leg,.47,.15,.43,armor,0,-1.23,.3,.05);
  }
  const [leftLeg,rightLeg]=legs;
  const weapon=new THREE.Group();weapon.name=weaponType;rightArm.add(weapon);weapon.position.set(0,-1.18,.23);
  if(weaponType==='hammer') {
    cyl(weapon,.047,.047,1.2,steel,0,.26,.06);
    plate(weapon,.91,.39,.46,dark,0,.92,.06,.065);
    plate(weapon,.21,.47,.5,armor,-.49,.92,.06,.04);
    plate(weapon,.21,.47,.5,armor,.49,.92,.06,.04);
    box(weapon,.62,.055,.04,glow,0,.95,.31);
  } else if(weaponType==='claws') {
    plate(weapon,.34,.2,.31,dark,0,0,.05,.04);
    for(let i=-1;i<=1;i++) {
      const claw=new THREE.Mesh(new THREE.ConeGeometry(.065,.7,4),steel);claw.rotation.x=Math.PI/2;claw.position.set(i*.14,.035,.49);claw.castShadow=true;weapon.add(claw);
    }
  } else if(weaponType==='spear') {
    cyl(weapon,.037,.037,1.85,steel,0,0,.62,'z',8);
    cyl(weapon,0,.085,.51,armor,0,0,1.77,'z',4);
    box(weapon,.06,.065,.55,glow,0,.066,1.53);
    plate(weapon,.31,.1,.11,orange,0,0,1.43,.02);
  } else if(weaponType==='shield') {
    plate(weapon,.88,1.12,.15,dark,0,.34,.36,.17);
    plate(weapon,.75,.99,.14,armor,0,.34,.47,.16);
    plate(weapon,.1,.77,.035,glow,0,.34,.575,.03);
    plate(weapon,.59,.1,.04,orange,0,.37,.575,.025);
  } else {
    cyl(weapon,.043,.043,.36,dark,0,-.04,.08);
    plate(weapon,.41,.085,.15,orange,0,.16,.08,.02);
    const bladeShape=new THREE.Shape();bladeShape.moveTo(-.115,0);bladeShape.lineTo(.115,0);bladeShape.lineTo(.12,.84);bladeShape.lineTo(0,1.17);bladeShape.lineTo(-.11,.84);bladeShape.closePath();
    const geo=new THREE.ExtrudeGeometry(bladeShape,{depth:.075,bevelEnabled:true,bevelSize:.018,bevelThickness:.015,bevelSegments:1,steps:1});
    mesh(geo,steel,weapon,0,.19,.04);
    box(weapon,.035,.81,.015,glow,0,.61,.139);
  }
  // Base stance and animated joints. The caller owns the root transform.
  let walkBlend=0;
  function animate(t, state={}) {
    const moving=state.moving?1:0; walkBlend += (moving-walkBlend)*.18;
    const wave=Math.sin(t*10), stride=wave*.43*walkBlend;
    const a=typeof state.attack==='number'?Math.max(0,Math.min(1,state.attack)):state.attack?1:0;
    const block=state.block?1:0,dash=state.dash?1:0,dead=state.dead?1:0;
    rig.position.y=Math.abs(Math.sin(t*10))*.042*walkBlend + Math.sin(t*2.1)*.011*(1-walkBlend);
    rig.rotation.set(dash*.19,0,dead*1.46);
    if(dead)rig.position.y=-.65;
    torso.rotation.y=-stride*.18;
    head.rotation.y=Math.sin(t*.6)*.04;
    leftLeg.rotation.x=stride;rightLeg.rotation.x=-stride;
    leftArm.rotation.set(-stride*.7-block*.9-dash*.45,0,-.1-block*.22);
    rightArm.rotation.set(stride*.7-.13-a*1.35-block*.65-dash*.65,a*-.4,.1+a*.2);
    weapon.rotation.z=weaponType==='blade'?-.12:0;
    glow.emissiveIntensity=2.1+Math.sin(t*3)*.3+a*1.3;
  }
  animate(0);
  return { group, parts:{torso,head,leftArm,rightArm,leftLeg,rightLeg,weapon}, animate };
}

export function createArena(THREE) {
  const group=new THREE.Group();group.name='FORGE / industrial proving ground';
  const mat=(color,metalness=.5,roughness=.7)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  const floor=mat('#343e3e',.6,.73), dark=mat('#121d22',.72,.65), rim=mat('#56605e',.7,.5), paint=mat('#ae7836',.25,.66);
  const glow=new THREE.MeshStandardMaterial({color:'#ff822e',emissive:'#ff6a17',emissiveIntensity:2,metalness:.3,roughness:.5});
  const cold=new THREE.MeshStandardMaterial({color:'#b9def0',emissive:'#8fcee8',emissiveIntensity:1.4,metalness:.3,roughness:.5});
  function add(g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;group.add(o);return o;}
  function box(w,h,d,m,x,y,z){return add(new THREE.BoxGeometry(w,h,d),m,x,y,z);}
  function ring(radius,width,m,y=.012){const o=add(new THREE.RingGeometry(radius-width/2,radius+width/2,96),m,0,y,0);o.rotation.x=-Math.PI/2;o.castShadow=false;return o;}
  add(new THREE.CylinderGeometry(11,11.2,.52,96),dark,0,-.28,0);
  add(new THREE.CylinderGeometry(10.75,10.75,.12,96),floor,0,-.07,0);
  ring(10.53,.17,rim);ring(9.92,.045,paint);ring(6.25,.036,rim);ring(2.18,.055,paint);
  // Sparse recessed expansion seams are batched into a single line mesh.
  const segments=[];
  for(let x=-10;x<=10;x+=2) {
    const reach=Math.sqrt(10.55*10.55-x*x);
    segments.push(x,.008,-reach,x,.008,reach,-reach,.008,x,reach,.008,x);
  }
  const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));
  group.add(new THREE.LineSegments(lineGeo,new THREE.LineBasicMaterial({color:'#202c2e',transparent:true,opacity:.8})));
  const center=new THREE.Mesh(new THREE.RingGeometry(1.25,1.3,6),paint);center.rotation.x=-Math.PI/2;center.position.y=.016;group.add(center);
  const chevrons=[];
  for(let i=0;i<24;i++) {
    const a=i*Math.PI/12,s=Math.sin(a),c=Math.cos(a);
    const o=box(.07,.018,.48,i%3===0?glow:paint,s*9.48,.016,c*9.48);o.rotation.y=a;
  }
  // Alternating open barriers preserve camera visibility and a readable edge.
  for(let i=0;i<12;i++) {
    const a=i*Math.PI/6,s=Math.sin(a),c=Math.cos(a),x=s*10.7,z=c*10.7;
    const p=box(.45,.87,.47,dark,x,.38,z);p.rotation.y=a;
    const cap=box(.52,.11,.53,rim,x,.85,z);cap.rotation.y=a;
    const lamp=box(.25,.11,.06,i%2?cold:glow,x-s*.27,.62,z-c*.27);lamp.rotation.y=a;
    if(i%2===0) {
      const panel=box(2.82,.42,.24,rim,Math.sin(a+.15)*10.65,.32,Math.cos(a+.15)*10.65);panel.rotation.y=a+.15;
      const stripe=box(2.46,.065,.025,paint,Math.sin(a+.15)*10.51,.41,Math.cos(a+.15)*10.51);stripe.rotation.y=a+.15;
    }
  }
  // Low industrial fragments outside the play field.
  for(let i=0;i<7;i++) {
    const a=.33+i*.87,r=12.7+(i%3)*.8;
    const chunk=box(1.1+(i%2)*.6,.55+(i%3)*.22,.7,dark,Math.sin(a)*r,-.18,Math.cos(a)*r);chunk.rotation.y=a*.8;
    const lid=box(.85+(i%2)*.55,.055,.55,rim,Math.sin(a)*r,.12+(i%3)*.11,Math.cos(a)*r);lid.rotation.y=a*.8;
  }
  return group;
}
