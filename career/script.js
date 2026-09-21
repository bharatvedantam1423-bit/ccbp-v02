/* "Meet NxtWave Partners" playlist (first 10). img = portrait crop of the YouTube thumbnail, 9:16. id opens the video in the modal.
   logo = company mark in assets/hiring-logos (taken from each company's own site); without one the company name is set as a wordmark. */
const TESTIMONIALS = [
  { id: "K_mIDRkBEGw", name: "Chaitanya Arikati",   role: "Head of Talent Acquisition", co: "Abjayon",              logo: "abjayon.svg", dur: "1:42" },
  { id: "LIb3_AyZ_wQ", name: "Raja Sekhar",         role: "Senior HR Executive",        co: "West Agile Labs",                            dur: "2:11" },
  { id: "hUfEOmF9TaQ", name: "Pavan Kumar",         role: "Founder & CEO",              co: "ProCorp",              logo: "procorp.png", dur: "1:53" },
  { id: "6EiBJ37MMFc", name: "Vinay Nawale",        role: "Head of Human Resources",    co: "GS Tech Technologies",                       dur: "1:37" },
  { id: "f1k5caShuOY", name: "Gopal Parvathaneni",  role: "Chairman & CEO",             co: "EPSoft",               logo: "epsoft.png",  dur: "1:33" },
  { id: "cYa8QopFaEY", name: "Vasu Adunutula",      role: "Co-Founder",                 co: "Cybersophy",                                 dur: "1:11" },
  { id: "_D9WGUpBZsM", name: "Vamshi Priya",        role: "HR Recruiter",               co: "Tvisha",               logo: "tvisha.png",  dur: "2:03" },
  { id: "zApgysr1Dqk", name: "Omkar Tadepalli",     role: "MD & CEO",                   co: "Caprus IT",            logo: "caprus.png",  dur: "1:50" },
  { id: "G7k29X1Q5V8", name: "Pradeep Kanneganti",  role: "CEO & Founder",              co: "Coretek Labs",         logo: "coretek.svg", dur: "2:12" },
  { id: "Bltckr4HX-w", name: "Anukriti Rai",        role: "Solutions Engineer",         co: "Nuron",                                      dur: "1:37" },
].map((t, i) => ({ ...t, img: `assets/people/hp${String(i + 1).padStart(2, "0")}.jpg` }));

const track = document.getElementById("ht-track");
const PLAY = '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>';

track.innerHTML = TESTIMONIALS.map((t, i) => `
  <li class="ht__card" style="z-index:${TESTIMONIALS.length - i}">
    <button class="ht__media" data-id="${t.id}" aria-label="Play: ${t.name}, ${t.role}, ${t.co}">
      <img src="${t.img}" alt="${t.name}" ${i > 4 ? 'loading="lazy"' : ""} decoding="async">
      <span class="ht__play">${PLAY}</span><span class="ht__dur">${t.dur}</span>
    </button>
    <div class="ht__label"><p class="ht__name">${t.name}</p><p class="ht__role">${t.role}</p>
      <p class="ht__co">${t.logo ? `<img src="assets/hiring-logos/${t.logo}" alt="${t.co}" loading="lazy">` : `<span>${t.co}</span>`}</p></div>
  </li>`).join("");

const cards  = [...track.children];
/* logos of very different shapes get the same visual weight: height from a constant area, clamped */
const fitLogo = im => { const r = im.naturalWidth / im.naturalHeight || 3;
  im.style.height = Math.min(26, Math.max(14, Math.sqrt(1500 / r)), 124 / r) + "px"; };
