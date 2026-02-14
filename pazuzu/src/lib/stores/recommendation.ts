import { derived, get } from 'svelte/store';
import { appData } from './app';
import { skillStates } from './skills';
import { daysAgo } from '../utils/format';
import type { Skill } from '../data/skills';

export interface Recommendation {
  skillId: string;
  skill: Skill;
  score: number;
  reason: string;
  duration: number; // suggested seconds
}

export const dailyPlan = derived([appData, skillStates], ([$data, $states]) => {
  const recommendations: Recommendation[] = [];

  for (const [skillId, state] of Object.entries($states)) {
    // Skip locked, sealed, and future skills
    if (!state.unlocked || state.sealed || state.skill.future) continue;

    let score = 0;
    let reason = '';

    // Recency: 2 pts/day since last trained, max 40
    const lastSession = [...$data.sessions]
      .reverse()
      .find(s => s.skillId === skillId);
    const daysSince = lastSession ? daysAgo(lastSession.dt) : 999;
    const recencyScore = Math.min(40, daysSince * 2);
    score += recencyScore;
    if (daysSince > 30) reason = 'Never trained';
    else if (daysSince > 7) reason = `${daysSince} days since last ritual`;

    // Foundation priority: 25 pts for foundation, 15 for stillness/impulse
    if (state.skill.branch === 'foundation') {
      score += 25;
      if (!reason) reason = 'Foundation Ward';
    } else if (state.skill.branch === 'stillness' || state.skill.branch === 'impulse') {
      score += 15;
    }

    // Gateway value: 5 pts for each skill this blocks
    let blockedCount = 0;
    for (const [, otherState] of Object.entries($states)) {
      if (!otherState.unlocked && !otherState.skill.future) {
        const isPrereq = otherState.skill.prerequisites.some(p => p.skillId === skillId);
        if (isPrereq) blockedCount++;
      }
    }
    if (blockedCount > 0) {
      score += blockedCount * 5;
      if (!reason) reason = `Unlocks ${blockedCount} Ward${blockedCount > 1 ? 's' : ''}`;
    }

    // Close to advancing: check last 5 sessions for this step
    const stepSessions = $data.sessions
      .filter(s => s.skillId === skillId && s.step === state.step)
      .slice(-5);
    if (stepSessions.length >= 3) {
      const upCount = stepSessions.filter(s => s.rating === 'up').length;
      if (upCount / stepSessions.length >= 0.6) {
        score += 15;
        if (!reason) reason = 'Close to advancing';
      }
    }

    // Lagging behind: step progress below average
    const startedSkills = Object.values($states).filter(s => s.started && !s.sealed);
    if (startedSkills.length > 1) {
      const avgProgress = startedSkills.reduce((sum, s) => sum + s.progress, 0) / startedSkills.length;
      if (state.progress < avgProgress * 0.7) {
        score += 15;
        if (!reason) reason = 'Lagging behind';
      }
    }

    // Assessment boost
    if ($data.assessment) {
      const loadout = $data.assessment.recommendedLoadout;
      if (loadout.primaryQuest === skillId || loadout.sideQuests.includes(skillId)) {
        score += 10;
        if (!reason) reason = 'Recommended from assessment';
      }
    }

    // Variety penalty: trained yesterday
    if (daysSince === 1) score -= 10;

    if (!reason) reason = 'Available for training';

    recommendations.push({
      skillId,
      skill: state.skill,
      score,
      reason,
      duration: state.skill.sessionDuration.min,
    });
  }

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  // Assemble plan: ensure mix of branches and session types
  const plan: Recommendation[] = [];
  const usedBranches = new Set<string>();
  let hasCalmSkill = false;

  for (const rec of recommendations) {
    if (plan.length >= 5) break;

    const isCalm = rec.skill.sessionType === 'calm';

    // Always include at least 1 calm skill
    if (plan.length >= 4 && !hasCalmSkill && !isCalm) continue;

    // Avoid too many from same branch (max 2)
    const branchCount = plan.filter(p => p.skill.branch === rec.skill.branch).length;
    if (branchCount >= 2) continue;

    plan.push(rec);
    usedBranches.add(rec.skill.branch);
    if (isCalm) hasCalmSkill = true;
  }

  // If we still have no calm skill, find one and add it
  if (!hasCalmSkill) {
    const calmRec = recommendations.find(r =>
      r.skill.sessionType === 'calm' && !plan.includes(r)
    );
    if (calmRec) {
      if (plan.length >= 5) plan.pop();
      plan.push(calmRec);
    }
  }

  return plan;
});
