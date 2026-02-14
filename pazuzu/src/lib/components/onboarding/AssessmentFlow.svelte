<script lang="ts">
  import { ASSESSMENT_CATEGORIES, generateLoadout, type AssessmentResult } from '../../data/assessment';
  import { setAssessment, setSkillStep } from '../../stores/app';
  import { SKILL_MAP } from '../../data/skills';

  let { oncomplete }: { oncomplete: () => void } = $props();

  type Stage = 'welcome' | 'assess' | 'result';

  let stage: Stage = $state('welcome');
  let currentCategory = $state(0);
  let levels: Record<string, number> = $state({});

  function startAssessment() {
    stage = 'assess';
    currentCategory = 0;
    levels = {};
  }

  function selectLevel(level: number) {
    const cat = ASSESSMENT_CATEGORIES[currentCategory];
    levels[cat.id] = level;

    if (currentCategory < ASSESSMENT_CATEGORIES.length - 1) {
      currentCategory++;
    } else {
      stage = 'result';
    }
  }

  function finish() {
    const loadout = generateLoadout(levels);
    const result: AssessmentResult = {
      completedAt: new Date().toISOString(),
      levels,
      recommendedLoadout: loadout,
    };
    setAssessment(result);

    // Initialize starting skills - marker is always the first
    setSkillStep('marker', 0);

    oncomplete();
  }

  let currentCat = $derived(ASSESSMENT_CATEGORIES[currentCategory]);
  let loadout = $derived(stage === 'result' ? generateLoadout(levels) : null);
</script>

<div class="assessment">
  {#if stage === 'welcome'}
    <div class="welcome">
      <div class="welcome-icon">
        <svg viewBox="0 0 24 24" fill="var(--pri)" width="64" height="64">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
        </svg>
      </div>
      <h1>Pazuzu's Wards</h1>
      <p class="welcome-sub">Progressive reinforcement training for Zuzu</p>
      <p class="welcome-desc">
        Before we begin, let's assess where Zuzu is right now.
        For each category, mark the highest level Zuzu can do today, honestly.
      </p>
      <button class="btn btn-pri btn-lg btn-block mt-12" onclick={startAssessment}>
        Begin Assessment
      </button>
    </div>

  {:else if stage === 'assess' && currentCat}
    <div class="assess-screen">
      <div class="assess-progress">
        <div class="assess-bar" style="width: {((currentCategory + 1) / ASSESSMENT_CATEGORIES.length) * 100}%"></div>
      </div>
      <div class="label">{currentCategory + 1} of {ASSESSMENT_CATEGORIES.length}</div>
      <h2>{currentCat.name}</h2>

      <div class="level-list">
        {#each currentCat.levels as lvl}
          <button
            class="level-btn"
            class:selected={levels[currentCat.id] === lvl.level}
            onclick={() => selectLevel(lvl.level)}
          >
            <div class="level-num">L{lvl.level}</div>
            <div class="level-desc">{lvl.description}</div>
          </button>
        {/each}
      </div>
    </div>

  {:else if stage === 'result' && loadout}
    <div class="result-screen">
      <h2>Assessment Complete</h2>
      <p class="text-dim mt-8">Based on Zuzu's current abilities, here is the recommended training plan:</p>

      <div class="loadout-card mt-12">
        <div class="loadout-item primary">
          <div class="label">Primary Quest</div>
          <div class="loadout-skill">{SKILL_MAP[loadout.primaryQuest]?.name || loadout.primaryQuest}</div>
        </div>

        <div class="loadout-item">
          <div class="label">Side Quests</div>
          {#each loadout.sideQuests as sq}
            <div class="loadout-skill">{SKILL_MAP[sq]?.name || sq}</div>
          {/each}
        </div>

        <div class="loadout-item">
          <div class="label">Passive Training</div>
          <div class="loadout-skill">{SKILL_MAP[loadout.passiveTraining]?.name || loadout.passiveTraining}</div>
        </div>
      </div>

      <button class="btn btn-pri btn-lg btn-block mt-12" onclick={finish}>
        Start Training
      </button>
    </div>
  {/if}
</div>

<style>
  .assessment {
    padding: 24px 16px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .welcome {
    text-align: center;
    padding-top: 60px;
    flex: 1;
  }
  .welcome-icon {
    margin-bottom: 16px;
    filter: drop-shadow(0 0 20px rgba(212,168,83,0.3));
  }
  .welcome h1 { font-size: 1.6rem; }
  .welcome-sub { color: var(--txt2); font-size: 0.9rem; margin-top: 4px; }
  .welcome-desc {
    color: var(--txt2); font-size: 0.85rem;
    margin-top: 24px; line-height: 1.6;
  }

  .assess-screen { flex: 1; }
  .assess-progress {
    height: 4px; background: var(--card2); border-radius: 2px;
    margin-bottom: 12px; overflow: hidden;
  }
  .assess-bar {
    height: 100%; background: var(--pri); border-radius: 2px;
    transition: width 0.3s;
  }

  .level-list { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
  .level-btn {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px; background: var(--card);
    border: 2px solid var(--brd); border-radius: var(--r2);
    width: 100%; text-align: left; color: var(--txt);
    min-height: 44px;
    transition: transform 0.1s, border-color 0.15s, background 0.15s;
  }
  .level-btn:active { background: var(--card2); transform: scale(0.98); }
  .level-btn.selected {
    border-color: var(--pri);
    border-width: 3px;
    background: rgba(212,168,83,0.12);
  }
  .level-num {
    font-family: var(--font-d); font-weight: 700;
    color: var(--pri); min-width: 28px; font-size: 0.85rem;
  }
  .level-desc { font-size: 0.85rem; line-height: 1.4; }

  .result-screen { flex: 1; }
  .loadout-card {
    background: var(--card); border: 1px solid var(--brd);
    border-radius: var(--r2); padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .loadout-item { margin-bottom: 14px; }
  .loadout-item:last-child { margin-bottom: 0; }
  .loadout-item.primary { border-bottom: 1px solid var(--brd); padding-bottom: 14px; }
  .loadout-skill {
    font-family: var(--font-d); font-size: 0.95rem;
    color: var(--pri); margin-top: 4px;
  }
</style>
