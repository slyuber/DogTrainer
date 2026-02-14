export type Branch = 'foundation' | 'stillness' | 'impulse' | 'body' | 'world' | 'voice';
export type SessionType = 'active' | 'calm' | 'passive' | 'mealtime';

export interface SkillStep {
  title: string;
  whatToDo: string;
  successLooksLike: string;
  whenToAdvance: string;
  whenToGoBack: string;
  commonMistakes?: string[];
  tips?: string[];
  suggestedDuration: number; // seconds
  suggestedReps?: string;
}

export interface Prerequisite {
  skillId: string;
  stepRequired?: number; // 0-based step index
  mastery?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  branch: Branch;
  abbr: string;
  description: string;
  connections: string;
  sessionType: SessionType;
  sessionDuration: { min: number; max: number }; // seconds
  sessionsPerDay: { min: number; max: number };
  prerequisites: Prerequisite[];
  steps: SkillStep[];
  neverCompletes?: boolean;
  future?: boolean; // placeholder skill without full guide
}

// ---------------------------------------------------------------------------
// BRANCH 1: FOUNDATION
// ---------------------------------------------------------------------------

const marker: Skill = {
  id: 'marker',
  name: 'Marker Conditioning',
  branch: 'foundation',
  abbr: 'MK',
  description:
    'Teaching Zuzu that a specific sound ("yes" or a clicker) means a treat is coming. This is the language you use to communicate "that exact thing you just did is what I want." Every single skill in the tree depends on precise communication. The marker bridges the gap between the moment Zuzu does something right and the moment the treat arrives.',
  connections: 'Everything. This is the root of the entire tree. Unlocks all other skills.',
  sessionType: 'active',
  sessionDuration: { min: 60, max: 120 },
  sessionsPerDay: { min: 3, max: 5 },
  prerequisites: [],
  steps: [
    {
      title: 'Loading the Marker',
      whatToDo:
        'Say "yes" (or click) and immediately deliver a treat. Zuzu does not need to do anything. You are creating the association: sound = food. Treat delivery must be within 1 second of the marker. Speed matters. Do this in a quiet room with minimal distractions.',
      successLooksLike:
        'Zuzu\'s ears flick, head turns, or body orients toward you when he hears the marker -- even when he was not looking at you.',
      whenToAdvance:
        'Zuzu shows a consistent "head snap" response to the marker sound. Usually takes 2-4 sessions across 1-2 days.',
      whenToGoBack:
        'If Zuzu shows no orientation to the marker after 4+ sessions, check treat value (use higher-value treats) and marker timing (sound must come before reaching for treat).',
      commonMistakes: [
        'Reaching for the treat before saying "yes" -- Zuzu will learn to watch your hand, not listen for the marker',
        'Using the marker conversationally ("yes, good boy, yes") -- the marker must be a precise, single-use tool',
        'Marking too late -- the marker must happen at the INSTANT of the desired behavior, not after',
      ],
      suggestedDuration: 90,
      suggestedReps: '15-20',
    },
    {
      title: 'Marker in Varied Contexts',
      whatToDo:
        'Same exercise but in different rooms, at different times of day, when Zuzu is doing different things. The marker should produce a "head snap" response regardless of context. Continue for 2-3 days alongside other training. If the head snap disappears in a new context, do 10 reps of Step 1 in that context.',
      successLooksLike:
        'Consistent head snap in at least 3 different rooms/situations.',
      whenToAdvance:
        'Zuzu orients to the marker sound reliably in at least 3 different rooms or situations. Usually 2-3 additional days.',
      whenToGoBack:
        'If the head snap disappears in a new context, return to Step 1 and do 10 reps in that specific context before retesting.',
      suggestedDuration: 90,
      suggestedReps: '15-20',
    },
  ],
};

const name: Skill = {
  id: 'name',
  name: 'Name Recognition',
  branch: 'foundation',
  abbr: 'NM',
  description:
    'Zuzu turns his head toward you when he hears "Zuzu" (or "Pazuzu"). You cannot redirect, recall, or interrupt without attention. His name is the "open the menu" button -- everything else is a selection within the menu.',
  connections:
    'Required for Recall, useful for all Stillness and World skills. Unlocks Recall Foundation, Eye Contact, all outdoor training.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 3, max: 5 },
  prerequisites: [{ skillId: 'marker', stepRequired: 0 }],
  steps: [
    {
      title: 'Name = Free Treat (No Response Required)',
      whatToDo:
        'Say his name in a clear, upbeat tone. Immediately treat. He does not need to look at you or do anything. You are loading the name with value the same way you loaded the marker.',
      successLooksLike:
        'Ears perk or head turns at name.',
      whenToAdvance:
        'Zuzu shows ear perk or head turn when he hears his name. Usually 1-3 days.',
      whenToGoBack:
        'If Zuzu shows no response after 3 days, increase treat value and ensure you are using a consistent, upbeat tone.',
      suggestedDuration: 150,
      suggestedReps: '20-30',
    },
    {
      title: 'Name = Look at You',
      whatToDo:
        'Say his name. Wait up to 2 seconds. If he looks at you: marker + treat. If no response after 2 seconds, make a kissy noise to get attention, then treat. Fade the kissy noise over sessions.',
      successLooksLike:
        '8/10 looks within 2 seconds in a quiet room.',
      whenToAdvance:
        'Zuzu looks at you within 2 seconds of hearing his name, 8 out of 10 reps, in a quiet room. Usually 3-7 days.',
      whenToGoBack:
        'If success rate drops below 50%, return to Step 1 for 2-3 sessions.',
      suggestedDuration: 150,
      suggestedReps: '15-20',
    },
    {
      title: 'Name with Mild Distractions',
      whatToDo:
        'Same exercise but Zuzu is sniffing something mildly interesting, or you are in a different room, or there is low-level household noise.',
      successLooksLike:
        '7/10 looks within 2 seconds with distractions present.',
      whenToAdvance:
        'Zuzu responds to his name 7 out of 10 times within 2 seconds with mild distractions. Usually 1-2 weeks.',
      whenToGoBack:
        'If success rate drops below 50%, return to Step 2 for 2-3 sessions.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'Name Outdoors (Hallway, Then Outside)',
      whatToDo:
        'Start in the building hallway. Then parkade. Then outdoors on calm days. Expect regression -- this is normal. Lower criteria: any glance toward you gets marked.',
      successLooksLike:
        '6/10 looks within 3 seconds outdoors.',
      whenToAdvance:
        'Zuzu looks at you 6 out of 10 times within 3 seconds in outdoor environments. This is ongoing maintenance.',
      whenToGoBack:
        'If success rate drops below 50%, return to Step 3 for 2-3 sessions.',
      tips: [
        'Weave name reps into every other training session and throughout the day.',
        'Do a few reps before meals, before walks, during commercial breaks.',
      ],
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
  ],
};

const eyecontact: Skill = {
  id: 'eyecontact',
  name: 'Eye Contact / Engagement',
  branch: 'foundation',
  abbr: 'EC',
  description:
    'Zuzu voluntarily looks at your face, especially your eyes. This is different from name recognition -- this is Zuzu choosing to check in with you without being asked. A dog who checks in with his handler is a dog who can be redirected before problems start. On walks, a voluntary check-in before reacting to a trigger is the foundation of all stranger and reactivity work.',
  connections:
    'Capturing Calm, Loose Leash Walking, Stranger Work, Recall. Unlocks Stranger desensitization (you need check-ins to do engage/disengage), Loose Leash (penalty yards method needs voluntary attention).',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'marker', mastery: true }],
  neverCompletes: true,
  steps: [
    {
      title: 'Capture Any Glance',
      whatToDo:
        'Sit quietly with treats. Do not say anything. Do not lure. Wait. The instant Zuzu glances at your face: marker + treat. Deliver the treat slightly away from you (toss it a foot or two) so he has to look away and then choose to look back. This is critical: the treat goes AWAY from you. This creates a loop -- look at you, get marked, eat treat over there, look back at you, get marked, eat treat over there.',
      successLooksLike:
        'Zuzu is reliably looking back at you within 3 seconds of eating the tossed treat, for 10+ reps in a row.',
      whenToAdvance:
        'Zuzu ping-pongs: looks at you, eats tossed treat, looks back within 3 seconds, 10+ reps in a row. Usually by session 5-6.',
      whenToGoBack:
        'If Zuzu loses interest and stops looking back, end the session and try again after a walk or play session to burn off energy.',
      tips: [
        'First session he may only look at you 3-5 times. That is normal.',
        'Toss the treat a foot or two away -- the travel creates the look-back loop.',
      ],
      suggestedDuration: 150,
    },
    {
      title: 'Hold the Gaze',
      whatToDo:
        'Same setup but now you wait for a slightly longer look -- 1 second of eye contact instead of a flick. Then 2 seconds. Build slowly. Do NOT stare at Zuzu to force this. Soft eyes, relaxed face.',
      successLooksLike:
        '2-second holds, 8/10 reps.',
      whenToAdvance:
        'Zuzu holds eye contact for 2 seconds, 8 out of 10 reps.',
      whenToGoBack:
        'If Zuzu cannot hold for 1 second consistently, return to Step 1 for 2-3 sessions.',
      suggestedDuration: 150,
    },
    {
      title: 'Check-ins During Movement',
      whatToDo:
        'Walk around the room slowly. Mark and treat any time Zuzu looks up at your face while you are both moving. This is the precursor to loose leash walking.',
      successLooksLike:
        'Zuzu offers 5+ check-ins in a 2-minute period of casual movement.',
      whenToAdvance:
        'Zuzu offers 5 or more voluntary check-ins during 2 minutes of walking around the room.',
      whenToGoBack:
        'If check-ins drop below 3 per 2 minutes, return to Step 2 for several sessions.',
      suggestedDuration: 150,
    },
    {
      title: 'Check-ins Outdoors',
      whatToDo:
        'On walks. Mark and treat every single check-in for the first few weeks. Then thin the reinforcement. This skill never "completes." You maintain it forever by occasionally rewarding check-ins throughout Zuzu\'s life.',
      successLooksLike:
        'Zuzu regularly checks in with you on walks without prompting.',
      whenToAdvance:
        'This step does not have a formal advancement -- it is ongoing maintenance. Thin reinforcement gradually over weeks.',
      whenToGoBack:
        'If outdoor check-ins stop, return to Step 3 indoors and rebuild. Also ensure you are still rewarding check-ins on walks rather than taking them for granted.',
      suggestedDuration: 180,
    },
  ],
};

