/* What Our Learners Have Built — centre carousel.
   • The page scrolls normally; the section is never pinned.
   • Horizontal trackpad swipes (or shift + wheel) over the cards move the rail in the swipe direction.
   • Opens on card 3 (START) with neighbours on both sides.
   • Arrows, drag, clicking a side card and ←/→ keys also work. The centre card is full size, the rest are at --side scale.
   • The entrance plays once and never replays when scrolling back up. */
(() => {
  const P = window.PROJECTS, N = P.length;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.querySelector(".lb");
  const stage = document.querySelector(".lb__stage");
  const track = document.getElementById("lb-track");
  const [prev, next] = document.querySelectorAll(".lb__arrow");
  const GO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  track.innerHTML = P.map((p, i) => `
    <li class="lb__card" data-i="${i}" aria-roledescription="slide" aria-label="${i + 1} of ${N}: ${p.name}">
      <div class="lb__media"><img src="${p.img}" alt="${p.name}" draggable="false"${i > 3 ? ' loading="lazy"' : ""}></div>
      <div class="lb__label">
        <div class="lb__text"><h3 class="lb__name">${p.name}</h3><p class="lb__desc">${p.desc}</p></div>
        <a class="lb__go" href="${p.href}"${p.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""} aria-label="View ${p.name} details">${GO}</a>
      </div>
    </li>`).join("");
  const cards = [...track.children];

  /* ---------- layout ---------- */
  const START = 2;                              // opens on card 3, so both sides of the rail are filled
  const state = { p: START };
  let cw = 0, side = .86, gap = 24, active = -1, target = START;
  const unit = () => cw * side + gap;
  const measure = () => {
    cw = cards[0].offsetWidth;
    const cs = getComputedStyle(section);   // tokens are scoped to .lb in the build
    side = parseFloat(cs.getPropertyValue("--side")) || .86;
    gap = parseFloat(cs.getPropertyValue("--gap")) || 24;
  };
  const render = () => {
    const u = unit(), half = cw * (1 - side) / 2, lim = innerWidth / 2 + cw;
    cards.forEach((c, i) => {
      const d = i - state.p, a = Math.min(Math.abs(d), 1);
      const x = d * u + Math.sign(d) * a * half;
      gsap.set(c, { x, yPercent: -50, scale: 1 - (1 - side) * a, visibility: Math.abs(x) > lim ? "hidden" : "visible" });
    });
    const r = Math.max(0, Math.min(N - 1, Math.round(state.p)));
    if (r !== active) {
      cards[active]?.classList.remove("is-active");
      cards[r].classList.add("is-active");
      active = r;
      prev.disabled = r === 0; next.disabled = r === N - 1;
    }
  };
  measure(); render();

  /* one tween drives every input: move `target`, the rail eases to it */
  const clamp = v => Math.max(0, Math.min(N - 1, v));
  const glide = (t, dur = .7) => { target = t; gsap.to(state, { p: t, duration: RM ? 0 : dur, ease: "power3.out", onUpdate: render, overwrite: true }); };
  const go = i => glide(clamp(i));

  /* smooth page scroll: the build already runs Lenis (NW.lenis) wired to ScrollTrigger */
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- trackpad: horizontal swipe over the cards; vertical scroll stays with the page ---------- */
  let idle;
  stage.addEventListener("wheel", e => {
    const dx = e.deltaX || (e.shiftKey ? e.deltaY : 0);
    if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY)) return;          // mostly vertical → page scroll
    e.preventDefault(); e.stopPropagation();                                  // no browser back-swipe, no Lenis
    const px = e.deltaMode === 1 ? dx * 16 : dx;
    glide(Math.max(-.25, Math.min(N - .75, target + px / unit())), .5);
    clearTimeout(idle);
    idle = setTimeout(() => go(Math.round(target)), 120);                     // settle on the nearest card
  }, { passive: false });

  /* ---------- arrows, clicks, keys ---------- */
  [prev, next].forEach(b => b.addEventListener("click", () => go(active + +b.dataset.dir)));
  let moved = false;
  track.addEventListener("click", e => {
    if (moved) { e.preventDefault(); return; }
    const c = e.target.closest(".lb__card");
    if (c && +c.dataset.i !== active) { e.preventDefault(); go(+c.dataset.i); }
  });
  addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const r = section.getBoundingClientRect();
    if (r.top < innerHeight * .5 && r.bottom > innerHeight * .5) { e.preventDefault(); go(active + (e.key === "ArrowRight" ? 1 : -1)); }
  });

  /* ---------- drag (mouse + touch; touch-action:pan-y keeps vertical swipes for the page) ---------- */
  let drag = null;
  track.addEventListener("pointerdown", e => { drag = { x: e.clientX, p: state.p, t: performance.now(), v: 0 }; moved = false; gsap.killTweensOf(state); });
  addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) < 6) return;
    moved = true; track.classList.add("drag");
    const now = performance.now(), np = Math.max(-.3, Math.min(N - .7, drag.p - dx / unit()));
    drag.v = (np - state.p) / Math.max(1, now - drag.t) * 16; drag.t = now;
    state.p = target = np; render();
  });
  const up = () => {
    if (!drag) return;
    const t = Math.round(state.p + drag.v * 6);
    drag = null; track.classList.remove("drag");
    if (moved) go(t);
    setTimeout(() => (moved = false));
  };
  addEventListener("pointerup", up); addEventListener("pointercancel", up);

  /* ---------- grid floor: slow forward drift, only while the section is on screen ---------- */
  if (!RM) {
    const drift = gsap.to(".lb__plane", { backgroundPosition: "0 64px", duration: 2.4, ease: "none", repeat: -1, paused: true });
    ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onToggle: s => s.isActive ? drift.play() : drift.pause() });
  }

  /* ---------- entrance: plays once, never on the way back up ---------- */
  if (!RM) {
    gsap.set([".lb__title", ".lb__sub", ".lb__nav"], { autoAlpha: 0, y: 24 });
    gsap.set(cards, { opacity: 0, y: 70 });
    ScrollTrigger.create({
      trigger: section, start: "top 75%", once: true,
      onEnter: () => gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".lb__title", { autoAlpha: 1, y: 0, duration: .9 })
        .to(".lb__sub", { autoAlpha: 1, y: 0, duration: .8 }, "-=.7")
        .to(cards, { opacity: 1, y: 0, duration: 1.1, stagger: { each: .08, from: START } }, "-=.6")   // centre card first, then outward
        .to(".lb__nav", { autoAlpha: 1, y: 0, duration: .7 }, "-=.8"),
    });
  }

  addEventListener("resize", () => { measure(); render(); });
})();
