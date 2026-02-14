export interface AssessmentCategory {
  id: string;
  name: string;
  levels: AssessmentLevel[];
}

export interface AssessmentLevel {
  level: number;
  description: string;
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  {
    id: 'attention',
    name: 'Attention & Engagement',
    levels: [
      { level: 0, description: 'Zuzu does not look at you when you say his name' },
      { level: 1, description: 'Zuzu looks at you when you say his name in a quiet room' },
      { level: 2, description: 'Zuzu looks at you when you say his name with mild distractions' },
      { level: 3, description: 'Zuzu looks at you when you say his name outdoors' },
    ]
  },
  {
    id: 'stillness',
    name: 'Stillness',
    levels: [
      { level: 0, description: 'Zuzu paces, sniffs, or moves constantly when free near you' },
      { level: 1, description: 'Zuzu will pause movement for 2-3 seconds if you toss a treat' },
      { level: 2, description: 'Zuzu will sit or lie down near you for 10+ seconds unprompted' },
      { level: 3, description: 'Zuzu will lie down near you for 1+ minute without getting up' },
      { level: 4, description: 'Zuzu will settle (hip roll, sigh, head down) near you for 5+ min' },
    ]
  },
  {
    id: 'impulseControl',
    name: 'Impulse Control',
    levels: [
      { level: 0, description: 'Zuzu lunges at dropped food, grabs things off the ground freely' },
      { level: 1, description: 'Zuzu can wait 1-2 seconds before eating food from your hand' },
      { level: 2, description: 'Zuzu can look away from food in your closed fist' },
      { level: 3, description: 'Zuzu can ignore food on the floor when you say "leave it"' },
      { level: 4, description: 'Zuzu can ignore food on a walk when cued' },
    ]
  },
  {
    id: 'bodyHandling',
    name: 'Body Handling',
    levels: [
      { level: 0, description: 'Zuzu moves away or mouths when you touch paws, ears, or belly' },
      { level: 1, description: 'Zuzu tolerates brief (1-2 sec) touches on body without pulling away' },
      { level: 2, description: 'Zuzu allows you to hold a paw for 3+ seconds' },
      { level: 3, description: 'Zuzu remains relaxed during full body examination' },
      { level: 4, description: 'Zuzu offers a chin rest or holds still voluntarily for handling' },
    ]
  },
  {
    id: 'strangerResponse',
    name: 'Stranger Response',
    levels: [
      { level: 0, description: 'Zuzu barks, lunges, or hides when strangers appear at any distance' },
      { level: 1, description: 'Zuzu notices strangers at distance but can be redirected with food' },
      { level: 2, description: 'Zuzu can watch strangers pass at 10+ meters without reacting' },
      { level: 3, description: 'Zuzu can be near strangers (3-5 meters) without reacting' },
      { level: 4, description: 'Zuzu can accept treats from a calm stranger' },
    ]
  },
  {
    id: 'mouthControl',
    name: 'Mouth Control',
    levels: [
      { level: 0, description: 'Zuzu picks up and eats random things on walks and at home' },
      { level: 1, description: 'Zuzu will trade an object for a treat sometimes' },
      { level: 2, description: 'Zuzu will drop items on cue reliably indoors' },
      { level: 3, description: 'Zuzu will leave items on cue on walks' },
    ]
  }
];

export interface AssessmentResult {
  completedAt: string;
  levels: Record<string, number>;
  recommendedLoadout: {
    primaryQuest: string;
    sideQuests: string[];
    passiveTraining: string;
  };
}

export function generateLoadout(levels: Record<string, number>): AssessmentResult['recommendedLoadout'] {
  // Find the weakest areas (lowest levels) and map to skills
  const weakest: { cat: string; level: number }[] = Object.entries(levels)
    .map(([cat, level]) => ({ cat, level }))
    .sort((a, b) => a.level - b.level);

  // Primary quest: most critical gap
  let primaryQuest = 'capturingcalm'; // default
  let sideQuests: string[] = [];
  let passiveTraining = 'name';

  const weakCat = weakest[0]?.cat;
  if (weakCat === 'stillness' || weakCat === 'attention') primaryQuest = 'capturingcalm';
  else if (weakCat === 'impulseControl') primaryQuest = 'leaveit';
  else if (weakCat === 'bodyHandling') primaryQuest = 'touchaccept';
  else if (weakCat === 'strangerResponse') primaryQuest = 'capturingcalm'; // calm first for stranger work
  else if (weakCat === 'mouthControl') primaryQuest = 'leaveit';

  // Side quests from different branches
  const branchMap: Record<string, string[]> = {
    attention: ['eyecontact', 'name'],
    stillness: ['capturingcalm', 'matplace'],
    impulseControl: ['wait', 'leaveit'],
    bodyHandling: ['touchaccept'],
    strangerResponse: ['stranger'],
    mouthControl: ['dropit', 'leaveit'],
  };

  for (const w of weakest.slice(1)) {
    const candidates = branchMap[w.cat] || [];
    for (const c of candidates) {
      if (c !== primaryQuest && !sideQuests.includes(c) && sideQuests.length < 2) {
        sideQuests.push(c);
      }
    }
  }

  // Ensure we have at least 1 side quest
  if (sideQuests.length === 0) sideQuests.push('touchaccept');

  return { primaryQuest, sideQuests, passiveTraining };
}
