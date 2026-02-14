<script lang="ts">
  import { appData, addSession, addActivity, setSkillStep } from '../../stores/app';
  import { skillStates } from '../../stores/skills';
  import { dailyPlan } from '../../stores/recommendation';
  import { checkAdvancement, applyAdvancement, type AdvancementResult } from '../../stores/advancement';
  import { SKILL_MAP, type Skill, type SkillStep } from '../../data/skills';
  import { playDing, vibrate } from '../../utils/audio';
  import { fmtDuration } from '../../utils/format';

  let { initialSkillId = '' }: { initialSkillId?: string } = $props();

  type Phase = 'suggest' | 'guide' | 'countdown' | 'timer' | 'rate' | 'summary';

  let phase: Phase = $state('suggest');
  let selectedSkillId = $state('');
  let timerSeconds = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | null = $state(null);
  let timerDuration = $state(120);
  let countdownVal = $state(3);
  let rating: 'up' | 'neutral' | 'down' = $state('neutral');
  let sessionNote = $state('');
  let advancementResult: AdvancementResult | null = $state(null);
  let usedTimer = $state(false);

  let selectedSkill: Skill | undefined = $derived(selectedSkillId ? SKILL_MAP[selectedSkillId] : undefined);
  let currentStep: number = $derived(
    selectedSkillId && $skillStates[selectedSkillId]
      ? $skillStates[selectedSkillId].step
      : 0
  );
  let currentStepData: SkillStep | undefined = $derived(
    selectedSkill ? selectedSkill.steps[currentStep] : undefined
  );

  $effect(() => {
    if (initialSkillId && initialSkillId !== selectedSkillId) {
      selectedSkillId = initialSkillId;
      phase = 'guide';
    }
  });

  function selectSkill(skillId: string) {
    selectedSkillId = skillId;
    if (!$appData.progress[skillId]) {
      setSkillStep(skillId, 0);
    }
    phase = 'guide';
  }

  function startTimer() {
    usedTimer = true;
    timerDuration = currentStepData?.suggestedDuration || selectedSkill?.sessionDuration.min || 120;
    phase = 'countdown';
    countdownVal = 3;
    const countInterval = setInterval(() => {
      countdownVal--;
      if (countdownVal <= 0) {
        clearInterval(countInterval);
        beginTimer();
      }
    }, 1000);
  }

  function beginTimer() {
    phase = 'timer';
    timerSeconds = 0;
    timerInterval = setInterval(() => {
      timerSeconds++;
      if (timerSeconds >= timerDuration) {
        endTimer();
      }
    }, 1000);
  }

  function endTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if ($appData.settings.soundEnabled) {
      playDing();
      vibrate(300);
    }
    phase = 'rate';
  }

  function skipTimer() {
    usedTimer = false;
    phase = 'rate';
  }

  function submitRating() {
    if (!selectedSkillId || !selectedSkill) return;

    addSession({
      skillId: selectedSkillId,
      dt: new Date().toISOString(),
      step: currentStep,
      duration: usedTimer ? timerSeconds : 0,
      rating,
      note: sessionNote,
      usedTimer,
    });

    addActivity({
      dt: new Date().toISOString(),
      type: 'training',
      subtype: selectedSkill.name,
      duration: usedTimer ? Math.round(timerSeconds / 60) : undefined,
    });

    // Check advancement
    advancementResult = checkAdvancement(selectedSkillId, currentStep, selectedSkill);
    phase = 'summary';
  }

  function handleAdvancement() {
    if (advancementResult && selectedSkillId && selectedSkill) {
      applyAdvancement(selectedSkillId, currentStep, selectedSkill, advancementResult);
    }
    resetSession();
  }

  function resetSession() {
    phase = 'suggest';
    selectedSkillId = '';
    rating = 'neutral';
    sessionNote = '';
    advancementResult = null;
    usedTimer = false;
    timerSeconds = 0;
  }
</script>

