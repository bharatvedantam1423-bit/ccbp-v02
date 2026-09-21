NxtWave homepage (static build)
===============================

Sections, top to bottom
  1  Hero            scroll-scrubbed film + 3D glass NXT WAVE icon with orbiting tech glyphs
  2  Programmes      Academy / Intensive / NIAT cards (3D tilt, shine, hover reveal)
  3  Recognition     "On the record. A higher standard." awards card
  4  Hiring network  "Where our learners work now" two-line logo ticker
  5  Mentors         "Taught by people who have done the job." scroll-scrubbed video
  6  Career Transformations, What companies look for now, What hiring teams say,
     Featured in the media, footer   (merged from career-site; styles scoped to .cs)

Folders
  index.html       the page
  assets/          videos, images, logos, 3D icon module (hero-logo-3d.js)
  career/          CSS + JS for the merged career sections
  vendor/          Lenis, GSAP + ScrollTrigger, Three.js r170, self-hosted fonts — no CDN needed

Preview
  Double-click index.html — it works straight from disk (file://), including the 3D icon.
  For the smoothest scroll scrubbing, serve the folder instead (from disk, browsers block the
  frame-capture step, so the hero/mentors films seek the video directly):
      npx http-server -p 8080 .
  then open http://localhost:8080/

Editing
  Programme cards   index.html → "CARD DATA"
  Hero text beats   index.html → the .hx-beat blocks (data-in / data-out = scroll progress)
  Mentors end frame index.html → LAST_FRAME in the mentors script
  Logo ticker       index.html → NAMES in the S4 ticker script (images in assets/logos)
  3D icon           edit assets/hero-logo-3d.js, then rebuild the bundle the page loads:
                      npm i three@0.170.0 esbuild
                      npx esbuild assets/hero-logo-3d.js --bundle --format=iife --minify --outfile=assets/hero-logo-3d.bundle.js
                    SVG changes: also refresh the inline copies in assets/embedded-svgs.js

Before launch
  Testimonial names, photos, quotes and packages in the career sections are placeholders
  (career/career.js COLS, career/script.js TESTIMONIALS). Links marked "#" have no destination yet.
