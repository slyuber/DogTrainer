# PALcares Website Redesign 2025

## About This Project
Next.js static/SSG nonprofit website for PALcares (Perseverance Analytics Ltd.). Originally built with AI assistance — functional and visually promising but needs systematic polish for production quality: cross-device consistency, performance, accessibility, and code hygiene.

## Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS + PostCSS
- **Output**: Static export (`next export` / `output: 'export'`)
- **Linting**: ESLint (eslint.config.mjs)
- **Lighthouse**: Already configured (.lighthouserc.json, lighthouse-reports/)

## Key Directories
- `app/` — Next.js App Router pages and layouts
- `public/` — Static assets (images, fonts, favicons)
- `PALcares Design Files/` — Reference design assets
- `lighthouse-reports/` — Performance audit history
- `dist/` / `out/` — Build output directories

## Common Commands
```bash
npm run dev          # Local dev server
npm run build        # Production build
npm run lint         # ESLint check
npx next export      # Static export (if separate from build)
```

## Critical Design Principles — READ BEFORE ANY CHANGE

### Preserve First, Improve Second
- The existing visual design direction is APPROVED — do not redesign from scratch
- Preserve: scroll-lock/snap behavior, section transitions, color palette, layout intent
- Improve: consistency, spacing rhythm, responsive breakpoints, animation polish, accessibility
- Every change must be justified by a specific problem it solves

### Avoid Common AI-Generated Website Anti-Patterns
These are the specific mistakes AI coding tools make repeatedly on this type of project. Actively check for and fix these:

1. **Inconsistent spacing** — AI mixes arbitrary px/rem values. Use a spacing scale consistently (Tailwind's built-in scale).
2. **Breakpoint chaos** — Responsive styles added ad-hoc per component instead of a unified breakpoint strategy. All components must respond to the SAME breakpoints consistently.
3. **Animation overload** — Too many competing animations, inconsistent durations/easings, animations that fire on every scroll. Use ONE easing curve and ONE duration scale project-wide.
4. **Orphaned/dead CSS** — Tailwind classes that conflict, duplicate utility patterns, or inline styles mixed with Tailwind. No inline styles unless absolutely necessary.
5. **Accessibility theater** — aria-labels that don't help, missing focus states, decorative images without alt="", semantic HTML violations (div soup).
6. **Mobile afterthought** — Desktop-first layouts that break below 768px. Touch targets too small. Horizontal overflow. Text too small on mobile.
7. **Scroll hijacking bugs** — Scroll-snap that traps users, sections that don't align properly, janky transitions between snap points.
8. **Font loading flash** — No font-display strategy, layout shift from web fonts loading.
9. **Image bloat** — Unoptimized images, missing next/image usage, no srcset/responsive images, massive hero images on mobile.
10. **Z-index wars** — Arbitrary z-index values, no z-index scale, overlapping elements on certain viewports.

### Responsive Breakpoint Contract
Use EXACTLY these breakpoints everywhere — no custom one-offs:
- `sm`: 640px  (large phones landscape)
- `md`: 768px  (tablets)
- `lg`: 1024px (small laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large screens)

### Animation & Transition Contract
- **Easing**: Use `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state changes
- **Duration scale**: `150ms` (micro), `300ms` (standard), `500ms` (emphasis), `700ms` (dramatic)
- **No animation on `prefers-reduced-motion: reduce`** — always wrap in media query or Tailwind `motion-safe:`
- **Scroll-triggered animations**: Use IntersectionObserver, fire ONCE, no re-triggering on scroll back

### Spacing Rhythm
Stick to Tailwind's default spacing scale. For section-level vertical spacing, use multiples of 4:
- Between elements within a section: `gap-4` to `gap-8`
- Section padding: `py-16` (mobile), `py-24` (tablet+), `py-32` (desktop+)
- Never use arbitrary values like `mt-[37px]` — find the nearest scale value

## Code Quality Standards

### TypeScript
- No `any` types — use `unknown` or proper interfaces
- All component props must have explicit interfaces
- Prefer `type` for component props, `interface` for data shapes

### Component Patterns
- One component per file
- Co-locate component-specific types in the same file
- Extract repeated UI patterns into shared components (don't let AI duplicate code across pages)
- Use semantic HTML: `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`

### Tailwind Discipline
- No `@apply` in CSS files unless creating a genuinely reusable utility (rare)
- No inline `style={{}}` — everything through Tailwind classes
- Use `cn()` or `clsx()` for conditional classes — no string interpolation
- Group Tailwind classes logically: layout → spacing → sizing → typography → colors → effects

### Performance
- All images through `next/image` with explicit width/height or fill
- Lazy load below-fold sections and images
- No layout shift (CLS) — reserve space for dynamic content
- Fonts: use `next/font` with `display: 'swap'`

## Testing Workflow
Before considering any change "done":
1. `npm run build` must pass with zero errors
2. Check in Chrome DevTools responsive mode at: 375px, 768px, 1024px, 1440px
3. Keyboard-navigate through all interactive elements
4. Run Lighthouse on affected pages (performance, accessibility, best practices)

## Instructions for Claude

### How to Approach Work
- Read existing code thoroughly before changing it. Understand the pattern before "improving" it.
- Make surgical, targeted changes. Do not refactor an entire file when fixing one issue.
- When you find a pattern used inconsistently, fix ALL instances — not just the one in front of you.
- If a change affects more than 3 files, stop and outline the plan before executing.
- Always explain WHY a change improves things, not just what you changed.

### What NOT to Do
- Do not add new npm dependencies without explicit approval
- Do not change the color palette, typography choices, or brand elements
- Do not remove scroll-snap or section-locking behavior — improve it
- Do not add loading spinners, skeleton screens, or UI patterns that weren't there unless asked
- Do not wrap everything in `try-catch` or add defensive patterns that hide real bugs
- Do not add comments explaining obvious code — only explain non-obvious decisions
