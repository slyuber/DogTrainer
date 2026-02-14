export interface InscriptionDef {
  id: string;
  title: string;
  description: string;
  check: (ctx: InscriptionContext) => boolean;
}

export interface InscriptionContext {
  totalSessions: number;
  totalDays: number;
  sealedSkills: string[];
  currentStreak: number;
  skillsStarted: number;
}

export const INSCRIPTIONS: InscriptionDef[] = [
  {
    id: 'first_ritual',
    title: 'First Ritual',
    description: 'Complete your first training session',
    check: ctx => ctx.totalSessions >= 1,
  },
  {
    id: 'ten_rituals',
    title: 'Ten Rituals',
    description: 'Complete 10 training sessions',
    check: ctx => ctx.totalSessions >= 10,
  },
  {
    id: 'fifty_rituals',
    title: 'The Devoted',
    description: 'Complete 50 training sessions',
    check: ctx => ctx.totalSessions >= 50,
  },
  {
    id: 'hundred_rituals',
    title: 'Century of Wards',
    description: 'Complete 100 training sessions',
    check: ctx => ctx.totalSessions >= 100,
  },
  {
    id: 'first_seal',
    title: 'First Seal',
    description: 'Master your first Ward',
    check: ctx => ctx.sealedSkills.length >= 1,
  },
  {
    id: 'five_seals',
    title: 'Shield Bearer',
    description: 'Master 5 Wards',
    check: ctx => ctx.sealedSkills.length >= 5,
  },
  {
    id: 'ten_seals',
    title: 'Ward Keeper',
    description: 'Master 10 Wards',
    check: ctx => ctx.sealedSkills.length >= 10,
  },
  {
    id: 'streak_3',
    title: 'Three-Day Vigil',
    description: 'Train 3 days in a row',
    check: ctx => ctx.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Week of Devotion',
    description: 'Train 7 days in a row',
    check: ctx => ctx.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    title: "Hanbi's Legacy",
    description: 'Train 30 days in a row',
    check: ctx => ctx.currentStreak >= 30,
  },
  {
    id: 'all_branches',
    title: 'Wind Walker',
    description: 'Start at least one Ward from every branch',
    check: ctx => ctx.skillsStarted >= 6,
  },
];
