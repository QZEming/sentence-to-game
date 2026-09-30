import * as THREE from "three";

// Small, shared geometries keep these articulated, entirely original characters
// inexpensive even when several camps are visible across the valley.
const BOX = new THREE.BoxGeometry(1, 1, 1);
const BALL = new THREE.SphereGeometry(1, 10, 7);
const ROCK = new THREE.IcosahedronGeometry(1, 0);
const CYLINDER = new THREE.CylinderGeometry(1, 1, 1, 8);
const CONE = new THREE.ConeGeometry(1, 1, 8);
const TORUS = new THREE.TorusGeometry(1, 0.055, 5, 20);
const UP = new THREE.Vector3(0, 1, 0);
const clamp = THREE.MathUtils.clamp;

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.82, ...options });
}

function part(parent, geometry, mat, position, scale, rotation) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function box(parent, mat, p, s, r) {
  return part(parent, BOX, mat, p, s, r);
}
function ball(parent, mat, p, s) {
  return part(parent, BALL, mat, p, s);
}
function joint(parent, x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  parent.add(group);
  return group;
}

function rod(parent, mat, start, end, radius = 0.025) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const delta = to.clone().sub(from);
  const mesh = part(
    parent,
    CYLINDER,
    mat,
    from.add(to).multiplyScalar(0.5).toArray(),
    [radius, delta.length(), radius],
  );
  mesh.quaternion.setFromUnitVectors(UP, delta.normalize());
  return mesh;
}

function polygon(parent, mat, vertices, indices) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return part(parent, geo, mat, [0, 0, 0], [1, 1, 1]);
}

function makeSword(parent, steel, gold, leather) {
  const sword = joint(parent, 0, -0.04, 0);
  // A bevelled, tapered blade catches the sun without a texture.
  polygon(
    sword,
    steel,
    [
      -0.065, -0.13, 0, 0, -0.13, 0.035, 0.065, -0.13, 0, -0.05, -0.82, 0, 0,
      -0.82, 0.025, 0.05, -0.82, 0, 0, -1.04, 0, 0, -0.13, -0.035, 0, -0.82,
      -0.025,
    ],
    [
      0, 3, 4, 0, 4, 1, 1, 4, 5, 1, 5, 2, 3, 6, 4, 4, 6, 5, 0, 7, 8, 0, 8, 3, 7,
      2, 5, 7, 5, 8, 3, 8, 6, 8, 5, 6,
    ],
  );
  box(sword, gold, [0, -0.09, 0], [0.3, 0.065, 0.085]);
  box(sword, leather, [0, 0.075, 0], [0.072, 0.24, 0.07]);
  ball(sword, gold, [0, 0.21, 0], [0.062, 0.045, 0.055]);
  return sword;
}

function makeBow(parent, wood, string) {
  const bow = joint(parent, 0, 0, 0);
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, -0.53, 0),
    new THREE.Vector3(0.47, 0, 0),
    new THREE.Vector3(0, 0.53, 0),
  );
  part(
    bow,
    new THREE.TubeGeometry(curve, 12, 0.033, 5, false),
    wood,
    [0, 0, 0],
    [1, 1, 1],
  );
  rod(bow, string, [0, -0.53, 0], [0, 0.53, 0], 0.009);
  return bow;
}

function makeGlider(parent, teal, cream, wood, cord) {
  const glider = joint(parent, 0, 0, 0);
  const clothTeal = teal.clone();
  const clothCream = cream.clone();
  clothTeal.side = THREE.DoubleSide;
  clothCream.side = THREE.DoubleSide;
  const xs = [-1.85, -0.94, 0, 0.94, 1.85];
  const edges = xs.map((x) => ({
    x,
    y: 2.72 - Math.abs(x) * 0.15,
    front: 0.62 - Math.abs(x) * 0.12,
    back: -0.82 + Math.abs(x) * 0.2,
  }));
  for (let i = 0; i < edges.length - 1; i++) {
    const a = edges[i],
      b = edges[i + 1];
    polygon(
      glider,
      i % 2 ? clothCream : clothTeal,
      [
        a.x,
        a.y,
        a.front,
        b.x,
        b.y,
        b.front,
        b.x,
        b.y - 0.16,
        b.back,
        a.x,
        a.y - 0.16,
        a.back,
      ],
      [0, 1, 2, 0, 2, 3],
    );
  }
  rod(glider, wood, [-1.85, 2.44, 0.4], [1.85, 2.44, 0.4], 0.025);
  rod(glider, wood, [0, 2.73, 0.64], [0, 2.53, -0.83], 0.035);
  for (const side of [-1, 1]) {
    rod(
      glider,
      cord,
      [side * 1.48, 2.43, 0.35],
      [side * 0.4, 2.04, 0.19],
      0.01,
    );
    rod(
      glider,
      cord,
      [side * 1.48, 2.23, -0.54],
      [side * 0.4, 2.04, 0.19],
      0.01,
    );
  }
  glider.visible = false;
  return glider;
}

