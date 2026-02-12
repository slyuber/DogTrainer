# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A PWA dog training tracker for Zu (8.5 kg mixed rescue) built on Emily Larlham's (Kikopup) Progressive Reinforcement Training methodology. Single HTML file with embedded CSS/JS, no build tools, no dependencies. Deployed via GitHub Pages at `slyuber.github.io/DogTrainer/`. Target device is Pixel 4a (5.81" OLED, 1080x2340).

## Development

No build step. Open `index.html` in a browser. After changes, commit and push to deploy:
```
git add index.html && git commit -m "description" && git push
```
Bump `CACHE_NAME` version in `sw.js` when updating cached assets to bust the service worker cache.

## Architecture

**Single-file SPA** (`index.html`): all CSS, HTML, and JS in one file. ~1130 lines.

### File Layout
- `index.html` — entire app (styles lines 13-291, markup 293-414, JS 416-1131)
- `sw.js` — service worker, cache-first offline strategy
- `manifest.json` — PWA manifest for Android install
- `icons/` — SVG app icons

### JS Architecture (inside `<script>` in index.html)

| Section | Lines | Purpose |
|---------|-------|---------|
| `SKILLS` array | 420-632 | Skill database — 20 skills across 3 phases, each with `id`, `abbr`, `phase`, `prereqs[]`, `steps[]` |
| `PHASES` object | 634-638 | Phase metadata (name, date range, badge class, color) |
| Data layer | 640-657 | `load()`/`save()` with localStorage key `zuTrainer`, migration-safe defaults merging |
| Utilities | 659-716 | `$()`, `toast()`, `modal()`, date helpers, `rollingAvg()`, `streak()`, `unlocked()`, `dailyPlan()` |
| Navigation | 718-726 | `go(tabName)` switches tabs, calls render function |
| Tab renderers | 728-1092 | `rHome()`, `rSkills()`, `rTrain()`, `rLog()`, `rProg()` — each rebuilds innerHTML |
| Settings | 1094-1124 | Bottom-sheet panel (not a tab), export/import JSON, reset |

### Data Model (localStorage `zuTrainer`)

```
D = {
  profile: { name, weight, rescueDate },
  settings: { duration, threshold, evalSessions, treatNotes },
  progress: { [skillId]: { step: number, unlocked: boolean } },
  sessions: [{ id, sid, dt, step, ok, no, notes, dur }],
  milestones: [{ id, t, ic, dt }],
  pottyLogs: [{ id, dt, type, loc, ctx, photo, notes }],
  aloneLogs: [{ id, dt, dur, loc, dist, bark, calm, notes }]
}
```

Photos in pottyLogs are base64 JPEG strings, resized to max 600px to fit localStorage (~5MB limit).

### Skill Progression Logic

- Each skill has ordered `steps[]`. `progress[skillId].step` is the current 0-based step index.
- Skills unlock when all `prereqs` have `step >= 1` (started step 2+).
- Phase 1 skills and skills with empty `prereqs` auto-unlock.
- After each training session, `rollingAvg()` computes mean success rate over last N sessions (default 3):
  - **>= 80%** → prompt to advance to next step
  - **< 50%** → suggest going back one step
  - **50-80%** → stay at current step
- Users can also manually jump to any step via `setStep()` in the Skills tab.
- When the last step passes threshold, skill is marked mastered (`step = steps.length`).

### CSS Conventions

- CSS variables prefixed short: `--pri`, `--ok`, `--bad`, `--bg`, `--card`, `--txt`, `--brd`, `--r`, `--rs`
- True black BG (`#0B0B14`) for OLED power saving
- No emoji anywhere — skills use 2-letter abbreviation badges (AT, PI, IC, etc.)
- All interactive elements have min 44px touch targets and `:active` transform feedback
- No `:hover` states (mobile-first) — use `:active` for press feedback
- Class names are terse: `.cd` (card), `.btn-p` (primary), `.tog` (toggle chip), `.si` (skill icon)

### Navigation

5 bottom tabs: Home, Skills, Train, Log, Progress. Settings is a gear icon in header opening a bottom-sheet overlay. Tab switching calls `go('tabName')` which toggles `.on` class and calls the tab's render function.

