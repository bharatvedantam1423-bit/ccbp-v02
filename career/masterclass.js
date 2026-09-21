/* Masterclasses from Mentors — data, rendering, scroll motion. */
(() => {
  // Content from ccbp.in → "Masterclasses from Mentors in the Community". Copy per Figma 778:1625.
  const MENTORS = [
    { name: 'Srividya Pranavi', img: 'srividya', role: 'Machine Learning Scientist', edu: 'Carnegie Mellon University, IIT Kharagpur' },
    { name: 'Sravya Nimmagadda', img: 'sravya', role: 'Senior Deep Learning Scientist, Autonomous Vehicles at NVIDIA', edu: 'Stanford, IIT Madras' },
    { name: 'Priyatham Bollimpalli', img: 'priyatham', role: 'Data & Applied Scientist II', edu: 'Carnegie Mellon University, IIT Guwahati' },
    { name: 'Vamsi Krishna', img: 'vamsi', role: 'AI & Quantum Computing, Google', edu: 'Georgia Institute of Technology, IIT Madras' },
  ];

  // Logos, trimmed from the ccbp.in logo wall (co-00…17) and the affiliation strip.
  const COMPANIES = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'VMware', 'Goldman Sachs',
    'PayPal', 'Samsung', 'Uber', 'Ola', 'Adobe', 'OYO',
    'Hotstar', 'Intel', 'NVIDIA', 'Walmart', 'Visa', 'eBay',
  ].map((name, i) => ({ name, src: `assets/masterclass/logos/co-${String(i).padStart(2, '0')}.png` }));

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M11 12h2v2h-2z"/></svg>',
    cap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v5"/></svg>',
  };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---- Mentor cards ----
  const grid = document.querySelector('.mc__grid');
  grid.insertAdjacentHTML('beforeend', MENTORS.map((m) => `
    <article class="mentor">
      <div class="mentor__top">
        <img class="mentor__avatar" src="assets/masterclass/avatar-${m.img}.jpg" alt="${esc(m.name)}" loading="lazy">
        <h3 class="mentor__name">${esc(m.name)}</h3>
      </div>
      <div class="mentor__panel">
        <p class="mentor__row">${ICON.bag}<span>${esc(m.role)}</span></p>
        <p class="mentor__row">${ICON.cap}<span>${esc(m.edu)}</span></p>
      </div>
    </article>`).join(''));

  // ---- Logo tickers: build S4 pattern — each set duplicated so translate −50% loops seamlessly ----
  const set = (list, hidden) => `<ul class="mc-ticker-set"${hidden ? ' aria-hidden="true"' : ''}>` +
    list.map((l) => `<li><img src="${l.src}" alt="${hidden ? '' : l.name}" decoding="async"></li>`).join('') + '</ul>';
  const row = (list, dir, dur) => `<div class="mc-ticker-row ${dir}" style="--tick-dur:${dur}s">${set(list)}${set(list, true)}</div>`;

  // Bottom: three lines of six, directions alternate (build DUR values)
  const DUR = [70, 64, 76];
  document.querySelector('[data-ticker="companies"]').innerHTML = DUR.map((d, r) => {
    const l = COMPANIES.slice(r * 6, r * 6 + 6);
    return row(l.concat(l), r % 2 ? 'to-left' : 'to-right', d);
  }).join('');

  // ---- Video: swap thumbnail for the YouTube player on click ----
  const video = document.querySelector('.mc__video');
  video.addEventListener('click', () => {
    if (video.classList.contains('is-playing')) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${video.dataset.yt}?autoplay=1&rel=0`;
    f.title = 'Sneak Peek Of Masterclass by Rakesh Misra';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    video.append(f);
    video.classList.add('is-playing');
  });

  // ---- Scroll-in: build "We train you for what companies hire for" pattern —
  //      each card grows from small to full size as it scrolls into view, never shrinks back.
  //      When all five are full size, the logo rows fade up (once). ----
  const ticker = document.querySelector('[data-ticker="companies"]');
  const cards = [video, ...grid.querySelectorAll('.mentor')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { ticker.classList.add('is-in'); return; }
  const MIN = 0.5, TRAVEL = 0.6;                    // start scale · viewport-heights of scroll to reach full size
  const target = cards.map(() => 0), cur = cards.map(() => 0);
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let tops = [], running = false, done = false;

  // untransformed page offsets, so the scale never feeds back into the measurement.
  // Re-read on every scroll: pinned sections above shift this section after load.
  const layout = () => { tops = cards.map((c) => { let y = 0, n = c; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; }); };
  const reveal = () => { if (done) return; done = true; ticker.classList.add('is-in'); };
  const render = () => cards.forEach((c, k) => {
    const p = ease(cur[k]);
    c.style.transform = p >= 1 ? '' : `scale(${MIN + (1 - MIN) * p})`;
    c.style.opacity = p >= 1 ? '' : 0.35 + 0.65 * p;
  });
  const measure = () => {
    layout();
    const vh = innerHeight, y = scrollY;
    const atEnd = y + vh >= document.documentElement.scrollHeight - 2;  // page can't scroll further: finish
    cards.forEach((_, k) => {
      const p = atEnd ? 1 : (y + vh - tops[k]) / (vh * TRAVEL);  // 0 as the card's top enters the viewport
      target[k] = Math.max(target[k], Math.min(1, Math.max(0, p)));
    });
    // every card has been scrolled to full size (or the logos are already on screen) → bring the logos in now
    if (target.every((v) => v >= 1) || ticker.getBoundingClientRect().top < vh) { target.fill(1); reveal(); }
  };
  const tick = () => {
    let moving = false;
    cards.forEach((_, k) => {
      const d = target[k] - cur[k];
      if (Math.abs(d) > 0.0005) { cur[k] += d * 0.18; moving = true; } else cur[k] = target[k];
    });
    render();
    if (moving) requestAnimationFrame(tick);
    else { running = false; if (done) removeEventListener('scroll', kick); }
  };
  const kick = () => { measure(); if (!running) { running = true; requestAnimationFrame(tick); } };

  cards.forEach((c) => { c.style.willChange = 'transform, opacity'; });
  layout(); render();
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { if (!done) kick(); });
  addEventListener('load', kick);
  kick();
})();
