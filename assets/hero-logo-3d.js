/* =====================================================================
   HERO — 3D glassmorphism icon
   A thin rounded-square pane of frosted glass carrying the raised white
   NXT WAVE mark (assets/nxtwave-logo-mark.svg).

   Real glassmorphism needs what is *behind* the pane. WebGL can't see the
   page, so each frame the hero film under the icon (video, or the captured
   frame canvas) is copied into a small, blurred backdrop texture; the glass
   face samples it in screen space with a slight refraction, a frosted tint,
   a fresnel edge, a thin bright border and a sheen streak.

   Four glowing tech glyphs (network, chip, code, database) drift around it
   like moons, each on its own randomised orbit (no orbit lines), passing in
   front of and behind the pane. Every 5 s a
   fast light shine sweeps across the glass.

   It owns the empty opening frames of the hero film, tilts toward the
   cursor, and rises + fades away as the student walks in.
   Visibility comes from the hero scrub: window.NW.heroLogo (0–1).
   ===================================================================== */
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const hero = document.getElementById('hero');
const cv = hero && hero.querySelector('.hx-logo3d');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* opened straight from disk (file://): fetch() is blocked and video pixels are off-limits, so SVGs come
   from the embedded copies (assets/embedded-svgs.js) and the glass skips sampling the film */
const FROM_DISK = location.protocol === 'file:';
const getText = url => (window.NW_EMBED && window.NW_EMBED[url]) ? Promise.resolve(window.NW_EMBED[url]) : fetch(url).then(r => r.text());

if (cv) init().catch(err => { console.warn('3D icon unavailable:', err); cv.remove(); });

async function init() {
  /* drop the flat gradient-shading overlays up front: 3D lighting replaces them */
  const svgText = (await getText(cv.dataset.src)).replace(/<path[^>]*fill="url\([^>]*\/>/g, '');

  /* ---------- renderer / scene ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(28, 1, 1, 5000);
  camera.position.set(0, 0, 1000);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(-400, 500, 700); scene.add(key);

  /* ---------- backdrop: a blurred copy of the film behind the icon ---------- */
  const BACK_SCALE = 0.25;                                   /* quarter-res is plenty once blurred */
  const back = document.createElement('canvas');
  const bctx = back.getContext('2d');
  const backTex = new THREE.CanvasTexture(back);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.minFilter = THREE.LinearFilter; backTex.generateMipmaps = false;
  const canFilter = 'filter' in bctx;
  const video = hero.querySelector('#hx-vid');
  const frames = hero.querySelector('.hx-frames');
  const bg = getComputedStyle(hero).getPropertyValue('--hx-bg').trim() || '#050d24';

  const paintBackdrop = () => {
    const W = back.width, H = back.height;
    bctx.filter = 'none';
    bctx.fillStyle = bg; bctx.fillRect(0, 0, W, H);
    const me = cv.getBoundingClientRect();
    const k = W / me.width;
    const useFrames = hero.classList.contains('has-frames') && frames;
    const src = useFrames ? frames : video;
    if (!src || FROM_DISK) { backTex.needsUpdate = true; return; }   /* keep the plain gradient ground */
    const r = src.getBoundingClientRect();
    if (canFilter) bctx.filter = 'blur(6px) saturate(1.25)';
    if (useFrames) {
      bctx.drawImage(frames, (r.left - me.left) * k, (r.top - me.top) * k, r.width * k, r.height * k);
    } else if (video.readyState >= 2 && video.videoWidth) {
      /* object-fit: cover inside the video's own box */
      const s = Math.max(r.width / video.videoWidth, r.height / video.videoHeight);
      const dw = video.videoWidth * s, dh = video.videoHeight * s;
      bctx.drawImage(video, (r.left - me.left + (r.width - dw) / 2) * k, (r.top - me.top + (r.height - dh) / 2) * k, dw * k, dh * k);
    }
    bctx.filter = 'none';
    backTex.needsUpdate = true;
  };

  /* ---------- the pane: thin rounded square ---------- */
  const S = 100, R = 13, D = 2.4, BEV = 1.6;                 /* size, corner radius, depth, bevel */
  const h = S / 2;
  const sq = new THREE.Shape();
  sq.moveTo(-h + R, -h);
  sq.lineTo(h - R, -h);  sq.quadraticCurveTo(h, -h, h, -h + R);
  sq.lineTo(h, h - R);   sq.quadraticCurveTo(h, h, h - R, h);
  sq.lineTo(-h + R, h);  sq.quadraticCurveTo(-h, h, -h, h - R);
  sq.lineTo(-h, -h + R); sq.quadraticCurveTo(-h, -h, -h + R, -h);
  const paneGeo = new THREE.ExtrudeGeometry(sq, {
    depth: D, curveSegments: 28,
    bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 6,
  });
  paneGeo.translate(0, 0, -D / 2);

  const glassMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uBack: { value: backTex },
      uRes: { value: new THREE.Vector2(1, 1) },
      uOpacity: { value: 1 },
      uHalf: { value: h + BEV },
      uRadius: { value: R + BEV },
      uTint: { value: new THREE.Color(0xcfe2ff) },
      uShine: { value: -1 },                               /* sweep progress 0…1, −1 = idle */
    },
    vertexShader: /* glsl */`
      varying vec3 vN;
      varying vec3 vV;
      varying vec2 vLocal;
      void main(){
        vLocal = position.xy;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vV = normalize(-mv.xyz);
        vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uBack;
      uniform vec2 uRes;
      uniform float uOpacity, uHalf, uRadius, uShine;
      uniform vec3 uTint;
      varying vec3 vN;
      varying vec3 vV;
      varying vec2 vLocal;

      float sdRoundBox(vec2 p, float b, float r){
        vec2 q = abs(p) - vec2(b - r);
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }

      void main(){
        vec3 N = normalize(vN);
        vec3 V = normalize(vV);
        vec2 suv = gl_FragCoord.xy / uRes;

        /* frosted refraction: shift by the surface normal, then a small 9-tap soften */
        vec2 off = N.xy * 0.035;
        vec3 col = vec3(0.0);
        float px = 2.5 / uRes.x, py = 2.5 / uRes.y;
        for (int i = -1; i <= 1; i++)
          for (int j = -1; j <= 1; j++)
            col += texture2D(uBack, suv + off + vec2(float(i) * px * 3.0, float(j) * py * 3.0)).rgb;
        col /= 9.0;

        /* frost: lift + cool milky tint, like light scattering inside the glass */
        col = mix(col, uTint, 0.36) * 1.22 + 0.07;

        /* fresnel: edges and grazing angles turn bright */
        float fr = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
        col += fr * 0.8;

        /* thin bright border just inside the edge (the glassmorphism 1px stroke) */
        float d = sdRoundBox(vLocal, uHalf, uRadius);
        float border = smoothstep(2.0, 0.0, abs(d + 1.2));
        float inner  = smoothstep(9.0, 0.0, -d) * 0.12;          /* light pooling toward the rim */
        col += border * 0.95 + inner;

        /* soft top-left highlight */
        vec2 u = vLocal / (uHalf * 2.0) + 0.5;
        float glow = smoothstep(0.75, 0.0, length(u - vec2(0.2, 0.85))) * 0.22;
        col += glow;

        /* the periodic shine: a narrow bright band racing corner to corner */
        float shine = 0.0;
        if (uShine >= 0.0) {
          float q = (u.x + (1.0 - u.y)) * 0.5;
          float c = mix(-0.25, 1.25, uShine);
          shine = smoothstep(0.07, 0.0, abs(q - c)) * 0.95 + smoothstep(0.2, 0.0, abs(q - c)) * 0.18;
        }
        col += shine;

        gl_FragColor = vec4(col, uOpacity * (0.9 + fr * 0.1 + shine * 0.1));
        #include <colorspace_fragment>
      }`,
  });

  /* the thin glass edge: pale, bright, a little see-through */
  const edgeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf2f8ff, emissive: 0xdcecff, emissiveIntensity: 0.85,
    roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02,
    envMapIntensity: 1.2, transparent: true, opacity: 0.92,
  });
  const pane = new THREE.Mesh(paneGeo, [glassMat, edgeMat]);   /* group 0 = faces, group 1 = edge + bevel */

  /* ---------- the mark: NXT WAVE (no ™), thin frosted-white relief on the pane ---------- */
  const data = new SVGLoader().parse(svgText);
  const shapes = [];
  for (const path of data.paths) {
    const fill = path.userData?.style?.fill;
    if (!fill || fill === 'none' || fill.startsWith('url(')) continue;        /* shading overlays */
    const pts = path.subPaths.flatMap(sp => sp.getPoints());
    if (pts.length && Math.min(...pts.map(p => p.x)) > 375) continue;         /* the ™ */
    shapes.push(...SVGLoader.createShapes(path));
  }
  const markGeo = new THREE.ExtrudeGeometry(shapes, {
    depth: 6, curveSegments: 10,
    bevelEnabled: true, bevelThickness: 2, bevelSize: 1.2, bevelSegments: 3,
  });
  markGeo.center();
  const markMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.85,
    roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 0.5,
    transparent: true, opacity: 0.96,
  });
  const mark = new THREE.Mesh(markGeo, markMat);
  const markW = S * 0.62;
  mark.scale.set(markW / 364, -markW / 364, markW / 364 * 0.45);        /* 364 ≈ NXT WAVE width in SVG units */
  mark.position.z = D / 2 + BEV + 0.6;

  const icon = new THREE.Group();
  icon.add(pane, mark);
  const pivot = new THREE.Group();                     /* cursor tilt here; icon keeps its idle float */
  pivot.add(icon);
  const system = new THREE.Group();                    /* position + scale for the pane and its orbits */
  system.add(pivot);
  scene.add(system);

  /* ---------- satellites: glowing glyphs, each on its own random orbit ---------- */
  const glyph = async (url) => {
    const svg = (await getText(url)).replace(/black/g, 'white');
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    /* soft star halo behind the glyph */
    const halo = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    halo.addColorStop(0, 'rgba(160,205,255,.45)'); halo.addColorStop(0.55, 'rgba(120,180,255,.12)'); halo.addColorStop(1, 'rgba(120,180,255,0)');
    g.fillStyle = halo; g.fillRect(0, 0, 256, 256);
    const k = 118 / Math.max(img.width, img.height);
    const w = img.width * k, h2 = img.height * k;
    g.shadowColor = 'rgba(170,210,255,.95)'; g.shadowBlur = 18;
    g.drawImage(img, 128 - w / 2, 128 - h2 / 2, w, h2);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const glyphTex = await Promise.all(cv.dataset.orbit.split(',').map(u => glyph(u.trim())));

  const rnd = (a, b) => a + Math.random() * (b - a);
  const orbitGroup = new THREE.Group();
  system.add(orbitGroup);
  const sats = [], satMats = [];
  glyphTex.forEach((tex, i) => {
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.setScalar(S * 0.32);
    orbitGroup.add(sp);
    satMats.push(mat);
    /* a random orbit per glyph: its own tilt, radius, speed, direction and drift */
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(-1.4, -0.95), rnd(-0.5, 0.5), rnd(-0.7, 0.7)));
    sats.push({
      tile: sp, q,
      r: rnd(S * 0.9, S * 1.3),
      speed: rnd(0.16, 0.32) * (Math.random() < 0.5 ? -1 : 1),
      phase: i * (Math.PI / 2) + rnd(-0.4, 0.4),           /* spread out so they don't bunch up */
      breathe: rnd(0.35, 0.7), breatheAmp: rnd(0.04, 0.09),
    });
  });
  const tmpV = new THREE.Vector3();

  /* resting pose: turned toward the headline, tipped back, a few degrees clockwise */
  const BASE = { x: 0.18, y: -0.42, z: -0.14 };

  /* ---------- layout ---------- */
  let baseX = 0, baseY = 0;
  const layout = () => {
    const W = cv.clientWidth, H = cv.clientHeight;
    const dpr = Math.min(2, devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    glassMat.uniforms.uRes.value.set(W * dpr, H * dpr);
    const bw = Math.max(2, Math.round(W * BACK_SCALE)), bh = Math.max(2, Math.round(H * BACK_SCALE));
    if (bw !== back.width || bh !== back.height) {
      back.width = bw; back.height = bh;
      backTex.dispose();                                 /* re-allocate at the new size (avoids sub-image overflow) */
    }
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const visW = visH * camera.aspect;
    const narrow = W < 860;
    const size = narrow ? visW * 0.34 : Math.min(visW * 0.19, visH * 0.34);
    system.scale.setScalar(size / S);
    baseX = narrow ? 0 : visW * 0.21;
    baseY = narrow ? visH * 0.2 : -visH * 0.07;
    /* desktop: centre the icon on the hero headline's vertical centre, and horizontally in the
       free space between the end of the headline and the page's right margin */
    const hl = hero.querySelector('.hx-headline');
    const nav = hero.querySelector('.hx-nav');
    if (!narrow && hl) {
      const cr = cv.getBoundingClientRect(), hr = hl.getBoundingClientRect();
      const padR = nav ? parseFloat(getComputedStyle(nav).paddingRight) || 64 : 64;
      const cx = (hr.right + (cr.right - padR)) / 2 - cr.left;
      const cy = hr.top + hr.height / 2 - cr.top;
      if (hr.width && hr.height) {
        baseX = (cx / W - 0.5) * visW;
        baseY = (0.5 - cy / H) * visH;
      }
    }
  };
  new ResizeObserver(layout).observe(cv);
  layout();
  document.fonts && document.fonts.ready.then(layout);   /* headline width settles once Outfit loads */

  /* ---------- cursor ---------- */
  let tx = 0, ty = 0, rx = 0, ry = 0;
  if (!RM) addEventListener('pointermove', e => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  /* ---------- loop: renders only while visible ---------- */
  let shown = 1, t0 = performance.now();
  const fadeMats = [edgeMat, markMat];
  const baseOpacity = fadeMats.map(m => m.opacity);
  const tick = now => {
    requestAnimationFrame(tick);
    const target = (window.NW && typeof NW.heroLogo === 'number') ? NW.heroLogo : 1;
    shown += (target - shown) * 0.2;
    if (shown < 0.002) { if (cv.style.opacity !== '0') cv.style.opacity = '0'; return; }

    const t = (now - t0) / 1000;
    rx += (ty * 0.35 - rx) * 0.08;
    ry += (tx * 0.6 - ry) * 0.08;
    pivot.rotation.set(BASE.x + rx, BASE.y + ry + (RM ? 0 : Math.sin(t * 0.6) * 0.05), BASE.z);
    icon.position.y = RM ? 0 : Math.sin(t * 0.9) * 2.2;

    /* satellites: each drifts round its own tilted orbit, breathing in and out a little;
       the system leans with the cursor */
    orbitGroup.rotation.set(rx * 0.35, ry * 0.35, 0);
    for (const s of sats) {
      const a = s.phase + t * s.speed;
      const r = s.r * (1 + Math.sin(t * s.breathe + s.phase) * s.breatheAmp);
      tmpV.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyQuaternion(s.q);
      s.tile.position.copy(tmpV);
    }

    /* shine: a fast sweep every 5 s */
    const cyc = t % 5;
    glassMat.uniforms.uShine.value = (!RM && cyc < 0.55) ? cyc / 0.55 : -1;

    /* exit: rises, shrinks a touch and turns away as it fades */
    const out = 1 - shown;
    system.position.set(baseX, baseY + out * 240, 0);
    icon.rotation.y = out * 0.9;
    icon.scale.setScalar(1 - out * 0.15);
    orbitGroup.scale.setScalar(1 + out * 0.35);          /* orbits drift outward as they fade */
    glassMat.uniforms.uOpacity.value = shown;
    fadeMats.forEach((m, i) => { m.opacity = baseOpacity[i] * shown; });
    satMats.forEach(m => { m.opacity = shown; });
    cv.style.opacity = '1';

    paintBackdrop();
    renderer.render(scene, camera);
  };
  requestAnimationFrame(tick);
  cv.classList.add('ready');
}