const handtarget: Skill = {
  id: 'handtarget',
  name: 'Hand Target / Touch',
  branch: 'foundation',
  abbr: 'HT',
  description:
    'Zuzu touches his nose to your open palm on cue. This is the Swiss Army knife of dog training. It gives you a way to move Zuzu without pulling his leash. It redirects attention. It interrupts fixation on triggers. It builds confidence (the dog takes an action and gets rewarded). It is the foundation for "go to your mat," handling, and cooperative care positioning.',
  connections:
    'Mat/Place training, Recall, Stranger work, Body Handling, Loose Leash. Unlocks Place training, Cooperative Care positioning, emergency redirection on walks.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'marker', mastery: true }],
  steps: [
    {
      title: 'Present and Mark',
      whatToDo:
        'Hold your open palm 6 inches from Zuzu\'s nose. Most dogs will investigate (sniff or bump). The instant his nose touches your palm: marker + treat. If he does not investigate, rub a tiny bit of treat on your palm.',
      successLooksLike:
        'Zuzu deliberately bumps your palm 8/10 times within 1 second of presentation.',
      whenToAdvance:
        'Zuzu deliberately bumps your palm 8 out of 10 times within 1 second of you presenting your hand. Usually 1-3 sessions.',
      whenToGoBack:
        'If Zuzu loses interest in your palm, try rubbing a treat on it again for a few reps to rebuild the association.',
      suggestedDuration: 120,
      suggestedReps: '10-15',
    },
    {
      title: 'Move the Target',
      whatToDo:
        'Present your palm in different positions -- high, low, left, right. Zuzu has to move to reach it. Start with small movements (6 inches from previous position).',
      successLooksLike:
        'Zuzu follows your palm to any position within arm\'s reach and bumps it deliberately.',
      whenToAdvance:
        'Zuzu follows your palm to any position within arm\'s reach and bumps it reliably.',
      whenToGoBack:
        'If Zuzu stops following the palm when you move it, reduce the distance of movement and rebuild gradually.',
      suggestedDuration: 120,
      suggestedReps: '10-15',
    },
    {
      title: 'Add the Cue',
      whatToDo:
        'Say "touch" just before presenting your palm. Only mark + treat if he touches AFTER the cue.',
      successLooksLike:
        'Zuzu responds to "touch" 8/10 times by bumping your palm.',
      whenToAdvance:
        'Zuzu responds to the verbal cue "touch" 8 out of 10 times.',
      whenToGoBack:
        'If Zuzu does not respond to the verbal cue, go back to Step 2 and ensure the physical response is strong before re-adding the cue.',
      suggestedDuration: 120,
      suggestedReps: '10-15',
    },
    {
      title: 'Add Distance',
      whatToDo:
        'Present your palm from 2 feet away. Then 4 feet. Zuzu has to walk to you to touch. This becomes a mini-recall.',
      successLooksLike:
        'Zuzu walks 4+ feet to touch your palm on cue.',
      whenToAdvance:
        'Zuzu reliably walks to you from across the room to touch your palm when cued.',
      whenToGoBack:
        'If Zuzu will not cross the distance, reduce to 1-2 feet and rebuild. Only increase distance when the shorter distance is reliable.',
      suggestedDuration: 120,
      suggestedReps: '10-15',
    },
    {
      title: 'Use as a Redirect',
      whatToDo:
        'On walks, when Zuzu notices a trigger but has not reacted yet, say "touch" and present your palm. Mark + treat for contact. This breaks fixation and reorients him toward you. Only works if Steps 1-4 are solid.',
      successLooksLike:
        'Zuzu responds to "touch" on walks even when mild triggers are present, breaking fixation and reorienting toward you.',
      whenToAdvance:
        'This is the practical application step. Continue reinforcing on walks as needed. Build to stronger distractions gradually.',
      whenToGoBack:
        'If Zuzu cannot respond to "touch" near triggers, increase distance from the trigger and return to Step 4 distance work in a calmer environment.',
      suggestedDuration: 120,
      suggestedReps: '5-10',
    },
  ],
};

// ---------------------------------------------------------------------------
// BRANCH 2: STILLNESS
// ---------------------------------------------------------------------------

const capturingcalm: Skill = {
  id: 'capturingcalm',
  name: 'Capturing Calm',
  branch: 'stillness',
  abbr: 'CC',
  description:
    'Rewarding Zuzu for any moment of stillness he offers on his own, without being asked. No cue, no command, no lure. You catch him being calm and make it pay. This is the single most important skill for daily quality of life together. A dog who can settle near you while you work is a dog who gets more freedom, more trust, and less pen time. Also prevents separation anxiety long-term.',
  connections:
    'Mat/Place (gives calm a location), Settle, Relaxation Protocol (structured calm). Also supports Stranger Work (calm is the alternative behavior to barking) and Body Handling (calm is required for grooming). Unlocks Mat/Place training, Settle, Relaxation Protocol, extended freedom in the house.',
  sessionType: 'calm',
  sessionDuration: { min: 300, max: 600 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'marker', mastery: true }],
  steps: [
    {
      title: 'Catch the Pause (Post-Walk Sessions)',
      whatToDo:
        'Do this immediately after a walk or play session when Zuzu has burned some energy and is more likely to pause. Sit in a chair. Have a pouch of high-value treats (small, soft, fast to eat -- cheese, hot dog bits, freeze-dried liver). Do not look at Zuzu. Read your phone. Pretend to work. Wait. He will pace. He will sniff. He will look at you expectantly. Do nothing. The instant he pauses -- even for ONE second -- gently place a treat between his front paws on the floor. Do NOT use your marker word yet. Do not say anything. Do not look at him excitedly. Just quietly place the treat. Why no marker? The marker is a precision tool that often revs dogs up. For capturing calm, you want to reward the STATE, not create excitement. The quiet treat delivery says "this moment right here, this stillness, this is what pays." He will eat the treat and get up and pace again. That is fine. Wait for the next pause. Repeat.',
      successLooksLike:
        'Zuzu is pausing for 3+ seconds and starting to orient toward you (or at least toward the floor near you) after eating the treat, instead of wandering away.',
      whenToAdvance:
        'Zuzu pauses for 3+ seconds and orients toward you or the floor near you after eating, instead of wandering away. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu cannot offer a pause within 2 minutes, check that he has had enough physical exercise before the session. A wound-up dog cannot capture calm. Try again after a longer walk.',
      tips: [
        'Session length: 5 minutes max. Calm training that goes too long creates frustration.',
        'Always do this after physical exercise or enrichment.',
        'Use one consistent location at first -- your desk chair, your couch.',
        'Session 1 you may only get 3-5 pauses. By session 5-8 you should see pauses getting longer.',
      ],
      suggestedDuration: 300,
    },
    {
      title: 'Reward the Sit or Down',
      whatToDo:
        'Same setup. But now you wait for Zuzu to sit or lie down, not just pause. If he has been doing Step 1 for several days, he will start offering sits because he has learned "stillness near this chair = treats appear." Only reward sits and downs, not standing pauses. Still no verbal cue -- you are capturing his choice. Treat delivery: Place treat between front paws (for sit) or slightly in front of paws (for down, to encourage the down position).',
      successLooksLike:
        'Zuzu offers a sit or down within 30 seconds of you sitting in the chair.',
      whenToAdvance:
        'Zuzu offers a sit or down within 30 seconds of you sitting in your training spot. Usually 1-2 weeks.',
      whenToGoBack:
        'If Zuzu is not offering sits/downs after 2 weeks, return to Step 1 and ensure pauses are being rewarded reliably. Also check exercise levels.',
      suggestedDuration: 300,
    },
    {
      title: 'Reward the Settle',
      whatToDo:
        'A settle is more than a down. It is a hip roll (weight shifts to one hip, not a sphinx position), a sigh, a head lower, or a look away from you. These are signs of genuine relaxation, not just "I\'m lying down waiting for the next treat." Deliver the first treat for the down. Then wait. Do not treat again until you see ONE sign of relaxation: hip roll, sigh, head drop, or eyes softening. If Zuzu gets up, ignore. Wait for the next down. Start over.',
      successLooksLike:
        'Zuzu offers a hip-rolled down with at least one relaxation sign within 1 minute of you sitting down.',
      whenToAdvance:
        'Zuzu offers a hip-rolled down with at least one relaxation sign (sigh, head drop, eyes softening) within 1 minute. Usually 2-4 weeks.',
      whenToGoBack:
        'If Zuzu keeps getting up before showing relaxation signs, return to Step 2 and build more duration in the basic down before asking for settle signs.',
      suggestedDuration: 450,
    },
    {
      title: 'Extend the Duration',
      whatToDo:
        'Now you thin the treats. Instead of treating every relaxation sign, wait longer between treats. Go from every 10 seconds to every 20, then 30, then 1 minute. If Zuzu gets up: DO NOT REACT. Do not say "no," do not sigh, do not look at him. Just wait for him to offer the down again and restart your count. Getting up has no consequence. Lying back down has consequences (treats). You can now introduce very quiet, calm praise between treats: "good" in a low, slow voice.',
      successLooksLike:
        'Zuzu maintains a settle for 5 minutes with only 2-3 treat deliveries.',
      whenToAdvance:
        'Zuzu holds a settle for 5 minutes with only 2-3 treat deliveries. Then fold this into your regular routine.',
      whenToGoBack:
        'If Zuzu cannot sustain a settle for more than 1 minute without getting up repeatedly, return to Step 3 and reward relaxation signs more frequently before thinning.',
      suggestedDuration: 600,
    },
    {
      title: 'Generalize',
      whatToDo:
        'Move the chair to a different room. Do the same exercise. Expect regression -- treat more frequently for the first 2-3 sessions in each new location. Then try it without the chair. Sit on the couch. Stand at the kitchen counter. The goal: Zuzu learns "wherever my human is still, calm pays."',
      successLooksLike:
        'Zuzu settles within a few minutes in multiple rooms and contexts, not just the original training spot.',
      whenToAdvance:
        'Zuzu offers calm settling behavior in at least 3 different locations or contexts. This is the final step -- continue maintaining throughout life.',
      whenToGoBack:
        'If calm behavior disappears in a new location, treat more frequently for the first 2-3 sessions there. If it still does not work, return to Step 4 in the original location and rebuild.',
      tips: [
        'Schedule placement: Always after physical activity.',
        'The sequence is: walk/play -> brief potty break -> capturing calm session -> pen or free time.',
      ],
      suggestedDuration: 600,
    },
  ],
};

const tethsettle: Skill = {
  id: 'tethsettle',
  name: 'Tether Settle',
  branch: 'stillness',
  abbr: 'TS',
  description:
    'Bridge between pen and free settle. Zuzu is clipped to a tether near you, limiting his options while keeping him close. He learns that being near you while tethered is calm and rewarding — the precursor to choosing calm without the tether.',
  connections:
    'Capturing Calm (parallel track), Mat/Place (tether settle feeds into mat work). Unlocks free settling near you without management.',
  sessionType: 'calm',
  sessionDuration: { min: 900, max: 3600 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'marker', mastery: true }],
  steps: [
    {
      title: 'Condition Tether as Positive',
      whatToDo:
        'Clip Zuzu to the tether. Immediately feed treats, give a kong, make it a party. Stay right next to him. After 5 minutes, unclip. Repeat 3-5 sessions until clipping the tether predicts good things.',
      successLooksLike:
        'Zuzu shows no stress when clipped to the tether — may wag, look expectant, or settle immediately.',
      whenToAdvance:
        'Zuzu is relaxed when clipped to the tether for 5 minutes across 3-5 sessions.',
      whenToGoBack:
        'If Zuzu panics or pulls at the tether, shorten the duration and increase treat value. Stay closer.',
      suggestedDuration: 300,
    },
    {
      title: 'Settle on Tether While You Sit Nearby',
      whatToDo:
        'Clip Zuzu to the tether. Sit in a chair within reach. Wait for a down — do not cue it. When he lies down, quietly place a treat between his paws. Treat every 15-30 seconds while he stays down. If he gets up, ignore. Wait for the next down.',
      successLooksLike:
        'Zuzu offers a down within 2 minutes and holds it for 5+ minutes with occasional treats.',
      whenToAdvance:
        'Zuzu settles on the tether for 15-30 minutes with treats every 1-2 minutes.',
      whenToGoBack:
        'If Zuzu will not lie down after 5 minutes, ensure he has had enough exercise. Try after a walk.',
      suggestedDuration: 1200,
    },
    {
      title: 'Extend Duration',
      whatToDo:
        'Build tether settle time from 15 minutes to 30, then 45, then 60+ minutes. Thin treats gradually. Provide a long-lasting chew (bully stick, frozen kong) to help bridge longer durations.',
      successLooksLike:
        'Zuzu settles on the tether for 45-60 minutes with a chew, minimal treat delivery needed.',
      whenToAdvance:
        'Zuzu can settle on the tether for 60+ minutes with only a chew and occasional treats.',
      whenToGoBack:
        'If Zuzu gets restless before 30 minutes, increase treat frequency and reduce duration target.',
      suggestedDuration: 2700,
    },
    {
      title: 'Fade to Free',
      whatToDo:
        'Unclip the leash but leave it attached loosely. Reward voluntary settling — if Zuzu stays near you and settles without the tether restriction, treat quietly. If he gets up and starts pacing, reclip and wait for the settle again.',
      successLooksLike:
        'Zuzu chooses to settle near you without the tether keeping him there.',
      whenToAdvance:
        'Zuzu voluntarily settles near you for 15+ minutes without the tether clipped. This is the bridge to free settling.',
      whenToGoBack:
        'If Zuzu paces constantly when unclipped, reclip and do more duration work at Step 3.',
      suggestedDuration: 1800,
    },
  ],
};