export function createHero() {
  const group = new THREE.Group();
  const rig = joint(group, 0, 0, 0);
  const teal = material("#247d76");
  const darkTeal = material("#19574f");
  const cream = material("#eee4c6");
  const skin = material("#d9a574");
  const hair = material("#674126");
  const leather = material("#67472e");
  const boot = material("#382f25");
  const pants = material("#334a4a");
  const steel = material("#bdd4d5", {
    metalness: 0.68,
    roughness: 0.28,
    side: THREE.DoubleSide,
  });
  const gold = material("#d4ae57", { metalness: 0.4, roughness: 0.38 });
  const dark = material("#20272a");
  const cord = material("#e5d6b2");

  box(rig, teal, [0, 1.21, 0], [0.59, 0.58, 0.33]);
  box(rig, darkTeal, [0, 0.91, 0], [0.63, 0.2, 0.35]);
  box(rig, leather, [0, 1.0, 0.015], [0.635, 0.09, 0.36]);
  box(rig, gold, [0.075, 1.005, 0.204], [0.115, 0.105, 0.025]);
  box(rig, cream, [0, 1.39, 0.178], [0.15, 0.3, 0.025], [0, 0, 0.16]);
  box(rig, leather, [-0.17, 1.27, 0.19], [0.08, 0.5, 0.035], [0, 0, -0.29]);

  const head = joint(rig, 0, 1.61, 0.015);
  ball(head, skin, [0, 0.045, 0], [0.225, 0.265, 0.207]);
  ball(head, hair, [0, 0.16, -0.045], [0.246, 0.2, 0.213]);
  box(head, hair, [-0.095, 0.19, 0.157], [0.23, 0.13, 0.105], [0.05, 0, -0.2]);
  box(head, hair, [0.14, 0.09, 0.145], [0.08, 0.2, 0.1], [0, 0, 0.1]);
  for (const side of [-1, 1]) {
    ball(head, skin, [side * 0.225, 0.02, 0], [0.055, 0.085, 0.055]);
    box(head, dark, [side * 0.078, 0.04, 0.194], [0.033, 0.052, 0.024]);
  }
  ball(head, skin, [0, -0.01, 0.215], [0.04, 0.045, 0.04]);

  // The cape hangs behind the pack; its separate pivot flutters with speed.
  const cape = joint(rig, 0, 1.48, -0.2);
  const capeMat = darkTeal.clone();
  capeMat.side = THREE.DoubleSide;
  polygon(
    cape,
    capeMat,
    [
      -0.28, 0, 0, 0.28, 0, 0, 0.4, -0.69, -0.12, 0.1, -0.82, -0.14, -0.39,
      -0.72, -0.12,
    ],
    [0, 1, 2, 0, 2, 3, 0, 3, 4],
  );
  box(rig, teal, [0, 1.48, 0.01], [0.68, 0.14, 0.4]);
  box(rig, leather, [0, 1.25, -0.28], [0.42, 0.4, 0.22]);
  part(
    rig,
    CYLINDER,
    cream,
    [0, 1.47, -0.29],
    [0.12, 0.56, 0.12],
    [0, 0, Math.PI / 2],
  );
  box(rig, gold, [0.12, 1.25, -0.4], [0.055, 0.25, 0.025]);

  function arm(side) {
    const shoulder = joint(rig, side * 0.4, 1.43, 0);
    box(shoulder, teal, [0, -0.125, 0], [0.22, 0.29, 0.25]);
    box(shoulder, cream, [0, -0.35, 0], [0.155, 0.26, 0.16]);
    box(shoulder, leather, [0, -0.45, 0.008], [0.175, 0.09, 0.185]);
    ball(shoulder, skin, [0, -0.56, 0.01], [0.092, 0.12, 0.095]);
    return shoulder;
  }
  const rightArm = arm(-1),
    leftArm = arm(1);
  function leg(side) {
    const hip = joint(rig, side * 0.165, 0.85, 0);
    box(hip, pants, [0, -0.19, 0], [0.225, 0.4, 0.235]);
    box(hip, boot, [0, -0.56, 0.015], [0.245, 0.34, 0.27]);
    box(hip, leather, [0, -0.39, 0.015], [0.265, 0.08, 0.29]);
    box(hip, boot, [0, -0.755, 0.092], [0.265, 0.16, 0.42]);
    return hip;
  }
  const leftLeg = leg(1),
    rightLeg = leg(-1);
  const sword = makeSword(rightArm, steel, gold, leather);
  sword.position.set(0, -0.6, 0.015);
  sword.rotation.x = -0.15;
  const axe = joint(rightArm, 0, -0.56, 0.03);
  rod(axe, leather, [0, 0.12, 0], [0, -0.84, 0], 0.037);
  polygon(
    axe,
    steel,
    [
      -0.035, -0.54, 0.02, 0.29, -0.47, 0.02, 0.36, -0.77, 0.02, -0.035, -0.77,
      0.02,
    ],
    [0, 1, 2, 0, 2, 3],
  );
  axe.visible = false;

  const shield = joint(leftArm, 0.09, -0.39, 0.04);
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(-0.25, 0.29);
  shieldShape.lineTo(0.25, 0.29);
  shieldShape.lineTo(0.25, -0.11);
  shieldShape.lineTo(0, -0.39);
  shieldShape.lineTo(-0.25, -0.11);
  shieldShape.closePath();
  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.055,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.02,
  });
  part(shield, shieldGeo, leather, [0, 0, 0], [1, 1, 1]);
  box(shield, gold, [0, 0.015, 0.095], [0.043, 0.47, 0.025]);
  box(shield, gold, [0, 0.14, 0.095], [0.39, 0.04, 0.025]);
  ball(shield, steel, [0, 0.05, 0.1], [0.075, 0.075, 0.035]);
  shield.rotation.y = 0.32;
  const bow = makeBow(rig, leather, cord);
  bow.position.set(-0.25, 1.24, -0.44);
  bow.rotation.z = -0.28;
  const glider = makeGlider(rig, teal, cream, leather, cord);

  let stride = 0;
  return {
    group,
    update(dt, player, time = 0) {
      const motion = player.motion || "ground";
      const speed = Math.max(0, Number(player.speed) || 0);
      const walk = clamp(speed / 5, 0, 1.2);
      stride += dt * (4 + speed * 1.65);
      const wave = Math.sin(stride),
        waveBack = Math.sin(stride + Math.PI);
      const moving = walk > 0.04;
      rig.position.y =
        motion === "ground"
          ? Math.abs(wave) * walk * 0.055
          : Math.sin(time * 2.5) * 0.017;
      rig.rotation.set(0, 0, 0);
      head.rotation.y = Math.sin(time * 0.7) * (moving ? 0.025 : 0.08);
      rightLeg.rotation.set(wave * walk * 0.72, 0, 0);
      leftLeg.rotation.set(waveBack * walk * 0.72, 0, 0);
      rightArm.rotation.set(-0.12 + waveBack * walk * 0.5, 0, 0.08);
      leftArm.rotation.set(-0.12 + wave * walk * 0.5, 0, -0.08);
      cape.rotation.set(
        -0.05 - walk * 0.34 + Math.sin(time * 5) * 0.055,
        Math.sin(time * 3.6) * 0.045,
        0,
      );
      sword.visible = !player.weapon || player.weapon === "sword";
      axe.visible = player.weapon === "axe";
      shield.visible = true;
      glider.visible = motion === "glide";
      glider.rotation.set(
        Math.sin(time * 2.4) * 0.025,
        0,
        Math.sin(time * 1.8) * 0.035,
      );
      bow.position.set(-0.25, 1.24, -0.44);
      bow.rotation.set(0, 0, -0.28);

      if (motion === "glide") {
        rightArm.rotation.set(Math.PI, 0, -0.06);
        leftArm.rotation.set(Math.PI, 0, 0.06);
        rightLeg.rotation.x = 0.23 + Math.sin(time * 2) * 0.08;
        leftLeg.rotation.x = -0.08 + Math.sin(time * 2 + 1) * 0.08;
        cape.rotation.x = -0.6;
        sword.visible = axe.visible = shield.visible = false;
      } else if (motion === "climb") {
        rightArm.rotation.set(-2.65 + wave * 0.4, 0, -0.14);
        leftArm.rotation.set(-2.65 + waveBack * 0.4, 0, 0.14);
        rightLeg.rotation.x = -0.4 + wave * 0.4;
        leftLeg.rotation.x = -0.4 + waveBack * 0.4;
        rig.position.z = 0.06;
        sword.visible = axe.visible = shield.visible = false;
      } else if (motion === "swim") {
        rig.rotation.x = -0.8;
        rig.position.y = -0.34;
        rightArm.rotation.set(-1.7 + wave * 0.85, 0, 0.4);
        leftArm.rotation.set(-1.7 + waveBack * 0.85, 0, -0.4);
        rightLeg.rotation.x = wave * 0.28;
        leftLeg.rotation.x = waveBack * 0.28;
        sword.visible = axe.visible = shield.visible = false;
      } else if (motion === "ride" || player.mounted) {
        rightLeg.rotation.set(-0.82, 0, -0.36);
        leftLeg.rotation.set(-0.82, 0, 0.36);
        rightArm.rotation.x = leftArm.rotation.x = -0.87;
        rig.position.y = Math.abs(wave) * walk * 0.035;
        sword.visible = axe.visible = false;
      } else if (motion === "air") {
        rightLeg.rotation.x = 0.25;
        leftLeg.rotation.x = -0.46;
        rightArm.rotation.z = 0.3;
        leftArm.rotation.z = -0.3;
      }
      if (motion !== "climb") rig.position.z = 0;

      if (
        player.attackTimer > 0 &&
        !["climb", "swim", "glide"].includes(motion)
      ) {
        const phase = 1 - clamp(player.attackTimer / 0.42, 0, 1);
        rightArm.rotation.set(-2.7 + phase * 4.0, -0.25 + phase * 0.5, -0.17);
        rig.rotation.y = Math.sin(phase * Math.PI) * 0.38;
        leftArm.rotation.x = -0.48;
      }
      if (player.block) {
        leftArm.rotation.set(-1.22, -0.55, 0.28);
        rightArm.rotation.x = -0.6;
        shield.rotation.y = -0.25;
      } else shield.rotation.y = 0.32;
      if ((player.bowTimer || player.shootTimer || 0) > 0) {
        bow.position.set(0.31, 1.39, 0.72);
        bow.rotation.set(0, -Math.PI / 2, 0.08);
        leftArm.rotation.set(-1.58, 0, 0);
        rightArm.rotation.set(-1.58, -1.05, 0.1);
        sword.visible = axe.visible = shield.visible = false;
      }
      if (player.dodgeTimer > 0 && motion === "ground") {
        const angle = (1 - clamp(player.dodgeTimer / 0.32, 0, 1)) * Math.PI * 2;
        // Roll around the hips while keeping the actor's world-space feet anchor.
        rig.rotation.x = angle;
        rig.position.y = 0.9 - Math.cos(angle) * 0.9;
        rig.position.z = -Math.sin(angle) * 0.9;
        rightArm.rotation.x = leftArm.rotation.x = -1.25;
        rightLeg.rotation.x = -0.45;
        leftLeg.rotation.x = -0.55;
      }
      // Blinking equipment and clothes communicate the invulnerability window.
      const blink = player.invulnerable > 0 && Math.floor(time * 14) % 2 === 0;
      teal.emissive.set(blink ? "#8b4a29" : "#000000");
      skin.emissive.set(blink ? "#5f2220" : "#000000");
      const armor = player.armor || "traveler";
      teal.color.set(
        {
          traveler: "#247d76",
          cloak: "#a66842",
          desert: "#afac72",
          knight: "#70868e",
        }[armor] || "#247d76",
      );
      teal.metalness = armor === "knight" ? 0.32 : 0;
    },
  };
}