## Training Methodology Reference

This app implements Emily Larlham's Progressive Reinforcement Training (PRT). Key principles that inform the UX:

- **Progressive Reinforcement Training manifesto**: https://progressivereinforcementtraining.com
- **Kikopup YouTube channel** (400+ free tutorials): https://www.youtube.com/@kikopup
- **Kikopup Academy** (structured courses): https://www.kikopupacademy.com
- **Dogmantics** (Emily's training site): https://dogmantics.com

### Core PRT Principles Embedded in the App

1. **No punishment** — the app tracks success/miss, never "corrections." Language throughout is positive.
2. **Tiny progressive steps** — each skill has 4-5 graduated steps from easiest to hardest.
3. **Criterion: 80% over 3 sessions** — research-backed threshold before advancing (from applied behavior analysis standard).
4. **Regression is normal** — the app suggests going back a step at <50%, with encouraging language ("Reinforcing earlier steps is always good").
5. **Short sessions** — default 3 minutes (research shows 3-5 min optimal for retention in dogs).
6. **Multiple skills per day** — daily plan recommends 5 different skills, prioritizing those not practiced recently.
7. **Distinct Leave It vs Drop It** — explicitly separated as different skills per Kikopup methodology.
8. **Prerequisite chains** — e.g., Recall requires Attention; Door Manners requires Sit + Release Cue; Outdoor LLW requires Indoor LLW + Positive Interrupter.

### Skill Phase Progression

| Phase | Skills | Timeline | Gate |
|-------|--------|----------|------|
| 1: Foundation | Attention, Positive Interrupter, Impulse Control, Capturing Calmness, Crate Training, House Training | Days 1-7 | Auto-unlocked |
| 2: Core Skills | Name Recognition, Recall, Sit, Release Cue, Down, Leave It, Drop It | Days 7-21 | Most auto-unlock; Recall needs Attention; Release/Down need Sit; Leave It needs Impulse Control |
| 3: Life Skills | Leash Pressure, LLW Indoor, Fetch, Handling, LLW Outdoor, Separation, Door Manners | Days 14-42 | Each has specific prereqs from Phase 1-2 |

### Research References for Training Content

- **Impulse Control / It's Yer Choice**: https://www.youtube.com/results?search_query=kikopup+its+yer+choice
- **Capturing Calmness protocol**: https://www.youtube.com/results?search_query=kikopup+capturing+calmness
- **Positive Interrupter**: https://www.youtube.com/results?search_query=kikopup+positive+interrupter
- **Cooperative Care / Handling**: Based on Chirag Patel's Bucket Game + Kikopup handling protocols
- **Loose Leash Walking**: Kikopup's "Leash Walking CONNECTED" methodology — must be reliable indoors before outdoor proofing
- **Separation Training**: Graduated departure protocol, first 15 minutes is hardest
- **Session structure research**: Multiple short sessions (3-5 min) > one long session; train multiple different behaviors per session for best engagement and retention

## Design Principles

- **Mobile-first, phone-only**: Max-width 430px, optimized for one-hand thumb use on Pixel 4a
- **OLED dark theme**: True black background saves battery, high contrast text
- **Minimal taps**: Quick-action buttons on dashboard for potty logging and alone time tracking
- **Toggle chips over dropdowns**: All multi-choice inputs use tappable pill buttons (`.tog` class), never `<select>` — faster on mobile
- **Photo capture**: Uses `capture="environment"` attribute to open camera directly, images resized to 600px max for localStorage budget
- **Offline-first**: Service worker caches all assets; all data in localStorage; works without internet after first load
- **No emoji in UI**: Skills identified by 2-letter codes in colored circles matching phase color. SVG icons for navigation and actions.

## Key Constraints

- **localStorage ~5MB limit**: Photos are JPEG compressed at 0.7 quality, resized to 600px max dimension. Monitor pottyLogs array size.
- **Single file**: All CSS/JS must stay in index.html. No external dependencies, no CDN links, no build step.
- **Service worker caching**: After changing index.html, users may need to refresh twice or close/reopen the app. Bump `CACHE_NAME` in sw.js for breaking changes.
- **No server**: All data is client-side only. Export/import JSON is the only backup mechanism.
