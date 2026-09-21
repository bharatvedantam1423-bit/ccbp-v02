/* NxtWave Learner's Experiences — big player + a carousel of stills (Figma CCBP-v02 828:149).
   Five stills fit the strip at a time; the arrows page through the rest. */
(() => {
  /* Stills are the client's own cards (assets/learners), at the proportions the Figma frame uses.
     The ids are still stand-ins — NxtWave videos already used in this build — because
     youtube.com/@NxtWaveTech is unreachable from here: swap each id for its real video. */
  const L = 'assets/learners/';
  /* V[0] is the card in the big slot; the rest fill the strip, so no still appears twice */
  const V = [
    { id: 'fpPwEFB86d4', t: 'Why I joined NxtWave after 1st year', img: L + 'why-i-joined.webp' },
    { id: 'K_mIDRkBEGw', t: 'From Mechanical Engineer to IT Pro with NxtWave \u2014 Praveen Chasta, Frontend Developer at Pleximus', img: L + 'praveen-chasta.png' },
    { id: 'hUfEOmF9TaQ', t: 'Associate Engineer \u2014 Lakshmi Agraharapu, BSc Mathematics graduate', img: L + 'lakshmi-agraharapu.png' },
    { id: 'f1k5caShuOY', t: 'Upskilling myself with NxtWave \u2014 Shri Nakshathi, student at NxtWave', img: L + 'shri-nakshathi.png' },
    { id: 'zApgysr1Dqk', t: 'NxtWave offered a career, not a placement \u2014 Bharathidevi Mogalapu, NxtWave alumna', img: L + 'bharathidevi-mogalapu.png' },
    { id: '6EiBJ37MMFc', t: 'How I learnt tech skills from scratch \u2014 NxtWave CCBP 4.0 success review (Telugu)', img: L + 'how-i-learnt-tech-skills.png' },
  ];



  const player = document.getElementById('ctf-player');
  const rail = document.getElementById('ctf-rail');
  if (!player || !rail || !V.length) return;
  const arrows = [...(rail.closest('.ctf__carousel')?.querySelectorAll('.ctf__arrow') || [])];

  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>';
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  let at = 0, playing = false;

  const poster = () => {
    player.classList.remove('is-live');
    player.innerHTML = `<button class="ctf__poster" type="button" aria-label="Play: ${esc(V[at].t)}">
      <img src="${V[at].img}" alt="" decoding="async">
      <span class="ctf__play">${PLAY}</span></button>`;
  };
  const play = () => {
    playing = true;
    player.classList.add('is-live');   /* the box opens to 16:9 for the embed */
    player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${V[at].id}?autoplay=1&rel=0"
      title="${esc(V[at].t)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  };
  const mark = () => rail.querySelectorAll('.ctf__thumb').forEach(b => {
    const on = +b.dataset.k === at;
    b.parentElement.classList.toggle('ctf__item--on', on);
    b.setAttribute('aria-current', on ? 'true' : 'false');
  });

  rail.innerHTML = V.slice(1).map((v, i) => `
    <li class="ctf__item">
      <button class="ctf__thumb" type="button" data-k="${i + 1}" aria-current="false" aria-label="Play: ${esc(v.t)}">
        <img src="${v.img}" alt="" ${i > 3 ? 'loading="lazy"' : ''} decoding="async">
      </button>
    </li>`).join('');
  poster();

  player.addEventListener('click', e => { if (e.target.closest('.ctf__poster')) play(); });
  rail.addEventListener('click', e => {
    const b = e.target.closest('.ctf__thumb');
    if (!b) return;
    const k = +b.dataset.k;
    if (k === at && playing) return;          // already in the big slot and running
    at = k; mark();
    /* a pick from the strip plays it: the strip's art is cut for the wide slot, the video isn't */
    play();
  });

  /* carousel: the arrows page the strip by one full row of stills */
  const ends = () => {
    const max = rail.scrollWidth - rail.clientWidth - 1;
    arrows.forEach(a => a.disabled = +a.dataset.dir < 0 ? rail.scrollLeft <= 1 : rail.scrollLeft >= max);
    arrows.forEach(a => a.hidden = max <= 1);
  };
  arrows.forEach(a => a.addEventListener('click', () => {
    rail.scrollBy({ left: +a.dataset.dir * rail.clientWidth, behavior: 'smooth' });
  }));
  rail.addEventListener('scroll', ends, { passive: true });
  addEventListener('resize', ends);
  ends();
})();