const findit: Skill = {
  id: 'findit',
  name: 'Find It',
  branch: 'stillness',
  abbr: 'FI',
  description:
    'Decompression tool — nose-down searching activates the parasympathetic nervous system, bringing Zuzu from arousal to calm. Say "find it" and scatter treats on the ground for Zuzu to sniff out. Use after walks, as an emergency redirect, or during pen time for enrichment.',
  connections:
    'Capturing Calm (same calming goal, different mechanism). Unlocks a quick decompression tool for any situation.',
  sessionType: 'passive',
  sessionDuration: { min: 120, max: 300 },
  sessionsPerDay: { min: 1, max: 5 },
  prerequisites: [{ skillId: 'marker', stepRequired: 0 }],
  steps: [
    {
      title: 'Scatter and Search',
      whatToDo:
        'Say "find it" in a calm voice. Toss 3-5 small treats on the ground (grass, floor, snuffle mat). Let Zuzu sniff them out. No markers needed — the sniffing IS the reward. Repeat 2-3 scatters per session. Use as a decompression tool after walks, as an emergency redirect when Zuzu is escalating, or as enrichment during pen time.',
      successLooksLike:
        'Zuzu immediately drops his nose to the ground when he hears "find it" and searches calmly.',
      whenToAdvance:
        'This is a single-step skill. Zuzu understands "find it" means treats are on the ground. Usually learned in 1-3 sessions.',
      whenToGoBack:
        'If Zuzu does not search, toss treats closer together and point to them. Build the association between the cue and ground-level treats.',
      tips: [
        'Use after every walk to bring arousal levels down before going inside.',
        'Scatter on grass for maximum sniffing engagement.',
        'Can be used as an emergency redirect — if Zuzu is fixating on a trigger, scatter treats and say "find it" to break the fixation.',
      ],
      suggestedDuration: 120,
    },
  ],
};

const matplace: Skill = {
  id: 'matplace',
  name: 'Mat / Place',
  branch: 'stillness',
  abbr: 'MP',
  description:
    'Zuzu goes to a specific mat or bed and stays there. This gives capturing calm a physical location -- a home base. A mat is a portable calm zone. You can put it next to your desk, bring it to a friend\'s house, use it at the vet. It gives Zuzu a clear answer to the question "what should I be doing?" When in doubt, go to the mat.',
  connections:
    'Capturing Calm (must have some calm foundation), Stay/Duration (builds on mat). Unlocks Settle on mat during triggers (doorbell, guests), duration stays, relaxation protocol.',
  sessionType: 'calm',
  sessionDuration: { min: 120, max: 300 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'capturingcalm', stepRequired: 1 }],
  steps: [
    {
      title: 'Mat = Treats Happen',
      whatToDo:
        'Place a mat, towel, or bed on the floor near you. The instant Zuzu steps on it (even one paw): marker + treat ON THE MAT. Drop the treat onto the mat surface so the mat itself becomes associated with food. If Zuzu does not approach the mat, toss a treat onto it. When he steps on to eat it, mark + treat again on the mat.',
      successLooksLike:
        'Zuzu walks to the mat within 5 seconds of you placing it down.',
      whenToAdvance:
        'Zuzu approaches and steps onto the mat within 5 seconds of placement. Usually 2-5 sessions.',
      whenToGoBack:
        'If Zuzu shows no interest in the mat, toss higher-value treats onto it and wait for any paw contact.',
      suggestedDuration: 150,
    },
    {
      title: 'Four Paws on the Mat',
      whatToDo:
        'Only mark + treat when all four paws are on the mat. If he steps off, wait. Do not lure him back. Let him figure it out.',
      successLooksLike:
        'Zuzu stands on the mat with all four paws, 8/10 times.',
      whenToAdvance:
        'Zuzu stands on the mat with all four paws 8 out of 10 times. Usually 1-3 days.',
      whenToGoBack:
        'If Zuzu cannot get all four paws on consistently, return to Step 1 and reward any paw contact for several more sessions.',
      suggestedDuration: 150,
    },
    {
      title: 'Down on the Mat',
      whatToDo:
        'Wait for a sit or down on the mat. If Zuzu knows a down cue, you can use it here ONCE to get the first rep. After that, wait for him to offer it. Treat delivery: Always on the mat between paws.',
      successLooksLike:
        'Zuzu goes to mat and lies down without being cued.',
      whenToAdvance:
        'Zuzu goes to the mat and lies down without a verbal cue. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu only stands on the mat and does not offer a down, return to Step 2 and ensure the four-paw behavior is very strong, then wait longer for the down to emerge.',
      suggestedDuration: 180,
    },
    {
      title: 'Duration on the Mat',
      whatToDo:
        'Same as Capturing Calm Step 4 but on the mat. Thin treats from every 5 seconds to every 10, 20, 30, 60. If Zuzu gets off the mat, stop treating. Wait for him to return and lie down. Resume.',
      successLooksLike:
        '2 minutes of down on the mat with 3-4 treat deliveries.',
      whenToAdvance:
        'Zuzu holds a down on the mat for 2 minutes with only 3-4 treat deliveries. Usually 1-2 weeks.',
      whenToGoBack:
        'If Zuzu keeps leaving the mat before 30 seconds, increase treat frequency (every 5 seconds) and rebuild duration slowly.',
      suggestedDuration: 300,
    },
    {
      title: 'Add the Cue',
      whatToDo:
        'Once Zuzu is reliably going to the mat and lying down, add "place" (or "mat" or "bed") just before he steps on it. Only mark + treat if he goes to the mat after the cue.',
      successLooksLike:
        'Zuzu goes to the mat and lies down when he hears the verbal cue "place."',
      whenToAdvance:
        'Zuzu responds to the verbal cue reliably, 8/10 times.',
      whenToGoBack:
        'If Zuzu does not respond to the cue, return to Step 4 and ensure the behavior is very strong before re-adding the verbal cue.',
      suggestedDuration: 180,
    },
    {
      title: 'Distance',
      whatToDo:
        'Send Zuzu to the mat from increasing distances. Start 3 feet away. Build to across the room.',
      successLooksLike:
        'Zuzu goes to his mat from across the room on cue and lies down.',
      whenToAdvance:
        'Zuzu reliably goes to the mat from across the room when cued.',
      whenToGoBack:
        'If Zuzu does not go to the mat from distance, reduce distance and rebuild. Only increase when the shorter distance is reliable.',
      suggestedDuration: 180,
    },
    {
      title: 'Add Distractions',
      whatToDo:
        'While Zuzu is on his mat, start with tiny distractions: drop a pen, stand up and sit back down, take one step away and return. Only advance the distraction level when Zuzu stays on the mat through the current level.',
      successLooksLike:
        'Zuzu stays on the mat through moderate distractions (you moving around, TV on, someone talking) until released. You say "place," Zuzu goes to his mat from across the room, lies down, and stays there.',
      whenToAdvance:
        'Zuzu remains on the mat through moderate household distractions. This is the mastery step -- continue maintaining.',
      whenToGoBack:
        'If Zuzu breaks from the mat with small distractions, return to Step 4 for more duration work in a quiet environment before adding distractions again.',
      suggestedDuration: 300,
    },
  ],
};

const relaxation: Skill = {
  id: 'relaxation',
  name: 'Relaxation Protocol',
  branch: 'stillness',
  abbr: 'RP',
  description:
    'Karen Overall\'s structured, multi-day program that systematically teaches Zuzu to remain relaxed while you perform increasingly challenging tasks around him (standing up, walking away, clapping, knocking on surfaces, going to the door). This bridges the gap between "lying on the mat in a quiet room" and "lying on the mat while real life happens." 15 days, each with 15-20 tasks.',
  connections:
    'Mat/Place (must be able to hold a down on the mat). Unlocks calm during doorbells, guests, meal preparation. Feeds directly into Stranger Work.',
  sessionType: 'calm',
  sessionDuration: { min: 600, max: 900 },
  sessionsPerDay: { min: 1, max: 1 },
  prerequisites: [
    { skillId: 'matplace', stepRequired: 3 },
    { skillId: 'eyecontact', stepRequired: 1 },
  ],
  steps: [
    {
      title: 'The 15-Day Program',
      whatToDo:
        'Zuzu is on his mat. You read from the day\'s task list (available free online -- search "Karen Overall Relaxation Protocol"). After each task (e.g., "take one step to the right and return"), if Zuzu stayed on his mat, deliver a treat. If he gets up, calmly reset him and retry the task at a lower intensity. One "day" of the protocol per session. Some days you may repeat a day 2-3 times before moving on. Session length: 10-15 minutes. Frequency: 1x per day, ideally at the same time. Do NOT rush through the 15 days. Some dogs take 3-6 weeks to complete it.',
      successLooksLike:
        'Zuzu can remain on his mat through Day 15\'s tasks, which include going to the front door, knocking, and returning.',
      whenToAdvance:
        'The protocol is complete when Zuzu can remain on his mat through Day 15\'s tasks. Do not rush -- some dogs take 3-6 weeks.',
      whenToGoBack:
        'If Zuzu gets up repeatedly during a day\'s tasks, repeat that day in the next session. If he cannot complete it after 3 attempts, go back to the previous day and rebuild.',
      tips: [
        'Do this at the same time each day for consistency.',
        'Each "day" in the protocol does not have to correspond to a calendar day -- repeat as needed.',
      ],
      suggestedDuration: 600,
    },
  ],
};

// ---------------------------------------------------------------------------
// BRANCH 3: IMPULSE CONTROL
// ---------------------------------------------------------------------------

