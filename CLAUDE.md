# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Pazuzu's Wards** — a single-file PWA for tracking progressive reinforcement dog training. Themed around the Mesopotamian protective deity Pazuzu (canine-faced wind demon who paradoxically served as a household guardian spirit). The dog's name is Zuzu (a Chiweenie rescue from Mexico).

The full build specification lives in `PAZUZU_SPEC.md`. Pre-compiled research (mythology, Kikopup methodology, anxiety signals) lives in `RESEARCH_REFERENCE.md`. Both are authoritative — consult them before making design or data decisions.

## Architecture

**Single-file PWA — everything in `index.html`.** All CSS, HTML, and JS in one file. No build step, no bundler, no npm, no CDN dependencies, no external libraries.

Supporting files:
- `sw.js` — Service worker (cache-first). Bump `CACHE_NAME` version string on every change to `index.html`.
- `manifest.json` — PWA manifest (already configured).
- `icons/icon-192.svg`, `icons/icon-512.svg` — App icons (already built).

## Running / Testing

Open `index.html` directly in a browser, or:
```
python -m http.server 8000
```
Then visit `http://localhost:8000`. Service worker requires HTTP (not `file://`), so use the server for PWA install testing.

Target device: **Pixel 4a** (5.81" OLED, 1080x2340). Always test in Chrome DevTools mobile emulation at 393x851 viewport.

## Data Layer

All state in **localStorage** under key `pazuzuWards`. The global data object `D` contains: `profile`, `settings`, `progress` (per-skill step tracking), `sessions`, `milestones`, `pottyLogs`, `aloneLogs`, `enrichmentLogs`, `foodNotes`, `behaviorNotes`, `aloneTimerState`.

Migration: if `zuTrainer` key exists but `pazuzuWards` doesn't, migrate the old format.

The `save()` function writes `D` to localStorage. Call it after every mutation.

## Terminology Mapping

The app uses Mesopotamian-themed naming consistently throughout the UI:

| Concept | App Term |
|---|---|
| Skill | **Ward** |
| Mastering a skill | **Sealing the Ward** |
| Skill phases (1/2/3) | **Circles** (I: Foundation, II: Core, III: Life) |
| Training session | **Ritual** |
| Daily plan | **The Daily Rite** |
| Milestone | **Inscription** |
| Skill tree | **The Ward Tree** / **Pazuzu's Shield** |
| Streak | **Vigil** |

Never use generic terms like "skill" or "session" in UI text.

## Skill Tree & Prerequisites

20 skills across 3 Circles. The prerequisite graph determines unlock state:

```
attention --> recall, leashpressure
leashpressure --> llwindoor
llwindoor + interrupter --> llwoutdoor
nomugging --> leaveit
sit --> release, down
sit + release --> doormanners
calmness --> handling, separation
crate --> separation
dropit --> fetch
```

Circle I skills (attention, interrupter, nomugging, calmness, crate, house) are auto-unlocked. Circle II/III skills unlock when all prereqs are mastered.

Each skill has steps with context-aware capture types: `reps` (success/miss counting), `duration` (hold timing), `observe` (mark-only, no fail), `timed_reps`. The UI must adapt buttons and display per capture type.

## Visual Design Constraints

- **OLED true black** background (`#0A0A0F`). Warm gold/bronze primary (`#D4A853`), teal accent (`#4ECDC4`).
- Fonts: **Cinzel** (display/headers — carved stone feel) + **DM Sans** (body) from Google Fonts. No Inter/Roboto/Arial.
- No emoji anywhere. Use 2-letter abbreviation badges (AT, PI, IC, etc.) and inline SVG icons.
- All touch targets minimum 44px. Use `:active` states, not `:hover`.
- Max-width: 430px centered. Mobile-first, portrait orientation.
- CSS variables defined in `:root` — see PAZUZU_SPEC.md section 2 for the full palette.

## Key Behaviors

**Alone Timer Persistence:** Must survive app backgrounding, tab closure, and phone lock. Uses `aloneTimerState` in localStorage with `visibilitychange` and `beforeunload` events. On app load, check if timer was running and resume from `startTime`. Floating pill indicator visible across all tabs.

**Training Ritual Flow:** Pre-session guidance (vocal/hand/position) -> 3-2-1 countdown -> timer with capture-type-specific buttons -> audio ding (Web Audio API, 880Hz + 1318.5Hz two-tone) + vibration on end -> session summary with advancement recommendation (>=80% over N sessions = advance).

**First-Time Ward Flow:** When training a ward for the first time, show "Where is Zuzu with this Ward?" modal to let the user pick their starting step rather than forcing step 1.

**Ward Tree Visualization:** Interactive SVG/CSS skill tree with connection lines between prerequisite nodes. Node states: locked (grey), available (pulsing gold outline), in-progress (gold fill + progress ring), sealed (golden glow). Tapping a node opens a slide-up detail sheet.

## Tabs (5 total, bottom nav)

1. **Shrine** (Home) — Profile, vigil streak, daily rite, quick actions (potty/alone/enrichment/behavior logging)
2. **Ward Tree** — Interactive skill tree visualization
3. **Ritual** (Train) — Session flow with capture-type-aware UI
4. **Chronicle** (Log) — Session history, filterable by skill
5. **Chronicles** (Progress) — Heatmap, inscriptions, separation chart, ward progress bars