<div class="ritual-tab">
  {#if phase === 'suggest'}
    <h2>Begin a Ritual</h2>
    <p class="text-dim mt-8">Choose a Ward from today's Rite, or pick any available Ward.</p>

    <div class="section mt-12">
      <div class="label mb-8">Today's Rite</div>
      {#each $dailyPlan as rec}
        <button class="rite-item" onclick={() => selectSkill(rec.skillId)}>
          <div class="rite-abbr">{rec.skill.abbr}</div>
          <div class="rite-info">
            <div class="rite-name">{rec.skill.name}</div>
            <div class="rite-reason">{rec.reason}</div>
          </div>
          <div class="rite-dur">{fmtDuration(rec.duration)}</div>
        </button>
      {/each}
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="label mb-8">All Available Wards</div>
      {#each Object.values($skillStates).filter(s => s.unlocked && !s.sealed && !s.skill.future) as state}
        <button class="rite-item" onclick={() => selectSkill(state.skill.id)}>
          <div class="rite-abbr">{state.skill.abbr}</div>
          <div class="rite-info">
            <div class="rite-name">{state.skill.name}</div>
            <div class="rite-reason">Step {state.step + 1}/{state.totalSteps}</div>
          </div>
        </button>
      {/each}
    </div>

  {:else if phase === 'guide'}
    {#if selectedSkill && currentStepData}
      <div class="guide-header">
        <button class="btn-back" onclick={() => phase = 'suggest'}>&larr;</button>
        <div>
          <h2>{selectedSkill.name}</h2>
          <div class="label">Step {currentStep + 1} of {selectedSkill.steps.length}: {currentStepData.title}</div>
        </div>
      </div>

      <div class="guide-card">
        <h3>What to Do</h3>
        <p>{currentStepData.whatToDo}</p>
      </div>

      <div class="guide-card">
        <h3>Success Looks Like</h3>
        <p>{currentStepData.successLooksLike}</p>
      </div>

      <div class="guide-card">
        <h3>When to Advance</h3>
        <p>{currentStepData.whenToAdvance}</p>
      </div>

      {#if currentStepData.whenToGoBack}
        <div class="guide-card">
          <h3>When to Go Back</h3>
          <p>{currentStepData.whenToGoBack}</p>
        </div>
      {/if}

      {#if currentStepData.commonMistakes?.length}
        <div class="guide-card">
          <h3>Common Mistakes</h3>
          <ul>
            {#each currentStepData.commonMistakes as mistake}
              <li>{mistake}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if currentStepData.tips?.length}
        <div class="guide-card">
          <h3>Tips</h3>
          <ul>
            {#each currentStepData.tips as tip}
              <li>{tip}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <div class="action-row mt-12">
        <button class="btn btn-pri btn-lg btn-block" onclick={startTimer}>
          Start Timer ({fmtDuration(currentStepData.suggestedDuration || selectedSkill.sessionDuration.min)})
        </button>
        <button class="btn btn-ghost btn-block mt-8" onclick={skipTimer}>
          I Did It (no timer)
        </button>
      </div>
    {/if}

  {:else if phase === 'countdown'}
    <div class="countdown-display">
      <span class="countdown-num">{countdownVal}</span>
    </div>

  {:else if phase === 'timer'}
    <div class="timer-display">
      <h2>{selectedSkill?.name}</h2>
      <div class="label">Step {currentStep + 1}: {currentStepData?.title}</div>
      <div class="session-timer">{fmtDuration(timerSeconds)}</div>
      <div class="timer-progress">
        <div class="timer-bar" style="width: {Math.min(100, (timerSeconds / timerDuration) * 100)}%"></div>
      </div>
      <button class="btn btn-bad mt-12" onclick={endTimer}>End Early</button>
    </div>

  {:else if phase === 'rate'}
    <div class="rate-display">
      <h2>How Did It Go?</h2>
      <div class="label mt-8">{selectedSkill?.name} &middot; Step {currentStep + 1}</div>

      <div class="rating-row mt-12">
        <button
          class="rating-btn up"
          class:selected={rating === 'up'}
          onclick={() => rating = 'up'}
        >
          <svg viewBox="0 0 24 24"><path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66a4.8 4.8 0 00-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84A2.34 2.34 0 009.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/></svg>
          <span>Went Well</span>
        </button>
        <button
          class="rating-btn neutral"
          class:selected={rating === 'neutral'}
          onclick={() => rating = 'neutral'}
        >
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="8" y1="15" x2="16" y2="15" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/></svg>
          <span>Okay</span>
        </button>
        <button
          class="rating-btn down"
          class:selected={rating === 'down'}
          onclick={() => rating = 'down'}
        >
          <svg viewBox="0 0 24 24"><path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34A2.34 2.34 0 0014.66 4H6.56c-.71 0-1.37.37-1.73.97L2.17 11.12z"/></svg>
          <span>Struggled</span>
        </button>
      </div>

      <div class="form-group mt-12">
        <label for="note">Note (optional)</label>
        <textarea id="note" bind:value={sessionNote} placeholder="How was the session?"></textarea>
      </div>

      <button class="btn btn-pri btn-block btn-lg mt-8" onclick={submitRating}>
        Complete Ritual
      </button>
    </div>

  {:else if phase === 'summary'}
    <div class="summary-display">
      <h2>Ritual Complete</h2>

      {#if advancementResult}
        <div class="advancement-card type-{advancementResult.type}">
          <p>{advancementResult.message}</p>

          {#if advancementResult.reasons}
            <div class="regression-hints mt-8">
              <div class="label">Possible reasons:</div>
              <ul>
                {#each advancementResult.reasons as reason}
                  <li>{reason}</li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if advancementResult.type === 'advance' || advancementResult.type === 'retreat1' || advancementResult.type === 'retreat2'}
            <button class="btn btn-pri btn-block mt-8" onclick={handleAdvancement}>
              {advancementResult.type === 'advance' ? 'Advance' : 'Go Back'}
            </button>
          {/if}
        </div>
      {/if}

      <button class="btn btn-sec btn-block mt-12" onclick={resetSession}>
        Train Another Ward
      </button>
    </div>
  {/if}
</div>

<style>
  .ritual-tab { padding: 16px 16px 100px; }

  .rite-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; background: var(--card);
    border: 1px solid var(--brd);
    border-radius: var(--r); cursor: pointer;
    min-height: 44px; width: 100%;
    text-align: left; color: var(--txt);
    margin-bottom: 6px;
    transition: transform 0.1s;
  }
  .rite-item:active { background: var(--card2); transform: scale(0.98); }
  .rite-abbr {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--card2); border: 1px solid var(--pri-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: 0.65rem; font-weight: 700;
    color: var(--pri); flex-shrink: 0;
  }
  .rite-info { flex: 1; }
  .rite-name { font-size: 0.85rem; }
  .rite-reason { font-size: 0.7rem; color: var(--txt2); }
  .rite-dur { font-size: 0.75rem; color: var(--txt2); }

  .guide-header {
    display: flex; gap: 12px; align-items: center; margin-bottom: 16px;
  }
  .btn-back {
    background: var(--card2); border: 1px solid var(--brd); color: var(--txt);
    width: 44px; height: 44px; border-radius: var(--r);
    font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
    transition: transform 0.1s;
  }
  .btn-back:active { transform: scale(0.95); background: var(--card); }

  .guide-card {
    background: var(--card); border: 1px solid var(--brd);
    border-left: 4px solid var(--pri-dim);
    border-radius: var(--r2); padding: 16px; margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .guide-card h3 { margin-bottom: 6px; font-size: 0.9rem; }
  .guide-card p { font-size: 0.85rem; color: var(--txt2); line-height: 1.6; }
  .guide-card ul { padding-left: 16px; font-size: 0.85rem; color: var(--txt2); }
  .guide-card li { margin-bottom: 4px; }

  .countdown-display {
    display: flex; align-items: center; justify-content: center;
    height: 60vh;
    font-family: var(--font-d); font-size: 5rem; color: var(--pri);
  }
  .countdown-num {
    animation: countPop 0.7s ease;
    text-shadow: 0 0 30px rgba(212,168,83,0.4);
  }

  .timer-display { text-align: center; padding-top: 40px; }
  .session-timer {
    font-family: var(--font-d); font-size: 3rem; color: var(--pri);
    font-variant-numeric: tabular-nums; padding: 20px 0;
    text-shadow: 0 0 20px rgba(212,168,83,0.3);
  }
  .timer-progress {
    height: 6px; background: var(--card2); border-radius: 3px; overflow: hidden;
  }
  .timer-bar {
    height: 100%; background: var(--pri); border-radius: 3px;
    transition: width 1s linear;
    box-shadow: 0 0 8px rgba(212,168,83,0.3);
  }

  .rate-display { padding-top: 20px; }
  .rating-row { display: flex; gap: 12px; justify-content: center; }
  .rating-btn {
    flex: 1; padding: 16px 8px; border-radius: var(--r3);
    border: 2px solid var(--brd); background: var(--card);
    color: var(--txt2); display: flex; flex-direction: column;
    align-items: center; gap: 8px; min-height: 90px;
    font-size: 0.8rem; font-weight: 600;
    opacity: 0.6;
    transition: transform 0.15s, opacity 0.15s, border-color 0.15s, background 0.15s;
  }
  .rating-btn svg { width: 32px; height: 32px; fill: currentColor; }
  .rating-btn.up { border-color: var(--ok); color: var(--ok); }
  .rating-btn.up svg { fill: var(--ok); }
  .rating-btn.neutral { border-color: var(--txt3); }
  .rating-btn.down { border-color: var(--bad); color: var(--bad); }
  .rating-btn.down svg { fill: var(--bad); }

  .rating-btn.selected {
    opacity: 1;
    transform: scale(1.05);
    border-width: 3px;
  }
  .rating-btn.up.selected { background: rgba(123,198,126,0.2); }
  .rating-btn.neutral.selected { background: var(--card2); border-color: var(--txt2); opacity: 1; }
  .rating-btn.down.selected { background: rgba(199,91,91,0.2); }

  .summary-display { padding-top: 20px; text-align: center; }
  .advancement-card {
    background: var(--card); border: 1px solid var(--brd);
    border-radius: var(--r2); padding: 16px; margin-top: 16px;
    text-align: left;
  }
  .advancement-card p { font-size: 0.9rem; }
  .type-advance { border-left: 4px solid var(--ok); border-color: var(--ok); }
  .type-hold { border-left: 4px solid var(--warn); }
  .type-retreat1, .type-retreat2 { border-left: 4px solid var(--bad); border-color: var(--bad); }
  .regression-hints { font-size: 0.8rem; color: var(--txt2); }
  .regression-hints ul { padding-left: 16px; }

  .action-row { text-align: center; }
  .section { margin-bottom: 8px; }
</style>