function healthBar(parent, height, width = 1.15) {
  const holder = joint(parent, 0, height, 0);
  const background = new THREE.Sprite(
    new THREE.SpriteMaterial({
      color: "#152521",
      depthTest: false,
      transparent: true,
      opacity: 0.78,
    }),
  );
  background.scale.set(width + 0.08, 0.125, 1);
  background.renderOrder = 15;
  holder.add(background);
  const foreground = new THREE.Sprite(
    new THREE.SpriteMaterial({ color: "#ef8267", depthTest: false }),
  );
  // Keep both sprites centred so parent yaw cannot skew the billboard fill.
  foreground.center.set(0.5, 0.5);
  foreground.scale.set(width, 0.065, 1);
  foreground.renderOrder = 16;
  holder.add(foreground);
  return (hp, maxHp, always = false) => {
    const ratio = clamp(hp / Math.max(1, maxHp), 0, 1);
    holder.visible = hp > 0 && (always || ratio < 0.999);
    foreground.scale.x = Math.max(0.001, width * ratio);
  };
}

function createSlime() {
  const group = new THREE.Group();
  const body = joint(group, 0, 0, 0);
  const jelly = material("#85af5d", { roughness: 0.3, metalness: 0.06 });
  const light = material("#c9e691", { roughness: 0.4 });
  const black = material("#263f32");
  const core = ball(body, jelly, [0, 0.49, 0], [0.65, 0.49, 0.61]);
  ball(body, light, [-0.2, 0.68, 0.35], [0.11, 0.11, 0.05]);
  for (const side of [-1, 1])
    ball(body, black, [side * 0.2, 0.49, 0.53], [0.065, 0.092, 0.04]);
  box(body, black, [0, 0.3, 0.572], [0.11, 0.035, 0.025]);
  const updateBar = healthBar(group, 1.18, 1.0);
  return {
    group,
    update(dt, enemy, time = 0) {
      if (!(enemy.frozen > 0) && enemy.motion !== "frozen") {
        const pulse = Math.sin(time * 5 + (enemy.x || 0));
        const active =
          enemy.speed > 0.05 ||
          ["walk", "chase", "attack", "move"].includes(enemy.motion);
        body.scale.set(1 + pulse * 0.08, 1 - pulse * 0.11, 1 + pulse * 0.08);
        body.position.y = active ? Math.max(0, Math.sin(time * 7)) * 0.22 : 0;
      }
      core.material.emissive.set(enemy.flash > 0 ? "#d97149" : "#000000");
      updateBar(enemy.hp, enemy.maxHp);
    },
  };
}