const wait: Skill = {
  id: 'wait',
  name: 'Wait / Food Manners',
  branch: 'impulse',
  abbr: 'WT',
  description:
    'Zuzu pauses before eating food, walking through doors, or accessing things he wants. Not a formal "stay" -- a brief moment of self-control. This is impulse control in its simplest form. Every meal becomes a training opportunity (3x daily, no extra sessions needed). It also prevents bolting through doors and teaches Zuzu that you are the gateway to good things.',
  connections:
    'Leave It (same impulse control muscle), Door Manners, Food Bowl Manners. Unlocks Leave It, Drop It, Door Manners.',
  sessionType: 'mealtime',
  sessionDuration: { min: 30, max: 60 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'marker', mastery: true }],
  steps: [
    {
      title: 'Sit Before the Bowl Touches the Floor',
      whatToDo:
        'Hold Zuzu\'s food bowl. Wait. If he jumps or paws at you, raise the bowl. The instant he sits (even briefly), begin lowering the bowl. If he breaks the sit, raise it again. When the bowl touches the floor with him in a sit: marker + "okay" (release word) and he eats. Zero extra time required -- this happens at every meal.',
      successLooksLike:
        'Zuzu sits as soon as he sees the bowl.',
      whenToAdvance:
        'Zuzu sits as soon as he sees the bowl, reliably at every meal. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu stops sitting for the bowl, ensure you are consistently raising the bowl when he breaks the sit. Do not lower the bowl until the sit happens.',
      suggestedDuration: 60,
    },
    {
      title: 'Bowl on the Floor, Brief Wait',
      whatToDo:
        'Bowl on the floor. Zuzu sitting. You stand with your hand near the bowl. Count "one." Then "okay" to release. Build to a count of three, then five. If he breaks before "okay," cover the bowl with your hand. Wait for the sit. Restart count.',
      successLooksLike:
        '5-second wait, 9/10 meals.',
      whenToAdvance:
        'Zuzu waits 5 seconds with the bowl on the floor, 9 out of 10 meals.',
      whenToGoBack:
        'If Zuzu cannot wait 2 seconds, return to Step 1 and ensure the basic sit-for-bowl is very strong.',
      suggestedDuration: 60,
    },
    {
      title: 'Step Back from the Bowl',
      whatToDo:
        'Same exercise but you place the bowl, take one step back, pause, then "okay." Build distance gradually.',
      successLooksLike:
        'Zuzu waits with the bowl on the floor while you take 2-3 steps back, until released.',
      whenToAdvance:
        'Zuzu reliably waits while you step back from the bowl. This is the mastery step for this skill.',
      whenToGoBack:
        'If Zuzu breaks when you step back, return to Step 2 and build more duration at close range before adding distance.',
      suggestedDuration: 60,
    },
  ],
};

const leaveit: Skill = {
  id: 'leaveit',
  name: 'Leave It',
  branch: 'impulse',
  abbr: 'LI',
  description:
    'Zuzu turns away from something he wants when cued. "Leave it" means "that thing is not for you, and something better is coming from me." Safety skill -- Zuzu eats things he should not. On walks, he may encounter dangerous items (chicken bones, garbage, rodent poison, salt). For a dog with IVDD risk, preventing lunging at ground items also protects his spine.',
  connections:
    'Wait (prerequisite -- same impulse control muscle), Drop It (companion skill), Eye Contact (Leave It works by redirecting attention to you). Unlocks safe walks, Drop It, outdoor freedom.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [
    { skillId: 'wait', stepRequired: 0 },
    { skillId: 'eyecontact', stepRequired: 0 },
  ],
  steps: [
    {
      title: 'Closed Fist',
      whatToDo:
        'Place a low-value treat in your closed fist. Present your fist to Zuzu. He will sniff, lick, paw at it. Do nothing. Wait. The instant he pulls his nose away -- even slightly, even just to take a breath: marker + treat FROM YOUR OTHER HAND (not the fist). The fist treat is never the reward. The reward always comes from elsewhere. Do NOT say "leave it" yet. No cue. He is just learning that backing off = reward.',
      successLooksLike:
        'Zuzu pulls away from the fist within 2 seconds, 8/10 times.',
      whenToAdvance:
        'Zuzu pulls away from the closed fist within 2 seconds, 8 out of 10 times. Usually 2-5 days.',
      whenToGoBack:
        'If Zuzu will not stop pawing or licking the fist, use a lower-value treat in the fist and a higher-value reward in the other hand to increase contrast.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'Open Hand',
      whatToDo:
        'Same exercise but open your palm to show the treat. If he goes for it, close your fist. If he looks away or backs off: marker + treat from other hand.',
      successLooksLike:
        'Zuzu does not attempt to take the treat from the open palm, 8/10 times.',
      whenToAdvance:
        'Zuzu does not attempt to take the treat from your open palm 8 out of 10 times. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu keeps going for the open palm, return to Step 1 closed fist for 3-5 more sessions.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'Add the Cue',
      whatToDo:
        'Now say "leave it" once, clearly, BEFORE opening your hand. One time only. Then open your hand. Mark + treat from other hand when he turns away. One cue, one time. If he does not respond, close your hand and try again. Do not repeat the cue.',
      successLooksLike:
        'Zuzu responds to "leave it" on first cue, 8/10 times.',
      whenToAdvance:
        'Zuzu responds to the verbal "leave it" cue on the first attempt 8 out of 10 times.',
      whenToGoBack:
        'If Zuzu ignores the cue, return to Step 2 and build more reps of automatic turning away before re-adding the verbal cue.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'Floor Placement',
      whatToDo:
        'Place a treat on the floor. Cover it with your hand/foot if needed. Say "leave it." Mark + treat from pocket/pouch when he turns away.',
      successLooksLike:
        'Zuzu can ignore a treat on the floor 8/10 times when cued.',
      whenToAdvance:
        'Zuzu ignores the floor treat 8 out of 10 times on cue.',
      whenToGoBack:
        'If success drops below 60%, return to Step 3 for 5+ sessions.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'Drop from Height',
      whatToDo:
        'Drop a treat from waist height. Say "leave it" just before it hits the ground. Be ready to cover with foot. Mark + treat for looking at you instead of the dropped treat.',
      successLooksLike:
        'Zuzu looks at you instead of the dropped treat, 7/10 times.',
      whenToAdvance:
        'Zuzu looks at you instead of the dropped treat 7 out of 10 times.',
      whenToGoBack:
        'If success drops below 60%, return to Step 4 for 5+ sessions.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'Moving Treat (Real-World Prep)',
      whatToDo:
        'Toss a treat a few feet away. Say "leave it." Mark + treat for not chasing it.',
      successLooksLike:
        'Zuzu does not chase the tossed treat and looks at you instead, 7/10 times.',
      whenToAdvance:
        '7 out of 10 successful. Usually ready to begin outdoor practice.',
      whenToGoBack:
        'If success drops below 60%, return to Step 5 for 5+ sessions.',
      suggestedDuration: 150,
      suggestedReps: '10-15',
    },
    {
      title: 'On Walks',
      whatToDo:
        'Plant a treat on your walk route (or have a friend do it). Walk past. Say "leave it" when Zuzu notices it. Mark + treat for passing without lunging. Start with low-value items on the ground. Build to higher-value items. Build to items Zuzu has not been told about (the real test).',
      successLooksLike:
        'Zuzu leaves planted items on walks when cued, and eventually ignores ground items without being cued.',
      whenToAdvance:
        'This is the ongoing real-world step. Timeline from Step 1 to here: 3-6 weeks. Step 7 is ongoing for months.',
      whenToGoBack:
        'If Zuzu grabs the forbidden item, do not punish. Just reset and make the next rep easier. If success rate drops below 60%, return to Step 6 for 5+ sessions.',
      suggestedDuration: 180,
    },
  ],
};

const dropit: Skill = {
  id: 'dropit',
  name: 'Drop It',
  branch: 'impulse',
  abbr: 'DI',
  description:
    'Zuzu releases an item that is already in his mouth. Different from Leave It: Leave It = "don\'t take it." Drop It = "you already have it, give it up." Both are essential. Drop It prevents resource guarding, prevents ingestion of dangerous items, and makes Zuzu safe to play tug (which is excellent enrichment).',
  connections:
    'Leave It (teach first -- same impulse control concept), Tug play (requires Drop It for safe play). Unlocks safe tug play, resource guarding prevention, the ability to retrieve items from Zuzu without a chase.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'leaveit', stepRequired: 2 }],
  steps: [
    {
      title: 'Trade Game with Low-Value Items',
      whatToDo:
        'Give Zuzu a low-value toy. Present a high-value treat near his nose. The smell will cause him to open his mouth. The instant the toy drops: marker + treat. Pick up the toy and give it back to him. Repeat. ALWAYS give the item back (when safe). This teaches him that dropping = treat AND he gets the item back. No reason to guard.',
      successLooksLike:
        'Zuzu opens his mouth when he sees you approach with a treat, 8/10 times.',
      whenToAdvance:
        'Zuzu readily drops items when he sees you approach with a treat, 8 out of 10 times.',
      whenToGoBack:
        'If Zuzu clamps down harder or moves away, use a higher-value trade treat and a lower-value toy. Build trust through repetition.',
      suggestedDuration: 120,
      suggestedReps: '5-10',
    },
    {
      title: 'Add the Cue',
      whatToDo:
        'Say "drop it" before presenting the treat. One cue. Wait. If he does not drop, bring the treat closer to his nose.',
      successLooksLike:
        'Zuzu drops on the verbal cue before seeing the treat.',
      whenToAdvance:
        'Zuzu drops items on the verbal cue "drop it" before you show the treat.',
      whenToGoBack:
        'If Zuzu ignores the verbal cue, return to Step 1 and build more trade reps before re-adding the cue.',
      suggestedDuration: 120,
      suggestedReps: '5-10',
    },
    {
      title: 'Fade the Treat Lure',
      whatToDo:
        'Say "drop it." Keep treats hidden. Mark + treat from pocket after he drops.',
      successLooksLike:
        'Zuzu drops items on cue without seeing a treat first.',
      whenToAdvance:
        'Zuzu reliably drops on cue with no visible treat lure.',
      whenToGoBack:
        'If Zuzu stops dropping without the visible lure, return to Step 2 for several sessions and fade more gradually.',
      suggestedDuration: 120,
      suggestedReps: '5-10',
    },
    {
      title: 'Higher-Value Items',
      whatToDo:
        'Practice with progressively more interesting items: better toys, chews, found objects. Always trade UP -- the treat must be more valuable than the dropped item.',
      successLooksLike:
        'Zuzu drops high-value items (good toys, chews) on cue.',
      whenToAdvance:
        'Zuzu drops high-value items on cue reliably.',
      whenToGoBack:
        'If Zuzu will not drop a high-value item, the trade is not good enough. Use a higher-value treat or return to lower-value items and rebuild.',
      suggestedDuration: 120,
      suggestedReps: '5-10',
    },
    {
      title: 'Emergency Drop',
      whatToDo:
        'Practice with items Zuzu REALLY does not want to give up (a stolen sock, a found treasure on a walk). You must have established enormous trust through Steps 1-4 for this to work. If it fails, go back to building more reps at Step 4.',
      successLooksLike:
        'Zuzu drops highly prized or stolen items on cue, trusting that something better is coming.',
      whenToAdvance:
        'This is the mastery step. Continue maintaining the trade game throughout life so the trust remains strong.',
      whenToGoBack:
        'If Zuzu refuses to drop a prized item, do not force it. Go back to Step 4 with medium-value items and build more trust reps.',
      suggestedDuration: 120,
      suggestedReps: '3-5',
    },
  ],
};

// ---------------------------------------------------------------------------
// BRANCH 4: BODY HANDLING AND COOPERATIVE CARE
// ---------------------------------------------------------------------------

