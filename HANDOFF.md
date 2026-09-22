# NxtWave homepage — handoff notes

Start a new chat in this folder and ask Claude to read this file first.
Last updated 2026-09-21.

## What this is
A static single-page NxtWave homepage (`index.html`, no build step) built from Figma file
**CCBP-v02** (`2sZTw3sbfXUJJ7Mjid9rF4`). Some sections were merged in from a supplied build
(`Downloads/nxtwave-homepage-build.zip`).

- **Work in `index.html`** in this folder. `publish/` and the old artifact are stale — don't touch
  or republish unless asked.
- **Preview:** `.claude/launch.json` → server "cards" (http-server, autoPort, currently port 5178).
  Port 5173 belongs to another chat serving a *different* copy of the project — don't use it.
- A backup of `index.html` + `career/` from just before the zip merge is in the session
  scratchpad (`backup-before-zip-merge`); it won't exist in a new session.

## Page, top to bottom
1. **Hero** `#hero` — opening screen from Figma 761:311: looping video `assets/hero-intro.webm`
   (poster/still `hero-intro.jpg`), 7-layer progressive blur on the lower half, headline 68px,
   stats, Lottie scroll cue (`assets/scroll-down-anim.js` + `vendor/lottie_light.min.js`,
   icon only), nav band (Figma 869:112): full width, 19% black over a 16px backdrop blur, flush
   at the top; stroked 100px-radius buttons (default stroke #3e5787, hover #406bdb) and a plain
   Login link. Hover fires three effects at once, all with no run-up: a diagonal band of light
   sweeping the button (`hx-sweep`, starting mid-crossing so it reads on frame one), two streaks
   running clockwise round the outline (a conic gradient behind a 1px ring mask — `hx-orbit`,
   `.hx-nl-ring`), and the label rolling over a letter at a time against a second copy
   (`.hx-nl-clip`, split per character in the NAV LABEL ROLL script).
   Cursor-lit dot grid (stronger on the opening
   screen). It dissolves into the scroll-scrubbed story film `assets/hero-v2-720.mp4` + six
   beats. The 3D logo was removed.
2. **Programmes** `#programmes` — 3 cards (`CARD DATA` script): at rest image/title/tags/CTAs;
   hover reveals description + batch/seats row; image never resizes. Canvas light-line fan
   with moving pulses behind the cards (no side blocks). **Recognised by** `#recognised-by`
   below the cards; its top margin is computed from how much a card grows when opened.
3. **Awards & Recognitions** `#recognition` — panel video `assets/awards-wall.mp4` scrubbed
   by **scroll** (frames captured to blobs, decoded ahead, adjacent frames blended), notch on
   top, 3 photo cards. Panel is 1600px wide at 16/7. The podium redesign with per-award hover
   (Figma 877:787) was built and then reverted at the user's request; it is in the history at
   `6e45d84` if it is ever wanted back. Opaque + z-index 3 (covers the programmes shadow).
3b. **National Level Recognition** `#national-recognition` (`.nr`, `career/national-recognition.*`)
   — supplied build, added under Awards. Three.js light-ribbon shader on `.nr-bg` (reuses
   `vendor/three/three.module.min.js`; the CSS gradient on `.nr` is the no-WebGL fallback) with a
   GSAP entrance, scroll parallax and pointer tilt. Its tokens are scoped to `.nr`, not `:root`.
   Photos/emblem in `assets/national-recognition/`. The CTA points at `#programmes` — there is no
   callback form on the page yet.
4. **3,000+ companies hire NxtWave learners** `#hiring-network` — 5-row logo ticker (`assets/logos`).
5. **Taught by people…** `#team` — heading pinned with a contained scroll-scrubbed film
   `assets/mentors-v2.mp4`, stops at `LAST_FRAME = 140`. The subhead is replaced by the
   alumni strip (`.mw-alumni`), inside `.mw-head` so it pins and reveals with the heading.
   IIT Bombay and IIT Delhi use the supplied colour seals; the other four are the
   **monochrome** `*-mono.png` files — colour versions would have to be supplied, the
   flattened black ones cannot be recoloured.
6. **Career Transformations** `#career-transformations` (`.ctv`) — two looping tickers, no
   pinning and no scroll-scrub: learner portraits drift up the left column, a three-column
   wall of short written reviews drifts on the right (middle column runs the other way).
   Each track holds its content twice and the CSS animation moves exactly one copy, so the
   loop is seamless; both pause on hover and stop under `prefers-reduced-motion`.
   **Content is the `PEOPLE` and `REVIEWS` arrays in the section's script — edit those.**
   Names, roles, packages and quotes are PLACEHOLDERS.
7. **Masterclasses** `#masterclasses` (`.mc`, `career/masterclass.*`) — follows Career
   Transformations in normal flow (it used to ride over the old pinned screen with
   `margin-top:-100vh`; that was removed with the pin).
8. **We train you for what companies hire for** `#what-companies-look-for` — Figma 839:377: a tall
   hero card (inline-SVG isometric AI diagram, built in code — the Figma raster couldn't be
   downloaded here) next to a column of three cards. Two scroll-reveal units (`[data-reveal]`):
   the hero and the right column each settle in oversized→normal with a blur fade, then their
   parts stagger in (`.wl-a`, delay in `--d`). IntersectionObserver in `career/script.js`,
   one-way; reduced motion shows everything at rest.
9. **Why Top Companies Prefer NxtWave Students** `#hiring-teams` — cards sized ~5.4 across, max 280px.
10. **Backed by Leading Global Investors** `#investors`.
11. **Recognized by Leading Media** `#featured-in-media` — bento grid + View More. Then footer.

Everything after Career Transformations sits in `.cs--after` (opaque, z-index 2).

**Design notes** toggle (bottom-right, off by default): per-section rationale card; data in
the `NOTES` array; the counter counts only sections present.

## Conventions
- **Headings:** one shared style in the "SECTION TYPE" block — Outfit 600, `--head-grad`
  (black→navy→blue, Figma 802:5314), `width:fit-content`; subheads Geist. Lower sections share
  `--head-size`. Change the token, not one section.
- **Spacing:** `--sec-y` (≈94px at 1440, 56px on phones) above each section heading, none below.
- Lenis drives scrolling; scrubbed films capture frames once (needs a visible tab; they wait for
  visibility and retry). The mentors film's capture does NOT have that guard yet.
- `html,body{overflow-x:clip}` (not `hidden`) — keeps sticky stages working.
- Browser-pane testing: emulated viewports can crop screenshots; hidden panes pause
  rAF/video; the user may be scrolling the pane at the same time.

## Open items
- Placeholder content: Career Transformations testimonials/names; award caption 3 duplicates
  caption 2 (as in Figma); "Learner Hired" wording is from Figma.
- New sections (Recognised by, Masterclasses, Investors) have no Design notes.
- Old unused files still on disk (exclude from any zip): `mentors.mp4`, `mentors-poster.png`,
  `hero-v2.mp4`, `hero-logo-3d*`, `embedded-svgs.js`, `award-*.png`, `mock*.png`,
  `career/career.js`, `career/career.css`.
- The Vercel zip (`nxtwave-homepage-vercel.zip`) is out of date — rebuild with forward-slash
  paths (not PowerShell `Compress-Archive`) when asked.