function createRaider(archer) {
  const group = new THREE.Group();
  const rig = joint(group, 0, 0, 0);
  const coat = material(archer ? "#70648d" : "#8d4f43");
  const skin = material("#8b9870");
  const leather = material("#3f4035");
  const bone = material("#dfcfaa");
  const iron = material("#86908a", { metalness: 0.35, roughness: 0.5 });
  const eye = material("#f1c87c", {
    emissive: "#bf6227",
    emissiveIntensity: 0.5,
  });
  box(rig, coat, [0, 1.1, 0], [0.67, 0.73, 0.39]);
  box(rig, leather, [0, 0.83, 0], [0.7, 0.1, 0.41]);
  ball(rig, skin, [0, 1.66, 0.04], [0.32, 0.33, 0.25]);
  ball(rig, coat, [0, 1.86, -0.02], [0.35, 0.17, 0.27]);
  box(rig, leather, [0, 1.58, 0.236], [0.5, 0.2, 0.07]);
  for (const side of [-1, 1]) {
    box(
      rig,
      eye,
      [side * 0.13, 1.72, 0.27],
      [0.095, 0.045, 0.035],
      [0, 0, side * 0.19],
    );
    part(
      rig,
      CONE,
      bone,
      [side * 0.3, 1.91, 0],
      [0.09, 0.3, 0.09],
      [0, 0, -side * 0.4],
    );
  }
  const arms = [],
    legs = [];
  for (const side of [-1, 1]) {
    const arm = joint(rig, side * 0.44, 1.4, 0);
    box(arm, skin, [0, -0.31, 0], [0.22, 0.62, 0.22]);
    box(arm, coat, [0, -0.13, 0], [0.3, 0.28, 0.31]);
    arms.push(arm);
    const leg = joint(rig, side * 0.2, 0.75, 0);
    box(leg, leather, [0, -0.3, 0], [0.27, 0.62, 0.28]);
    box(leg, leather, [0, -0.65, 0.09], [0.31, 0.18, 0.43]);
    legs.push(leg);
  }
  if (archer) {
    const bow = makeBow(arms[1], leather, bone);
    bow.position.set(0, -0.45, 0.14);
    bow.rotation.y = Math.PI / 2;
    part(
      rig,
      CYLINDER,
      leather,
      [-0.26, 1.31, -0.29],
      [0.12, 0.53, 0.12],
      [0, 0, -0.28],
    );
  } else {
    rod(arms[0], leather, [0, -0.48, 0], [0, -1.3, 0], 0.055);
    part(arms[0], ROCK, iron, [0, -1.18, 0], [0.22, 0.28, 0.22]);
  }
  const updateBar = healthBar(group, 2.34);
  let stride = 0;
  return {
    group,
    update(dt, enemy, time = 0) {
      if (!(enemy.frozen > 0) && enemy.motion !== "frozen") {
        const moving =
          enemy.speed === undefined
            ? [
                "walk",
                "chase",
                "move",
                "patrol",
                "approach",
                "return",
              ].includes(enemy.motion)
            : enemy.speed > 0.05;
        stride += dt * (moving ? 8 : 2);
        const walk = moving ? 0.58 : 0.04;
        rig.position.y = moving
          ? Math.abs(Math.sin(stride)) * 0.055
          : Math.sin(time * 2) * 0.015;
        legs[0].rotation.x = Math.sin(stride) * walk;
        legs[1].rotation.x = -Math.sin(stride) * walk;
        arms[0].rotation.set(-Math.sin(stride) * walk * 0.6, 0, 0.1);
        arms[1].rotation.set(Math.sin(stride) * walk * 0.6, 0, -0.1);
        if (enemy.windup > 0 || enemy.motion === "attack") {
          if (archer) {
            arms[1].rotation.x = -1.55;
            arms[0].rotation.set(-1.55, -0.9, 0);
          } else
            arms[0].rotation.x =
              -2.5 + (1 - clamp((enemy.windup || 0) / 0.65, 0, 1)) * 3.4;
        }
      }
      coat.emissive.set(enemy.flash > 0 ? "#d68159" : "#000000");
      skin.emissive.set(enemy.flash > 0 ? "#cf7254" : "#000000");
      updateBar(enemy.hp, enemy.maxHp);
    },
  };
}

