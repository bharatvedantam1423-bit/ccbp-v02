/* Featured in the media — 33 articles scraped from niatindia.com, in their order.
   [publication logo, date, cover image, headline, article url]; images are framerusercontent ids. */
(() => {
  const F = 'assets/media/';   /* bundled local copies of the niatindia.com covers + publication logos */
  const L = { indiaToday:'ahfgYhWmI376HHvlCHAHZi7iMf4.png', cxo:'D7pNDe5e6TLTNIFG0oIzt90DiKo.png', bs:'DN4nOqtDMSLUOr9jYLA2zCHU.png', et:'2gj1cWR4JqTao4UdCmXdXwxVMY0.png', ht:'ytvrCANXXC03bkG3ltcfWVFbVA.webp', print:'tOVc8h6GG2MMadkWL5NFthw7c.png', ys:'fMUqMKrVWrHzvqw02jieXptY6yc.svg', fe:'UwVhhWt3DxYnDYScmZPVrn3Wpzc.png', ttoday:'ShfRADfHXHbr7zIqeFNyHy3eXHw.png' };
  const A = [
    [L.indiaToday,'19 Feb 2026','xi5VnaamN4Br8dNycFjp0OLU48.webp',"Meet the winners of India’s largest GenAI buildathon at India AI Impact Summit 2026",'https://www.indiatoday.in/education-today/news/story/meet-the-winners-of-indias-largest-genai-buildathon-at-india-ai-impact-summit-2026-2870537-2026-02-19'],
    [L.cxo,'23 Feb 2026','3zq8qRFqUsZsADQnI01KYWGRuc.jpg',"NxtWave and Automation Anywhere Launch India’s Largest AI & Agentic Process Automation (APA) Upskilling Initiative",'https://cxotoday.com/media-coverage/nxtwave-and-automation-anywhere-launch-indias-largest-ai-agentic-process-automation-apa-upskilling-initiative/'],
    [L.bs,'09 March 2026','krZDWpBsncwt7rRpwL9syFM8as.png',"NIAT is Empowering Universities to Deliver NEP-Aligned, Industry-Ready Education",'https://www.business-standard.com/content/press-releases-ani/niat-is-empowering-universities-to-deliver-nep-aligned-industry-ready-education-125060600289_1.html'],
    [L.et,'23 Oct 2025','0uPvMxmQxqy7vPGdxYyDtSMY8ng.jpg',"Empowering every learner: How AI is transforming education beyond metros",'https://etedge-insights.com/industry/education/empowering-every-learner-how-ai-is-transforming-education-beyond-metros/'],
    [L.ht,'05 June 2025','hSMYK3vPhRLfDGWuDjaiRLKwoWo.png',"OpenAI Academy & NxtWave (NIAT) Launch India’s Largest GenAI Innovation Challenge for Students",'https://www.hindustantimes.com/brand-stories/openai-academy-nxtwave-niat-launch-india-s-largest-genai-innovation-challenge-for-students-101749136157355.html'],
    [L.print,'22 May 2025','Z4lYlSv9S315stx1HLHffODtFI.jpg',"NIAT Students Win Big at Hackathons, Showcasing Innovation, Leadership, and the Power of Future-Ready Learning",'https://theprint.in/ani-press-releases/niat-students-win-big-at-hackathons-showcasing-innovation-leadership-and-the-power-of-future-ready-learning/2634283/'],
    [L.indiaToday,'16 May 2025','AxymKlawGnGaQnnGGgbjDuy2XA.png','India’s Tier-2 and Tier-3 cities are the new tech talent hubs','https://bestcolleges.indiatoday.in/news-detail/indias-tier-2-and-tier-3-cities-are-the-new-tech-talent-hubs-3500'],
    [L.ys,'13 May 2025','ob3olocrSczfoMIwQQJuXcSYWhU.png',"India’s physical AI moment: Building next-gen autonomous vehicles",'https://yourstory.com/2025/05/indias-physical-ai-moment-building-a-next-gen-autonomous-vehicles'],
    ['nLYbCjFDOM6zjSkPmOnvP0wN2ic.png','26 Feb 2024','SW9L2iB9QGVa8IGVLryga7vMvM0.png',"Forbes India 30 Under 30 2024: How Anupam Pedarla and Sashank Reddy Gujjula are preparing industry-ready candidates",'https://www.forbesindia.com/article/30-under-30-2024/anupam-pedarla-and-sashank-reddy-gujjula-bridging-the-gap/91651/1'],
    ['TxrnMm2oSomvy9vwpcesZZ1SWm4.png','21 Feb 2023','RWnP6p8gjCiBjYAqjeOTO8OZ70.jpg','Edtech startup NxtWave raises $33 million in fresh funding','https://economictimes.indiatimes.com/tech/funding/nxtwave-raises-33-million-in-funding-round-led-by-greater-pacific-capital/articleshow/98112172.cms'],
    [L.indiaToday,'27 Apr 2025','gqYNywktibAlux6cRR7tWro78mA.jpg',"Navigating the AI and Robotics revolution: Courses for students to pursue",'https://bestcolleges.indiatoday.in/news-detail/navigating-the-ai-and-robotics-revolution-courses-for-students-to-pursue'],
    [L.ht,'04 Sep 2024','d5z6Ba9duTmuB8kbmPvkDVm1To.jpg',"NxtWave and NSDC launch SkillUp India 4.0, aims to empower over 30 lakh students",'https://www.hindustantimes.com/education/news/nxtwave-and-nsdc-launch-skillup-india-4-0-aims-to-empower-over-30-lakh-students-101725365770655.html'],
    ['3t9YXsu5qSJnDH676d1oS6g5ZY.jpg','15 Apr 2025','81U3FzPe5R9o064xmB9saGrBfI.jpg',"Bridging the Skills Gap: Connecting Academia with Industry",'https://www.deccanchronicle.com/jobs-and-education/bridging-the-skills-gap-connecting-academia-with-industry-1873051'],
    ['OwyKXrrnWIerlcXDb105aDTWiE.png','30 Apr 2025','aINYG0mdYxFD4V6A6Lgmhz2gRZY.webp','Practical Learning Models Drive India’s AI Ambitions','https://www.bweducation.com/article/practical-learning-models-drive-indias-ai-ambitions-555395'],
    [L.fe,'06 June 2025','kb0uWjHKLpbzd2M0NVq8OfbLGDs.webp','‘India can be a global leader in physical AI,’ says Rahul Attuluri','https://www.financialexpress.com/life/technology-india-can-be-a-global-leader-in-physical-ai-says-rahul-attuluri-3808662/'],
    ['qclrrFInDDuNwFxHStLKOz5RtU.jpg','16 Feb 2024','LgDBkUUKqMceG4ntMmUe4iBb4aU.png',"NxtWave founders earn the prestigious Forbes India 30 Under 30 in the education category for empowering Tier-2, 3 and 4 college students",'https://www.theweek.in/wire-updates/business/2024/02/16/dcm54-nxtwave.html'],
    [L.ys,'21 Feb 2023','tT56FJVvYmRXksroXqVYNu7jyc.png',"Edtech startup NxtWave raises $33M in Series A round led by Greater Pacific Capital",'https://yourstory.com/2023/02/edtech-startup-nxtwave-series-a-funding-greater-pacific-capital'],
    [L.fe,'17 Apr 2023','9fuqKwmGgazovsqSH3TGGx2Ih8.png',"APIS partners with NxtWave Disruptive Technologies to enhance startup ecosystem in AP",'https://www.financialexpress.com/jobs-career/education-apis-partners-with-nxtwave-disruptive-technologies-to-enhance-startup-ecosystem-in-ap-3050509/'],
    [L.print,'03 May 2023','vfV8t1GYIs077Z1wh2CQUlPQgtM.png',"1,500 Companies Hire NxtWave Graduates as the Startup Continues to Revolutionize the Tech Employment Landscape",'https://theprint.in/ani-press-releases/1500-companies-hire-nxtwave-graduates-as-the-startup-continues-to-revolutionize-the-tech-employment-landscape/1734478/'],
    [L.fe,'13 Sep 2023','U1osqP85nxmwRkZXED0gEh9EUSw.png',"NxtWave aims to empower tech students with Generative AI workshop on World Youth Skills Day",'https://www.financialexpress.com/jobs-career/education-nxtwave-aims-to-empower-tech-students-with-generative-ai-workshop-on-world-youth-skills-day-3170269/'],
    [L.cxo,'30 Nov 2023','xhOT2jgH6nPkTxV5VZ6Y2bbjI4.png','NxtWave Awarded the Startup Spotlight Award by T-Hub','https://cxotoday.com/media-coverage/nxtwave-awarded-the-startup-spotlight-award-by-t-hub/'],
    [L.fe,'10 Apr 2023','hPRQ8bCzNenDYYHIILNGA0kyXzI.png',"NxtWave hosts 4-day ‘4.0 Tech Camp’ in Dubai to upskill students in emerging technologies",'https://www.financialexpress.com/jobs-career/education-nxtwave-hosts-4-day-4-0-tech-camp-in-dubai-to-upskill-students-in-emerging-technologies-3041040/'],
    ['GlvLywRhm4NOmuYtA0B9vT7Kho.png','05 Oct 2023','XkZ1enagdPT67VAJtkYqOzLfs.png',"NxtWave Marks Impactful CSR Initiatives and Blood Donation Drive",'https://www.csrmandate.org/nxtwave-marks-impactful-csr-initiatives-and-blood-donation-drive/'],
    ['hngrb9AL4JeYUGMKvJJuYDIrM8.png','30 Nov 2023','j1mOoTSDgqA4Rf9rEuker5cu1QY.png',"NxtWave Graduates Shine at the 2nd Kaushal Deekshant Samaroh, New Delhi, Organised by the Ministry of Skill Development and Entrepreneurship",'https://businessnewsthisweek.com/business/nxtwave-graduates-shine-at-the-2nd-kaushal-deekshant-samaroh-new-delhi/'],
    [L.fe,'26 Sep 2023','NsplL7JsT7fe6NxL4dEBlNtmOmQ.png',"NxtWave to host workshop on ‘Ethical Hacking – Building India’s Cyber Army’",'https://www.financialexpress.com/jobs-career/education-nxtwave-to-host-workshop-on-ethical-hacking-building-indias-cyber-army-3255252/'],
    ['azZzOZoucHAM2Ny65pwoSEK9S1Y.png','13 Jun 2024','lvRE1NGG7DrJxMPHXdqlLaUYFbQ.png',"NxtWave has been named a Tech Pioneer 2024 by the World Economic Forum",'https://timesofindia.indiatimes.com/india/wef-recognises-edtech-startup-as-tech-pioneer-2024/articleshow/110973253.cms'],
    ['cYhikmiBBJnT4QawISTn4bS8Jlg.png','03 Sep 2024','HUPFCKF8NS7MV0zAVJFOYTc14c.png',"NSDC, NxtWave join hands to skill 3 million students in AI and ML",'https://www.cnbctv18.com/education/nsdc-nxtwave-mou-skill-india-mission-ai-ml-workshops-3-million-students-19470158.htm'],
    [L.indiaToday,'08 Oct 2024','WfvCnYQZJP4unFn5CZ2X58kJUg.png',"Over 2000 Companies Hire NxtWave Learners",'https://www.indiatoday.in/pr-newswire?rkey=20241008EN25620'],
    [L.fe,'11 Jun 2024','lvRE1NGG7DrJxMPHXdqlLaUYFbQ.png',"NxtWave recognized as a ‘Technology Pioneer’ by World Economic Forum",'https://www.financialexpress.com/jobs-career/education/nxtwave-recognized-as-a-technology-pioneer-by-world-economic-forum/3522172/'],
    [L.ttoday,'01 Jun 2025','CigQSRhoABLGcVTXxBHghquceqU.webp',"NIAT is Empowering Universities to Deliver NEP-Aligned, Industry-Ready Education",'https://telanganatoday.com/niat-is-empowering-universities-to-deliver-nep-aligned-industry-ready-education'],
    ['zwEh7lTHMg9cvkaTuLNfeBSqMp0.png','7 Months ago','IiTw52Lcg1bhYu1lhrxIpPGhkwU.jpeg',"NIAT’s new campaign ‘Built By Skills’ puts the spotlight back on what matters most on World Youth Skills Day",'https://www.adgully.com/post/3923/niats-new-campaign-built-by-skills-puts-the-spotlight-back-on-what-matters-most-on-world-youth-skills-day'],
    ['5u2EIBJ7FYnB8r2aFVDR2HdqBo.png','29 Jun 2025','IyH13MAGQXHzc8Q6z9QQL1WqrQA.jpg',"Rahul Attuluri of NxtWave and NIAT spotlights India’s upskilling revolution helping career opportunities in the age of AI",'https://education21.in/rahul-attuluri-of-nxtwave-and-niat-spotlights-indias-upskilling-revolution-helping-career-opportunities-in-the-age-of-ai/'],
    [L.ttoday,'22 Jun 2025','Lh8yywkZ7P5R3g1Js74sAOkZhM.webp',"Over 600 students take part in NIAT’s ‘Build for Telangana Hackathon’",'https://telanganatoday.com/over-600-students-take-part-in-niats-build-for-telangana-hackathon'],
  ];
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const pub = u => new URL(u).hostname.replace(/^www\./,'');
  /* publication logos trimmed to their ink (assets/media/trim) so every mark can be sized on the same rule */
  const logo = f => F + (f.endsWith('.svg') ? f : 'trim/' + f.replace(/\.\w+$/, '.png'));
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  /* HD covers (article originals where the source had them) */
  /* text-poster covers that lose their words in the tall desktop slot of the two stacked cards get a square re-framing */
  const SQ = new Set(['krZDWpBsncwt7rRpwL9syFM8as.png']);
  const cover = img => F + 'hd/' + img.replace(/\.\w+$/, '') + '.jpg?v=2';   /* v=2: covers re-cropped (baked-in side strips removed) — busts stale browser caches */
  const card = ([lg,date,img,title,url], i) => `
    <li class="fm__card${i === 0 ? ' fm__card--feat' : ''}">
      <a class="fm__link" href="${url}" target="_blank" rel="noopener" aria-label="${esc(title)} — ${pub(url)}, ${date}">
        <div class="fm__body">
          <div class="fm__top"><img class="fm__logo" src="${logo(lg)}" alt="${pub(url)}" loading="lazy"><span class="fm__date">${date}</span></div>
          <h3 class="fm__h">${esc(title)}</h3>
          <span class="fm__cta">View More${ARROW}</span>
        </div>
        <picture class="fm__img">${SQ.has(img) && (i === 1 || i === 2) ? `<source media="(min-width:1181px)" srcset="${cover(img).replace('.jpg', '-sq.jpg')}">` : ''}<img src="${cover(img)}" alt="" loading="lazy"></picture>
      </a>
    </li>`;
  const grid = document.getElementById('fm-grid'), more = document.getElementById('fm-more');
  /* equal visual weight: height from a constant logo area, clamped so tall and very wide marks stay legible */
  const fit = im => { const r = im.naturalWidth / im.naturalHeight || 4;
    const h = Math.min(22, Math.max(11, Math.sqrt(1400 / r))); im.style.height = Math.min(h, 140 / r) + 'px'; };
  let shown = 0;
  const add = n => {
    grid.insertAdjacentHTML('beforeend', A.slice(shown, shown + n).map((a, k) => card(a, shown + k)).join(''));
    shown = Math.min(A.length, shown + n);
    grid.querySelectorAll('.fm__logo:not([style])').forEach(im => im.complete ? fit(im) : im.addEventListener('load', () => fit(im), { once: true }));
    more.hidden = shown >= A.length;
  };
  add(7);                                   // featured + 2 stacked + 2×2, as in Figma CCBP-v02 755:495
  more.addEventListener('click', () => add(4));

  /* Footer — course tracks from ccbp.in, laid out like Ather's footer locator */
  const B = 'https://www.ccbp.in/intensive/';
  const T = [
    ['Software Training Institute','software-training-institute',[]],
    ['MERN Stack Developer course','mern-stack-developer-course','Hyderabad Bangalore Mumbai Pune Chennai'],
    ['Full Stack Developer course','full-stack-developer-course','Hyderabad Bangalore Pune Mumbai Delhi Ahmedabad Coimbatore Chennai Chandigarh Noida Kolkata Kochi Bhubaneswar Visakhapatnam Vijayawada Gurgaon Jaipur Indore Kanpur Nagpur Madurai Bhopal Trivandrum Guwahati Patna Aurangabad Trichy Salem Thane Kerala Mysore Telugu Tamil Hindi'],
    ['Data Analytics course','data-analyst-course','Hyderabad Bangalore Pune Mumbai Delhi Chennai Kolkata Chandigarh Ahmedabad Coimbatore Gurgaon Noida Kerala Nagpur Indore Jaipur Lucknow Thane Bhopal Dehradun Bhubaneswar Mysore Vadodara Kanpur Trivandrum Surat Nashik Madurai Patna Aurangabad Ghaziabad Meerut Guwahati Kolhapur Kochi Trichy Telugu Tamil Hindi'],
    ['QA / Automation Testing course','automation-testing-course','Bangalore Hyderabad Chennai Pune Coimbatore Noida Telugu Tamil Hindi'],
  ];
  const langs = ['Telugu','Tamil','Hindi'];
  const href = (slug, c) => {
    if (slug === 'data-analyst-course' && c === 'Hindi') return B + slug + '/hindi';
    if (slug === 'automation-testing-course' && langs.includes(c)) return B + 'software-automation-testing-course-in-' + c.toLowerCase();
    return B + slug + '-in-' + c.toLowerCase();
  };
  document.getElementById('ft-tracks').insertAdjacentHTML('beforeend', T.map(([name, slug, cities]) => {
    const list = cities.length ? cities.split(' ') : [];
    return `<div class="ft__track${list.length ? "" : " ft__track--solo"}"><p class="ft__track-t"><a href="${B+slug}">${name}</a></p>${
      list.length ? `<div class="ft__cities">${list.map(c => `<a href="${href(slug,c)}">${c}</a>`).join('')}</div>` : ''}</div>`;
  }).join(''));

  /* Mobile accordions (Ather pattern) */
  const mq = matchMedia('(max-width:900px)');
  document.querySelector('.ft').addEventListener('click', e => {
    const t = e.target.closest('.ft__h, .ft__track-t');
    if (!t || !mq.matches || t.parentElement.matches(".ft__track--solo") || (e.target.closest('a') && t.parentElement.classList.contains('open'))) return;
    if (e.target.closest('a')) e.preventDefault();
    t.parentElement.classList.toggle('open');
  });
  document.getElementById('ft-year').textContent = new Date().getFullYear();
})();

