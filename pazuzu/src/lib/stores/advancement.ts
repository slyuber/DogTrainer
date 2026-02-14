import { get } from 'svelte/store';
import { appData, setSkillStep, sealSkill } from './app';
import type { Skill } from '../data/skills';

export interface AdvancementResult {
  type: 'advance' | 'hold' | 'retreat1' | 'retreat2';
  message: string;
  reasons?: string[];
}

export function checkAdvancement(skillId: string, currentStep: number, skill: Skill): AdvancementResult {
  const data = get(appData);
  const sessions = data.sessions
    .filter(s => s.skillId === skillId && s.step === currentStep)
    .slice(-5);

  if (sessions.length < 3) {
    return { type: 'hold', message: 'Keep practicing — need more sessions at this step.' };
  }

  const upCount = sessions.filter(s => s.rating === 'up').length;
  const downCount = sessions.filter(s => s.rating === 'down').length;

  // Advance: 4+ of last 5 are thumbs up
  if (upCount >= 4 && sessions.length >= 4) {
    const nextStep = currentStep + 1;
    if (nextStep >= skill.steps.length) {
      if (skill.neverCompletes) {
        return { type: 'hold', message: 'This Ward never fully seals — keep maintaining it.' };
      }
      return { type: 'advance', message: 'Ready to seal this Ward!' };
    }
    return {
      type: 'advance',
      message: `Ready to advance to Step ${nextStep + 1}: ${skill.steps[nextStep].title}`,
    };
  }

  // Retreat 2: 4+ of last 5 are thumbs down
  if (downCount >= 4) {
    return {
      type: 'retreat2',
      message: `Consider going back 2 steps for a few sessions.`,
      reasons: REGRESSION_REASONS,
    };
  }

  // Retreat 1: 3+ of last 5 are thumbs down
  if (downCount >= 3) {
    return {
      type: 'retreat1',
      message: `Consider returning to the previous step for a few sessions.`,
      reasons: REGRESSION_REASONS,
    };
  }

  return { type: 'hold', message: 'Mixed results — keep practicing at this step.' };
}

export function applyAdvancement(skillId: string, currentStep: number, skill: Skill, result: AdvancementResult) {
  switch (result.type) {
    case 'advance': {
      const nextStep = currentStep + 1;
      if (nextStep >= skill.steps.length && !skill.neverCompletes) {
        sealSkill(skillId);
      } else {
        setSkillStep(skillId, Math.min(nextStep, skill.steps.length - 1));
      }
      break;
    }
    case 'retreat1':
      setSkillStep(skillId, Math.max(0, currentStep - 1));
      break;
    case 'retreat2':
      setSkillStep(skillId, Math.max(0, currentStep - 2));
      break;
    case 'hold':
      break;
  }
}

const REGRESSION_REASONS = [
  'Tired or over/under-exercised?',
  'In pain? (IVDD: watch for reluctance to move, hunched posture, yelping)',
  'Routine change? New stressor?',
  'Long gap since last practice?',
];
