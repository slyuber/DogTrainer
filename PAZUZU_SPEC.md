# PAZUZU — Progressive Reinforcement Dog Training PWA
## Claude Code Build Specification

> **Use `/init` to create a CLAUDE.md from this spec, then build iteratively.**

---

## 1. PROJECT IDENTITY & THEME

### Name: **Pazuzu's Wards** (short: **Pazuzu**)

Remove ALL references to "Kikopup" / "Kikopup's Trainer" from the UI. The app is themed around the Mesopotamian deity **Pazuzu** — the King of Wind Demons who paradoxically served as the most popular **protective household spirit** in ancient Assyria/Babylon (1st millennium BCE).

### Mythology to draw from:
- **Pazuzu is a protector who frightens away worse things.** He guarded homes, infants, and pregnant women against the demoness Lamashtu. Amulets bearing his face were mass-produced and hung in homes as wards.
- **Dual nature:** Both a bringer of storms and a domestic guardian spirit. "I am Pazuzu, son of Hanbi, king of the evil lilû-demons. I was enraged against the strong mountains and ascended them." Then he broke the wings of other wind demons to protect people.
- **He is NOT pure evil.** The Exorcist mischaracterizes him. In actual Mesopotamian belief, he was a trickster-protector — you point the storm at your enemies.
- **Visual motifs:** Canine face (perfect for a dog app!), four wings, talons, wind/storm imagery, cuneiform inscriptions, terracotta/bronze/clay textures, Mesopotamian geometric patterns.

### How this maps to the app:
| Mythology Concept | App Mapping |
|---|---|
| Pazuzu protects the household | Zuzu (the dog) is the ward being protected/trained |
| Amulets ward off evil | Skills are "wards" — protective abilities you teach Zuzu |
| Wind demon hierarchy | Skill tree organized as a wind-demon hierarchy |
| Breaking the wings of evil lilû | Mastering a skill = "breaking the wings" of that challenge |
| Domestic spirit aspect | Home tab = the "household shrine" |
| Cuneiform inscriptions | Decorative detail, milestone names |
| Son of Hanbi | "Hanbi's Legacy" as an achievement category |

### Naming Convention:
- Skills are called **"Wards"** (protective abilities)
- Mastering a skill = **"Sealing the Ward"** 
- Skill phases = **"Circles"** (like circles of protection)
  - Circle I: Foundation Wards
  - Circle II: Core Wards  
  - Circle III: Life Wards
- Training sessions = **"Rituals"**
- The daily plan = **"The Daily Rite"**
- Milestones = **"Inscriptions"** (like cuneiform on the back of Pazuzu statues)
- The skill tree = **"The Ward Tree"** or **"Pazuzu's Shield"**
- Streak = **"Vigil"** (consecutive days of practice)

---

## 2. VISUAL DESIGN DIRECTION

### Aesthetic: **Mesopotamian Arcane + Dark OLED Gaming UI**

Think: *Hades* (the game) meets ancient Babylonian temple inscriptions. Dark, warm, mystical — NOT generic purple-gradient AI slop.

### Color Palette:
```css
:root {
  /* Primary: warm amber/gold — like terracotta and bronze amulets */
  --pri: #D4A853;          /* Warm gold — Pazuzu amulet bronze */
  --pri-glow: rgba(212,168,83,0.20);
  --pri-dim: #8B7035;
  
  /* Accent: protective teal — Mesopotamian lapis lazuli */  
  --acc: #4ECDC4;          /* Teal — lapis lazuli, Ishtar Gate */
  --acc-glow: rgba(78,205,196,0.15);
  
  /* Status */
  --ok: #7BC67E;           /* Muted sage green — sealed ward */
  --warn: #E8B84B;         /* Amber warning */
  --bad: #C75B5B;          /* Muted clay red — not harsh */
  
  /* Surfaces — true black OLED with warm undertone */
  --bg: #0A0A0F;           /* Near-black with slight warmth */
  --card: #12121E;         /* Dark temple stone */
  --card2: #1A1A2A;        /* Lighter stone */
  --input: #161625;        
  
  /* Text */
  --txt: #E8E4D9;          /* Warm parchment white, NOT blue-white */
  --txt2: #9B9685;         /* Weathered stone */
  --txt3: #5A564A;         /* Faded inscription */
  
  /* Borders & misc */
  --brd: #2A2A3A;
  --glow-gold: 0 0 20px rgba(212,168,83,0.15);
}
```

### Typography:
- Do NOT use Inter, Roboto, or Arial
- Use a distinctive font pairing:
  - **Display/Headers:** A geometric or inscriptive font (consider importing one from Google Fonts that evokes carved stone — e.g., `Cinzel`, `Cormorant Garamond`, or `Uncial Antiqua` for decorative headers)
  - **Body:** A clean humanist sans-serif like `Source Sans 3` or `DM Sans` — readable on mobile but warmer than system fonts
- Skill abbreviation badges: use a monospace or slab font for the 2-letter codes

### Visual Details:
- Subtle geometric border patterns inspired by Mesopotamian art (zigzag lines, stepped patterns) on cards
- Ward icons: 2-letter abbreviations in circular badges with a subtle cuneiform-inspired border
- Mastered skills get a golden glow effect
- Locked skills appear as "dormant wards" — faded with a small lock icon
- The skill tree should have visible CONNECTION LINES between prerequisite skills (SVG lines or CSS borders)
- Use subtle grain/noise texture overlay on the background for depth
- Toast notifications styled as "inscriptions appearing"
- Phase/Circle headers with small decorative dividers

### Navigation Icons:
Replace generic SVG icons with thematically appropriate ones:
- Home → Shrine/Temple icon (simplified ziggurat)
- Ward Tree → Branching tree / shield icon
- Ritual (Train) → Flame / candle icon
- Chronicle (Log) → Scroll / tablet icon
- Progress → Rising steps / mountain icon

### CRITICAL CONSTRAINTS:
- OLED true black background (saves battery on Pixel 4a)
- All touch targets minimum 44px
- Use `:active` states, NOT `:hover` (mobile-first)
- Max-width: 430px centered
- No emoji anywhere — use 2-letter abbreviations and SVG icons only

---

## 3. ARCHITECTURE