const touchaccept: Skill = {
  id: 'touchaccept',
  name: 'Touch Acceptance',
  branch: 'body',
  abbr: 'TA',
  description:
    'Zuzu allows and eventually enjoys being touched on all parts of his body -- paws, ears, belly, tail, muzzle, along the spine. Every vet visit, every grooming session, every nail trim depends on this. A dog who panics when touched is a dog who will be muzzled and restrained, which makes the fear worse each time.',
  connections:
    'Capturing Calm (calm state required for handling), Chin Rest (advanced cooperative care). Unlocks Paw Handling, Mouth/Ear Checks, Nail Prep, Brushing, Vet Visits.',
  sessionType: 'calm',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 1, max: 2 },
  prerequisites: [
    { skillId: 'marker', mastery: true },
    { skillId: 'capturingcalm', stepRequired: 0 },
  ],
  steps: [
    {
      title: 'Touch and Treat (1-Second Touches)',
      whatToDo:
        'Touch a neutral body area (shoulder, side) for 1 second. Remove your hand. Marker + treat. That is one rep. Always touch THEN treat (this order matters -- touch predicts treat, so touch becomes a good thing). Start with the area Zuzu is most comfortable with (usually shoulder or chest).',
      successLooksLike:
        'Zuzu shows no tension (no flinching, no moving away, no freezing) during 1-second touches on shoulders and sides.',
      whenToAdvance:
        'Zero tension during 1-second touches on shoulders and sides. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu flinches or moves away, you are touching too firmly or on a sensitive area. Lighten the touch and stay on the most comfortable area.',
      tips: [
        'Best done when Zuzu is already calm (after a walk, after a capturing calm session).',
        'Do NOT attempt handling practice when he is wound up.',
      ],
      suggestedDuration: 150,
    },
    {
      title: 'Map the Body',
      whatToDo:
        'Same exercise but gradually work toward more sensitive areas. Order of progression: 1) Shoulder/side (easiest), 2) Back (along the spine -- important for IVDD monitoring), 3) Chest, 4) Hips, 5) Base of tail, 6) Ears (outside, briefly), 7) Paws (top of foot, briefly), 8) Muzzle/chin, 9) Belly (when offered -- never flip a nervous dog), 10) Between toes (hardest for most dogs). Move to the next area ONLY when the current area produces zero tension. Some areas may take days. Paws and muzzle often take weeks.',
      successLooksLike:
        'Zuzu tolerates 1-second touches on all body areas (shoulder through belly/toes) without tension.',
      whenToAdvance:
        'All body areas can be touched for 1 second without tension.',
      whenToGoBack:
        'If Zuzu moves away from a touch on a new area, you went too fast. Go back to the previous area for 3 sessions.',
      suggestedDuration: 150,
    },
    {
      title: 'Extend Touch Duration',
      whatToDo:
        'Once all areas are mapped at 1 second, build duration. Touch shoulder for 2 seconds. Then 3. Then 5. Build duration on easy areas first, then harder areas.',
      successLooksLike:
        '5-second touches on all body areas without tension.',
      whenToAdvance:
        'Zuzu tolerates 5-second touches on all body areas without tension.',
      whenToGoBack:
        'If tension returns when extending duration, reduce to 1-2 seconds on that area and rebuild slowly.',
      suggestedDuration: 150,
    },
    {
      title: 'Add Gentle Manipulation',
      whatToDo:
        'Gently lift a paw and set it down. Briefly fold an ear to look inside. Run your fingers along the gumline. Gently palpate along the spine (this is your IVDD check). Always pair with high-value treats. One manipulation per session. Do not try to do everything at once.',
      successLooksLike:
        'Zuzu tolerates gentle manipulation of paws, ears, mouth, and spine without pulling away or showing stress signs.',
      whenToAdvance:
        'Zuzu allows gentle manipulation of all areas with minimal tension. One manipulation type per session is fine.',
      whenToGoBack:
        'If Zuzu pulls away or shows stress during manipulation, return to Step 3 duration touches on that area for several sessions.',
      suggestedDuration: 150,
    },
    {
      title: 'Introduce the Chin Rest',
      whatToDo:
        'Teach Zuzu to place his chin on your hand (or on a surface) and hold it there. This becomes his "consent signal" for cooperative care -- as long as his chin is resting, the procedure continues. If he lifts his chin, the procedure stops. Lure chin onto your palm with a treat. Mark + treat for contact. Build duration from 1 second to 5, 10, 30 seconds. Begin pairing chin rest with handling (chin rests, you touch an ear with other hand, treat). This is advanced and takes weeks to build. No rush.',
      successLooksLike:
        'Zuzu voluntarily places his chin on your hand and holds it for 10+ seconds while you perform gentle handling with your other hand.',
      whenToAdvance:
        'Zuzu holds a chin rest for 30 seconds and tolerates paired handling. This is the mastery step -- continue building and maintaining.',
      whenToGoBack:
        'If Zuzu will not offer the chin rest, go back to luring with a treat and rebuild the basic chin contact before adding duration or paired handling.',
      suggestedDuration: 180,
    },
  ],
};

const nailpaw: Skill = {
  id: 'nailpaw',
  name: 'Nail / Paw Prep',
  branch: 'body',
  abbr: 'NP',
  description:
    'Zuzu allows his paws to be held, nails to be touched with a tool, and eventually nails to be trimmed or filed. Neglected nails cause pain, posture problems, and can worsen spinal issues. Zuzu will need nail maintenance every 2-3 weeks for life. Starting cooperative nail care now saves years of struggle.',
  connections:
    'Touch Acceptance (must be able to hold paws). Unlocks safe nail trims, scratch board use, vet nail care without stress.',
  sessionType: 'calm',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 1, max: 2 },
  prerequisites: [{ skillId: 'touchaccept', stepRequired: 3 }],
  steps: [
    {
      title: 'Touch Top of Paw (1 sec)',
      whatToDo:
        'Touch the top of Zuzu\'s paw for 1 second, then remove your hand. Marker + treat. Repeat until relaxed.',
      successLooksLike: 'Zuzu shows no tension when you touch the top of his paw.',
      whenToAdvance: 'Zero tension during 1-second paw top touches for 10+ reps.',
      whenToGoBack: 'If Zuzu pulls away, return to Touch Acceptance Step 3 for paw-area duration work.',
      suggestedDuration: 120,
    },
    {
      title: 'Cup Paw in Hand (1 sec)',
      whatToDo: 'Cup Zuzu\'s paw gently in your hand for 1 second. Release. Marker + treat.',
      successLooksLike: 'Zuzu allows his paw to be cupped without pulling away.',
      whenToAdvance: 'Zuzu tolerates cupping for 1 second, 10+ reps without tension.',
      whenToGoBack: 'If Zuzu pulls away, go back to Step 1 for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Cup Paw in Hand (3 sec)',
      whatToDo: 'Cup Zuzu\'s paw for 3 seconds. Release. Marker + treat. Build slowly from 1 to 3 seconds.',
      successLooksLike: 'Zuzu allows 3-second paw holds without tension.',
      whenToAdvance: '3-second holds with zero tension, 8/10 reps.',
      whenToGoBack: 'If tension returns, reduce to 1-second holds (Step 2) for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Separate One Toe Gently',
      whatToDo: 'While holding the paw, gently separate one toe. Release. Marker + treat.',
      successLooksLike: 'Zuzu allows a toe to be separated without pulling away.',
      whenToAdvance: 'Toe separation on all paws without tension.',
      whenToGoBack: 'If Zuzu pulls away, go back 2 steps (paw cupping) for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Touch Nail with Your Finger',
      whatToDo: 'Touch one nail with your finger. Marker + treat. Work through each nail over sessions.',
      successLooksLike: 'Zuzu allows nail touching without tension.',
      whenToAdvance: 'All nails can be touched with a finger without tension.',
      whenToGoBack: 'If Zuzu pulls away, go back 2 steps for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Touch Nail with Clipper (Closed)',
      whatToDo: 'Touch the closed clipper to one nail. Just touch the metal to the nail. Marker + treat.',
      successLooksLike: 'Zuzu tolerates the clipper touching his nail.',
      whenToAdvance: 'Clipper can touch all nails without tension.',
      whenToGoBack: 'If Zuzu reacts to the clipper, go back 2 steps for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Open and Close Clipper Near Paw (Sound Only)',
      whatToDo: 'Open and close the clipper near the paw so Zuzu hears the sound. Marker + treat.',
      successLooksLike: 'Zuzu shows no reaction to the clipper sound near his paw.',
      whenToAdvance: 'Clipper sound near all paws without tension.',
      whenToGoBack: 'If the sound causes tension, go back 2 steps for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Touch Clipper to Nail While Opening/Closing',
      whatToDo: 'Touch the clipper to a nail while opening and closing it. Do not actually clip. Marker + treat.',
      successLooksLike: 'Zuzu tolerates the clipper on his nail with the opening/closing motion.',
      whenToAdvance: 'All nails tolerate this motion without tension.',
      whenToGoBack: 'If Zuzu pulls away, go back 2 steps for 3 sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Clip the Very Tip of One Nail',
      whatToDo: 'Clip the very tip of one nail. Just the tip. Marker + high-value treat.',
      successLooksLike: 'Zuzu tolerates one nail being clipped.',
      whenToAdvance: 'One nail clipped without stress, repeated across multiple sessions.',
      whenToGoBack: 'If Zuzu reacts strongly, go back 2 steps for 3 sessions. There is no rush on this.',
      suggestedDuration: 120,
    },
    {
      title: 'Multiple Nails Per Session',
      whatToDo:
        'One nail per session initially. Build to 2-3 nails per session over weeks. Alternative: A scratch board (sandpaper glued to a board) that Zuzu scratches himself -- this teaches him to file his own front nails. Many dogs enjoy it because they are in control.',
      successLooksLike: 'Zuzu tolerates 2-3 nails being clipped in a single session without stress.',
      whenToAdvance: 'This is the mastery step. Continue maintaining cooperative nail care for life.',
      whenToGoBack: 'If nail trim fear develops at any point, go back to Step 6 and rebuild. Nail trim fear is one of the hardest things to fix once established and one of the easiest to prevent with patience now.',
      suggestedDuration: 150,
    },
  ],
};

const mouthear: Skill = {
  id: 'mouthear',
  name: 'Mouth / Ear Check',
  branch: 'body',
  abbr: 'ME',
  description:
    'Zuzu allows examination of his mouth, teeth, gums, and ears for veterinary and grooming care. Builds on the cooperative care foundation of Touch Acceptance.',
  connections:
    'Touch Acceptance (prerequisite). Unlocks stress-free vet oral and ear exams.',
  sessionType: 'calm',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 1, max: 1 },
  prerequisites: [{ skillId: 'touchaccept', stepRequired: 3 }],
  steps: [
    {
      title: 'Lip Lift (1 Second)',
      whatToDo:
        'Gently lift Zuzu\'s lip to see his teeth for 1 second. Remove your hand. Marker + treat. One side at a time. Build comfort with the motion before adding duration.',
      successLooksLike:
        'Zuzu allows a 1-second lip lift without pulling away or showing stress.',
      whenToAdvance:
        'Zuzu tolerates 1-second lip lifts on both sides, 8/10 reps without tension.',
      whenToGoBack:
        'If Zuzu pulls away, return to Touch Acceptance muzzle/chin work for several sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Gum Touch',
      whatToDo:
        'Touch Zuzu\'s gumline briefly with your finger. Marker + high-value treat. Keep it very brief — one quick touch, then reward. Build from touching the outside of the lip to touching the actual gum.',
      successLooksLike:
        'Zuzu allows a brief gum touch without pulling away.',
      whenToAdvance:
        'Zuzu tolerates gumline touches on both sides, 8/10 reps.',
      whenToGoBack:
        'If Zuzu clamps his mouth shut or pulls away, return to Step 1 lip lifts for more sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Ear Fold',
      whatToDo:
        'Gently fold Zuzu\'s ear to look inside for 1-2 seconds. Marker + treat. One ear at a time. Do not poke inside — just fold the flap to look.',
      successLooksLike:
        'Zuzu allows both ears to be folded and examined for 1-2 seconds without head shaking or pulling away.',
      whenToAdvance:
        'Both ears can be folded and examined for 2 seconds, 8/10 reps.',
      whenToGoBack:
        'If Zuzu shakes his head or pulls away, return to Touch Acceptance ear work for several sessions.',
      suggestedDuration: 120,
    },
    {
      title: 'Full Oral and Ear Exam',
      whatToDo:
        'Hold Zuzu\'s lip for 5 seconds while examining teeth on one side. Then the other side. Then fold each ear and look inside. Deliver a treat chain — treat after each area examined. This simulates what a vet will do.',
      successLooksLike:
        'Zuzu tolerates a full mouth and ear examination with treat delivery between each area.',
      whenToAdvance:
        'Zuzu allows a complete oral and ear exam in one session with minimal stress. This is the mastery step.',
      whenToGoBack:
        'If Zuzu becomes stressed during the full exam, break it into individual areas and rebuild duration on whichever area caused the stress.',
      suggestedDuration: 150,
    },
  ],
};

