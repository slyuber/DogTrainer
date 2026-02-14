export interface ScheduleBlock {
  time: string;
  label: string;
  type: 'walk' | 'training' | 'calm' | 'pen' | 'potty' | 'meal' | 'body' | 'free';
  note?: string;
}

export const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  { time: 'Morning', label: 'Wake + Potty', type: 'potty' },
  { time: 'Morning', label: 'Walk / Rollerblade (20-30 min)', type: 'walk', note: 'Practice check-ins, loose leash, name responses' },
  { time: 'Morning', label: 'Capturing Calm (5-10 min)', type: 'calm', note: 'After walk — sit in work spot, reward settling' },
  { time: 'Morning', label: 'Pen Time + Enrichment', type: 'pen', note: 'Kong, chew, snuffle mat' },
  { time: 'Midday', label: 'Potty Break', type: 'potty' },
  { time: 'Midday', label: 'Active Training (3-5 min)', type: 'training', note: 'Pick ONE active skill' },
  { time: 'Midday', label: 'Calm Session (5 min)', type: 'calm' },
  { time: 'Midday', label: 'Walk (15-20 min)', type: 'walk', note: 'Stranger CC/DS practice if triggers available' },
  { time: 'Evening', label: 'Walk (20-30 min)', type: 'walk', note: 'Loose leash + sniff enrichment' },
  { time: 'Evening', label: 'Active Training (3-5 min)', type: 'training', note: 'Different skill from midday' },
  { time: 'Evening', label: 'Body Handling (2-3 min)', type: 'body', note: 'Touch acceptance work' },
  { time: 'Evening', label: 'Free Time + Passive Calm', type: 'free', note: 'Reward any settling' },
  { time: 'Evening', label: 'Dinner', type: 'meal', note: 'Wait practice, hand-feed for name/engagement reps' },
  { time: 'Evening', label: 'Final Potty + Crate', type: 'potty' },
];