function createGuardian() {
  const group = new THREE.Group();
  const rig = joint(group, 0, 0, 0);
  const stone = material("#3e5152", { roughness: 0.9 });
  const edge = material("#63797a", { roughness: 0.7, metalness: 0.15 });
  const moss = material("#668363");
  const light = material("#b5fae4", {
    emissive: "#43d8b2",
    emissiveIntensity: 1.3,
  });
  const dark = material("#172c2a");
  part(rig, ROCK, stone, [0, 2.83, 0], [1.13, 1.18, 0.68]);
  box(rig, edge, [0, 3.12, 0.43], [1.41, 0.65, 0.27]);
  part(rig, ROCK, light, [0, 2.95, 0.66], [0.3, 0.42, 0.19]);
  const halo = part(rig, TORUS, edge, [0, 2.95, 0.63], [0.55, 0.55, 0.55]);
  box(rig, stone, [0, 4.02, 0], [0.96, 0.72, 0.73]);
  box(rig, dark, [0, 4.01, 0.385], [0.73, 0.18, 0.05]);
  box(rig, light, [0, 4.04, 0.42], [0.57, 0.055, 0.05]);
  box(rig, moss, [-0.17, 4.43, -0.03], [1.14, 0.13, 0.84]);
  box(rig, edge, [-0.32, 4.61, -0.08], [0.21, 0.32, 0.24], [0, 0, 0.17]);
  box(rig, edge, [0.34, 4.55, -0.12], [0.26, 0.3, 0.28], [0, 0, -0.19]);
  const legs = [],
    arms = [];
  for (const side of [-1, 1]) {
    const leg = joint(rig, side * 0.59, 1.94, 0);
    part(leg, ROCK, stone, [0, -0.6, 0], [0.44, 0.93, 0.44]);
    box(leg, edge, [0, -1.08, 0.07], [0.6, 0.52, 0.63]);
    box(leg, stone, [0, -1.7, 0.16], [0.73, 0.42, 0.97]);
    box(leg, light, [0, -0.92, 0.405], [0.27, 0.045, 0.03]);
    legs.push(leg);
    const arm = joint(rig, side * 1.2, 3.39, 0);
    part(arm, ROCK, edge, [0, -0.13, 0], [0.66, 0.59, 0.65]);
    box(arm, moss, [0, 0.3, 0.015], [0.86, 0.1, 0.71], [0, 0, side * -0.13]);
    part(arm, ROCK, stone, [side * 0.13, -0.89, 0], [0.45, 0.7, 0.45]);
    box(arm, edge, [side * 0.16, -1.41, 0.03], [0.65, 0.57, 0.66]);
    box(arm, light, [side * 0.16, -1.27, 0.37], [0.39, 0.06, 0.025]);
    arms.push(arm);
  }
  const updateBar = healthBar(group, 5.1, 2.8);
  let stride = 0;
  return {
    group,
    update(dt, enemy, time = 0) {
      const awake =
        enemy.motion !== "dormant" &&
        enemy.motion !== "sleep" &&
        enemy.motion !== "inactive";
      if (!(enemy.frozen > 0) && enemy.motion !== "frozen") {
        const moving =
          enemy.speed === undefined
            ? ["walk", "chase", "move", "approach", "patrol"].includes(
                enemy.motion,
              )
            : enemy.speed > 0.05;
        stride += dt * (moving ? 4 : 1);
        rig.position.y = Math.abs(Math.sin(stride)) * (moving ? 0.07 : 0.01);
        legs[0].rotation.x = Math.sin(stride) * (moving ? 0.28 : 0.025);
        legs[1].rotation.x = -legs[0].rotation.x;
        arms[0].rotation.x = -legs[0].rotation.x * 0.7;
        arms[1].rotation.x = legs[0].rotation.x * 0.7;
        if (enemy.windup > 0 || enemy.motion === "attack") {
          const strike = 1 - clamp((enemy.windup || 0) / 1.05, 0, 1);
          arms[0].rotation.x = arms[1].rotation.x = -2.45 + strike * 3.0;
        }
        halo.rotation.z = time * (awake ? 0.8 : 0.07);
      }
      light.emissiveIntensity = awake ? 1 + Math.sin(time * 3) * 0.22 : 0.14;
      stone.emissive.set(enemy.flash > 0 ? "#a46e4b" : "#000000");
      edge.emissive.set(enemy.flash > 0 ? "#97654d" : "#000000");
      updateBar(enemy.hp, enemy.maxHp, awake);
    },
  };
}