/* Closing CTA — ambient neural mesh (from variations/v02-neural.html, cursor interaction removed)
   + heading sweep (from v2-stories: pale → blue highlight runs letter by letter → settles white) */
(() => {
  const sec = document.querySelector('.cta');
  if (!sec) return;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = sec.querySelector('.cta__mesh'), ctx = cv.getContext('2d');
  let W, H, pts = [], on = false, raf = 0;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  function size(){
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(W * H / 9000);
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.4 + .6 }));
  }
  function draw(){
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++){
      const a = pts[i];
      if (!RM){ a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++){
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++){
        const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120){ ctx.strokeStyle = `rgba(110,150,255,${(1 - d / 120) * .35})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.fillStyle = 'rgba(143,179,255,.7)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  function loop(){ draw(); if (on && !RM) raf = requestAnimationFrame(loop); }
  size(); draw();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); draw(); }, 150); });
  new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) loop(); }).observe(sec);
})();

/* Heading sweep (from v2-stories) on every section title:
   starts pale, a blue highlight runs through it letter by letter, then settles to its own colour */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const split = el => {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3){
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)){ frag.append(' '); return; }
          const w = document.createElement('span'); w.className = 'sw-w';
          [...part].forEach(ch => { const c = document.createElement('span'); c.className = 'sw-c'; c.textContent = ch; w.append(c); });
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(el);
    el.setAttribute('aria-label', label);
    [...el.children].forEach(c => c.setAttribute('aria-hidden', 'true'));
    return [...el.querySelectorAll('.sw-c')];
  };
  document.querySelectorAll('.ct__title, .wl__title, .ht__title, .fm__title, .cta__title').forEach(el => {
    const dark = !!el.closest('.cta, .ct');
    const chars = split(el);
    const finals = chars.map(c => { const v = getComputedStyle(c).color; return /rgba\(.*,\s*0\)$/.test(v) ? 'rgba(37,99,235,0)' : v; });  // transparent → gradient title
    const [start, mid1, mid2] = dark ? ['rgba(255,255,255,.22)', '#BFDBFE', '#60A5FA'] : ['#C7CDD8', '#93C5FD', '#2563EB'];
    gsap.set(chars, { color: start });
    const tl = gsap.timeline({ paused: true });
    chars.forEach((c, i) => tl.to(c, { keyframes: [
      { color: mid1, duration: .14, ease: 'none' },
      { color: mid2, duration: .16, ease: 'none' },
      { color: finals[i], duration: .38, ease: 'power1.out' } ] }, i * .03));
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => tl.play() });
  });
})();
