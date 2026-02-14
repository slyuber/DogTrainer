import { derived } from 'svelte/store';
import { appData } from './app';
import type { Skill } from '../data/skills';

// This will be initialized after skills.ts is loaded
let SKILL_MAP: Record<string, Skill> = {};

export function initSkillMap(map: Record<string, Skill>) {
  SKILL_MAP = map;
}

export interface SkillState {
  skill: Skill;
  unlocked: boolean;
  step: number;
  totalSteps: number;
  started: boolean;
  sealed: boolean;
  progress: number; // 0-1
}

export const skillStates = derived(appData, $data => {
  const states: Record<string, SkillState> = {};

  for (const skill of Object.values(SKILL_MAP)) {
    const prog = $data.progress[skill.id];
    const step = prog?.step ?? 0;
    const sealed = !!prog?.masteredAt;
    const started = !!prog?.startedAt;
    const totalSteps = skill.steps.length;

    // Check prerequisites - step-level
    let unlocked = true;
    for (const prereq of skill.prerequisites) {
      const prereqProg = $data.progress[prereq.skillId];
      if (prereq.mastery) {
        if (!prereqProg?.masteredAt) { unlocked = false; break; }
      } else if (prereq.stepRequired !== undefined) {
        const prereqStep = prereqProg?.step ?? 0;
        const prereqSealed = !!prereqProg?.masteredAt;
        if (!prereqSealed && prereqStep < prereq.stepRequired) { unlocked = false; break; }
      } else {
        // Just needs to be started
        if (!prereqProg?.startedAt) { unlocked = false; break; }
      }
    }

    // Skills with no prereqs are always unlocked
    if (skill.prerequisites.length === 0) unlocked = true;

    states[skill.id] = {
      skill,
      unlocked,
      step,
      totalSteps,
      started,
      sealed,
      progress: sealed ? 1 : (totalSteps > 0 ? step / totalSteps : 0),
    };
  }

  return states;
});
