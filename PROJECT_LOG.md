# PROJECT CONTINUITY LOG

## 1. Completed Features
- ✅ Next.js 16 App Router initialized
- ✅ Directory structure under `src/` (components, data, styles, animations, hooks, assets)
- ✅ `src/data/data.json` — fully dynamic data (no hardcoding in components)
- ✅ Liquid Glass design system — SCSS tokens + Tailwind utility classes (`liquid-glass`, `liquid-glass-heavy`, `text-gradient`)
- ✅ `AppProvider.tsx` — global stage state: `preloading → lanyard → cinematic → home`
- ✅ `EntryLanyard.tsx` — authentic React Bits 3D Lanyard (Rapier physics, `@react-three/fiber`, `meshline`)
  - Profile picture overlay (`ProfilePic.jpeg`) placed as a 3D plane mesh on the badge
  - Drag threshold set at `Y < -3` world units to trigger cinematic transition
- ✅ `Hero.tsx` — fullscreen background video (`background.webm`), parallax scroll, `RotatingText` component, glass content panel
- ✅ `RotatingText.tsx` — animated text cycle with Framer Motion AnimatePresence
- ✅ `About.tsx` — bento grid layout with bio, education, and tech stack
- ✅ `Projects.tsx` — card grid with hover states, links, and tag labels
- ✅ `Contact.tsx` — large hero-style CTA, social links, footer
- ✅ `NavigationDock.tsx` — macOS-style dock with magnetic spring hover, click-to-scroll, shows only in `home` stage
- ✅ `page.tsx` — orchestrates all stages, GSAP cinematic reveal (scale + blur + opacity)

## 2. Current State
All major sections are wired up and the build passes cleanly (`npm run build` ✅).

The full flow is:
1. **Preloading (1.5s)** — silent tick, Hero video starts buffering in background
2. **Lanyard** — 3D physics badge appears with physics rope simulation
3. **Drag lanyard down past threshold** → `cinematic` stage triggers
4. **GSAP reveal** — zoomed, blurred Hero elegantly unfurls into view
5. **Home** — Dock appears, all sections scrollable

## 3. Next Steps (To Do)
- [ ] Add **Education Timeline** section (horizontal/vertical scroll timeline with GSAP)
- [ ] Add **Theme Toggle** (dark ↔ light) button to the Dock or a corner button
- [ ] Wire **Resume** dock item to a PDF in `/public/assets/resume.pdf`
- [ ] Add scroll-linked **section indicator** (the small dots/line on the right side)
- [ ] Add **cursor follower** micro-animation for premium feel
- [ ] Improve **mobile experience** (Dock should collapse on mobile)
- [ ] Finalize user's real data (education institution, actual resume link etc.)

## 4. Architecture Decisions
- All data consumed from `src/data/data.json` — zero hardcoding in components.
- Stage management via React Context (`AppProvider`) avoids prop drilling.
- GSAP handles cinematic macro-transitions; Framer Motion handles per-element micro-interactions.
- Lucide React used for all icons — `Github/Linkedin/Twitter` are NOT exported; used `GitBranch`, `Link`, `AtSign` as semantic alternatives.
- `meshline` JSX elements use `@ts-ignore` inline since they are registered via `extend()` but not in TS intrinsic map.

## 5. Component Breakdown
| Component | Role |
|---|---|
| `AppProvider.tsx` | Global stage + theme state |
| `EntryLanyard.tsx` | 3D Lanyard entry with Rapier physics |
| `Hero.tsx` | Fullscreen video hero with parallax + RotatingText |
| `RotatingText.tsx` | Animated designation text cycle |
| `About.tsx` | Bento grid: bio, education, tech stack |
| `Projects.tsx` | Project cards with hover effects |
| `Contact.tsx` | CTA + social links + footer |
| `NavigationDock.tsx` | Magnetic macOS-style dock (click-to-scroll) |

## 6. Animation Strategy Notes
- **Lanyard physics:** Rapier joints simulate rope segments (fixed → j1 → j2 → j3 → card). Drag tracking via pointer events, release threshold via translation Y coordinate.
- **Cinematic reveal:** GSAP `fromTo` on main content div — scale 1.08→1, blur 20px→0, opacity 0→1 over 2.2s with `power3.out`.
- **Scroll animations:** Framer Motion `whileInView` with `viewport: { once: true }` for About/Projects/Contact.
- **Dock hover:** `useMotionValue` + `useSpring` on icon width based on mouse X distance.
