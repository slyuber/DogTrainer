import { SKILLS, SKILL_MAP } from './src/lib/data/skills';
import { ASSESSMENT_CATEGORIES } from './src/lib/data/assessment';
import { INSCRIPTIONS } from './src/lib/data/inscriptions';
import { TREE_NODES, TREE_CONNECTIONS } from './src/lib/data/tree-layout';

let errors = 0;
function check(cond: boolean, msg: string) {
  if (!cond) { console.error(`  FAIL: ${msg}`); errors++; }
}

console.log(`--- Data Integrity Tests ---\n`);

// 1. Skill count
console.log(`Skills: ${SKILLS.length}`);
check(SKILLS.length === 22, `Expected 22 skills, got ${SKILLS.length}`);

// 2. All skill IDs unique
const ids = SKILLS.map(s => s.id);
check(new Set(ids).size === ids.length, 'Duplicate skill IDs');

// 3. All prerequisite references valid
for (const skill of SKILLS) {
  for (const prereq of skill.prerequisites) {
    check(!!SKILL_MAP[prereq.skillId], `${skill.id} has invalid prereq: ${prereq.skillId}`);
    if (prereq.stepRequired !== undefined) {
      const target = SKILL_MAP[prereq.skillId];
      if (target) {
        check(prereq.stepRequired < target.steps.length,
          `${skill.id} prereq ${prereq.skillId} step ${prereq.stepRequired} exceeds step count ${target.steps.length}`);
      }
    }
  }
}
console.log('Prerequisite refs: checked');

// 4. All tree nodes reference valid skills
for (const node of TREE_NODES) {
  check(!!SKILL_MAP[node.skillId], `Tree node has invalid skill: ${node.skillId}`);
}
console.log(`Tree nodes: ${TREE_NODES.length} (all valid)`);

// 5. All tree connections reference valid skills
for (const conn of TREE_CONNECTIONS) {
  check(!!SKILL_MAP[conn.from], `Tree connection invalid from: ${conn.from}`);
  check(!!SKILL_MAP[conn.to], `Tree connection invalid to: ${conn.to}`);
}
console.log(`Tree connections: ${TREE_CONNECTIONS.length} (all valid)`);

// 6. Every skill has at least 1 step with required fields
for (const skill of SKILLS) {
  check(skill.steps.length > 0, `${skill.id} has no steps`);
  for (let i = 0; i < skill.steps.length; i++) {
    const step = skill.steps[i];
    check(!!step.title, `${skill.id} step ${i} missing title`);
    check(!!step.whatToDo, `${skill.id} step ${i} missing whatToDo`);
    check(step.suggestedDuration > 0, `${skill.id} step ${i} missing suggestedDuration`);
  }
}
console.log('Step data: all complete');

// 7. Branches
const branches = [...new Set(SKILLS.map(s => s.branch))];
console.log(`Branches: ${branches.join(', ')}`);
check(branches.length === 6, `Expected 6 branches, got ${branches.length}`);

// 8. Auto-unlocked skills (no prereqs)
const autoUnlocked = SKILLS.filter(s => s.prerequisites.length === 0);
console.log(`Auto-unlocked: ${autoUnlocked.map(s => s.id).join(', ')}`);
check(autoUnlocked.some(s => s.id === 'marker'), 'marker should be auto-unlocked');

// 9. Future skills
const future = SKILLS.filter(s => s.future);
console.log(`Future skills: ${future.map(s => s.id).join(', ')}`);
check(future.length === 6, `Expected 6 future skills, got ${future.length}`);

// 10. Guided skills (non-future)
const guided = SKILLS.filter(s => !s.future);
console.log(`Guided skills: ${guided.length}`);
check(guided.length === 16, `Expected 16 guided skills, got ${guided.length}`);

// 11. Skill abbreviations are all 2 chars
for (const skill of SKILLS) {
  check(skill.abbr.length === 2, `${skill.id} abbr "${skill.abbr}" is not 2 chars`);
}
console.log('Abbreviations: all 2-char');

// 12. Assessment categories
console.log(`Assessment categories: ${ASSESSMENT_CATEGORIES.length}`);
check(ASSESSMENT_CATEGORIES.length === 6, `Expected 6 categories`);

// 13. Inscriptions
console.log(`Inscriptions: ${INSCRIPTIONS.length}`);
check(INSCRIPTIONS.length >= 10, `Expected at least 10 inscriptions`);

// 14. neverCompletes flag
const neverComplete = SKILLS.filter(s => s.neverCompletes);
console.log(`Never-completes: ${neverComplete.map(s => s.id).join(', ')}`);
check(neverComplete.some(s => s.id === 'eyecontact'), 'eyecontact should have neverCompletes');

// 15. Session types
const sessionTypes = [...new Set(SKILLS.map(s => s.sessionType))];
console.log(`Session types: ${sessionTypes.join(', ')}`);
check(sessionTypes.includes('mealtime'), 'Should have mealtime session type');
check(sessionTypes.includes('calm'), 'Should have calm session type');

console.log(`\n--- Result: ${errors === 0 ? 'ALL PASSED' : errors + ' ERRORS'} ---`);
process.exit(errors > 0 ? 1 : 0);
