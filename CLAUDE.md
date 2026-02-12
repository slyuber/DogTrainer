# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pazuzu's Wards** — a PWA dog training tracker for Zuzu (8.5 kg Chiweenie rescue from Mexico) built on Emily Larlham's (Kikopup) Progressive Reinforcement Training methodology. Themed around the Mesopotamian protective deity Pazuzu — a household guardian spirit who frightened away worse things. Skills are "Wards," sessions are "Rituals," streaks are "Vigils," milestones are "Inscriptions."

Single HTML file with embedded CSS/JS, no build tools, no dependencies. Deployed via GitHub Pages at `slyuber.github.io/DogTrainer/`. Target device is Pixel 4a (5.81" OLED, 1080x2340).

## Development

No build step. Open `index.html` in a browser. After changes, commit and push to deploy:
```
git add index.html sw.js && git commit -m "description" && git push
```
Bump `CACHE_NAME` version in `sw.js` when updating cached assets. No co-author attribution in commits.

## Architecture

**Single-file SPA** (`index.html`): all CSS, HTML, and JS in one file.

### File Layout
- `index.html` — entire app (styles, markup, JS all embedded)
- `sw.js` — service worker, cache-first offline strategy, `CACHE_NAME: 'pazuzu-v1'`
- `manifest.json` — PWA manifest for Android install
- `icons/` — SVG app icons (Pazuzu-themed: stylized canine face with wings)

### Data Model (localStorage key: `pazuzuWards`)

```
D = {
  profile: { name, weight, rescueDate, breed, age, origin },
  settings: { duration (180s default), threshold (80), evalSessions (3), treatTiers, soundEnabled, reminders },
  progress: { [skillId]: { step, unlocked, startedAt, masteredAt } },
  sessions: [{ id, sid, dt, step, ok, no, dur, notes, captureType, environment, treatLevel, distractionLevel }],
  milestones: [{ id, t, ic, dt }],
  pottyLogs: [{ id, dt, type, loc, ctx, surface, photo (base64 JPEG), notes, signalGiven }],
  aloneLogs: [{ id, dt, dur, loc, dist, departureReaction, arrivalReaction, bodyLanguage[], vocalization, destructive, ate, enrichmentUsed, eliminatedInside, departureCuesPracticed, calm, notes }],
  enrichmentLogs: [{ id, dt, type, duration, engagement, notes }],
  foodNotes: { kibble, highValueTreats[], medValueTreats[], lowValueTreats[], dislikes[], allergies[], feedingSchedule, notes },
  behaviorNotes: [{ id, dt, category, trigger, intensity, bodyLanguage[], response, outcome, notes }],
  aloneTimerState: { running, startTime, elapsed }
}
```

Migration: if old `zuTrainer` key exists but `pazuzuWards` doesn't, migrate data.

### Skill (Ward) System

20 skills across 3 Circles (phases). Each has `id`, `name`, `abbr` (2-letter), `phase`, `prereqs[]`, `desc`, `video` (YouTube search URL), `steps[]`.

Each step has:
- `t` (title), `d` (description)
- `guidance`: `{ vocal, hand, position }` — what to say, do with hands, where to stand
- `capture`: `{ type, successLabel, missLabel, notes_prompt }` — how to track data
  - Types: `reps` (success/miss buttons), `duration` (hold timer), `observe` (success-only, no fail), `timed_reps`

### Skill Progression Logic

- `progress[skillId].step` is 0-based step index
- Skills unlock when all `prereqs` have `step >= 1`
- Phase 1 skills and skills with empty `prereqs` auto-unlock
- After each session, `rollingAvg()` over last N sessions (default 3):
  - **>= 80%** → prompt to advance
  - **< 50%** → suggest going back
  - **50-80%** → stay at current step
- Last step + threshold → skill mastered ("Ward Sealed"), `masteredAt` set
- First-time flow: "Where is Zuzu with this Ward?" modal lets user pick starting step

### Prerequisite Map
```
attention → recall, leashpressure → llwindoor → llwoutdoor
interrupter → llwoutdoor
nomugging → leaveit
sit → release, down, doormanners
release → doormanners
calmness → handling, separation
crate → separation
dropit → fetch
```

### Alone Timer Background Persistence

The alone timer must survive app backgrounding, tab closure, and phone lock:
- On start: save `{ running: true, startTime: Date.now(), elapsed: 0 }` to localStorage
- On `visibilitychange`: persist state
- On app load: if timer was running, resume from saved `startTime`
- Periodic save every 30 seconds while running
- Floating indicator pill visible on all tabs when timer is active

## Visual Design

**Aesthetic: Mesopotamian Arcane + Dark OLED Gaming UI** (Hades-game meets Babylonian temple inscriptions)

### Color Palette
- Primary: warm gold `#D4A853` (Pazuzu amulet bronze)
- Accent: teal `#4ECDC4` (lapis lazuli, Ishtar Gate)
- Status: sage green `#7BC67E` (sealed), amber `#E8B84B` (warning), clay red `#C75B5B`
- Surfaces: near-black `#0A0A0F`, dark stone `#12121E`, `#1A1A2A`
- Text: warm parchment `#E8E4D9`, weathered stone `#9B9685`, faded `#5A564A`

### Typography
- Display/Headers: `Cinzel` (Google Font — evokes carved stone inscriptions)
- Body: `DM Sans` (humanist sans-serif, warm and readable)
- Abbreviation badges: monospace or slab

### Naming Convention
| Concept | App Term |
|---------|----------|
| Skills | Wards |
| Mastering a skill | Sealing the Ward |
| Skill phases | Circles (I, II, III) |
| Training sessions | Rituals |
| Daily plan | The Daily Rite |
| Milestones | Inscriptions |
| Skill tree | The Ward Tree / Pazuzu's Shield |
| Streak | Vigil |

## CSS Conventions

- CSS variables prefixed short: `--pri`, `--acc`, `--ok`, `--bad`, `--bg`, `--card`, `--txt`, `--brd`
- True black BG for OLED power saving
- No emoji anywhere — skills use 2-letter abbreviation badges
- All interactive elements min 44px touch targets
- `:active` states for press feedback, NOT `:hover` (mobile-first)
- Max-width: 430px centered
- Toggle chips (`.tog`) for all multi-choice inputs, never `<select>`
- Subtle Mesopotamian geometric patterns (zigzag, stepped) on card borders

## Navigation

5 bottom tabs with themed icons:
- **Shrine** (Home): ziggurat icon — dashboard, quick actions, daily rite
- **Ward Tree** (Skills): shield/tree icon — interactive skill tree with SVG connection lines
- **Ritual** (Train): flame icon — training session with context-aware capture
- **Chronicle** (Log): scroll icon — potty, alone time, enrichment, behavior logging
- **Progress**: rising steps icon — heatmap, inscriptions, separation chart

Settings accessed via gear icon in header (bottom-sheet overlay).

## Key Constraints

- **localStorage ~5MB limit**: Photos JPEG 0.7, max 600px. Monitor log array sizes.
- **Single file**: All CSS/JS in index.html. No external deps except Google Fonts.
- **Service worker caching**: Bump `CACHE_NAME` in sw.js for breaking changes.
- **No server**: All data client-side. JSON export/import is the only backup. Auto-export reminder every 7 days.
- **No emoji in UI**: 2-letter codes in styled badges. SVG icons for navigation.
- **Audio**: Web Audio API for timer ding (sine wave 880Hz + 1318.5Hz chime). No external audio files.
- **Vibration**: `navigator.vibrate(200)` on timer end.

## Training Methodology Reference

Implements Emily Larlham's Progressive Reinforcement Training (PRT):
- **PRT manifesto**: https://progressivereinforcementtraining.com
- **Kikopup YouTube** (400+ tutorials): https://www.youtube.com/@kikopup
- **Kikopup Academy**: https://www.kikopupacademy.com
- **Dogmantics**: https://dogmantics.com
- **Calming signals** (Turid Rugaas): lip licking, yawning, whale eye, tucked tail, etc. — used in anxiety tracking
- **Cooperative Care** (Chirag Patel's Bucket Game): used in Handling & Grooming ward
- **Session research**: 3-5 min sessions optimal for dog retention; multiple different behaviors per day
- **80% criterion**: From applied behavior analysis standard before advancing difficulty
