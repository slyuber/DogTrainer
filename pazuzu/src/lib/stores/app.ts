import { writable, get } from 'svelte/store';
import type { AssessmentResult } from '../data/assessment';
import { uid } from '../utils/uid';

// ── Types ──

export interface AppData {
  version: 2;
  profile: {
    name: string;
    weight: number;
    rescueDate: string;
    breed: string;
    age: string;
    origin: string;
  };
  settings: {
    soundEnabled: boolean;
    reminders: boolean;
  };
  assessment: AssessmentResult | null;
  progress: Record<string, SkillProgress>;
  sessions: TrainingSession[];
  activityLog: ActivityEntry[];
  aloneLogs: AloneLog[];
  behaviorNotes: BehaviorNote[];
  foodNotes: string[];
  milestones: Milestone[];
  aloneTimerState: {
    running: boolean;
    startTime: number;
    elapsed: number;
  };
  penTimerState: {
    running: boolean;
    startTime: number;
    elapsed: number;
  };
}

export interface SkillProgress {
  step: number;
  startedAt: string | null;
  masteredAt: string | null;
}

export interface TrainingSession {
  id: string;
  skillId: string;
  dt: string;
  step: number;
  duration: number;
  rating: 'up' | 'neutral' | 'down';
  note: string;
  usedTimer: boolean;
}

export type ActivityType = 'training' | 'potty' | 'walk' | 'play' | 'alone'
  | 'enrichment' | 'feeding' | 'cuddle' | 'grooming' | 'sleep' | 'pen';

export interface ActivityEntry {
  id: string;
  dt: string;
  type: ActivityType;
  subtype: string;
  location?: string;
  duration?: number;
  outcome?: string;
  note?: string;
}

export interface AloneLog {
  id: string;
  dt: string;
  duration: number;
  note?: string;
}

export interface BehaviorNote {
  id: string;
  dt: string;
  note: string;
  tags: string[];
}

export interface Milestone {
  id: string;
  inscriptionId: string;
  dt: string;
}

// ── Default Data ──

const DEFAULT_DATA: AppData = {
  version: 2,
  profile: {
    name: 'Zuzu',
    weight: 8.5,
    rescueDate: '2026-01',
    breed: 'Chiweenie',
    age: '~2 years',
    origin: 'Rescue from Mexico',
  },
  settings: {
    soundEnabled: true,
    reminders: true,
  },
  assessment: null,
  progress: {},
  sessions: [],
  activityLog: [],
  aloneLogs: [],
  behaviorNotes: [],
  foodNotes: [],
  milestones: [],
  aloneTimerState: { running: false, startTime: 0, elapsed: 0 },
  penTimerState: { running: false, startTime: 0, elapsed: 0 },
};

// ── Storage ──

const STORAGE_KEY = 'pazuzuWards';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 2) {
        // Ensure new fields exist for existing v2 data
        if (!parsed.penTimerState) {
          parsed.penTimerState = { running: false, startTime: 0, elapsed: 0 };
        }
        // Migrate strangerbarking → engagedisengage
        if (parsed.progress?.strangerbarking) {
          parsed.progress.engagedisengage = parsed.progress.strangerbarking;
          delete parsed.progress.strangerbarking;
        }
        if (parsed.sessions) {
          for (const s of parsed.sessions) {
            if (s.skillId === 'strangerbarking') s.skillId = 'engagedisengage';
          }
        }
        return parsed;
      }
    }
    // Check for v1 migration
    const oldRaw = localStorage.getItem('pazuzuWards') || localStorage.getItem('zuTrainer');
    if (oldRaw) {
      try {
        return migrateV1(JSON.parse(oldRaw));
      } catch { /* fall through to default */ }
    }
  } catch { /* fall through */ }
  return { ...DEFAULT_DATA };
}