track.querySelectorAll(".ht__co img").forEach(im => im.complete ? fitLogo(im) : im.addEventListener("load", () => fitLogo(im), { once: true }));
const labels = cards.map(c => c.querySelector(".ht__label"));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scroll animation: deck rises with scroll → fans out into a row. Plays once, never reverses. ---------- */
if (!reduce && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  const deck = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--deck")) || 14;
  // x that collapses each card onto card 0, fanned slightly so the edges peek out like the reference
  const stackX = (i) => cards[0].offsetLeft - cards[i].offsetLeft + Math.min(i, 3) * deck();
  let done = false;

  gsap.set(cards, { x: stackX });
  gsap.set(labels, { autoAlpha: 0, y: 10 });

  // 1) the stacked deck travels up with the scroll (only until it lands).
  //    Driven by onUpdate rather than a scrubbed tween: a ScrollTrigger refresh (e.g. the late window "load"
  //    once the photos arrive) reverts + re-renders a scrubbed tween, which made the deck jump back down mid-scroll.
  const rail = document.querySelector(".ht__rail");
  const lift = () => innerHeight * 0.55;
  gsap.set(rail, { y: lift() });
  const toY = gsap.quickTo(rail, "y", { duration: 0.6, ease: "power3" });
  const rise = ScrollTrigger.create({
    trigger: ".ht", start: "top bottom", end: "top 20%",
    onUpdate: (s) => toY((1 - s.progress) * lift()),
    onRefresh: (s) => toY((1 - s.progress) * lift()),
  });

  // 2) once it lands, the deck spreads into the row — one-shot
  const spread = () => {
    if (done) return;
    done = true;
    rise.kill();
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .to(rail, { y: 0, duration: 0.6, ease: "power3.out", overwrite: true }, 0)
      .to(cards, { x: 0, duration: 1.3, stagger: 0.045 }, 0)
      .to(labels, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out" }, 0.35)
      .add(() => gsap.set(cards, { clearProps: "transform" }));
  };
  ScrollTrigger.create({ trigger: ".ht", start: "top 20%", once: true, onEnter: spread });
  // page reloaded below the section → show the finished state straight away
  ScrollTrigger.create({ trigger: ".ht", start: "top 20%", once: true, onLeave: spread });

  // keep the collapsed positions correct after resizes while the deck is still stacked
  ScrollTrigger.addEventListener("refreshInit", () => { if (!done) gsap.set(cards, { x: 0 }); });
  ScrollTrigger.addEventListener("refresh",     () => { if (!done) gsap.set(cards, { x: stackX }); });
}

/* ---------- Horizontal rail: arrows + mouse drag ---------- */
const [prev, next] = document.querySelectorAll(".ht__arrow");
const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
const syncArrows = () => {
  prev.disabled = track.scrollLeft < 4;
  next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
};
document.querySelectorAll(".ht__arrow").forEach(b =>
  b.addEventListener("click", () => track.scrollBy({ left: step() * b.dataset.dir, behavior: "smooth" })));
track.addEventListener("scroll", syncArrows, { passive: true });
addEventListener("resize", syncArrows);
syncArrows();

let down = null, moved = false;
track.addEventListener("pointerdown", e => {
  if (e.pointerType !== "mouse") return;
  down = { x: e.clientX, s: track.scrollLeft }; moved = false;
});
addEventListener("pointermove", e => {
  if (!down) return;
  const dx = e.clientX - down.x;
  if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("drag"); }
  if (moved) track.scrollLeft = down.s - dx;
});
addEventListener("pointerup", () => {
  if (!down) return;
  down = null;
  if (moved) {
    // let snap re-engage from the current position
    const i = Math.round(track.scrollLeft / step());
    track.classList.remove("drag");
    track.scrollTo({ left: i * step(), behavior: "smooth" });
  }
});

/* ---------- Video modal ---------- */
const modal = document.getElementById("ht-modal");
const frame = modal.querySelector(".ht__frame");
track.addEventListener("click", e => {
  const m = e.target.closest(".ht__media");
  if (!m || moved || !m.dataset.id) return;
  frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${m.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  modal.showModal();
});
const close = () => { modal.close(); frame.innerHTML = ""; };
modal.querySelector(".ht__close").addEventListener("click", close);
modal.addEventListener("click", e => { if (e.target === modal) close(); });
modal.addEventListener("close", () => { frame.innerHTML = ""; });

/* What companies look for now — each card grows from small to full size as it scrolls into view (one-way) */
addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.wl__card, .fm__card')];
  if (!cards.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const MIN = 0.5, TRAVEL = 0.6;                    // start scale · viewport-heights of scroll to reach full size
  const target = cards.map(() => 0), cur = cards.map(() => 0);
  const ease = t => 1 - Math.pow(1 - t, 3);
  let tops = [], running = false;

  // untransformed page offsets, so the scale never feeds back into the measurement
  const layout = () => { tops = cards.map(c => { let y = 0, n = c; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; }); };
  const render = () => cards.forEach((c, k) => {
    const p = ease(cur[k]);
    c.style.transform = p >= 1 ? '' : `scale(${MIN + (1 - MIN) * p})`;
    c.style.opacity = p >= 1 ? '' : 0.35 + 0.65 * p;
  });
  const measure = () => {
    const vh = innerHeight, y = scrollY;
    cards.forEach((_, k) => {
      const p = (y + vh - tops[k]) / (vh * TRAVEL);  // 0 as the card's top enters the viewport
      target[k] = Math.max(target[k], Math.min(1, Math.max(0, p)));  // never shrinks back
    });
  };
  const tick = () => {
    let moving = false;
    cards.forEach((_, k) => {
      const d = target[k] - cur[k];
      if (Math.abs(d) > 0.0005) { cur[k] += d * 0.12; moving = true; } else cur[k] = target[k];
    });
    render();
    if (moving) requestAnimationFrame(tick); else running = false;
  };
  const kick = () => { measure(); if (!running) { running = true; requestAnimationFrame(tick); } };

  cards.forEach(c => { c.style.willChange = 'transform, opacity'; });
  layout(); render();
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { layout(); kick(); });
  addEventListener('load', () => { layout(); kick(); });
  kick();
});

/* What companies look for now — click (or Enter/Space) zooms the card's image; one card at a time, Esc resets */
(() => {
  const cards = [...document.querySelectorAll('.wl__card')];
  const toggle = card => {
    const on = !card.classList.contains('is-zoomed');
    cards.forEach(c => c.classList.remove('is-zoomed'));
    if (on) card.classList.add('is-zoomed');
  };
  cards.forEach(c => {
    c.tabIndex = 0;
    c.addEventListener('click', () => toggle(c));
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c); } });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') cards.forEach(c => c.classList.remove('is-zoomed')); });
})();