export function createEnemy(type = "slime") {
  if (type === "guardian") return createGuardian();
  if (type === "raider" || type === "archer")
    return createRaider(type === "archer");
  return createSlime();
}

export function createHorse() {
  const group = new THREE.Group();
  const rig = joint(group, 0, 0, 0);
  const chestnut = material("#9d6240");
  const light = material("#bc8253");
  const maneMat = material("#392e25");
  const cream = material("#e6d1ad");
  const leather = material("#574434");
  const metal = material("#baa97c", { metalness: 0.5 });
  const black = material("#171f1d");
  ball(rig, chestnut, [0, 1.3, 0], [0.47, 0.48, 0.85]);
  ball(rig, chestnut, [0, 1.57, 0.58], [0.32, 0.55, 0.34]);
  const head = joint(rig, 0, 2.0, 0.7);
  ball(head, light, [0, 0, 0.13], [0.245, 0.33, 0.39]);
  ball(head, chestnut, [0, -0.16, 0.4], [0.23, 0.18, 0.29]);
  box(head, cream, [0, 0.04, 0.46], [0.095, 0.33, 0.035], [-0.25, 0, 0]);
  for (const side of [-1, 1]) {
    part(
      head,
      CONE,
      chestnut,
      [side * 0.15, 0.34, 0.02],
      [0.075, 0.29, 0.075],
      [0, 0, side * -0.18],
    );
    ball(head, black, [side * 0.231, 0.05, 0.2], [0.025, 0.045, 0.045]);
  }
  box(head, leather, [0, -0.13, 0.44], [0.475, 0.063, 0.41], [-0.16, 0, 0]);
  box(rig, maneMat, [0, 1.82, 0.42], [0.15, 0.59, 0.29], [0.3, 0, 0]);
  const tail = joint(rig, 0, 1.47, -0.78);
  part(
    tail,
    CONE,
    maneMat,
    [0, -0.42, -0.17],
    [0.17, 0.87, 0.17],
    [-0.4, 0, Math.PI],
  );
  box(rig, leather, [0, 1.73, -0.09], [0.67, 0.13, 0.59]);
  box(rig, leather, [0, 1.8, 0.2], [0.57, 0.18, 0.13]);
  box(rig, leather, [0, 1.82, -0.4], [0.56, 0.22, 0.13]);
  const legs = [];
  for (const z of [-0.54, 0.51])
    for (const side of [-1, 1]) {
      const leg = joint(rig, side * 0.29, 1.13, z);
      part(leg, CYLINDER, chestnut, [0, -0.34, 0], [0.12, 0.64, 0.12]);
      part(leg, CYLINDER, cream, [0, -0.79, 0.005], [0.083, 0.32, 0.083]);
      box(leg, maneMat, [0, -1.035, 0.035], [0.18, 0.15, 0.23]);
      legs.push(leg);
    }
  for (const side of [-1, 1]) {
    rod(
      rig,
      leather,
      [side * 0.24, 1.7, -0.07],
      [side * 0.5, 1.05, -0.06],
      0.02,
    );
    part(rig, TORUS, metal, [side * 0.5, 1.03, -0.06], [0.11, 0.16, 0.11]);
    rod(
      rig,
      leather,
      [side * 0.22, 1.88, 1.03],
      [side * 0.26, 1.72, 0.18],
      0.012,
    );
  }
  let stride = 0;
  return {
    group,
    update(dt, { speed = 0, time = 0 } = {}) {
      const amount = clamp(Math.abs(speed) / 8, 0, 1);
      stride += dt * (2 + Math.abs(speed) * 1.4);
      legs.forEach((leg, i) => {
        leg.rotation.x =
          Math.sin(stride + (i === 0 || i === 3 ? 0 : Math.PI)) * amount * 0.68;
      });
      rig.position.y = Math.abs(Math.sin(stride)) * amount * 0.065;
      rig.rotation.z = Math.sin(stride) * amount * 0.025;
      head.rotation.x =
        Math.sin(time * 2.1) * 0.035 + Math.sin(stride) * amount * 0.045;
      tail.rotation.z = Math.sin(time * 3.7) * 0.13;
      tail.rotation.x = -amount * 0.3;
    },
  };
}

export function createProjectile(type = "arrow") {
  const group = new THREE.Group();
  if (type.includes("arrow")) {
    const wood = material("#b99258");
    const steel = material("#d1e0dc", { metalness: 0.35, roughness: 0.45 });
    rod(group, wood, [0, 0, -0.36], [0, 0, 0.28], 0.013);
    part(
      group,
      CONE,
      steel,
      [0, 0, 0.35],
      [0.045, 0.16, 0.045],
      [Math.PI / 2, 0, 0],
    );
    box(group, steel, [0, 0, -0.3], [0.13, 0.01, 0.14]);
    box(group, steel, [0, 0, -0.3], [0.01, 0.13, 0.14]);
  } else {
    const glow = material(type.includes("bomb") ? "#67ddda" : "#efbd77", {
      emissive: type.includes("bomb") ? "#149dba" : "#e78c37",
      emissiveIntensity: 0.8,
      metalness: 0.3,
    });
    ball(group, glow, [0, 0, 0], [0.18, 0.18, 0.18]);
    if (type.includes("bomb"))
      part(
        group,
        TORUS,
        material("#e9e7b3"),
        [0, 0, 0],
        [0.2, 0.2, 0.2],
        [Math.PI / 2, 0, 0],
      );
  }
  return group;
}