const coopcare: Skill = {
  id: 'coopcare',
  name: 'Cooperative Care',
  branch: 'body',
  abbr: 'CK',
  description:
    'Full cooperative care protocol where Zuzu participates willingly in grooming, vet procedures, and health checks using consent signals like the chin rest.',
  connections:
    'Touch Acceptance (prerequisite). Unlocks stress-free vet visits, grooming, and health monitoring.',
  sessionType: 'calm',
  sessionDuration: { min: 120, max: 300 },
  sessionsPerDay: { min: 1, max: 1 },
  prerequisites: [{ skillId: 'touchaccept', stepRequired: 4 }],
  steps: [
    {
      title: 'Chin Rest on Hand',
      whatToDo:
        'Lure Zuzu\'s chin onto your open palm with a treat held just below your fingers. The instant his chin touches your palm: marker + treat. Build duration from 1 second to 3, then 5, then 10 seconds of chin contact before marking.',
      successLooksLike:
        'Zuzu voluntarily places his chin on your hand and holds it for 5+ seconds.',
      whenToAdvance:
        'Zuzu holds a chin rest for 10 seconds, 8/10 reps.',
      whenToGoBack:
        'If Zuzu will not offer the chin rest, go back to luring with a treat held lower and reward any chin contact, even a brief touch.',
      suggestedDuration: 150,
    },
    {
      title: 'Chin Rest + Single-Area Handling',
      whatToDo:
        'Zuzu rests his chin on your hand. With your other hand, gently touch one area (ear, paw, side). Treat while the chin stays resting. If Zuzu lifts his chin, stop touching immediately — the chin lift means "I need a break." Wait for the chin rest again before resuming.',
      successLooksLike:
        'Zuzu holds a chin rest while you touch one body area with your other hand.',
      whenToAdvance:
        'Zuzu maintains a chin rest during single-area handling for 10+ seconds across different body areas.',
      whenToGoBack:
        'If Zuzu lifts his chin repeatedly when you start touching, reduce the handling to just hovering your hand near the area without contact, then rebuild.',
      suggestedDuration: 180,
    },
    {
      title: 'Full Cooperative Care Protocol',
      whatToDo:
        'The chin rest becomes the consent signal for any procedure. As long as Zuzu\'s chin is resting, the procedure continues. If he lifts his chin, the procedure stops immediately. No exceptions. Practice with brushing, ear cleaning, paw handling, and nail work. This builds Zuzu\'s trust that he has control over what happens to his body.',
      successLooksLike:
        'Zuzu holds a chin rest through multi-step grooming or handling procedures, lifting his chin only when he genuinely needs a break.',
      whenToAdvance:
        'Zuzu participates in full grooming or vet-simulation sessions using the chin rest consent protocol. This is the mastery step.',
      whenToGoBack:
        'If Zuzu stops offering chin rests, return to Step 2 and rebuild trust with single-area handling.',
      suggestedDuration: 300,
    },
  ],
};

// ---------------------------------------------------------------------------
// BRANCH 5: WORLD SKILLS
// ---------------------------------------------------------------------------

const looseleash: Skill = {
  id: 'looseleash',
  name: 'Loose Leash Walking',
  branch: 'world',
  abbr: 'LL',
  description:
    'Zuzu walks near you without pulling the leash taut. A dog who pulls is a dog who cannot go places. A Chiweenie who pulls is also at risk for tracheal damage (always harness, never collar) and spinal stress from sudden jerks. Loose leash walking means more walks, more enrichment, more exposure to the world, all of which build a more confident dog.',
  connections:
    'Eye Contact (voluntary check-ins are the foundation), Name Recognition (need to redirect), Hand Target (can lure him back to position). Unlocks longer walks, more socialization opportunities, Stranger Work, urban enrichment.',
  sessionType: 'active',
  sessionDuration: { min: 180, max: 300 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [
    { skillId: 'eyecontact', stepRequired: 2 },
    { skillId: 'name', stepRequired: 2 },
    { skillId: 'handtarget', stepRequired: 2 },
  ],
  steps: [
    {
      title: 'Reward Position (Indoors)',
      whatToDo:
        'Walk around your home with Zuzu on leash. Mark + treat every time he is at your side (either side is fine -- pick one and be consistent). One step, treat. Two steps, treat. Build.',
      successLooksLike:
        'Zuzu defaults to your side for 10+ steps indoors.',
      whenToAdvance:
        'Zuzu defaults to your chosen side for 10+ consecutive steps indoors.',
      whenToGoBack:
        'If Zuzu cannot stay at your side for 3+ steps, increase treat frequency (every single step) and rebuild.',
      suggestedDuration: 240,
    },
    {
      title: 'Penalty Yards (Hallway or Quiet Outdoor Area)',
      whatToDo:
        'Walk forward. If the leash goes taut, immediately stop. Stand still. Wait. When Zuzu looks back at you or the leash goes slack: marker + treat + resume walking. If he does not look back within 5 seconds, turn and walk the other direction. When he catches up to your side: marker + treat.',
      successLooksLike:
        '50% of the walk has a loose leash.',
      whenToAdvance:
        '50% or more of the walk has a loose leash consistently.',
      whenToGoBack:
        'If leash tension is constant, return to Step 1 indoors for several more sessions.',
      suggestedDuration: 300,
    },
    {
      title: 'Real Walks with Sniff Breaks',
      whatToDo:
        'Structure the walk: 1 minute of "let\'s go" (you choose the path, loose leash, treats for check-ins) followed by 30 seconds of "go sniff" (he chooses, full leash length, free exploration). Alternate. The sniff break is CRITICAL. Sniffing is Zuzu\'s primary way of processing the world. A walk with no sniffing is like going to a library and being told you cannot open any books. Structured sniff breaks also give you a powerful reinforcer that is not food -- "go sniff" becomes a reward for good leash behavior. Walk duration for an 8.5 kg Chiweenie: 20-30 minutes per walk. Walks per day: 2-3 (plus potty breaks). Remember IVDD: avoid sustained high-speed trotting and sudden direction changes. Steady pace with sniff breaks is ideal.',
      successLooksLike:
        'Zuzu walks on a loose leash during structured portions and sniffs freely during break portions, with smooth transitions between the two.',
      whenToAdvance:
        'This is the mastery step. Continue this structure on all walks. Build to more challenging environments gradually.',
      whenToGoBack:
        'If pulling increases on real walks, return to Step 2 penalty yards in a quieter area.',
      suggestedDuration: 300,
    },
  ],
};

const stranger: Skill = {
  id: 'stranger',
  name: 'Stranger Desensitization',
  branch: 'world',
  abbr: 'SD',
  description:
    'Changing Zuzu\'s emotional response to unfamiliar people from fear/alarm to neutral or positive. Zuzu barks at strangers -- this is fear-based behavior, not aggression. Barking makes the scary thing go away, which reinforces the barking. Counter-conditioning changes the underlying emotion so the barking becomes unnecessary. Expect 2-6 months of consistent work. Progress is not linear.',
  connections:
    'Eye Contact (check-ins replace fixation), Capturing Calm (calm is the replacement behavior), Loose Leash (need leash control to manage distance). Unlocks calm walks in public, guest tolerance, vet visit tolerance.',
  sessionType: 'passive',
  sessionDuration: { min: 300, max: 600 },
  sessionsPerDay: { min: 1, max: 2 },
  prerequisites: [
    { skillId: 'eyecontact', stepRequired: 2 },
    { skillId: 'looseleash', stepRequired: 1 },
    { skillId: 'capturingcalm', stepRequired: 1 },
  ],
  steps: [
    {
      title: 'Find Zuzu\'s Threshold Distance',
      whatToDo:
        'Take Zuzu to a place where strangers pass at a distance (bench near a path, parking lot, park edge). Note the distance at which he NOTICES a person but does not bark. This is his threshold. For many nervous dogs, this is 15-30 meters. If he barks at all visible humans regardless of distance, your starting distance is "can see but barely" -- possibly 50+ meters. You may need to use a car as a barrier at first.',
      successLooksLike:
        'You have identified the distance at which Zuzu notices strangers without reacting (barking, lunging, or hiding).',
      whenToAdvance:
        'You have a clear threshold distance identified where Zuzu notices but does not react. Move to Step 2.',
      whenToGoBack:
        'If Zuzu reacts at all visible distances, use a car as a barrier or try earlier/quieter times with fewer people.',
      suggestedDuration: 300,
    },
    {
      title: 'At Threshold -- "Look at That" Game',
      whatToDo:
        'Position yourself at threshold distance. When a stranger appears and Zuzu notices them (ears forward, head turn, body tension but no bark): mark + treat. Stranger exists -> treat. Feed rapidly if needed. 3-5 small treats in a row while the stranger is visible. When the stranger passes out of view, treats stop. This makes the association crystal clear: stranger = treat party. No stranger = nothing special. Session length: 5-10 minutes. End before Zuzu gets tired or frustrated. Frequency: 3-5 sessions per week minimum. Daily is better.',
      successLooksLike:
        'Zuzu sees a stranger at threshold distance and immediately looks at you (expecting a treat) instead of fixating. This is called a "conditioned emotional response" (CER).',
      whenToAdvance:
        'Zuzu shows a CER -- sees a stranger at threshold distance and immediately looks at you. Timeline: 1-4 weeks of consistent practice.',
      whenToGoBack:
        'If Zuzu barks during a session, you are too close. Increase distance immediately (walk away, cross the street, put a car between you). When he calms, treat.',
      suggestedDuration: 420,
    },
    {
      title: 'Decrease Distance Gradually',
      whatToDo:
        'When Zuzu has a solid CER at threshold distance, decrease the distance by 10-20%. Repeat the process at the new distance. Only decrease distance when 9/10 stranger appearances at the current distance produce a look-at-you response. If Zuzu reacts (barks), you moved too close. Increase distance. Do not punish the bark.',
      successLooksLike:
        'Zuzu shows a CER at the new, closer distance, 9/10 stranger appearances.',
      whenToAdvance:
        '9 out of 10 stranger appearances at the current distance produce a look-at-you response. Then decrease distance by another 10-20%.',
      whenToGoBack:
        'If Zuzu reacts at the new distance, increase distance back to where the CER was solid and rebuild.',
      suggestedDuration: 420,
    },
    {
      title: 'Different Stranger Types',
      whatToDo:
        'Generalize to different people: men, women, children, people with hats, people with bags, people with dogs, people making noise. Each new type may reset the distance. That is normal.',
      successLooksLike:
        'Zuzu shows a CER to various types of strangers at the working distance.',
      whenToAdvance:
        'Zuzu shows a CER to multiple stranger types at the current working distance.',
      whenToGoBack:
        'If a new stranger type causes a reaction, increase distance for that type and rebuild. Distance progress with other types is not lost.',
      suggestedDuration: 420,
    },
    {
      title: 'Moving Closer (Active Approach)',
      whatToDo:
        'Instead of sitting and watching, you and Zuzu walk past strangers at the safe distance. Mark + treat for calm passage. Build to walking past at closer distances.',
      successLooksLike:
        'Zuzu walks past strangers calmly at the safe distance, offering check-ins.',
      whenToAdvance:
        'Zuzu walks past strangers without reacting and checks in with you during passage.',
      whenToGoBack:
        'If Zuzu reacts while walking past, increase distance and return to stationary observation (Step 3).',
      suggestedDuration: 420,
    },
    {
      title: 'Stationary Strangers Nearby',
      whatToDo:
        'Practice near seated people (cafe patios, park benches). Zuzu learns that people sitting still are boring and predict treats. If Zuzu barks during any session: Do not say "no." Do not pull the leash tight. Calmly increase distance (walk away, cross the street, put a car between you). When he calms, treat. The bark means "I was too close." Adjust and continue.',
      successLooksLike:
        'Zuzu can be near seated strangers (3-5 meters) without reacting, looking at you for treats.',
      whenToAdvance:
        'Zuzu is calm near stationary strangers at moderate distance. This is the current mastery step. Continue building tolerance over months.',
      whenToGoBack:
        'If Zuzu reacts to seated strangers, increase distance and return to Step 5 walk-bys.',
      suggestedDuration: 420,
    },
  ],
};

const recall: Skill = {
  id: 'recall',
  name: 'Recall',
  branch: 'world',
  abbr: 'RC',
  description:
    'Zuzu comes to you reliably when called, even with distractions. The foundation of off-leash safety and the most important emergency skill. Recall is never "done" — it requires lifelong maintenance and reinforcement.',
  connections:
    'Name Recognition (prerequisite), Eye Contact (prerequisite). Unlocks off-leash reliability, Emergency Recall.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 300 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [
    { skillId: 'name', stepRequired: 2 },
    { skillId: 'eyecontact', stepRequired: 1 },
    { skillId: 'marker', mastery: true },
  ],
  neverCompletes: true,
  steps: [
    {
      title: 'Indoor Recall Game',
      whatToDo:
        'Say Zuzu\'s name + "come!" in an excited voice. Back up a few steps to create movement. When he reaches you, deliver a jackpot — 5-10 treats fed one at a time. Make arriving at you the best thing that has ever happened. Do NOT grab his collar yet. Just treat, treat, treat. Practice in one room first.',
      successLooksLike:
        'Zuzu runs to you enthusiastically when he hears the recall cue, 8/10 times in the same room.',
      whenToAdvance:
        'Zuzu responds to the recall cue 8 out of 10 times in one room. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu does not come, increase treat value and back up more enthusiastically. Make yourself irresistible.',
      suggestedDuration: 150,
      suggestedReps: '5-10',
    },
    {
      title: 'Different Rooms, More Distance',
      whatToDo:
        'Call Zuzu from the next room. Then from across the house. He has to actively seek you out. Jackpot every time — 5-10 treats. Start adding a gentle collar touch before treating (touch collar, then treat) so he learns that being caught is good.',
      successLooksLike:
        'Zuzu comes running from another room when called, 7/10 times.',
      whenToAdvance:
        'Zuzu responds to the recall cue from different rooms 7 out of 10 times.',
      whenToGoBack:
        'If Zuzu does not come from another room, return to Step 1 in the same room for more reps.',
      suggestedDuration: 180,
      suggestedReps: '5-10',
    },
    {
      title: 'Outdoor Recall on Leash',
      whatToDo:
        'On leash outdoors. Wait for Zuzu to be sniffing at the end of the leash (not pulling, just distracted). Call the recall cue. Do NOT reel him in — wait for him to choose to come. Jackpot when he arrives. If he ignores you, do NOT repeat the cue. Wait, then try again when the distraction is lower.',
      successLooksLike:
        'Zuzu turns away from outdoor sniffing and comes to you on the recall cue, 6/10 times.',
      whenToAdvance:
        'Zuzu responds to the outdoor recall cue 6 out of 10 times on leash.',
      whenToGoBack:
        'If Zuzu ignores the cue outdoors, return to Step 2 indoor distance recalls for more sessions.',
      suggestedDuration: 180,
      suggestedReps: '3-5',
    },
    {
      title: 'Long Line Recall (15-30 Feet)',
      whatToDo:
        'In a quiet, open area with a 15-30 foot long line. Let Zuzu wander and sniff. When he is mildly engaged with something, call the recall cue. Jackpot when he arrives. Practice in low-distraction areas first, then gradually increase the interest level of the environment.',
      successLooksLike:
        'Zuzu comes to you from 15-30 feet away on the long line, 6/10 times.',
      whenToAdvance:
        'Zuzu responds to the recall cue on a long line 6 out of 10 times in a low-distraction area.',
      whenToGoBack:
        'If Zuzu ignores the cue on the long line, return to Step 3 on regular leash for more reps.',
      suggestedDuration: 240,
      suggestedReps: '3-5',
    },
    {
      title: 'Recall with Increasing Distractions',
      whatToDo:
        'Practice recall near other dogs, people, squirrels, and other high-value distractions. Start at threshold distance — far enough that Zuzu notices but does not fixate. Jackpot every successful recall. This step is ongoing and never truly complete. Continue rewarding recalls throughout life.',
      successLooksLike:
        'Zuzu responds to recall near mild-to-moderate distractions, choosing you over the environment.',
      whenToAdvance:
        'This step is ongoing. Recall is a lifelong skill that requires continued reinforcement.',
      whenToGoBack:
        'If recall fails near distractions, increase distance from the distraction and return to Step 4 long line work.',
      suggestedDuration: 300,
      suggestedReps: '3-5',
    },
  ],
};