### Single-file PWA
- **`index.html`** — All CSS + HTML + JS in one file. No external dependencies, no CDN, no build step.
- **`sw.js`** — Service worker, cache-first strategy. Bump `CACHE_NAME` version on changes.
- **`manifest.json`** — PWA manifest for Android install
- **`icons/`** — SVG app icons (redesign with Pazuzu motif — stylized canine face with wings)

### Data Persistence Strategy

**Primary: localStorage** (`pazuzuWards` key)
- Same as current approach but with expanded data model
- JPEG photos compressed at 0.7, max 600px for localStorage budget (~5MB)

**Backup: JSON Export/Import**
- One-tap export to JSON file
- Import with validation and merge strategy
- Add **auto-export reminder** every 7 days (toast notification)

**NEW: Background Alone Timer Persistence**
- When alone timer is running, save state to localStorage every 10 seconds:
  ```js
  { aloneTimerStart: Date.now(), aloneTimerRunning: true }
  ```
- On app reopen, detect running timer and resume from saved start time
- Use `visibilitychange` event to persist timer state when app goes to background
- Use `beforeunload` to save state on close
- This ensures the timer survives app backgrounding, browser tab closure, and accidental navigation

---

## 4. FULL SKILL (WARD) DATABASE

### Research-Backed Skill Tree

Every skill below is drawn from Kikopup's (Emily Larlham's) Progressive Reinforcement Training methodology. Video links go to Kikopup search results. Steps follow her graduated approach: capture/lure → add cue → add duration → add distance → add distractions.

Each step should include:
- `t` — Step title
- `d` — Detailed description (what to do)
- `guidance` — Object with optional fields:
  - `vocal`: String — what verbal cue or sound to use (e.g., "say 'yes' as marker", "kissy noise", "say 'watch me'") 
  - `hand`: String — hand/body guidance (e.g., "lure with treat at nose level", "point to mat", "closed fist")
  - `position`: String — where to be relative to dog (e.g., "facing dog", "at dog's side", "across room")
