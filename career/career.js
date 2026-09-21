/* Career Transformations — video testimonial marquees + gravity avatars.
   44px avatars float in zero-g (the cursor gently repels them); when the section
   comes into view gravity switches on one avatar at a time, so they pour down like sand and pile
   at the section floor. Canvas 2D, clipped to the section, runs only while it's on screen. */
(() => {
  const sec = document.querySelector('.ct');
  if (!sec) return;

  /* ---------- Testimonial marquees: video + text cards alternate (placeholder data — swap for real learners) ---------- */
  const COLS = [
    [ // col 1: top → bottom
      ['v', 'v01', 'Aditya Rao', 'SDE I, Amazon', 24, 'tall'],
      ['t', 't01', 'Rohan Das', 'Backend Engineer, Razorpay', 'The mock interviews felt harder than the real ones. By the time I sat for Razorpay, nothing surprised me.'],
      ['v', 'v02', 'Sneha Iyer', 'Frontend Engineer, Swiggy', 18, 'wide'],
      ['t', 't02', 'Kavya Nair', 'Data Analyst, Flipkart', 'I came in from a non-tech job. The projects I built here were what every interviewer wanted to talk about.'],
    ],
    [ // col 2: bottom → top
      ['v', 'v03', 'Arjun Mehta', 'Full Stack Developer, Zoho', 10, 'tall'],
      ['t', 't03', 'Karthik S', 'Applied Scientist, GoKwik', 'This journey blended theory with hands-on work, and it gave me the skills to tackle real problems in AI and ML.'],
      ['v', 'v04', 'Priya Reddy', 'Software Engineer, Deloitte', 8, 'wide'],
      ['t', 't04', 'Meera Pillai', 'ML Engineer, Fractal', 'Weekly reviews kept me honest. I stopped waiting for a lucky break and started building every day.'],
    ],
  ];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>';
  const video = ([, img, name, role, lpa, shape], dupe) => `
    <button class="ct__v ct__v--${shape}" type="button"${dupe ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="Play ${esc(name)}'s story"`}>
      <img src="assets/people/${img}.jpg" alt="" decoding="async">
      <span class="ct__pkg">₹${lpa} LPA</span>
      <span class="ct__play"><svg viewBox="0 0 14 14"><path d="M4.6 2.9v8.1l6.4-4z"/></svg></span>
      <span class="ct__meta"><span class="ct__name">${esc(name)}</span><br><span class="ct__role">${esc(role)}</span></span>
    </button>`;
  const text = ([, img, name, role, quote], dupe) => `
    <figure class="ct__t"${dupe ? ' aria-hidden="true"' : ''}>
      <div class="ct__stars" role="img" aria-label="5 out of 5">${STAR.repeat(5)}</div>
      <blockquote class="ct__q">“${esc(quote)}”</blockquote>
      <figcaption class="ct__by"><img src="assets/people/${img}.jpg" alt="" loading="lazy" width="43" height="43"><span><span class="ct__bn">${esc(name)}</span><br><span class="ct__br">${esc(role)}</span></span></figcaption>
    </figure>`;
  const item = (d, dupe) => (d[0] === 'v' ? video : text)(d, dupe);
  // each list is rendered twice so translating by -50% loops seamlessly
  const col = (list, dir) => `<div class="ct__col ct__col--${dir}"><div class="ct__track">${list.map(d => item(d)).join('')}${list.map(d => item(d, 1)).join('')}</div></div>`;
  sec.querySelector('.ct__cols').innerHTML = col(COLS[0], 'down') + col(COLS[1], 'up');

  /* ---------- Gravity avatars ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = sec.querySelector('.ct__canvas'), ctx = cv.getContext('2d');

  const P = {
    n: 36, r: 22,                   // count + avatar radius (44px circles)
    g: 1500, drag: .992,            // gravity px/s², air drag per step (soft "sand" fall)
    iters: 4, bounce: .2, floor: .85, fric: .1,
    pushR: 110, push: .04,          // cursor repel radius + strength (subtle)
    stagger: .06,                   // seconds between each avatar's release
    step: 1 / 120,
  };

  let W = 0, H = 0, DPR = 1, scale = 1, dirty = true;

  // one pre-rendered circular sprite per photo, shared by bodies
  const SPR = 128, PAD = 0, K = (SPR + PAD * 2) / SPR;
  const sprites = Array.from({ length: 16 }, (_, i) => {
    const c = document.createElement('canvas'); c.width = c.height = SPR + PAD * 2;
    const x = c.getContext('2d'), m = c.width / 2, r = SPR / 2, img = new Image();
    const paint = () => {
      x.clearRect(0, 0, c.width, c.height);
      x.save(); x.beginPath(); x.arc(m, m, r, 0, Math.PI * 2); x.clip();
      if (img.naturalWidth) x.drawImage(img, m - r, m - r, SPR, SPR); else { x.fillStyle = '#1e2a44'; x.fill(); }
      x.restore(); dirty = true;
    };
    img.onload = () => { paint(); wake(); };
    img.src = `assets/people/p${String(i + 1).padStart(2, '0')}.jpg`;
    paint();
    return c;
  });

  const rnd = gsap.utils.random;
  const bodies = Array.from({ length: P.n }, (_, i) => ({ base: P.r, spr: sprites[i % sprites.length], r: 0, x: 0, y: 0, px: 0, py: 0, a: 0, g: 0 }));

  function bounds(b) {
    if (b.y > H - b.r) { const vy = b.y - b.py; b.y = H - b.r; b.py = b.y + vy * P.bounce; b.px = b.x - (b.x - b.px) * P.floor; }
    else if (b.y < b.r) { if (b.in) { const vy = b.y - b.py; b.y = b.r; b.py = b.y + vy * P.bounce; } } // bodies parked above the section fall in freely
    else b.in = true;
    if (b.x < b.r) { const vx = b.x - b.px; b.x = b.r; b.px = b.x + vx * P.bounce; }
    else if (b.x > W - b.r) { const vx = b.x - b.px; b.x = W - b.r; b.px = b.x + vx * P.bounce; }
  }

  function collide(friction) {
    for (let i = 0; i < P.n; i++) {
      const a = bodies[i];
      for (let j = i + 1; j < P.n; j++) {
        const b = bodies[j], dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r;
        if (Math.abs(dx) >= min || Math.abs(dy) >= min) continue;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 < 1e-6) continue;
        const d = Math.sqrt(d2), ma = a.r * a.r, mb = b.r * b.r, inv = 1 / (ma + mb), o = (min - d) / d;
        a.x -= dx * o * mb * inv; a.y -= dy * o * mb * inv;
        b.x += dx * o * ma * inv; b.y += dy * o * ma * inv;
        if (friction) { // tangential friction so they stack into a mound instead of spreading flat
          const nx = dx / d, ny = dy / d, rvx = (b.x - b.px) - (a.x - a.px), rvy = (b.y - b.py) - (a.y - a.py), vn = rvx * nx + rvy * ny;
          const tx = (rvx - vn * nx) * P.fric * .5, ty = (rvy - vn * ny) * P.fric * .5;
          a.px -= tx; a.py -= ty; b.px += tx; b.py += ty;
        }
      }
    }
    for (const b of bodies) bounds(b);
  }

  const mouse = { x: 0, y: 0, on: false };
  function step() {
    const g = P.g * P.step * P.step;
    for (const b of bodies) {
      const drag = b.g ? P.drag : .999;
      let vx = (b.x - b.px) * drag, vy = (b.y - b.py) * drag;
      b.px = b.x; b.py = b.y;
      if (mouse.on) { // gentle push away from the cursor
        const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy), R = P.pushR + b.r;
        if (d < R && d > .01) { const f = (1 - d / R) * P.push * 10; vx += dx / d * f * P.step * 60; vy += dy / d * f * P.step * 60; }
      }
      b.x += vx; b.y += vy + g * b.g;
    }
    for (let k = 0; k < P.iters; k++) collide(k === P.iters - 1);
    for (const b of bodies) b.a += (b.x - b.px) / b.r * .5; // rolling
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const b of bodies) {
      const s = b.r * 2 * K, c = Math.cos(b.a) * DPR, n = Math.sin(b.a) * DPR;
      ctx.setTransform(c, n, -n, c, b.x * DPR, b.y * DPR);
      ctx.drawImage(b.spr, -s / 2, -s / 2, s, s);
    }
    dirty = false;
  }

  // zero-g start: scattered through the upper part of the section, drifting slowly
  function scatter() {
    const top = H * .6, sr = sec.getBoundingClientRect(), hr = sec.querySelector('.ct__copy').getBoundingClientRect();
    const hx0 = hr.left - sr.left - 24, hx1 = hr.left - sr.left + Math.min(hr.width, 720) + 24, hy0 = hr.top - sr.top - 24, hy1 = hr.bottom - sr.top + 24;
    for (const b of bodies) {
      b.r = b.base * scale; b.g = 0; b.a = rnd(-.3, .3);
      b.in = false;
      for (let t = 0; t < 12 && !b.in; t++) { // keep the heading readable: avoid its box
        b.x = rnd(b.r, W - b.r); b.y = rnd(b.r, top);
        b.in = b.x + b.r < hx0 || b.x - b.r > hx1 || b.y + b.r < hy0 || b.y - b.r > hy1;
      }
      if (!b.in) b.y = -rnd(b.r, 260); // no clear spot (narrow screens): park above the section
      b.px = b.x - rnd(-.25, .25); b.py = b.y - rnd(-.25, .25);
    }
    for (let k = 0; k < 30; k++) collide(false);
    dirty = true;
  }

  function size() {
    const oW = W, oH = H;
    W = sec.clientWidth; H = sec.clientHeight; DPR = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    scale = 1;
    for (const b of bodies) {
      b.r = b.base * scale;
      if (oW) { const vx = b.x - b.px, vy = b.y - b.py; b.x *= W / oW; b.y *= H / oH; b.px = b.x - vx; b.py = b.y - vy; bounds(b); }
    }
    dirty = true; wake();
  }

  // loop: only while visible; sleeps once everything has settled
  let visible = false, asleep = false, released = false, acc = 0, calm = 0;
  function wake() { asleep = false; calm = 0; }
  gsap.ticker.add((_t, dms) => {
    if (!visible) return;
    if (!asleep) {
      acc += Math.min(dms / 1000, 1 / 30);
      while (acc >= P.step) { step(); acc -= P.step; }
      let e = 0; for (const b of bodies) e += Math.abs(b.x - b.px) + Math.abs(b.y - b.py);
      calm = released && !mouse.on && bodies.every(b => b.g === 1) && e / P.n < .02 ? calm + 1 : 0;
      if (calm > 60) asleep = true;
      dirty = true;
    }
    if (dirty) draw();
  });

  const release = () => {
    if (released) return;
    released = true; wake();
    gsap.to(gsap.utils.shuffle(bodies.slice()), { g: 1, duration: .5, ease: 'power1.in', stagger: P.stagger });
  };
  const reset = () => { released = false; gsap.killTweensOf(bodies); scatter(); wake(); };

  sec.addEventListener('pointermove', e => {
    const r = sec.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    mouse.on = e.pointerType === 'mouse' && !e.target.closest('.ct__v, .ct__btn'); // only in open space
    wake();
  });
  sec.addEventListener('pointerleave', () => { mouse.on = false; });

  size(); scatter();
  new ResizeObserver(size).observe(sec);

  ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: s => { visible = s.isActive; sec.classList.toggle('is-off', !visible); if (visible) wake(); } });

  if (RM) { // no motion: show the settled pile once
    for (const b of bodies) b.g = 1;
    for (let i = 0; i < 900; i++) step();
    released = true; asleep = true; draw();
    return;
  }

  ScrollTrigger.create({ trigger: sec, start: 'top 55%', onEnter: release, onLeaveBack: reset });
})();
