// National Level Recognition — Three.js light-ribbon backdrop + GSAP entrance, parallax and tilt.
import * as THREE from "../vendor/three/three.module.min.js";

const section = document.querySelector(".nr");
if (!section) throw new Error("national-recognition: section missing");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ------------------------------------------------------------------
   1. Backdrop: soft diagonal light ribbons on pale blue (one quad, one shader)
   ------------------------------------------------------------------ */
(function backdrop() {
  const canvas = section.querySelector(".nr-bg");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" }); }
  catch { canvas.remove(); return; }            // CSS gradient on .nr stays as the fallback
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.7, 0.4) },
    uScroll: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime, uScroll; uniform vec2 uRes, uMouse;
      float band(float d, float w){ return smoothstep(w, 0., abs(d)); }
      void main(){
        vec2 p = vUv; float ar = uRes.x / uRes.y; vec2 q = vec2(p.x * ar, p.y);
        vec3 base = mix(vec3(.984,.988,1.), vec3(.933,.953,.992), p.y * .35 + (1. - p.x) * .15 + p.x * p.y * .25);
        float t = uTime * .06 + uScroll * .8;
        // three slow ribbons sweeping bottom-left -> top-right
        float d1 = q.y - (.22 + .18 * q.x / ar) - .05 * sin(q.x * 1.6 + t * 2.);
        float d2 = q.y - (.86 + .10 * q.x / ar) - .06 * sin(q.x * 1.2 - t * 1.6 + 1.3);
        float d3 = q.y - (.55 - .08 * q.x / ar) - .04 * sin(q.x * 2.1 + t * 1.3 + 2.);
        vec3 col = base;
        col += vec3(1.) * band(d1, .16) * .55;                // white sheen
        col = mix(col, vec3(.90,.93,.99), band(d1 + .09, .06) * .5); // its shaded edge
        col += vec3(1.) * band(d2, .12) * .45;
        col = mix(col, vec3(.91,.94,.995), band(d3, .22) * .35);
        // faint blue glow following the pointer
        vec2 m = vec2(uMouse.x * ar, uMouse.y);
        col = mix(col, vec3(.86,.91,1.), smoothstep(.55, 0., distance(q, m)) * .28);
        gl_FragColor = vec4(col, 1.);
      }`,
    depthTest: false, depthWrite: false,
  });
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  const cam = new THREE.Camera();

  const size = () => {
    const { width, height } = section.getBoundingClientRect();
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width, height);
  };
  size();
  new ResizeObserver(size).observe(section);

  const target = uniforms.uMouse.value.clone();
  if (fine) section.addEventListener("pointermove", (e) => {
    const r = section.getBoundingClientRect();
    target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  });

  let visible = false, raf = 0;
  const clock = new THREE.Clock();
  const frame = () => {
    raf = 0;
    if (!visible) return;
    uniforms.uTime.value = reduce ? 0 : clock.getElapsedTime();
    uniforms.uMouse.value.lerp(target, 0.05);
    renderer.render(scene, cam);
    if (!reduce) raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) { clock.start(); raf = requestAnimationFrame(frame); }
  }).observe(section);

  // expose so GSAP can drive the scroll uniform
  section._bgScroll = (v) => { uniforms.uScroll.value = v; if (reduce) renderer.render(scene, cam); };
})();

/* ------------------------------------------------------------------
   2. GSAP: entrance, scroll parallax, pointer tilt
   ------------------------------------------------------------------ */
const { gsap, ScrollTrigger } = window;
if (gsap && ScrollTrigger && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  const q = gsap.utils.selector(section);
  const ease = "expo.out";

  const tl = gsap.timeline({
    defaults: { ease, duration: 1.1 },
    scrollTrigger: { trigger: section, start: "top 70%", once: true },
  });
  tl.from(q(".nr-title .ln>span"), { yPercent: 110, stagger: .09 })
    .from(q(".nr-lede"), { opacity: 0, y: 18, duration: .9 }, "<.35")
    .from(q(".nr-btn"), { opacity: 0, y: 18, scale: .96, duration: .9 }, "<.12")
    // photos: wipe up from the bottom inside their skewed frames
    .from(q(".nr-ph"), { clipPath: "inset(100% 0% 0% 0% round 18px)", stagger: .14, duration: 1.3, ease: "expo.inOut" }, 0.1)
    .from(q(".nr-ph img"), { scale: 1.25, stagger: .14, duration: 1.8 }, "<")
    .from(q(".nr-card"), { y: 60, opacity: 0, duration: 1.2 }, "-=1.1")
    .from(q(".nr-div"), { scaleY: 0, duration: .9 }, "<.25")
    .from(q(".nr-emblem"), { opacity: 0, y: 10, scale: .9, duration: .9 }, "<")
    .from(q(".nr-card-t>*"), { opacity: 0, y: 12, stagger: .07, duration: .8 }, "<.1")
    .set(q(".nr-ph"), { clearProps: "clipPath" });

  // scroll parallax: panels drift at different depths, card counter-drifts, backdrop flows
  const mm = gsap.matchMedia();
  mm.add("(min-width: 601px)", () => {
    gsap.timeline({ scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: .6 } })
      .fromTo(q('.nr-ph[data-depth="1"]'), { y: 30 }, { y: -30, ease: "none" }, 0)
      .fromTo(q('.nr-ph[data-depth="2"]'), { y: 50 }, { y: -50, ease: "none" }, 0)
      .fromTo(q(".nr-card"), { y: 16 }, { y: -16, ease: "none" }, 0);
  });
  ScrollTrigger.create({
    trigger: section, start: "top bottom", end: "bottom top",
    onUpdate: (s) => section._bgScroll?.(s.progress),
  });

  // pointer tilt on the photo pair + magnetic CTA (desktop only)
  if (fine) {
    const photos = q(".nr-photos")[0];
    const rx = gsap.quickTo(photos, "rotationX", { duration: .8, ease: "power3" });
    const ry = gsap.quickTo(photos, "rotationY", { duration: .8, ease: "power3" });
    const media = q(".nr-media")[0];
    media.addEventListener("pointermove", (e) => {
      const r = media.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - .5) * 6);
      rx(-((e.clientY - r.top) / r.height - .5) * 5);
    });
    media.addEventListener("pointerleave", () => { rx(0); ry(0); });

    const btn = q(".nr-btn")[0];
    const bx = gsap.quickTo(btn, "x", { duration: .5, ease: "power3" });
    const by = gsap.quickTo(btn, "y", { duration: .5, ease: "power3" });
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      bx((e.clientX - r.left - r.width / 2) * .15);
      by((e.clientY - r.top - r.height / 2) * .25);
    });
    btn.addEventListener("pointerleave", () => { bx(0); by(0); });
  }
}