- `capture` — Object describing what data to collect:
  - `type`: `'reps'` | `'duration'` | `'observe'` | `'timed_reps'`
    - `reps`: Count success/miss (standard click-counter style)
    - `duration`: Track how long the dog holds (e.g., eye contact duration, stay duration)  
    - `observe`: No fail condition — just mark when the behavior happens (e.g., "capturing calmness" — you're just rewarding natural behavior)
    - `timed_reps`: Reps within the timer, but with a different UI emphasis
  - `successLabel`: String — what the ✓ button means (e.g., "Looked", "Sat", "Dropped it", "Stayed calm")
  - `missLabel`: String | null — what the ✗ button means, or null if there's no fail condition
  - `notes_prompt`: String — placeholder text for the notes field specific to this step

### CIRCLE I — Foundation Wards (Days 1-7, auto-unlocked)

```js
{
  id: 'attention', name: 'Attention Ward', abbr: 'AT', phase: 1, prereqs: [],
  desc: 'Teaching Zuzu to offer eye contact voluntarily — the foundation of all communication.',
  video: 'https://www.youtube.com/results?search_query=kikopup+eye+contact+training',
  steps: [
    {
      t: 'Capture Eye Contact',
      d: 'Wait for Zuzu to glance at your eyes. The instant she makes eye contact, mark ("yes" or click) and treat. No cue yet — just reward natural glances toward your face.',
      guidance: { vocal: 'Mark with "yes" or clicker the instant eyes meet yours', hand: 'Hands still — no luring', position: 'Facing Zuzu, relaxed posture' },
      capture: { type: 'observe', successLabel: 'Looked', missLabel: null, notes_prompt: 'How quickly did she offer eye contact? Duration of glances?' }
    },
    {
      t: 'Build Duration',
      d: 'Gradually wait for longer eye contact before marking. Start with 1 second, build to 3. If she breaks contact, simply wait — never repeat or prompt.',
      guidance: { vocal: 'Same "yes" marker — delay it slightly each session', hand: 'Still no hand motion', position: 'Facing, 2-3 feet away' },
      capture: { type: 'duration', successLabel: 'Held gaze', missLabel: 'Broke early', notes_prompt: 'Longest duration held? Average hold time?' }
    },
    {
      t: 'Mild Distractions',
      d: 'Practice with a toy on the floor or a person nearby. Mark eye contact that happens despite the distraction. Keep sessions to 2-3 minutes.',
      guidance: { vocal: '"Yes" marker when she chooses you over distraction', hand: 'None — let her choose', position: 'Near the distraction source' },
      capture: { type: 'reps', successLabel: 'Chose me', missLabel: 'Distracted', notes_prompt: 'What distractions were present? How did she handle them?' }
    },
    {
      t: 'Add Verbal Cue',
      d: 'Once she offers eye contact reliably, say "watch me" just BEFORE she looks. Pair the word with the behavior she already knows.',
      guidance: { vocal: 'Say "watch me" → she looks → mark "yes" → treat', hand: 'Brief point to your eyes if needed, then fade', position: 'Facing, various distances' },
      capture: { type: 'reps', successLabel: 'Responded to cue', missLabel: 'No response', notes_prompt: 'Response latency? Does she respond without hand signal?' }
    },
    {
      t: 'Proof Everywhere',
      d: 'Practice in different rooms, outdoors on leash, near other dogs at distance. In new environments, accept shorter duration and rebuild.',
      guidance: { vocal: '"Watch me" cue', hand: 'None needed', position: 'Various — new environments' },
      capture: { type: 'reps', successLabel: 'Responded', missLabel: 'Too distracted', notes_prompt: 'Environment? Distance from distractions? Duration achieved?' }
    }
  ]
},
{
  id: 'interrupter', name: 'Positive Interrupter', abbr: 'PI', phase: 1, prereqs: [],
  desc: 'A special sound that means "stop what you\'re doing and come get something amazing."',
  video: 'https://www.youtube.com/results?search_query=kikopup+positive+interrupter',
  steps: [
    {
      t: 'Charge the Sound',
      d: 'Pick a unique sound (kissy noise, whistle, or specific word). Make the sound then immediately give a HIGH-VALUE treat. Repeat 15-20 times. Zuzu doesn\'t need to do anything — just building the association.',
      guidance: { vocal: 'Your chosen sound (kissy noise recommended) → immediate treat', hand: 'Deliver treat directly after sound', position: 'Any — Zuzu can be doing anything' },
      capture: { type: 'observe', successLabel: 'Pair completed', missLabel: null, notes_prompt: 'What sound are you using? How many pairings this session? Any head turn toward you yet?' }
    },
    {
      t: 'Test Response',
      d: 'When Zuzu is mildly distracted, make the sound. She should whip her head toward you. If she doesn\'t, go back to charging more.',
      guidance: { vocal: 'Interrupter sound when she\'s mildly distracted', hand: 'Treat ready in hand', position: 'Within a few feet' },
      capture: { type: 'reps', successLabel: 'Head whip', missLabel: 'No response', notes_prompt: 'Response speed? How distracted was she? How enthusiastic was the head turn?' }
    },
    {
      t: 'Use with Distractions',
      d: 'Practice when Zuzu is sniffing, looking away, etc. Sound → she looks → mark and treat. Never use when she\'s over threshold (too scared or too excited).',
      guidance: { vocal: 'Interrupter sound → "yes" marker → jackpot treat', hand: 'None', position: 'Various distances' },
      capture: { type: 'reps', successLabel: 'Interrupted', missLabel: 'Over threshold', notes_prompt: 'Distraction level? Was she under or over threshold? Response time?' }
    },
    {
      t: 'Increase Difficulty',
      d: 'Gradually use around more interesting distractions. Always reward generously — this must stay a "jackpot" sound. Never overuse or it loses power.',
      guidance: { vocal: 'Same sound — must ALWAYS predict amazing reward', hand: 'Jackpot treats (multiple high-value)', position: 'Any real-world scenario' },
      capture: { type: 'reps', successLabel: 'Jackpot response', missLabel: 'Weak/no response', notes_prompt: 'Hardest distraction she responded to? Treat value used?' }
    }
  ]
},
{
  id: 'nomugging', name: 'Impulse Control', abbr: 'IC', phase: 1, prereqs: [],
  desc: 'Teaching Zuzu that self-control earns rewards — the foundation of It\'s Yer Choice.',
  video: 'https://www.youtube.com/results?search_query=kikopup+its+yer+choice+impulse+control',
  steps: [
    {
      t: 'Closed Fist',
      d: 'Hold treat in closed fist. Zuzu will nose, paw, and lick. Wait. The moment she backs off or looks away, mark and treat from your OTHER hand.',
      guidance: { vocal: '"Yes" when she backs off or disengages', hand: 'Closed fist with treat — reward from OTHER hand', position: 'Sitting in front of Zuzu' },
      capture: { type: 'reps', successLabel: 'Backed off', missLabel: 'Still mugging', notes_prompt: 'How long before she offered the first back-off? Getting faster?' }
    },
    {
      t: 'Open Hand',
      d: 'Place open hand with treat near floor. Cover it if she lunges. When she looks away or backs off, mark and reward from the other hand.',
      guidance: { vocal: '"Yes" on disengage', hand: 'Open palm — cover quickly if she goes for it', position: 'Hand low, sitting or kneeling' },
      capture: { type: 'reps', successLabel: 'Showed restraint', missLabel: 'Went for it', notes_prompt: 'Open hand duration before covering? Fastest disengage?' }
    },
    {
      t: 'Treat on Floor',
      d: 'Place treat on floor, cover with hand if she goes for it. Mark and reward from other hand when she shows restraint. Build to uncovered treat.',
      guidance: { vocal: '"Yes" when she chooses not to take it', hand: 'Ready to cover — reward from other hand', position: 'Kneeling beside treat' },
      capture: { type: 'reps', successLabel: 'Left it', missLabel: 'Grabbed it', notes_prompt: 'Covered or uncovered? Duration of restraint?' }
    },
    {
      t: 'Around Food',
      d: 'Build duration of restraint around visible food. Practice near your plate, low tables, food prep. Always reward the choice to leave it alone.',
      guidance: { vocal: '"Yes" for ignoring food', hand: 'Treat ready as reward', position: 'Near real food situations' },
      capture: { type: 'reps', successLabel: 'Ignored food', missLabel: 'Went for it', notes_prompt: 'What food? How close? How long did she ignore it?' }
    }
  ]
},
{
  id: 'calmness', name: 'Capturing Calmness', abbr: 'CC', phase: 1, prereqs: [],
  desc: 'Rewarding calm states of being throughout the day — Zuzu learns that relaxation pays.',
  video: 'https://www.youtube.com/results?search_query=kikopup+capturing+calmness',
  steps: [
    {
      t: 'Reward Calm Moments',
      d: 'Throughout the day, when Zuzu naturally lies down or settles, gently mark and toss a treat to her. No cue, no prompting. You\'re reinforcing a state of being.',
      guidance: { vocal: 'Quiet, calm "yes" or gentle marker', hand: 'Gently toss or place treat — no excited delivery', position: 'Wherever she happens to settle' },
      capture: { type: 'observe', successLabel: 'Calm captured', missLabel: null, notes_prompt: 'Where did she settle? What was happening? How long was she calm before you marked?' }
    },
    {
      t: 'On a Mat',
      d: 'When Zuzu settles on her bed or mat, calmly reward. Build up to dropping several treats one at a time while she stays settled. Deliver treats slowly and quietly.',
      guidance: { vocal: 'Very quiet marker or none — just deliver treat', hand: 'Slow, calm treat delivery — one at a time', position: 'Near her mat, calm energy' },
      capture: { type: 'duration', successLabel: 'Settled on mat', missLabel: 'Got up', notes_prompt: 'Duration on mat? How many treats delivered? Did she stay after last treat?' }
    },
    {
      t: 'Build Duration',
      d: 'Gradually space out rewards while Zuzu stays relaxed on mat. If she gets up, that\'s fine — no correction. Just reward the next calm settle she offers.',
      guidance: { vocal: 'Minimal — quiet presence', hand: 'Increasingly spaced treat delivery', position: 'Gradually increase your distance from mat' },
      capture: { type: 'duration', successLabel: 'Stayed settled', missLabel: 'Got up', notes_prompt: 'Longest duration between treats? Did she stay relaxed or look expectant?' }
    },
    {
      t: 'Exciting Contexts',
      d: 'Practice mat settling when visitors arrive (start at distance), in new rooms, or when activity is happening. Lower criteria in harder contexts.',
      guidance: { vocal: 'Calm marker when she chooses mat over excitement', hand: 'Higher value treats in harder contexts', position: 'Mat placed in progressively exciting environments' },
      capture: { type: 'reps', successLabel: 'Settled despite activity', missLabel: 'Too excited', notes_prompt: 'What exciting thing was happening? Distance from trigger? Duration of settle?' }
    }
  ]
},
{
  id: 'crate', name: 'Crate Training', abbr: 'CR', phase: 1, prereqs: [],
  desc: 'Making the crate a safe den — never a punishment. Zuzu should walk in voluntarily.',
  video: 'https://www.youtube.com/results?search_query=kikopup+crate+training',
  steps: [
    {
      t: 'Crate Discovery',
      d: 'Toss treats near and then into the crate. Let Zuzu explore freely — door stays OPEN. No luring or pushing. End on a good note if she shows any hesitation.',
      guidance: { vocal: 'None — let curiosity drive', hand: 'Toss treats near, then just inside entrance', position: 'Sitting near crate, relaxed' },
      capture: { type: 'observe', successLabel: 'Approached/entered', missLabel: null, notes_prompt: 'How close did she get? Did she go inside? Body language (relaxed, cautious, stiff)?' }
    },
    {
      t: 'Meals Inside',
      d: 'Feed meals inside crate with door open. She should enter willingly. If not, place bowl closer to opening and move further in over sessions.',
      guidance: { vocal: 'None', hand: 'Place food bowl progressively further inside', position: 'Near crate but not blocking exit' },
      capture: { type: 'observe', successLabel: 'Ate inside crate', missLabel: null, notes_prompt: 'How far inside was the bowl? Did she eat the whole meal? Relaxed or rushed?' }
    },
    {
      t: 'Brief Door Closure',
      d: 'While Zuzu eats inside, gently close door. Open BEFORE she finishes eating. Gradually extend how long the door stays closed. Stay nearby.',
      guidance: { vocal: 'None — calm presence', hand: 'Close door gently, treat through door bars', position: 'Right next to crate' },
      capture: { type: 'duration', successLabel: 'Calm with door closed', missLabel: 'Stressed (whined/pawed)', notes_prompt: 'Duration door was closed? Any stress signals? Did she finish eating calmly?' }
    },
    {
      t: 'Short Separations',
      d: 'Close door, step away for 10 seconds, return calmly, treat through door, then open. Build duration slowly. Never use crate as punishment.',
      guidance: { vocal: 'Calm "good girl" through door bars', hand: 'Treat through bars on return', position: 'Step away, then out of sight briefly' },
      capture: { type: 'duration', successLabel: 'Calm while away', missLabel: 'Vocalised/distressed', notes_prompt: 'Distance you reached? Duration away? Any whining, barking, or scratching?' }
    },
    {
      t: 'Extended Duration',
      d: 'Build to 30+ minutes with you in another room. Leave stuffed Kong or safe chew. Keep departures and arrivals boring and low-key.',
      guidance: { vocal: 'Low-key goodbye and hello', hand: 'Provide enrichment item (Kong, chew)', position: 'Different room — out of sight' },
      capture: { type: 'duration', successLabel: 'Settled for full duration', missLabel: 'Stressed before time was up', notes_prompt: 'Total minutes? Enrichment used? Any vocalization? Calm when you returned?' }
    }
  ]
},
{
  id: 'house', name: 'House Training', abbr: 'HT', phase: 1, prereqs: [],
  desc: 'Building a reliable potty routine with reward-based outdoor elimination.',
  video: 'https://www.youtube.com/results?search_query=kikopup+house+training+puppy',
  steps: [
    {
      t: 'Frequent Outings',
      d: 'Take Zuzu out every 1-2 hours, after meals, after naps, and after play. Same spot each time. Wait quietly. When she goes, mark and have a treat party.',
      guidance: { vocal: '"Yes! Good girl!" — big celebration after she goes', hand: 'Treat party — multiple treats in a row', position: 'Same potty spot, standing quietly while waiting' },
      capture: { type: 'observe', successLabel: 'Went outside', missLabel: null, notes_prompt: 'Time since last outing? After meal/nap/play? How long until she went?' }
    },
    {
      t: 'Learn Her Signals',
      d: 'Watch for sniffing, circling, going to the door. Take her out immediately. Reward every outdoor success. Use baby gates to manage indoor access.',
      guidance: { vocal: 'Praise outdoor success', hand: 'Treat every outdoor success', position: 'Observing from nearby' },
      capture: { type: 'reps', successLabel: 'Signalled + success', missLabel: 'Accident', notes_prompt: 'What signal did she give? How quickly did you respond? Location of accident if any?' }
    },
    {
      t: 'Extend Intervals',
      d: 'Gradually increase time between outings as she proves reliable. Continue rewarding outdoor elimination. If accidents happen, just clean up — no punishment.',
      guidance: { vocal: 'Continue praising outdoor success', hand: 'Continue treating', position: 'Normal routine' },
      capture: { type: 'reps', successLabel: 'Held it', missLabel: 'Accident', notes_prompt: 'Hours between outings? Any accidents this week? Time of day patterns?' }
    },
    {
      t: 'Full Freedom',
      d: 'Gradually give Zuzu access to more rooms as she proves reliable. Occasional treats for going outside maintain the habit long-term.',
      guidance: { vocal: 'Intermittent praise', hand: 'Occasional treat', position: 'Full house access' },
      capture: { type: 'observe', successLabel: 'Reliable day', missLabel: null, notes_prompt: 'Rooms with access? Any regression? Days since last accident?' }
    }
  ]
}
```

### CIRCLE II — Core Wards (Days 7-21)

```js
// Name Recognition — prereqs: none
{ id: 'name', name: 'Name Recognition', abbr: 'NR', phase: 2, prereqs: [] }
// steps: Name=Treat (observe), Name Orientation (reps), Distance (reps), Busy Environments (reps)
// Vocal guidance: Say "Zuzu" clearly → treat. Never use name for scolding.

// Recall — prereqs: ['attention']
{ id: 'recall', name: 'Recall', abbr: 'RC', phase: 2, prereqs: ['attention'] }
// steps: Restrained Recall (reps), Surprise Recalls (reps), Long Line Outdoors (reps), Around Distractions (reps), Proof Reliability (reps)
// Vocal: "Zuzu, come!" — excited voice. NEVER call to end fun or punish.
// This is a SAFETY behavior — keep reinforcing for life.

// Sit — prereqs: none
{ id: 'sit', name: 'Sit', abbr: 'SI', phase: 2, prereqs: [] }
// steps: Lure or Capture (reps), Add Verbal Cue (reps), Any Position (reps), Add Duration (duration), Add Distractions (reps)
// Hand: Arc treat over head (lure). Vocal: "Sit" BEFORE she sits once reliable.

// Release Cue — prereqs: ['sit']
{ id: 'release', name: 'Release Cue', abbr: 'RE', phase: 2, prereqs: ['sit'] }
// steps: Pair the Word (reps), Release Before She Breaks (reps), Vary the Reward (reps), Use with Everything (reps)
// Vocal: "Free!" or "Break!" + toss treat so she must move

// Down — prereqs: ['sit']
{ id: 'down', name: 'Down', abbr: 'DN', phase: 2, prereqs: ['sit'] }
// steps: Lure from Sit (reps), Lure from Standing (reps), Add Verbal Cue (reps), Build Duration (duration), Various Surfaces (reps)
// Hand: Lower treat between paws to floor

// Leave It — prereqs: ['nomugging']
{ id: 'leaveit', name: 'Leave It', abbr: 'LI', phase: 2, prereqs: ['nomugging'] }
// steps: Two-Treat Method (reps), Add the Cue (reps), Floor Items (reps), On Walks (reps), High-Value Items (reps)
// KEY: Leave It item is NEVER the reward. Always reward from other hand.

// Drop It — prereqs: none
{ id: 'dropit', name: 'Drop It', abbr: 'DI', phase: 2, prereqs: [] }
// steps: Trade Game (reps), Add Cue (reps), Various Objects (reps), Quick Response (reps)
// KEY: Trade UP. She drops toy → treat → gets toy BACK. Never chase or force.
```

### CIRCLE III — Life Wards (Days 14-42)

```js
// Leash Pressure Yields — prereqs: ['attention']
{ id: 'leashpressure', name: 'Leash Pressure Yields', abbr: 'LP', phase: 3, prereqs: ['attention'] }

// Loose Leash Walking Indoor — prereqs: ['leashpressure', 'attention']
{ id: 'llwindoor', name: 'LLW Indoor', abbr: 'LW', phase: 3, prereqs: ['leashpressure', 'attention'] }

// Loose Leash Walking Outdoor — prereqs: ['llwindoor', 'interrupter']
{ id: 'llwoutdoor', name: 'LLW Outdoor', abbr: 'LO', phase: 3, prereqs: ['llwindoor', 'interrupter'] }

// Fetch — prereqs: ['dropit']
{ id: 'fetch', name: 'Fetch', abbr: 'FE', phase: 3, prereqs: ['dropit'] }

// Handling & Grooming — prereqs: ['calmness']
{ id: 'handling', name: 'Handling & Grooming', abbr: 'HG', phase: 3, prereqs: ['calmness'] }
// Uses Chirag Patel's Bucket Game + Kikopup cooperative care
// KEY: If she moves away, LET HER. Never hold still or restrain.

// Separation Training — prereqs: ['crate', 'calmness']
{ id: 'separation', name: 'Separation Training', abbr: 'ST', phase: 3, prereqs: ['crate', 'calmness'] }
// CRITICAL SKILL — see section 6 for expanded separation tracking

// Door Manners — prereqs: ['sit', 'release']
{ id: 'doormanners', name: 'Door Manners', abbr: 'DM', phase: 3, prereqs: ['sit', 'release'] }
```

### Prerequisite Map (for rendering the skill tree with connection lines):

```
attention ──→ recall
attention ──→ leashpressure ──→ llwindoor ──→ llwoutdoor
interrupter ──────────────────────────────→ llwoutdoor
nomugging ──→ leaveit
sit ──→ release
sit ──→ down
sit ──→ doormanners
release ──→ doormanners
calmness ──→ handling
calmness ──→ separation
crate ──→ separation
dropit ──→ fetch
leashpressure ──→ llwindoor
```

---

## 5. THE WARD TREE (Skill Tree UI)

### This is the centerpiece of the redesign.

Instead of a flat list grouped by phase, render an ACTUAL VISUAL SKILL TREE that looks like a game skill tree (think Path of Exile, Diablo, or Hades mirror of night).

### Layout approach:
- SVG or CSS-based tree with nodes and connecting lines
- Each skill is a circular/hexagonal node
- Lines connect prerequisites to dependent skills
- Nodes are colored by status:
  - **Locked** (grey, faded) — prerequisites not met
  - **Available** (dim gold outline, pulsing) — ready to start
  - **In Progress** (gold fill, partial ring showing progress %)
  - **Mastered/Sealed** (full golden glow, special border)
- Tapping a node opens a detail panel (slide-up sheet) with:
  - Skill name and description
  - Current step with full instructions
  - Step guidance (vocal, hand, position)
  - Step list showing progress (done/current/future)
  - Button to jump to training ritual for this skill
  - Link to Kikopup video search results

### Tree Layout (suggested positioning):
```
                    [AT] Attention
                   /    \
              [RC]       [LP] Leash Pressure
                          |
[PI] Pos.Int    [LW] LLW Indoor
        \         |
         [LO] LLW Outdoor

[IC] Impulse ──→ [LI] Leave It

[SI] Sit ──→ [RE] Release ──→ [DM] Door Manners
   |
  [DN] Down

[CC] Calmness ──→ [HG] Handling
       |
      [ST] Separation ←── [CR] Crate

[NR] Name Recog

[DI] Drop It ──→ [FE] Fetch

[HT] House Training
```

- The tree should be horizontally scrollable if it exceeds screen width, or use a compact vertical layout that fits on the Pixel 4a screen
- Consider a "zoom" interaction where tapping a Circle/Phase highlights that section

### First-Time User Flow:
When a user first opens the Ward Tree or taps a skill to train:
1. Show a brief modal: **"Where is Zuzu with this Ward?"**
2. Present the step list for that skill
3. Let them tap which step matches Zuzu's current ability
4. Confirm with description of what that step involves
5. This sets `progress[skillId].step` correctly before first training session

---

## 6. EXPANDED DATA MODEL

```js
D = {
  profile: {
    name: 'Zuzu',
    weight: 8.5,          // kg
    rescueDate: '',        // ISO date
    breed: 'Chiweenie',    // breed/mix
    age: '',               // approximate age or DOB
    origin: 'Mexico rescue'
  },
  
  settings: {
    duration: 180,         // default session seconds
    threshold: 80,         // advance % threshold
    evalSessions: 3,       // rolling avg window
    treatTiers: '',        // text: Low/Med/High treats
    soundEnabled: true,    // ding on timer end
    reminders: true        // daily training reminder
  },
  
  progress: {
    [skillId]: {
      step: 0,             // current 0-based step index
      unlocked: false,     // prereqs met
      startedAt: null,     // ISO date — when first trained
      masteredAt: null      // ISO date — when sealed
    }
  },
  
  sessions: [{
    id: '',                // timestamp-based unique ID
    sid: '',               // skill ID
    dt: '',                // ISO datetime
    step: 0,               // step index during session
    ok: 0,                 // success count
    no: 0,                 // miss count (null for 'observe' type)
    dur: 0,                // session duration in seconds
    notes: '',
    captureType: '',       // 'reps' | 'duration' | 'observe' | 'timed_reps'
    environment: '',       // optional: indoor/outdoor/new place
    treatLevel: '',        // optional: low/med/high value treats used
    distractionLevel: ''   // optional: none/low/medium/high
  }],
  
  milestones: [{
    id: '', t: '', ic: '', dt: ''
  }],
  
  pottyLogs: [{
    id: '', dt: '', type: '', // pee/poop/both
    loc: '',       // outside/inside
    ctx: '',       // after meal/after nap/after play/morning/bedtime
    surface: '',   // grass/concrete/gravel/pad/floor
    photo: '',     // base64 JPEG
    notes: '',
    signalGiven: '' // none/sniffing/circling/door/whining/other
  }],
  
  aloneLogs: [{
    id: '', dt: '',
    dur: 0,                    // seconds
    loc: '',                   // crate/room/house/yard
    dist: '',                  // none/door/room/floor/out
    
    // EXPANDED ANXIETY TRACKING (research-backed signals)
    departureReaction: '',     // calm/noticed/whined/barked/panicked
    arrivalReaction: '',       // calm/excited/frantic/ignored
    bodyLanguage: [],          // multi-select: lip_licking, yawning, panting, pacing, trembling, whale_eye, tucked_tail, raised_hackles, drooling, scratching, hiding, clingy
    vocalization: '',          // none/whining/barking/howling/crying
    destructive: false,        // any destructive behavior
    ate: '',                   // yes/no/partially — did she eat enrichment
    enrichmentUsed: '',        // kong/puzzle/chew/lickmat/none
    eliminatedInside: false,   // accident during alone time
    
    // DEPARTURE CUES PRACTICED
    departureCuesPracticed: false,  // did you practice fake departures (keys, shoes, etc)
    
    calm: '',                  // yes/mostly/no
    notes: ''
  }],
  
  // NEW: Enrichment & Food Tracking
  enrichmentLogs: [{
    id: '', dt: '',
    type: '',          // kong/puzzle/lickmat/snuffle_mat/busy_box/scatter_feed/decompression_walk/flirt_pole/other
    duration: 0,       // minutes engaged
    engagement: '',    // high/medium/low/refused
    notes: ''
  }],
  
  // NEW: Food & Treat Preferences
  foodNotes: {
    kibble: '',            // brand/type currently using
    highValueTreats: [],   // strings: what she goes crazy for
    medValueTreats: [],    // strings: solid motivators
    lowValueTreats: [],    // strings: kibble-level
    dislikes: [],          // strings: foods she refuses or spits out
    allergies: [],         // strings: known or suspected
    feedingSchedule: '',   // text notes on schedule
    notes: ''
  },
  
  // NEW: Behavioral Observations
  behaviorNotes: [{
    id: '', dt: '',
    category: '',      // reactivity/fear/excitement/aggression/resource_guarding/other
    trigger: '',       // what caused it
    intensity: '',     // mild/moderate/severe
    bodyLanguage: [],  // same signal list as aloneLogs
    response: '',      // what you did
    outcome: '',       // how it resolved
    notes: ''
  }],
  
  // ALONE TIMER STATE (for background persistence)
  aloneTimerState: {
    running: false,
    startTime: null,    // Date.now() when started
    elapsed: 0          // seconds accumulated before current run
  }
}
```

### Anxiety Signal Tracking Reference

Based on Turid Rugaas's calming signals research and veterinary behavioral science, these are the key body language signals to track during separation and general observations:

| Signal | What it means | When to note |
|---|---|---|
| Lip licking | Stress, appeasement | During departures, new situations |
| Yawning | Stress (not sleepiness) | Contextual — inappropriate timing |
| Panting | Stress (not heat/exercise) | Stiff tongue, drawn-back = stress |
| Pacing | Cannot settle, anxiety | During alone time, pre-departure |
| Trembling/shaking | Fear, high stress | Alone time, vet visits, storms |
| Whale eye | Showing whites of eyes | When uncomfortable, guarding |
| Tucked tail | Fear, submission | New environments, strangers |
| Raised hackles | Arousal (not always aggression) | New dogs, sudden stimuli |
| Drooling | Extreme stress | Alone time, car rides |
| Scratching | Displacement behavior | Appears to scratch "for no reason" |
| Hiding | Avoidance, fear | Under furniture, behind you |
| Clingy/velcro | Separation anxiety precursor | Following room to room |
| Freezing | Assessing danger | Sudden stillness = pay attention |
| Sniffing ground | Displacement, self-calming | Inappropriate context sniffing |
| Turning away | Avoidance, calming signal | When approached by stranger/dog |
| Low body posture | Fear, trying to appear small | New environments, loud noises |

The app should present these as **tappable toggle chips** during alone time logging, making it fast to record which signals were observed.

---

## 7. TRAINING RITUAL (Session) Flow

### Pre-Session:
1. User selects a Ward from the grid or taps "Train" on a Ward from the tree
2. **FIRST TIME FOR THIS WARD:** Show "Where is Zuzu?" modal with step descriptions. Let user pick starting step.
3. Show current step card with:
   - Step title and full description
   - **Guidance box:** vocal cue, hand guidance, body position (highlighted in accent color)
   - Capture type indicator (what the buttons will track)
4. Select session duration (1/2/3/5 min toggle chips)
5. **Prominent "Begin Ritual" button**

### During Session:
1. **Timer auto-starts with a brief 3-2-1 countdown** (so user doesn't forget to start)
   - If user wants manual control, they can tap to pause
2. Display based on `capture.type`:
   - **`reps`**: Two big buttons — ✓ (successLabel) and ✗ (missLabel). Running count and rate.
   - **`duration`**: Single tap-to-start/stop button measuring hold duration. Records each hold.
   - **`observe`**: Single ✓ button (successLabel). No ✗ button. "Tap when you see the behavior."
   - **`timed_reps`**: Same as reps but with more emphasis on the timer.
3. Current step instruction visible but collapsed (expandable)
4. Guidance summary visible: "🗣 Say 'watch me' → 👋 No hand signal → 📍 Various rooms"
5. Running stats: Total reps, success rate (if applicable), elapsed time

### Timer End:
1. **Audio ding** — use Web Audio API to generate a pleasant bell/chime sound (no external audio file needed). Generate a sine wave tone at ~880Hz for 200ms, fading out. Or a two-tone chime.
2. Visual flash on the timer display
3. **Gentle prompt:** "Ritual complete! How did it go?"
4. Show session summary with option to add notes
5. Show rolling average and advancement recommendation:
   - **≥80%** over last N sessions → "⬆ Ready to advance to next step?" (with confirm)
   - **<50%** → "Consider reinforcing the previous step — regression is normal and always good practice."
   - **50-80%** → "Keep practicing this step — Zuzu is getting there!"

### Post-Session:
1. Save to `sessions` array
2. Update progress, check milestones
3. If advancement accepted → increment step
4. If last step mastered → "🏆 Ward Sealed! [skill name] mastered!" — special golden animation
5. Check if any new skills are now unlocked and notify

---

## 8. ALONE TIME TRACKER

### Must survive:
- App being backgrounded
- Browser tab closing
- Phone screen locking
- Accidental navigation away

### Implementation:
```js
// On start:
D.aloneTimerState = { running: true, startTime: Date.now(), elapsed: 0 };
save();

// On visibility change (background/foreground):
document.addEventListener('visibilitychange', () => {
  if (D.aloneTimerState.running) save(); // persist current state
});

// On app load (resume check):
if (D.aloneTimerState.running) {
  // Calculate elapsed from startTime to now
  const elapsed = Math.floor((Date.now() - D.aloneTimerState.startTime) / 1000) + D.aloneTimerState.elapsed;
  // Resume UI timer from this elapsed value
  resumeAloneTimer(elapsed);
}

// Periodic save every 30 seconds while running:
setInterval(() => { if (D.aloneTimerState.running) save(); }, 30000);
```

### UI:
- Always visible as a **floating indicator** when timer is running (small pill at top of screen showing elapsed time, regardless of which tab you're on)
- Pulsing red dot when recording
- One-tap access to the alone time form from anywhere
- When saving, present the full anxiety signal form with toggle chips

---

## 9. ENRICHMENT & FOOD TRACKING

### Quick Log Enrichment:
On the Log tab or as a quick action from Home, allow logging:
- Type: Kong / Puzzle toy / Lick mat / Snuffle mat / Busy box / Scatter feed / Decompression walk / Flirt pole / Chew / Other
- Duration engaged (minutes)
- Engagement level: High / Medium / Low / Refused
- Notes

### Food Preferences:
In Settings, add a "Zuzu's Palate" section:
- High value treats (comma-separated tags)
- Medium value treats
- Low value treats
- Dislikes / refused foods (important for training — if a treat isn't working, check here)
- Known allergies/sensitivities
- Current kibble brand
- Feeding schedule notes

This data should be **surfaced during training sessions** — when starting a ritual, show a small note: "Suggested treat tier: [High/Med/Low] for [skill difficulty]"

---

## 10. BEHAVIORAL OBSERVATION LOG

Quick-access form for logging notable behaviors outside of structured training:

- Category: Reactivity / Fear / Excitement / Resource guarding / Aggression / Positive social / Other
- Trigger: Free text (what caused it)
- Intensity: Mild / Moderate / Severe  
- Body language signals: Same toggle chip set as anxiety signals
- Your response: What you did (free text)
- Outcome: How it resolved (free text)
- Notes

This gives a longitudinal record of behavioral patterns that can inform training priorities.

---

## 11. MILESTONES (Inscriptions) — Expanded

Themed as cuneiform inscriptions being revealed:

```js
const INSCRIPTIONS = [
  // Session milestones
  { id: 'first_ritual', check: () => sessions.length >= 1, text: 'First Ritual Performed', icon: 'flame' },
  { id: 'ten_rituals', check: () => sessions.length >= 10, text: 'Ten Rituals Completed', icon: 'flame' },
  { id: 'twentyfive', check: () => sessions.length >= 25, text: 'Twenty-Five Rituals', icon: 'star' },
  { id: 'fifty', check: () => sessions.length >= 50, text: 'Fifty Rituals', icon: 'star' },
  { id: 'hundred', check: () => sessions.length >= 100, text: 'One Hundred Rituals!', icon: 'crown' },
  
  // Streak (Vigil) milestones
  { id: 'vigil_3', check: () => streak() >= 3, text: '3-Day Vigil', icon: 'shield' },
  { id: 'vigil_7', check: () => streak() >= 7, text: '7-Day Vigil', icon: 'shield' },
  { id: 'vigil_14', check: () => streak() >= 14, text: '14-Day Vigil!', icon: 'shield' },
  { id: 'vigil_30', check: () => streak() >= 30, text: '30-Day Vigil!', icon: 'shield' },
  
  // Ward mastery
  // Auto-generated: one per skill — "Ward of [skill] Sealed"
  
  // Circle completion
  { id: 'circle_1', check: () => allPhase1Mastered(), text: 'Circle I Complete — Foundation Sealed', icon: 'circle' },
  { id: 'circle_2', check: () => allPhase2Mastered(), text: 'Circle II Complete — Core Sealed', icon: 'circle' },
  { id: 'circle_3', check: () => allPhase3Mastered(), text: 'Circle III Complete — Life Wards Sealed', icon: 'circle' },
  
  // Special
  { id: 'all_sealed', check: () => allMastered(), text: 'Pazuzu\'s Shield Complete — All Wards Sealed', icon: 'pazuzu' },
  { id: 'first_alone_30', check: () => hasAloneLog(30*60), text: 'First 30-Minute Separation', icon: 'house' },
  { id: 'first_alone_60', check: () => hasAloneLog(60*60), text: 'First Hour Alone', icon: 'house' },
  { id: 'potty_streak_7', check: () => noPottyAccidents(7), text: '7 Days Accident-Free', icon: 'leaf' },
];
```

---

## 12. HOME TAB — "The Shrine"

Display:
1. **Zuzu's Avatar** — Stylized dog silhouette within a Pazuzu-inspired circular frame (golden border with wing motifs)
2. **Name, weight, days since rescue** (brief stats)
3. **Vigil (streak)** — prominently displayed with fire/flame visual
4. **Quick Stats:** Total rituals, Active wards, Sealed wards
5. **The Daily Rite** — Today's recommended 5 skills to practice, prioritized by:
   - Least recently practiced
   - Closest to advancement threshold
   - Recently unlocked skills
6. **Quick Actions** grid:
   - Log Potty (with count today)
   - Alone Time (shows running timer if active)
   - Log Enrichment
   - Log Behavior Note
7. **Recent Activity** — last 3-5 logged items

---

## 13. PROGRESS TAB — "Chronicles"

1. **Activity Heatmap** (8 weeks) — same as current but with gold palette
2. **Inscriptions** (milestones) — most recent at top
3. **Separation Progress Chart** — if aloneLogs exist, show a simple line/bar chart of max alone duration over time (use inline SVG or canvas — no chart library)
4. **Ward Progress Summary** — each skill showing step progress as a mini bar
5. **Session History** — reverse-chronological, filterable by skill

---

## 14. TECHNICAL IMPLEMENTATION NOTES

### Audio (Timer Ding):
```js
function playDing() {
  if (!D.settings.soundEnabled) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 880; // A5
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
  // Second tone for pleasant chime
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = 'sine';
  osc2.frequency.value = 1318.5; // E6
  gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
  osc2.start(ctx.currentTime + 0.15);
  osc2.stop(ctx.currentTime + 1);
}
```

### Session Auto-Start Countdown:
When user taps "Begin Ritual":
1. Show overlay: "3... 2... 1... Begin!" (each number fills screen briefly)
2. Timer starts automatically
3. If user is doing an `observe` type capture, timer still runs but there's a prominent reminder: "Ready? Watch for the behavior and tap ✓ when you see it."

### Vibration API:
For timer end and button feedback:
```js
if (navigator.vibrate) navigator.vibrate(200); // 200ms buzz on timer end
```

### Service Worker:
- Keep cache-first strategy
- Bump `CACHE_NAME` to `'pazuzu-v1'`
- Update asset list to match new file structure

### localStorage Key:
- Change from `'zuTrainer'` to `'pazuzuWards'`
- Include migration: if `zuTrainer` exists but `pazuzuWards` doesn't, migrate data

---

## 15. SUMMARY OF CHANGES FROM CURRENT APP

| Area | Current | New |
|---|---|---|
| Branding | "Zu's Kikopup Trainer" | "Pazuzu's Wards" — full Mesopotamian theme |
| Visual | Purple/pink dark theme | Gold/bronze/teal Mesopotamian arcane theme |
| Skills view | Flat list by phase | Interactive skill TREE with connection lines |
| Skill steps | Generic reps tracking | Context-aware capture (reps/duration/observe) |
| Guidance | Just step description | Vocal cue, hand guidance, position for each step |
| First-time | Starts at step 1 | "Where is Zuzu?" modal to pick starting step |
| Timer | Manual start, no audio | Auto-start countdown, ding sound on end |
| Alone time | Resets on close | Persists through background/close via localStorage state |
| Alone tracking | Basic (bark/calm) | Full anxiety signal tracking (15+ body language signals) |
| Data fields | Minimal | Enrichment logs, food preferences, behavioral observations |
| Potty tracking | Basic | Added surface type, signal given |
| Milestones | Generic | Themed as "Inscriptions" with Pazuzu mythology |
| Data backup | Manual export only | Auto-export reminder every 7 days |
| Font | System fonts | Distinctive font pairing (Cinzel + DM Sans or similar) |

---

## 16. FILE STRUCTURE

```
/
├── index.html          # Everything — CSS, HTML, JS
├── sw.js               # Service worker
├── manifest.json       # PWA manifest (updated name/theme)
├── icons/
│   ├── icon-192.svg    # Pazuzu-themed app icon
│   └── icon-512.svg    # Pazuzu-themed app icon
└── CLAUDE.md           # Dev docs for Claude Code
```

---

## 17. BUILD ORDER (for Claude Code)

1. **Read this spec fully before writing any code**
2. Create `CLAUDE.md` with architecture decisions
3. Build the data model and persistence layer first
4. Build the Ward Tree (skill tree) visualization
5. Build the training ritual flow with context-aware capture
6. Build the alone time tracker with background persistence
7. Build the expanded logging (potty, enrichment, behavior)
8. Build the home dashboard and progress views
9. Apply the full Pazuzu visual theme
10. Add audio (ding), vibration, and countdown
11. Test the service worker and PWA install flow
12. Migration from old `zuTrainer` data format

---

*"I am Pazuzu, son of Hanbi. I broke their wings."*
*— Let's break the wings of every challenge Zuzu faces.*