const doormanners: Skill = {
  id: 'doormanners',
  name: 'Door Manners',
  branch: 'world',
  abbr: 'DM',
  description:
    'Zuzu waits calmly at doors instead of bolting through. Combines impulse control with spatial awareness for safety at thresholds.',
  connections:
    'Wait (prerequisite). Unlocks safe door transitions, guest management.',
  sessionType: 'active',
  sessionDuration: { min: 60, max: 180 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'wait', stepRequired: 1 }],
  steps: [
    {
      title: 'Wait Before Opening',
      whatToDo:
        'Approach a door with Zuzu on leash. Ask for a sit (or wait for him to offer one). Reach for the door handle. If Zuzu breaks the sit, remove your hand from the handle and wait. When he sits again, reach for the handle again. Only open the door when he holds the sit while your hand is on the handle.',
      successLooksLike:
        'Zuzu sits and holds position while you reach for and touch the door handle.',
      whenToAdvance:
        'Zuzu holds a sit while you touch the door handle 8/10 times. Usually 3-7 days.',
      whenToGoBack:
        'If Zuzu breaks constantly, slow down — reward the sit before reaching for the handle, then build to touching the handle.',
      suggestedDuration: 120,
    },
    {
      title: 'Door Opens, Hold Position',
      whatToDo:
        'Open the door gradually — 1 inch, then 3 inches, then 6 inches, then halfway, then fully open. Treat for holding the sit at each stage. If Zuzu breaks, close the door and wait for the sit again. Release with "okay" when you want him to go through.',
      successLooksLike:
        'Zuzu holds his sit while the door is fully open, waiting for the release cue.',
      whenToAdvance:
        'Zuzu holds position with the door fully open until released, 8/10 times.',
      whenToGoBack:
        'If Zuzu breaks when the door opens more than a crack, return to Step 1 and build more duration with the door closed.',
      suggestedDuration: 150,
    },
    {
      title: 'Real-World Doorways',
      whatToDo:
        'Practice at the front door, car doors, building entrances, and elevator doors. Each new doorway may require starting from Step 1 briefly. Add distractions gradually — people on the other side of the door, sounds from outside, other dogs visible.',
      successLooksLike:
        'Zuzu waits at real-world doorways until released, even with mild distractions on the other side.',
      whenToAdvance:
        'Zuzu waits at multiple real-world doorways consistently. This is the mastery step.',
      whenToGoBack:
        'If Zuzu bolts through a new doorway, return to Step 2 at that specific door and rebuild.',
      suggestedDuration: 150,
    },
  ],
};

const emergencyrecall: Skill = {
  id: 'emergencyrecall',
  name: 'Emergency Recall',
  branch: 'world',
  abbr: 'ER',
  description:
    'A nuclear-option recall using a unique cue and a unique reward that Zuzu never gets any other time. This is your last line of defense — for moments when Zuzu is about to run into traffic, chase a coyote, or approach a dangerous dog. It must be so heavily loaded that it overrides every other impulse.',
  connections:
    'Recall (prerequisite — need a working recall before building the emergency version), Marker (must be fluent). Unlocks true emergency safety.',
  sessionType: 'active',
  sessionDuration: { min: 60, max: 120 },
  sessionsPerDay: { min: 1, max: 1 },
  prerequisites: [
    { skillId: 'recall', stepRequired: 0 },
    { skillId: 'marker', mastery: true },
  ],
  steps: [
    {
      title: 'Choose Unique Cue',
      whatToDo:
        'Pick a word Zuzu has never heard before — not "come," not his name, not anything you say daily. Something distinct and unusual. This cue will ONLY ever be used for emergencies.',
      successLooksLike:
        'You have selected a unique, distinctive word that is not used in any other context.',
      whenToAdvance:
        'Once you have chosen the cue, move to Step 2 immediately.',
      whenToGoBack:
        'N/A — this is a planning step.',
      suggestedDuration: 60,
    },
    {
      title: 'Choose Unique Reward',
      whatToDo:
        'Pick something Zuzu goes absolutely insane for — something he never gets at any other time. Rotisserie chicken, a specific squeeze tube, a special toy. This reward is ONLY paired with the emergency cue. Never give it for anything else.',
      successLooksLike:
        'You have a designated emergency reward that Zuzu loves and never receives in other contexts.',
      whenToAdvance:
        'Once you have the reward selected and stocked, move to Step 3.',
      whenToGoBack:
        'N/A — this is a planning step.',
      suggestedDuration: 60,
    },
    {
      title: 'Load Cue at Home (2+ Weeks)',
      whatToDo:
        'Once per day: say the emergency cue, then immediately deliver a 15-30 second jackpot of the unique reward. Zuzu does not need to do anything — you are loading the cue with extreme value. One rep per day. Do not overdo it. Do not use the cue for anything else. Stop after the jackpot — no training, no other cues. The session is just: cue → 15-30 seconds of the best thing in the world → done.',
      successLooksLike:
        'Zuzu shows explosive excitement when he hears the emergency cue — spinning, running to you, intense focus.',
      whenToAdvance:
        'After 2+ weeks of daily loading, Zuzu shows an explosive response to the cue.',
      whenToGoBack:
        'If the response is not explosive after 2 weeks, increase the value of the reward or extend loading for another week.',
      suggestedDuration: 60,
    },
    {
      title: 'Test Short Distance Outdoors on Leash',
      whatToDo:
        'On leash outdoors, in a calm environment. Wait for Zuzu to be mildly distracted (sniffing). Say the emergency cue. If he whips around and comes to you: jackpot with the unique reward for 15-30 seconds. If he does not respond, do NOT repeat the cue. Walk closer, get his attention normally, and go back to indoor loading for another week.',
      successLooksLike:
        'Zuzu responds instantly to the emergency cue outdoors on leash, even when mildly distracted.',
      whenToAdvance:
        'Zuzu responds to the emergency cue outdoors on leash 3 times in a row across different sessions.',
      whenToGoBack:
        'If Zuzu ignores the cue outdoors, return to Step 3 for another week of indoor loading. Do not repeat the cue — you will weaken it.',
      suggestedDuration: 60,
    },
    {
      title: 'Test on Long Line with Distractions',
      whatToDo:
        'On a 15-20 foot long line in a mildly distracting environment. Let Zuzu wander and sniff. When he is engaged with something mildly interesting, say the emergency cue. Jackpot on response. Practice 1x per week maximum — do not overuse or the cue loses its power.',
      successLooksLike:
        'Zuzu responds to the emergency cue on a long line with mild distractions present.',
      whenToAdvance:
        'This is the maintenance step. Continue practicing 1x per week with the unique reward. Never use the cue casually.',
      whenToGoBack:
        'If the response weakens, return to Step 3 indoor loading for a full week before retesting outdoors.',
      suggestedDuration: 120,
    },
  ],
};

