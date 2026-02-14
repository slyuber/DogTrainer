import { derived } from 'svelte/store';
import { appData } from './app';
import type { ActivityEntry } from './app';
import { isToday } from '../utils/format';
import { SKILL_MAP } from '../data/skills';

export interface TimelineItem {
  id: string;
  dt: string;
  type: string;
  label: string;
  detail: string;
  source: 'activity' | 'session' | 'alone';
}

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export const periodLabels: Record<TimePeriod, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

export function getTimePeriod(iso: string): TimePeriod {
  const h = new Date(iso).getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

export const todayTimeline = derived(appData, $data => {
  const items: TimelineItem[] = [];

  // Activity log entries from today
  for (const entry of $data.activityLog) {
    if (!isToday(entry.dt)) continue;
    items.push({
      id: entry.id,
      dt: entry.dt,
      type: entry.type,
      label: formatActivityLabel(entry),
      detail: entry.note || '',
      source: 'activity',
    });
  }

  // Training sessions from today
  for (const session of $data.sessions) {
    if (!isToday(session.dt)) continue;
    const skillName = SKILL_MAP[session.skillId]?.name || session.skillId;
    items.push({
      id: session.id,
      dt: session.dt,
      type: 'training',
      label: `Ritual: ${skillName}`,
      detail: session.rating === 'up' ? 'Went well' : session.rating === 'down' ? 'Struggled' : 'Okay',
      source: 'session',
    });
  }

  // Alone logs from today
  for (const log of $data.aloneLogs) {
    if (!isToday(log.dt)) continue;
    items.push({
      id: log.id,
      dt: log.dt,
      type: 'alone',
      label: 'Alone Time',
      detail: `${Math.round(log.duration / 60)} min`,
      source: 'alone',
    });
  }

  // Sort chronologically
  items.sort((a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime());
  return items;
});

function formatActivityLabel(entry: ActivityEntry): string {
  const typeLabels: Record<string, string> = {
    potty: 'Potty',
    walk: 'Walk',
    play: 'Play',
    alone: 'Alone',
    enrichment: 'Enrichment',
    feeding: 'Meal',
    cuddle: 'Cuddle',
    grooming: 'Grooming',
    sleep: 'Sleep',
    pen: 'Pen',
  };
  const base = typeLabels[entry.type] || entry.type;
  if (entry.subtype) return `${base}: ${entry.subtype}`;
  return base;
}