function migrateV1(old: any): AppData {
  const data: AppData = { ...DEFAULT_DATA };
  data.version = 2;

  // Migrate profile
  if (old.profile) {
    data.profile = { ...DEFAULT_DATA.profile, ...old.profile };
  }

  // Migrate settings
  if (old.settings) {
    data.settings = { ...DEFAULT_DATA.settings, ...old.settings };
  }

  // Migrate progress - map old ward IDs to new skill IDs
  const idMap: Record<string, string> = {
    'attention': 'eyecontact',
    'interrupter': 'interrupter',
    'nomugging': 'wait',
    'calmness': 'capturingcalm',
    'crate': 'matplace',
    'house': 'marker',
    'sit': 'marker',
    'recall': 'recall',
    'leashpressure': 'looseleash',
    'release': 'wait',
    'doormanners': 'doormanners',
    'leaveit': 'leaveit',
    'dropit': 'dropit',
    'down': 'capturingcalm',
    'handling': 'touchaccept',
    'separation': 'capturingcalm',
    'fetch': 'dropit',
    'llwindoor': 'looseleash',
    'llwoutdoor': 'looseleash',
    'strangerbarking': 'engagedisengage',
  };

  if (old.progress) {
    for (const [oldId, prog] of Object.entries(old.progress as Record<string, any>)) {
      const newId = idMap[oldId] || oldId;
      if (!data.progress[newId]) {
        data.progress[newId] = {
          step: prog.step || 0,
          startedAt: prog.startedAt || null,
          masteredAt: prog.masteredAt || null,
        };
      }
    }
  }

  // Migrate sessions - convert ok/no counts to ratings
  if (old.sessions) {
    data.sessions = old.sessions.map((s: any) => {
      const total = (s.ok || 0) + (s.no || 0);
      const pct = total > 0 ? (s.ok || 0) / total : 0.5;
      let rating: 'up' | 'neutral' | 'down' = 'neutral';
      if (pct >= 0.8) rating = 'up';
      else if (pct < 0.5) rating = 'down';

      return {
        id: s.id || uid(),
        skillId: idMap[s.wardId] || s.wardId || 'marker',
        dt: s.dt || new Date().toISOString(),
        step: s.step || 0,
        duration: s.dur || 0,
        rating,
        note: s.note || '',
        usedTimer: true,
      };
    });
  }

  // Migrate pottyLogs, enrichmentLogs → activityLog
  if (old.pottyLogs) {
    for (const log of old.pottyLogs) {
      data.activityLog.push({
        id: uid(),
        dt: log.dt || new Date().toISOString(),
        type: 'potty',
        subtype: log.type || 'pee',
        location: log.loc || '',
        note: log.note || '',
      });
    }
  }

  if (old.enrichmentLogs) {
    for (const log of old.enrichmentLogs) {
      data.activityLog.push({
        id: uid(),
        dt: log.dt || new Date().toISOString(),
        type: 'enrichment',
        subtype: log.type || 'kong',
        duration: log.dur,
        note: log.note || '',
      });
    }
  }

  if (old.aloneLogs) {
    data.aloneLogs = old.aloneLogs.map((l: any) => ({
      id: l.id || uid(),
      dt: l.dt || new Date().toISOString(),
      duration: l.dur || l.duration || 0,
      note: l.note || '',
    }));
  }

  if (old.milestones) {
    data.milestones = old.milestones.map((m: any) => ({
      id: m.id || uid(),
      inscriptionId: m.id || m.inscriptionId || '',
      dt: m.dt || new Date().toISOString(),
    }));
  }

  if (old.aloneTimerState) {
    data.aloneTimerState = old.aloneTimerState;
  }

  return data;
}

// ── Store ──

export const appData = writable<AppData>(loadData());

export function save() {
  const d = get(appData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

export function updateData(fn: (d: AppData) => void) {
  appData.update(d => {
    fn(d);
    return d;
  });
  save();
}

// ── Helper Actions ──

export function addSession(session: Omit<TrainingSession, 'id'>) {
  updateData(d => {
    d.sessions.push({ ...session, id: uid() });
  });
}

export function addActivity(entry: Omit<ActivityEntry, 'id'>): string {
  const id = uid();
  updateData(d => {
    d.activityLog.push({ ...entry, id });
  });
  return id;
}

export function updateActivity(id: string, updates: Partial<ActivityEntry>) {
  updateData(d => {
    const idx = d.activityLog.findIndex(e => e.id === id);
    if (idx >= 0) d.activityLog[idx] = { ...d.activityLog[idx], ...updates };
  });
}

export function deleteActivity(id: string) {
  updateData(d => {
    d.activityLog = d.activityLog.filter(e => e.id !== id);
  });
}

export function deleteSession(id: string) {
  updateData(d => {
    d.sessions = d.sessions.filter(s => s.id !== id);
  });
}

export function deleteAloneLog(id: string) {
  updateData(d => {
    d.aloneLogs = d.aloneLogs.filter(l => l.id !== id);
  });
}

export function setSkillStep(skillId: string, step: number) {
  updateData(d => {
    if (!d.progress[skillId]) {
      d.progress[skillId] = { step: 0, startedAt: null, masteredAt: null };
    }
    d.progress[skillId].step = step;
    if (!d.progress[skillId].startedAt) {
      d.progress[skillId].startedAt = new Date().toISOString();
    }
  });
}

export function sealSkill(skillId: string) {
  updateData(d => {
    if (!d.progress[skillId]) {
      d.progress[skillId] = { step: 0, startedAt: null, masteredAt: null };
    }
    d.progress[skillId].masteredAt = new Date().toISOString();
  });
}

export function addMilestone(inscriptionId: string) {
  updateData(d => {
    if (!d.milestones.find(m => m.inscriptionId === inscriptionId)) {
      d.milestones.push({ id: uid(), inscriptionId, dt: new Date().toISOString() });
    }
  });
}

export function setAssessment(assessment: AssessmentResult) {
  updateData(d => {
    d.assessment = assessment;
  });
}

export function updateSession(id: string, updates: Partial<TrainingSession>) {
  updateData(d => {
    const idx = d.sessions.findIndex(s => s.id === id);
    if (idx >= 0) d.sessions[idx] = { ...d.sessions[idx], ...updates };
  });
}

export function updateAloneLog(id: string, updates: Partial<AloneLog>) {
  updateData(d => {
    const idx = d.aloneLogs.findIndex(l => l.id === id);
    if (idx >= 0) d.aloneLogs[idx] = { ...d.aloneLogs[idx], ...updates };
  });
}

export function unsealSkill(skillId: string) {
  updateData(d => {
    if (d.progress[skillId]) {
      d.progress[skillId].masteredAt = null;
    }
  });
}