// ---------------------------------------------------------------------------
// BRANCH 6: VOICE AND SELF-REGULATION
// ---------------------------------------------------------------------------

const alertbark: Skill = {
  id: 'alertbark',
  name: 'Alert Bark Management',
  branch: 'voice',
  abbr: 'AB',
  description:
    'Reducing Zuzu\'s barking at sounds and sights from inside the home -- knocks, doorbells, people passing windows, sounds in the hallway. Alert barking is self-reinforcing: Zuzu barks at the mail carrier, the mail carrier leaves, Zuzu thinks his barking worked. This loop strengthens every repetition. Breaking it requires management (prevent rehearsal) and training (new response to triggers).',
  connections:
    'Stranger Desensitization (same emotional mechanism), Mat/Place (gives an alternative behavior), Capturing Calm (baseline skill). Unlocks calm indoor behavior during household triggers.',
  sessionType: 'calm',
  sessionDuration: { min: 300, max: 600 },
  sessionsPerDay: { min: 1, max: 2 },
  prerequisites: [
    { skillId: 'matplace', stepRequired: 2 },
    { skillId: 'capturingcalm', stepRequired: 1 },
  ],
  steps: [
    {
      title: 'Management (Immediate -- No Training Needed)',
      whatToDo:
        'Block visual access to windows where Zuzu barks (window film, closed blinds). Use white noise or music to mask hallway sounds. If the doorbell triggers barking, disconnect it or put a sign asking visitors to text. These are not training steps -- they are management to prevent the barking loop from rehearsing and strengthening while you build the training foundation.',
      successLooksLike:
        'Barking frequency decreases because Zuzu is no longer exposed to triggers that he cannot yet handle.',
      whenToAdvance:
        'Management is in place and barking has reduced from trigger prevention. Begin the training step alongside management.',
      whenToGoBack:
        'If barking increases despite management, check for new trigger sources and block those as well.',
      tips: [
        'Management is ongoing -- keep it in place even as training progresses.',
        'This is not a failure; management is a professional best practice.',
      ],
      suggestedDuration: 120,
    },
    {
      title: 'Knock/Sound Desensitization Training',
      whatToDo:
        'Record the triggering sounds (knock, doorbell) or use YouTube. Play at barely audible volume. Zuzu does not react. Treat. Increase volume by 5-10% per session. Treat throughout. When you reach realistic volume and Zuzu looks at you instead of reacting: the CER is established. Pair with Mat/Place: sound happens -> Zuzu goes to mat -> treat. This gives him a JOB when the trigger occurs. Timeline: 2-4 weeks for recorded sounds. Real-world knocks take longer because of unpredictability. Expect 1-3 months for substantial improvement with real visitors.',
      successLooksLike:
        'Zuzu hears a knock or doorbell sound at realistic volume and looks at you or goes to his mat instead of barking.',
      whenToAdvance:
        'Zuzu shows a CER to recorded sounds at full volume. Then begin generalizing to real-world triggers. This is ongoing work over 1-3 months.',
      whenToGoBack:
        'If Zuzu barks at the recorded sound, you increased volume too fast. Reduce by 20% and rebuild.',
      suggestedDuration: 420,
    },
  ],
};

const interrupter: Skill = {
  id: 'interrupter',
  name: 'Positive Interrupter',
  branch: 'voice',
  abbr: 'PI',
  description:
    'A unique sound (smooch noise, whistle, specific word) that means "stop what you are doing and look at me for a treat." Different from his name -- this is a reset button. When Zuzu is about to bark, or has started barking, or is picking up something he should not, you need a non-punitive way to interrupt. The positive interrupter is loaded with so much value (100+ reps of sound = treat) that it punches through distraction.',
  connections:
    'Marker Conditioning (same loading technique). Unlocks non-punitive behavior interruption in real-world situations.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 180 },
  sessionsPerDay: { min: 2, max: 3 },
  prerequisites: [{ skillId: 'marker', mastery: true }],
  steps: [
    {
      title: 'Load and Use the Interrupter',
      whatToDo:
        'Choose a sound: a loud smooch/kiss noise or a short whistle. NOT "no." NOT his name. Load it the same way you loaded the marker: make the sound, treat, 20 reps, 3x daily, for 3 days. Test: Make the sound when Zuzu is mildly distracted (sniffing). He should whip his head toward you. If he does, it is loaded. Use sparingly. Only use it to interrupt behaviors you need to stop NOW. Do not overuse or it loses power. ALWAYS follow through with a treat. Every single time. If you use it and do not treat, you are degrading the tool.',
      successLooksLike:
        'Zuzu whips his head toward you when he hears the interrupter sound, even when mildly distracted.',
      whenToAdvance:
        'This is a single-step skill. The interrupter is loaded when Zuzu responds reliably to the sound while mildly distracted. Maintain by always treating after use.',
      whenToGoBack:
        'If the interrupter loses power (Zuzu ignores it), you have either overused it or failed to treat after use. Reload: 20 reps of sound = treat, 3x daily, for 2-3 days.',
      tips: [
        'Use sparingly -- only for behaviors you need to stop immediately.',
        'ALWAYS follow through with a treat, every single time.',
        'If you use it and do not treat, you are degrading the tool.',
      ],
      suggestedDuration: 120,
      suggestedReps: '20',
    },
  ],
};

const engagedisengage: Skill = {
  id: 'engagedisengage',
  name: 'Engage-Disengage Game',
  branch: 'voice',
  abbr: 'ED',
  description:
    'Two-level game that teaches self-interruption around triggers. Level 1 changes Zuzu\'s emotional response (classical counter-conditioning — trigger appears, you mark + treat). Level 2 builds voluntary disengagement (operant — Zuzu sees trigger, looks AWAY on his own, you mark + treat the disengage). This is the bridge between "Zuzu tolerates strangers at a distance" and "Zuzu can regulate his own response to strangers."',
  connections:
    'Alert Bark Management (prerequisite), Stranger Desensitization (prerequisite — need threshold distance work). Unlocks self-regulated calm around triggers.',
  sessionType: 'passive',
  sessionDuration: { min: 300, max: 600 },
  sessionsPerDay: { min: 1, max: 2 },
  prerequisites: [
    { skillId: 'alertbark', mastery: true },
    { skillId: 'stranger', stepRequired: 0 },
  ],
  steps: [
    {
      title: 'Level 1: Mark the Engagement',
      whatToDo:
        'At threshold distance. A stranger appears. Zuzu notices (ears forward, head turn). The instant he notices: mark + treat. You are marking the LOOKING, not waiting for him to look away. This is classical counter-conditioning — stranger appears → treat happens. Zuzu does not have to do anything "right." Stranger exists = treat. Repeat for each person who passes. 5-10 minute sessions.',
      successLooksLike:
        'Zuzu sees a stranger and immediately looks at you expectantly (conditioned emotional response). He is no longer fixating — he is anticipating the treat.',
      whenToAdvance:
        'Zuzu shows a CER at the current distance — sees stranger, looks at you — 9/10 times. Then move to Level 2.',
      whenToGoBack:
        'If Zuzu barks or lunges, you are too close. Increase distance immediately. Return to Stranger Desensitization threshold work.',
      suggestedDuration: 420,
    },
    {
      title: 'Level 2: Mark the Disengagement',
      whatToDo:
        'At threshold distance. A stranger appears. Zuzu notices. Now WAIT. Do not mark the engagement. Wait for Zuzu to look AWAY from the stranger voluntarily — back at you, at the ground, at anything that is not the trigger. Mark + treat the moment he disengages. This is operant conditioning — Zuzu is choosing to disengage, and the choice is reinforced. This builds the self-interruption skill that replaces barking.',
      successLooksLike:
        'Zuzu notices a stranger, pauses briefly, then voluntarily looks away without prompting. The disengagement becomes faster and more automatic over sessions.',
      whenToAdvance:
        'Zuzu voluntarily disengages from strangers at the current distance 8/10 times. Then decrease distance by 10-20% and repeat.',
      whenToGoBack:
        'If Zuzu cannot disengage voluntarily, return to Level 1 at the current distance for more classical conditioning work.',
      suggestedDuration: 420,
    },
  ],
};

const quietcue: Skill = {
  id: 'quietcue',
  name: 'Quiet on Cue',
  branch: 'voice',
  abbr: 'QC',
  description:
    'Teaching Zuzu a verbal cue to stop barking on command. This is an advanced skill that only works when the emotional foundation (calm, impulse control, desensitization) is already strong.',
  connections:
    'Positive Interrupter (prerequisite), Alert Bark Management (prerequisite). Unlocks on-cue bark cessation.',
  sessionType: 'active',
  sessionDuration: { min: 120, max: 300 },
  sessionsPerDay: { min: 1, max: 2 },
  prerequisites: [
    { skillId: 'interrupter', mastery: true },
    { skillId: 'alertbark', mastery: true },
  ],
  steps: [
    {
      title: 'Capture Quiet Moments',
      whatToDo:
        'When Zuzu pauses between barks — even a 2-second pause — mark + treat the silence. Do not wait for a long silence at first. Any pause counts. You are teaching him that silence has value. Do not say "quiet" yet — just capture the natural pauses.',
      successLooksLike:
        'Zuzu begins offering longer pauses between barks because the pauses are being reinforced.',
      whenToAdvance:
        'Zuzu offers 5+ second pauses between barks reliably, and you can predict when the pause will happen.',
      whenToGoBack:
        'If Zuzu barks continuously with no pauses, use the Positive Interrupter to create a pause, then mark + treat the resulting silence.',
      suggestedDuration: 180,
    },
    {
      title: 'Add "Quiet" Cue',
      whatToDo:
        'During a natural pause in barking, say "quiet" in a calm, low voice. Mark + treat the continued silence. Build duration — "quiet" for 3 seconds of silence, then 5, then 10. If Zuzu resumes barking after the cue, do not repeat it. Wait for the next natural pause and try again.',
      successLooksLike:
        'Zuzu stops barking and remains quiet for 10+ seconds after hearing the "quiet" cue.',
      whenToAdvance:
        'Zuzu responds to the "quiet" cue 7/10 times with 10+ seconds of silence. This is the mastery step — continue reinforcing.',
      whenToGoBack:
        'If Zuzu ignores the cue, return to Step 1 and capture more natural pauses before re-adding the verbal cue.',
      suggestedDuration: 180,
    },
  ],
};

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export const SKILLS: Skill[] = [
  // Foundation
  marker,
  name,
  eyecontact,
  handtarget,
  // Stillness
  capturingcalm,
  tethsettle,
  findit,
  matplace,
  relaxation,
  // Impulse
  wait,
  leaveit,
  dropit,
  // Body
  touchaccept,
  nailpaw,
  mouthear,
  coopcare,
  // World
  looseleash,
  stranger,
  recall,
  emergencyrecall,
  doormanners,
  // Voice
  alertbark,
  interrupter,
  engagedisengage,
  quietcue,
];

export const SKILL_MAP: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
);
