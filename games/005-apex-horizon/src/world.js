import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { createTrack, sampleTrack } from "./track.js";

const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** All drivable surfaces are sampled from the same centreline as the physics. */
export function createWorld(scene, trackId = "coast", weather = "clear") {
  const track = createTrack(trackId);
  const city = track.id === "city";
  const alpine = track.id === "alpine";
  const wet = weather === "wet";
  const root = new THREE.Group();
  root.name = `world-${track.id}`;
  scene.add(root);
  const owned = new Set();
  const keep = (item) => {
    owned.add(item);
    return item;
  };
  const palette = new Map();
  const batches = new Map();
  const turbines = [];
  const pickups = new Map();
  const countdownLights = [];
  let time = 0;
  let lowQuality = false;
  let disposed = false;
  let seed = alpine ? 4751 : city ? 1861 : 9057;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const range = (a, b) => mix(a, b, random());
  const half = track.width / 2;
  const railOffset = half + track.verge;
  const heights = track.samples.map((point) => point.y);
  const minY = Math.min(...heights);
  const maxY = Math.max(...heights);
  const baseY = minY - (alpine ? 36 : city ? 5 : 12);

  function standard(color, roughness = 0.8, metalness = 0, emissive = 0) {
    const key = `${color}/${roughness}/${metalness}/${emissive}`;
    if (!palette.has(key))
      palette.set(
        key,
        keep(
          new THREE.MeshStandardMaterial({
            color,
            roughness,
            metalness,
            emissive,
            emissiveIntensity: emissive ? 1.1 : 0,
          }),
        ),
      );
    return palette.get(key);
  }
  function unlit(color, options = {}) {
    return keep(new THREE.MeshBasicMaterial({ color, ...options }));
  }
  function mesh(geometry, material, parent = root) {
    const result = new THREE.Mesh(keep(geometry), material);
    parent.add(result);
    return result;
  }
  function add(geometry, material, castShadow = true) {
    // Procedural leaves and polyhedra may be non-indexed; a batch needs one format.
    if (!geometry.index) {
      geometry.setIndex(
        Array.from({ length: geometry.attributes.position.count }, (_, i) => i),
      );
    }
    const key = `${material.uuid}/${castShadow}`;
    if (!batches.has(key))
      batches.set(key, { material, castShadow, geometries: [] });
    batches.get(key).geometries.push(geometry);
  }
  function transformed(geometry, x, y, z, rx = 0, ry = 0, rz = 0) {
    geometry.rotateX(rx);
    geometry.rotateY(ry);
    geometry.rotateZ(rz);
    geometry.translate(x, y, z);
    return geometry;
  }
  function box(x, y, z, w, h, d, material, ry = 0, castShadow = true) {
    add(
      transformed(new THREE.BoxGeometry(w, h, d), x, y, z, 0, ry),
      material,
      castShadow,
    );
  }
  function cylinder(
    x,
    y,
    z,
    top,
    bottom,
    height,
    material,
    segments = 8,
    ry = 0,
    rz = 0,
    castShadow = true,
  ) {
    add(
      transformed(
        new THREE.CylinderGeometry(top, bottom, height, segments),
        x,
        y,
        z,
        0,
        ry,
        rz,
      ),
      material,
      castShadow,
    );
  }
  function ellipsoid(x, y, z, sx, sy, sz, material, detail = 1) {
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    geometry.scale(sx, sy, sz);
    add(transformed(geometry, x, y, z), material);
  }
  function between(a, b, radius, material, segments = 6) {
    const direction = new THREE.Vector3().subVectors(b, a);
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      direction.length(),
      segments,
    );
    geometry.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      ),
    );
    geometry.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    add(geometry, material);
  }
  function flush() {
    for (const { material, castShadow, geometries } of batches.values()) {
      if (!geometries.length) continue;
      const geometry = mergeGeometries(geometries, false);
      geometries.forEach((item) => item.dispose());
      if (!geometry) continue;
      const object = mesh(geometry, material);
      object.castShadow = castShadow;
      object.receiveShadow = true;
    }
    batches.clear();
  }
  function texture(width, height, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d"), width, height);
    const result = keep(new THREE.CanvasTexture(canvas));
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }
  function sign(
    text,
    subtitle,
    accent = city ? "#88f6ef" : "#f2eecc",
    background = "#152a31",
  ) {
    return texture(1024, 256, (ctx, width, height) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, 12, height);
      ctx.fillRect(width - 92, 45, 56, 8);
      ctx.fillRect(width - 68, 61, 32, 8);
      ctx.fillStyle = "#fffdf0";
      ctx.font = "900 114px system-ui, sans-serif";
      ctx.fillText(text, 42, 136);
      ctx.fillStyle = accent;
      ctx.font = "600 29px system-ui, sans-serif";
      ctx.fillText(subtitle, 48, 206);
    });
  }
  function placard(map, x, y, z, w, h, yaw = 0) {
    const material = keep(
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.8,
        side: THREE.DoubleSide,
        emissive: 0xffffff,
        emissiveMap: map,
        emissiveIntensity: city ? 0.72 : 0.08,
      }),
    );
    const object = mesh(new THREE.PlaneGeometry(w, h), material);
    object.position.set(x, y, z);
    object.rotation.y = yaw;
    return object;
  }
  function ribbon(left, right, material, options = {}) {
    const count = Math.max(
      260,
      Math.ceil(track.length / (options.spacing || 3)),
    );
    const positions = [],
      uvs = [],
      indices = [],
      colors = [];
    for (let i = 0; i <= count; i++) {
      const s = (i / count) * track.length;
      const point = sampleTrack(track, s);
      for (const offset of [left, right]) {
        const lift =
          typeof options.height === "function"
            ? options.height(offset, s, point)
            : options.height || 0;
        positions.push(
          point.x + point.nx * offset,
          point.y + lift,
          point.z + point.nz * offset,
        );
        uvs.push(
          (offset - left) / (right - left),
          s / (options.textureLength || 14),
        );
        if (options.color) {
          const c = options.color(offset, s, point);
          colors.push(c.r, c.g, c.b);
        }
      }
      if (i < count) {
        const n = i * 2;
        indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    if (colors.length)
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const object = mesh(geometry, material);
    object.receiveShadow = true;
    return object;
  }
  function strip(s0, s1, left, right, material, lift = 0.045) {
    const steps = Math.max(1, Math.ceil((s1 - s0) / 2));
    const vertices = [],
      indices = [],
      uvs = [];
    for (let i = 0; i <= steps; i++) {
      const p = sampleTrack(track, mix(s0, s1, i / steps));
      vertices.push(
        p.x + p.nx * left,
        p.y + lift,
        p.z + p.nz * left,
        p.x + p.nx * right,
        p.y + lift,
        p.z + p.nz * right,
      );
      uvs.push(0, i / steps, 1, i / steps);
      if (i < steps) {
        const n = i * 2;
        indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    add(geometry, material, false);
  }

  const skyHorizon = new THREE.Color(
    city ? 0x253453 : alpine ? 0xb7d5df : wet ? 0xb7c1c6 : 0xf6c7a1,
  );
  const skyTop = new THREE.Color(
    city ? 0x060b24 : alpine ? 0x548fb7 : wet ? 0x637f94 : 0x7d9fbd,
  );
  scene.background = skyHorizon;
  const fog = new THREE.Fog(
    skyHorizon,
    city ? 260 : alpine ? 330 : 380,
    city ? 1250 : 1600,
  );
  scene.fog = fog;
  const sunDirection = new THREE.Vector3(
    -0.6,
    city ? 0.35 : 0.19,
    -0.8,
  ).normalize();
  const skyMaterial = keep(
    new THREE.ShaderMaterial({
      uniforms: {
        top: { value: skyTop },
        bottom: { value: skyHorizon },
        sunDir: { value: sunDirection },
        sunColor: {
          value: new THREE.Color(
            city ? 0xaacbff : alpine ? 0xfff4d1 : 0xffdba1,
          ),
        },
        night: { value: city ? 1 : 0 },
        cloudiness: { value: wet ? 0.8 : alpine ? 0.28 : 0.18 },
      },
      vertexShader:
        "varying vec3 vP; void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec3 vP;uniform vec3 top;uniform vec3 bottom;uniform vec3 sunDir;uniform vec3 sunColor;uniform float night;uniform float cloudiness;
      void main(){vec3 d=normalize(vP);float h=smoothstep(-.07,.82,d.y);vec3 c=mix(bottom,top,h);
      float glow=pow(max(dot(d,sunDir),0.),12.);float disc=smoothstep(.99955,.99982,dot(d,sunDir));
      c+=sunColor*(glow*.2+disc*1.9)*(1.-cloudiness*.62);
      float cloud=sin(d.x*13.+sin(d.z*7.))*sin(d.z*23.-d.y*14.);cloud=smoothstep(.25,.9,cloud)*smoothstep(.08,.3,d.y)*(1.-smoothstep(.35,.8,d.y));
      c=mix(c,vec3(.87,.9,.91),cloud*cloudiness*(1.-night));
      float star=fract(sin(dot(floor(d.xz*470./max(d.y,.08)),vec2(12.9898,78.233)))*43758.5453);c+=step(.9978,star)*night*.5*smoothstep(.15,.5,d.y);
      gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    }),
  );
  const sky = mesh(new THREE.SphereGeometry(1850, 24, 16), skyMaterial);
  sky.position.y = 90;
  sky.renderOrder = -100;
  const hemi = new THREE.HemisphereLight(
    city ? 0x9facff : 0xd9eeff,
    city ? 0x304154 : alpine ? 0x708366 : 0xbba48f,
    city ? 2.4 : 2.5,
  );
  root.add(hemi);
  const sun = new THREE.DirectionalLight(
    city ? 0xb8caff : wet ? 0xdfecff : 0xffe0bc,
    city ? 1.25 : wet ? 2.2 : 3.15,
  );
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -70;
  sun.shadow.camera.right = sun.shadow.camera.top = 70;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 320;
  sun.shadow.normalBias = 0.055;
  sun.shadow.bias = -0.00015;
  root.add(sun, sun.target);
  const initial = sampleTrack(track, 0);
  sun.position.set(initial.x - 75, initial.y + 100, initial.z + 55);
  sun.target.position.set(initial.x, initial.y, initial.z);

  const asphaltMap = texture(256, 256, (ctx, width, height) => {
    ctx.fillStyle = "#777777";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 16000; i++) {
      const v = Math.floor(range(80, 165));
      ctx.fillStyle = `rgba(${v},${v},${v},${range(0.1, 0.45)})`;
      ctx.fillRect(random() * width, random() * height, range(0.5, 1.5), 0.8);
    }
    ctx.fillStyle = "rgba(10,10,10,.055)";
    for (let i = 0; i < 11; i++)
      ctx.fillRect((i * width) / 11 + random() * 3, 0, 1, height);
  });
  asphaltMap.wrapS = asphaltMap.wrapT = THREE.RepeatWrapping;
  const asphalt = keep(
    new THREE.MeshPhysicalMaterial({
      color: city ? 0x344253 : 0x555b5d,
      map: asphaltMap,
      roughness: wet ? 0.23 : city ? 0.35 : 0.84,
      metalness: wet || city ? 0.12 : 0,
      clearcoat: wet ? 0.65 : city ? 0.28 : 0,
      clearcoatRoughness: 0.24,
    }),
  );
  ribbon(-half, half, asphalt, { height: 0.015, textureLength: 11 });
  const shoulder = standard(
    city ? 0x465468 : alpine ? 0x8d938a : 0xc4b692,
    0.96,
  );
  ribbon(-railOffset - 0.4, -half, shoulder, { height: -0.025 });
  ribbon(half, railOffset + 0.4, shoulder, { height: -0.025 });
  const white = standard(0xe8e4cf, 0.86);
  const curbRed = standard(city ? 0x14a9b6 : 0xa34236, 0.7);
  const rail = standard(city ? 0x44586f : 0x879597, 0.44, 0.55);
  const dark = standard(0x202b32, 0.7, 0.3);
  const accent = unlit(city ? 0x73fff1 : 0xf1c66d);
  const paint = city ? unlit(0x9adbde) : white;
  ribbon(-half + 0.28, -half + 0.4, paint, { height: 0.037 });
  ribbon(half - 0.4, half - 0.28, paint, { height: 0.037 });
  for (let s = 0; s < track.length; s += 8)
    strip(s, Math.min(s + 3.2, track.length), -0.085, 0.085, white);
  for (let s = 0, index = 0; s < track.length; s += 3.2, index++) {
    const material = index % 2 ? white : curbRed;
    strip(
      s,
      Math.min(s + 3.2, track.length),
      -half - 0.22,
      -half + 0.15,
      material,
      0.052,
    );
    strip(
      s,
      Math.min(s + 3.2, track.length),
      half - 0.15,
      half + 0.22,
      material,
      0.052,
    );
  }
  // The thin vertical ribbon is the actual collision boundary, with visible support posts.
  for (const side of [-1, 1]) {
    const points = [],
      normals = [],
      uvs = [],
      indices = [];
    const count = Math.ceil(track.length / 3);
    for (let i = 0; i <= count; i++) {
      const p = sampleTrack(
        track,
        (i / count) * track.length,
        railOffset * side,
      );
      points.push(p.x, p.y + 0.39, p.z, p.x, p.y + 0.83, p.z);
      normals.push(
        -p.nx * side,
        0,
        -p.nz * side,
        -p.nx * side,
        0,
        -p.nz * side,
      );
      uvs.push(i / 8, 0, i / 8, 1);
      if (i < count) {
        const n = i * 2;
        indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normals, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    const material = rail.clone();
    material.side = THREE.DoubleSide;
    keep(material);
    const object = mesh(geometry, material);
    object.receiveShadow = true;
    for (let s = 0; s < track.length; s += 9) {
      const p = sampleTrack(track, s, railOffset * side);
      box(p.x, p.y + 0.48, p.z, 0.13, 0.96, 0.14, rail, p.yaw, false);
      const r = sampleTrack(track, s, (railOffset - 0.04) * side);
      box(r.x, r.y + 0.69, r.z, 0.07, 0.12, 0.25, accent, p.yaw, false);
    }
    if (city)
      ribbon(side * railOffset - 0.03, side * railOffset + 0.03, accent, {
        height: 0.86,
      });
  }

  const terrainBase = new THREE.Color(
    city ? 0x4c5661 : alpine ? 0x5c7859 : 0x849270,
  );
  const terrainOuter = new THREE.Color(
    city ? 0x293844 : alpine ? 0x657b6c : 0xc4ab81,
  );
  function terrainY(offset, s, p) {
    const distance = Math.abs(offset);
    const t = clamp((distance - railOffset) / 72, 0, 1);
    if (city) return p.y - 0.1 - t * 3.3;
    if (alpine)
      return (
        p.y -
        0.18 -
        Math.pow(t, 1.25) * 27 +
        Math.sin(s * 0.025 + offset * 0.13) * t * 6
      );
    return (
      mix(p.y - 0.1, baseY - 0.4, Math.pow(t, 0.85)) +
      Math.sin(s * 0.031) * Math.sin(t * Math.PI) * 1.7
    );
  }
  const terrainMaterial = keep(
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      side: THREE.DoubleSide,
    }),
  );
  const terrainGeometry = [];
  for (const side of [-1, 1]) {
    const offsets = [
      railOffset + 0.35,
      railOffset + 4,
      railOffset + 12,
      railOffset + 29,
      railOffset + 52,
      railOffset + 78,
    ];
    for (let i = 0; i < offsets.length - 1; i++) {
      const terrain = ribbon(
        side * offsets[i],
        side * offsets[i + 1],
        terrainMaterial,
        {
          spacing: 6,
          height: (offset, s, p) => terrainY(offset, s, p) - p.y,
          color: (offset, s) => {
            const c = terrainBase
              .clone()
              .lerp(
                terrainOuter,
                clamp((Math.abs(offset) - railOffset) / 65, 0, 1),
              );
            return c.multiplyScalar(
              0.92 + Math.sin(s * 0.043 + offset * 0.07) * 0.08,
            );
          },
        },
      );
      terrainGeometry.push(terrain.geometry);
      root.remove(terrain);
    }
  }
  const mergedTerrain = mergeGeometries(terrainGeometry, false);
  terrainGeometry.forEach((geometry) => {
    geometry.dispose();
    owned.delete(geometry);
  });
  const terrainMesh = mesh(mergedTerrain, terrainMaterial);
  terrainMesh.receiveShadow = true;

  // A cheap clearance test keeps every decorative object out of every piece of road.
  function clearOfRoad(x, z, clearance) {
    const threshold = clearance * clearance;
    for (let i = 0; i < track.samples.length; i += 2) {
      const p = track.samples[i];
      const dx = p.x - x,
        dz = p.z - z;
      if (dx * dx + dz * dz < threshold) return false;
    }
    return true;
  }
  function sceneryPoint(s, offset, clearance = railOffset + 3) {
    const p = sampleTrack(track, s, offset);
    if (!clearOfRoad(p.x, p.z, clearance)) return null;
    p.y = terrainY(offset, s, sampleTrack(track, s));
    return p;
  }
  const ground = mesh(
    new THREE.PlaneGeometry(3600, 3600),
    standard(city ? 0x283842 : alpine ? 0x596e63 : 0x548e8c, 1),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = baseY - 0.8;
  let ocean = null;
  if (!alpine && !city) {
    ground.visible = false;
    const water = keep(
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          dark: { value: new THREE.Color(wet ? 0x3c737e : 0x298889) },
          light: { value: new THREE.Color(wet ? 0x72a4aa : 0x76c4bb) },
        },
        vertexShader:
          "varying vec3 vWorld;void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}",
        fragmentShader: `varying vec3 vWorld;uniform float time;uniform vec3 dark;uniform vec3 light;
        void main(){float waves=sin(vWorld.x*.12+vWorld.z*.16+time*.5)+sin(vWorld.z*.29-vWorld.x*.041-time*.7)*.45;
        float ripple=smoothstep(.94,1.22,waves)*.4;vec3 color=mix(dark,light,.34+waves*.12)+ripple*.16;
        float distanceToCamera=length(vWorld.xz-cameraPosition.xz);float fog=smoothstep(250.,1650.,distanceToCamera);color=mix(color,vec3(.56,.7,.7),fog*.82);
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
      }),
    );
    ocean = mesh(new THREE.PlaneGeometry(3600, 3600), water);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = baseY;
  }

  const rock = standard(alpine ? 0x8c938b : 0xa48f75, 0.98);
  const treeTrunk = standard(alpine ? 0x625448 : 0x8c7760, 1);
  const foliage = standard(alpine ? 0x2b574c : 0x547b4b, 1);
  const foliageLight = standard(alpine ? 0x4d7460 : 0x779b60, 1);
  const snow = standard(0xe8eced, 0.95);
  function pine(p, scale = 1) {
    cylinder(
      p.x,
      p.y + 2.2 * scale,
      p.z,
      0.18 * scale,
      0.4 * scale,
      4.4 * scale,
      treeTrunk,
      5,
    );
    for (let n = 0; n < 3; n++)
      cylinder(
        p.x,
        p.y + (3.4 + n * 1.85) * scale,
        p.z,
        0,
        (2.5 - n * 0.53) * scale,
        5.2 * scale,
        n % 2 ? foliageLight : foliage,
        7,
      );
  }
  function palm(p, scale = 1) {
    const tilt = range(-0.14, 0.14),
      height = range(7, 11) * scale;
    const tip = new THREE.Vector3(p.x + tilt * height, p.y + height, p.z);
    between(new THREE.Vector3(p.x, p.y, p.z), tip, 0.2 * scale, treeTrunk, 7);
    for (let n = 0; n < 7; n++) {
      const angle = (n / 7) * TAU + p.x;
      const length = range(3.4, 4.5) * scale;
      const verts = [],
        uv = [],
        indices = [];
      for (let i = 0; i <= 5; i++) {
        const t = i / 5,
          radius = t * length;
        const width = Math.sin(Math.PI * t) * 0.56 * scale;
        const y =
          tip.y + Math.sin(t * Math.PI) * 0.6 * scale - t * t * 1.1 * scale;
        verts.push(
          tip.x + Math.sin(angle) * radius + Math.cos(angle) * width,
          y,
          tip.z + Math.cos(angle) * radius - Math.sin(angle) * width,
          tip.x + Math.sin(angle) * radius - Math.cos(angle) * width,
          y,
          tip.z + Math.cos(angle) * radius + Math.sin(angle) * width,
        );
        uv.push(0, t, 1, t);
        if (i < 5) {
          const k = i * 2;
          indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(verts, 3),
      );
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      add(geometry, n % 2 ? foliage : foliageLight);
    }
    ellipsoid(
      tip.x,
      tip.y - 0.23,
      tip.z,
      0.42 * scale,
      0.35 * scale,
      0.42 * scale,
      treeTrunk,
      0,
    );
  }
  foliage.side = foliageLight.side = THREE.DoubleSide;
  if (!city) {
    for (let s = 14; s < track.length; s += alpine ? 11 : 23) {
      for (const side of [-1, 1]) {
        if (random() < 0.21) continue;
        const offset = side * range(18, alpine ? 65 : 36);
        const p = sceneryPoint(s + range(-7, 7), offset, railOffset + 3);
        if (!p) continue;
        if (alpine) pine(p, range(0.6, 1.45));
        else palm(p, range(0.8, 1.25));
      }
    }
    for (let s = 30; s < track.length; s += 26) {
      const offset = (random() > 0.5 ? 1 : -1) * range(16, 64);
      const p = sceneryPoint(s, offset, railOffset + 3);
      if (p)
        ellipsoid(
          p.x,
          p.y + 1.1,
          p.z,
          range(1.5, 4.8),
          range(1.5, 3.2),
          range(1.2, 4.3),
          rock,
          0,
        );
    }
  }

  if (alpine) {
    // Broad, faceted peaks sit beyond the complete circuit, so they never occlude a road.
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * TAU,
        radius = range(510, 950),
        height = range(160, 370);
      const x = Math.sin(angle) * radius,
        z = Math.cos(angle) * radius;
      const baseRadius = range(125, 220);
      if (!clearOfRoad(x, z, baseRadius + railOffset + 8)) continue;
      cylinder(
        x,
        baseY + height * 0.42,
        z,
        0,
        baseRadius,
        height,
        rock,
        7,
        angle,
      );
      cylinder(
        x,
        baseY + height * 0.42 + height * 0.3,
        z,
        0,
        range(40, 65),
        height * 0.39,
        snow,
        7,
        angle,
      );
    }
    const lodgeWall = standard(0x99745c),
      lodgeRoof = standard(0x354a50, 0.8);
    for (const fraction of [0.025, 0.28, 0.63, 0.83]) {
      const p = sceneryPoint(fraction * track.length, 31, 22);
      if (!p) continue;
      box(p.x, p.y + 2.7, p.z, 11, 5.4, 7, lodgeWall, p.yaw);
      const roof = new THREE.CylinderGeometry(6.8, 6.8, 10.8, 3, 1);
      roof.rotateZ(Math.PI / 2);
      roof.rotateY(p.yaw);
      roof.translate(p.x, p.y + 6.1, p.z);
      add(roof, lodgeRoof);
      for (const side of [-1, 1]) {
        const q = new THREE.Vector3(side * 2.8, 2.8, 3.54).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          p.yaw,
        );
        box(
          p.x + q.x,
          p.y + q.y,
          p.z + q.z,
          1.8,
          1.9,
          0.08,
          standard(0xd9c59c, 0.3, 0, 0x443419),
          p.yaw,
        );
      }
    }
    // Mountain lakes use a low basin outside the boundary.
    for (const fraction of [0.22, 0.73]) {
      const p = sceneryPoint(fraction * track.length, -69, 44);
      if (!p) continue;
      const lake = mesh(
        new THREE.CircleGeometry(30, 36),
        standard(0x478e9b, 0.2, 0.2),
      );
      lake.rotation.x = -Math.PI / 2;
      lake.position.set(p.x, p.y + 0.3, p.z);
      lake.scale.y = 0.7;
    }
  } else if (!city) {
    const cream = standard(0xe9ded1, 0.8),
      lighthouseRed = standard(0xbe6250, 0.7),
      boatDeck = standard(0x997355, 0.8);
    const p =
      sceneryPoint(track.length * 0.19, -48, 20) ||
      sceneryPoint(track.length * 0.72, 47, 20);
    if (p) {
      const height = 24;
      cylinder(p.x, p.y + 1.5, p.z, 5, 6, 3, rock, 12);
      cylinder(p.x, p.y + height / 2, p.z, 2.5, 3.2, height, cream, 16);
      cylinder(p.x, p.y + height * 0.61, p.z, 2.76, 2.87, 3, lighthouseRed, 16);
      cylinder(p.x, p.y + height + 0.3, p.z, 3.45, 3.45, 0.6, cream, 16);
      cylinder(
        p.x,
        p.y + height + 2,
        p.z,
        2.25,
        2.25,
        3.2,
        standard(0x6d9b9e, 0.25, 0.25, 0x183b3c),
        12,
      );
      cylinder(p.x, p.y + height + 4.2, p.z, 0, 3.2, 2, lighthouseRed, 12);
      const light = mesh(new THREE.SphereGeometry(0.6, 10, 6), unlit(0xffdf95));
      light.position.set(p.x, p.y + height + 2, p.z);
    }
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * TAU,
        r = range(560, 1000),
        h = range(25, 100);
      cylinder(
        Math.sin(angle) * r,
        baseY + h * 0.2,
        Math.cos(angle) * r,
        0,
        range(65, 130),
        h,
        rock,
        7,
        angle,
      );
    }
    for (const fraction of [0.14, 0.38, 0.64, 0.85]) {
      const p = sceneryPoint(fraction * track.length, -130, 50);
      if (!p) continue;
      const y = baseY + 0.7;
      const hull = new THREE.SphereGeometry(1, 12, 6);
      hull.scale(3.5, 1.8, 9);
      hull.rotateY(p.yaw);
      hull.translate(p.x, y, p.z);
      add(hull, cream);
      box(p.x, y + 1, p.z, 5.4, 0.5, 10, boatDeck, p.yaw);
      box(p.x, y + 2.1, p.z, 3.8, 2, 5, cream, p.yaw);
      cylinder(p.x, y + 8, p.z, 0.09, 0.11, 14, rail, 6);
      const vertices = [0, 2, 0, 0, 14, 0, 0, 2, 7];
      const sail = new THREE.BufferGeometry();
      sail.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      sail.setAttribute(
        "uv",
        new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0], 2),
      );
      sail.computeVertexNormals();
      transformed(sail, p.x, y, p.z, 0, p.yaw);
      const sailMaterial = standard(0xf0e9d6, 0.9);
      sailMaterial.side = THREE.DoubleSide;
      add(sail, sailMaterial);
    }
    for (const fraction of [0.34, 0.41, 0.49]) {
      const p = sceneryPoint(fraction * track.length, 67, 25);
      if (!p) continue;
      cylinder(p.x, p.y + 17, p.z, 0.5, 0.85, 34, cream, 10);
      const turbine = new THREE.Group();
      turbine.position.set(p.x, p.y + 34, p.z);
      turbine.rotation.y = -0.5;
      root.add(turbine);
      const rotor = new THREE.Group();
      turbine.add(rotor);
      rotor.position.z = 1;
      const geometry = [];
      for (let n = 0; n < 3; n++) {
        const blade = new THREE.BoxGeometry(0.52, 12, 0.15);
        blade.translate(0, 6, 0);
        blade.rotateZ((n / 3) * TAU);
        geometry.push(blade);
      }
      const rotorMesh = mesh(mergeGeometries(geometry, false), cream, rotor);
      rotorMesh.castShadow = false;
      geometry.forEach((item) => item.dispose());
      const hub = mesh(new THREE.SphereGeometry(0.75, 8, 6), cream, rotor);
      hub.position.z = 0.1;
      turbines.push(rotor);
    }
  }

  if (city) {
    const concrete = standard(0x3e4b60, 0.86, 0.1);
    const glassA = standard(0x21394c, 0.28, 0.6),
      glassB = standard(0x323448, 0.3, 0.45);
    const neonCyan = unlit(0x5af5ed),
      neonPink = unlit(0xeb6daa),
      neonGold = unlit(0xf4c779);
    const windowMap = texture(128, 256, (ctx, w, h) => {
      ctx.fillStyle = "#1b293c";
      ctx.fillRect(0, 0, w, h);
      for (let y = 5; y < h; y += 13)
        for (let x = 4; x < w; x += 12) {
          ctx.fillStyle =
            random() > 0.38
              ? random() > 0.7
                ? "#eec48f"
                : "#9acbd3"
              : "#293c50";
          ctx.fillRect(x, y, 6, 6);
        }
    });
    windowMap.wrapS = windowMap.wrapT = THREE.RepeatWrapping;
    const windows = keep(
      new THREE.MeshStandardMaterial({
        map: windowMap,
        color: 0x8aa1b1,
        emissiveMap: windowMap,
        emissive: 0xc0dfee,
        emissiveIntensity: 0.68,
        roughness: 0.35,
        metalness: 0.3,
      }),
    );
    for (let s = 0; s < track.length; s += 36)
      for (const side of [-1, 1]) {
        const offset = side * range(29, 72),
          width = range(10, 22),
          depth = range(10, 20);
        const p = sceneryPoint(
          s + range(-8, 8),
          offset,
          railOffset + Math.max(width, depth) * 0.7 + 3,
        );
        if (!p) continue;
        const height = range(16, 85);
        box(
          p.x,
          p.y + height / 2,
          p.z,
          width,
          height,
          depth,
          random() > 0.5 ? glassA : glassB,
          p.yaw,
        );
        box(p.x, p.y + 0.45, p.z, width + 2, 0.9, depth + 2, concrete, p.yaw);
        // Window walls are batched; their UVs scale with actual building size.
        const facade = new THREE.BoxGeometry(
          width + 0.08,
          height - 0.9,
          depth + 0.08,
        );
        const uv = facade.getAttribute("uv");
        for (let i = 0; i < uv.count; i++) {
          uv.setXY(i, (uv.getX(i) * width) / 14, (uv.getY(i) * height) / 30);
        }
        transformed(facade, p.x, p.y + height / 2, p.z, 0, p.yaw);
        add(facade, windows, false);
        const material = random() > 0.6 ? neonPink : neonCyan;
        box(
          p.x,
          p.y + height + 0.05,
          p.z,
          width + 0.4,
          0.19,
          depth + 0.4,
          material,
          p.yaw,
          false,
        );
        if (random() > 0.55) {
          const corner = new THREE.Vector3(
            width * 0.5,
            0,
            depth * 0.5,
          ).applyAxisAngle(new THREE.Vector3(0, 1, 0), p.yaw);
          box(
            p.x + corner.x,
            p.y + height / 2,
            p.z + corner.z,
            0.15,
            height,
            0.15,
            material,
            p.yaw,
            false,
          );
        }
        if (height > 62)
          cylinder(p.x, p.y + height + 5, p.z, 0.07, 0.15, 10, rail, 5);
      }
    for (let i = 0; i < 38; i++) {
      const angle = (i / 38) * TAU,
        radius = range(470, 900),
        x = Math.sin(angle) * radius,
        z = Math.cos(angle) * radius;
      if (!clearOfRoad(x, z, 70)) continue;
      const height = range(45, 210),
        width = range(18, 38);
      box(
        x,
        baseY + height / 2,
        z,
        width,
        height,
        width,
        windows,
        angle,
        false,
      );
      box(
        x,
        baseY + height,
        z,
        width + 0.2,
        0.5,
        width + 0.2,
        i % 3 ? neonCyan : neonPink,
        angle,
        false,
      );
    }
    const glowMaterial = keep(
      new THREE.MeshBasicMaterial({
        color: 0x87c3cf,
        transparent: true,
        opacity: 0.035,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    for (let s = 18; s < track.length; s += 54)
      for (const side of [-1, 1]) {
        const p = sampleTrack(track, s, side * (railOffset + 2));
        cylinder(p.x, p.y + 5.2, p.z, 0.08, 0.13, 10.4, dark, 6);
        const end = sampleTrack(track, s, side * (railOffset - 0.7));
        between(
          new THREE.Vector3(p.x, p.y + 10.4, p.z),
          new THREE.Vector3(end.x, p.y + 10.4, end.z),
          0.09,
          dark,
        );
        box(end.x, p.y + 10.33, end.z, 1.4, 0.1, 0.6, neonGold, p.yaw, false);
        // Pool-of-light decals stay attached to the actual road elevation.
        add(
          transformed(
            new THREE.CircleGeometry(5.5, 14),
            end.x,
            p.y + 0.028,
            end.z,
            -Math.PI / 2,
          ),
          glowMaterial,
          false,
        );
      }
    const brands = [
      sign("APEX", "PRECISION / VELOCITY / FREEDOM", "#78f7ec", "#132f3c"),
      sign("HORIZON", "THE CITY NEVER STOPS", "#ffa4c9", "#2f1e40"),
      sign("005", "CHASE THE NEXT LIGHT", "#ffdc8d", "#23303e"),
    ];
    for (let i = 0; i < 6; i++) {
      const p = sceneryPoint(
        (track.length * (i + 0.2)) / 6,
        22 * (i % 2 ? 1 : -1),
        17,
      );
      if (!p) continue;
      box(p.x, p.y + 3.5, p.z, 0.25, 7, 0.25, rail);
      placard(
        brands[i % 3],
        p.x,
        p.y + 7,
        p.z,
        10,
        2.5,
        p.yaw + (i % 2 ? -0.25 : 0.25),
      );
    }
  }

  // Curvature-based warnings give useful advance notice of the circuit's real bends.
  const arrowTexture = texture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = city ? "#102f3c" : "#e9be5c";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = city ? "#74fff3" : "#28383d";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(38, 21);
    ctx.lineTo(84, 64);
    ctx.lineTo(38, 107);
    ctx.stroke();
  });
  const arrowMaterial = keep(
    new THREE.MeshBasicMaterial({ map: arrowTexture, side: THREE.DoubleSide }),
  );
  for (let s = 50; s < track.length; s += 38) {
    const a = sampleTrack(track, s - 10),
      b = sampleTrack(track, s + 18);
    let turn = b.yaw - a.yaw;
    while (turn > Math.PI) turn -= TAU;
    while (turn < -Math.PI) turn += TAU;
    if (Math.abs(turn) < 0.15) continue;
    const side = turn > 0 ? 1 : -1;
    for (let n = 0; n < 3; n++) {
      const p = sampleTrack(track, s + n * 6, side * (railOffset + 1.3));
      cylinder(p.x, p.y + 1.4, p.z, 0.055, 0.055, 2.8, rail, 5);
      const plane = new THREE.PlaneGeometry(1.7, 1.7);
      // Plane faces the approaching driver; horizontal mirror points into the bend.
      if (turn > 0) plane.scale(-1, 1, 1);
      transformed(plane, p.x, p.y + 2.35, p.z, 0, p.yaw + Math.PI);
      add(plane, arrowMaterial, false);
    }
  }
  const checkpointColors = [
    unlit(city ? 0x54d7e7 : 0xcab76f),
    standard(0x263b42, 0.7),
  ];
  for (let i = 1; i < track.checkpoints; i++) {
    const s = (i / track.checkpoints) * track.length;
    for (const side of [-1, 1]) {
      const p = sampleTrack(track, s, side * (railOffset + 0.7));
      cylinder(p.x, p.y + 1.8, p.z, 0.055, 0.055, 3.6, rail, 5);
      box(
        p.x,
        p.y + 3.1,
        p.z,
        0.7,
        0.85,
        0.04,
        checkpointColors[0],
        p.yaw,
        false,
      );
    }
  }

  // Finish markings and a proper overhead start gantry are shared by all biomes.
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 20; col++)
      strip(
        row * 0.6 - 0.6,
        (row + 1) * 0.6 - 0.6,
        -half + (col * track.width) / 20,
        -half + ((col + 1) * track.width) / 20,
        (row + col) % 2 ? white : dark,
        0.06,
      );
  for (let s = -10; s > -60; s -= 8)
    for (const side of [-1, 1]) {
      const offset = side * 2.8;
      strip(s, s + 0.14, offset - 1, offset + 1, white, 0.043);
      strip(s - 2.8, s, offset - 0.98, offset - 0.88, white, 0.043);
      strip(s - 2.8, s, offset + 0.88, offset + 0.98, white, 0.043);
    }
  const gate = sampleTrack(track, 0);
  for (const side of [-1, 1]) {
    const p = sampleTrack(track, 0, side * (railOffset + 1.1));
    box(p.x, p.y + 4.4, p.z, 0.8, 8.8, 0.8, dark, p.yaw);
    box(p.x, p.y + 1.6, p.z, 1.1, 3.2, 1.1, rail, p.yaw);
  }
  box(
    gate.x,
    gate.y + 8.5,
    gate.z,
    railOffset * 2 + 3,
    1.8,
    0.8,
    dark,
    gate.yaw,
  );
  placard(
    sign(
      "APEX HORIZON",
      "005 / THE PURSUIT OF MOTION",
      city ? "#81faee" : "#f4d177",
    ),
    gate.x,
    gate.y + 8.5,
    gate.z,
    15.5,
    1.9,
    gate.yaw + Math.PI,
  );
  for (let i = 0; i < 5; i++) {
    const p = sampleTrack(track, 0, (i - 2) * 1.25);
    const material = keep(new THREE.MeshBasicMaterial({ color: 0x321c19 }));
    const lamp = mesh(new THREE.SphereGeometry(0.26, 10, 7), material);
    lamp.position.set(p.x, p.y + 7.13, p.z);
    countdownLights.push(lamp);
  }

  // Tunnel interiors maintain at least eight metres of overhead clearance.
  for (const tunnel of track.tunnels || []) {
    const start = tunnel.from * track.length,
      end = tunnel.to * track.length;
    const sections = Math.ceil((end - start) / 5),
      points = [],
      uv = [],
      indices = [];
    const profile = [
      [-railOffset - 2, 0],
      [-railOffset - 2, 6],
      [-railOffset - 1, 8.8],
      [-7, 11.5],
      [0, 12.3],
      [7, 11.5],
      [railOffset + 1, 8.8],
      [railOffset + 2, 6],
      [railOffset + 2, 0],
    ];
    for (let i = 0; i <= sections; i++) {
      const p = sampleTrack(track, mix(start, end, i / sections));
      for (const [offset, height] of profile) {
        points.push(p.x + p.nx * offset, p.y + height, p.z + p.nz * offset);
        uv.push(i / sections, offset / 30);
      }
      if (i < sections)
        for (let j = 0; j < profile.length - 1; j++) {
          const a = i * profile.length + j,
            b = a + profile.length;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material = standard(alpine ? 0x78817e : 0x354758, 0.94);
    material.side = THREE.DoubleSide;
    const object = mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    for (let s = start; s <= end; s += 15) {
      const p = sampleTrack(track, s);
      for (const side of [-1, 1]) {
        const q = sampleTrack(track, s, side * (railOffset + 1.2));
        box(
          q.x,
          q.y + 6.1,
          q.z,
          0.12,
          0.2,
          3.8,
          unlitCache(city ? 0x66fff0 : 0xe6d9ac),
          p.yaw,
          false,
        );
      }
    }
    for (const s of [start, end]) {
      const p = sampleTrack(track, s);
      box(p.x, p.y + 12.8, p.z, railOffset * 2 + 5, 1.1, 1.4, rock, p.yaw);
      for (const side of [-1, 1]) {
        const q = sampleTrack(track, s, side * (railOffset + 2.1));
        box(q.x, q.y + 5.6, q.z, 1.2, 11.2, 1.4, rock, p.yaw);
      }
    }
  }
  function unlitCache(color) {
    const key = `unlit:${color}`;
    if (!palette.has(key)) palette.set(key, unlit(color));
    return palette.get(key);
  }

  const pickupRingGeometry = keep(new THREE.TorusGeometry(0.88, 0.055, 6, 24));
  const nitroGeometry = keep(new THREE.OctahedronGeometry(0.52, 0));
  const repairParts = [
    new THREE.BoxGeometry(0.27, 1.05, 0.25),
    new THREE.BoxGeometry(0.88, 0.27, 0.25),
  ];
  const repairGeometry = keep(mergeGeometries(repairParts, false));
  repairParts.forEach((item) => item.dispose());
  const pickupMaterials = { nitro: unlit(0x78ffef), repair: unlit(0xffd978) };
  for (const pickup of track.pickups || []) {
    const p = sampleTrack(track, pickup.t * track.length, pickup.offset || 0);
    const group = new THREE.Group();
    group.position.set(p.x, p.y + 1.45, p.z);
    root.add(group);
    const icon = new THREE.Mesh(
      pickup.type === "repair" ? repairGeometry : nitroGeometry,
      pickupMaterials[pickup.type] || pickupMaterials.nitro,
    );
    group.add(icon);
    const ring = new THREE.Mesh(
      pickupRingGeometry,
      pickupMaterials[pickup.type] || pickupMaterials.nitro,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.3;
    group.add(ring);
    pickups.set(pickup.id, {
      group,
      icon,
      ring,
      baseY: p.y + 1.45,
      phase: random() * TAU,
    });
  }

  let rain = null;
  const rainCount = 350;
  if (wet) {
    const positions = new Float32Array(rainCount * 6);
    for (let i = 0; i < rainCount; i++) {
      const x = range(-24, 24),
        y = range(0, 24),
        z = range(-24, 24);
      positions.set([x, y, z, x - 0.2, y + 1.15, z + 0.12], i * 6);
    }
    const geometry = keep(new THREE.BufferGeometry());
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    rain = new THREE.LineSegments(
      geometry,
      keep(
        new THREE.LineBasicMaterial({
          color: 0xc5dce4,
          transparent: true,
          opacity: city ? 0.24 : 0.3,
          depthWrite: false,
        }),
      ),
    );
    rain.frustumCulled = false;
    root.add(rain);
  }
  flush();

  function update(dt, state) {
    if (disposed) return;
    time += Math.min(dt || 0, 0.12);
    if (ocean) ocean.material.uniforms.time.value = time;
    turbines.forEach((rotor, i) => {
      rotor.rotation.z = time * (0.22 + i * 0.045);
    });
    for (const pickup of state?.pickups || []) {
      const visual = pickups.get(pickup.id);
      if (!visual) continue;
      visual.group.visible = pickup.active;
      visual.group.position.y =
        visual.baseY + Math.sin(time * 2 + visual.phase) * 0.17;
      visual.icon.rotation.y = time * 1.5 + visual.phase;
      visual.icon.rotation.z =
        pickup.type === "repair" ? Math.sin(time) * 0.08 : 0.25;
      visual.ring.scale.setScalar(
        1 + Math.sin(time * 2.2 + visual.phase) * 0.055,
      );
    }
    const phase = state?.phase;
    for (let i = 0; i < countdownLights.length; i++) {
      const color =
        phase === "countdown"
          ? i < Math.ceil(((3 - state.countdown) * 5) / 3)
            ? 0xff503e
            : 0x492b29
          : phase === "racing"
            ? 0x81f4b7
            : 0x384e52;
      countdownLights[i].material.color.setHex(color);
    }
    const player = state?.player;
    if (player) {
      sun.position.set(player.x - 75, player.y + 100, player.z + 55);
      sun.target.position.set(player.x, player.y, player.z);
      if (rain) {
        rain.position.set(player.x, player.y, player.z);
        const array = rain.geometry.attributes.position.array;
        for (let i = 0; i < rainCount; i++) {
          let y = array[i * 6 + 1] - (dt || 0) * 21;
          if (y < 0) y += 24;
          array[i * 6 + 1] = y;
          array[i * 6 + 4] = y + 1.15;
        }
        rain.geometry.attributes.position.needsUpdate = true;
      }
    }
  }
  return {
    update,
    setQuality(low) {
      lowQuality = !!low;
      sun.castShadow = !lowQuality;
      if (rain)
        rain.geometry.setDrawRange(0, (lowQuality ? 130 : rainCount) * 2);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      root.removeFromParent();
      owned.forEach((resource) => resource.dispose?.());
      owned.clear();
      sun.shadow.map?.dispose();
      if (scene.fog === fog) scene.fog = null;
      if (scene.background === skyHorizon) scene.background = null;
    },
  };
}
