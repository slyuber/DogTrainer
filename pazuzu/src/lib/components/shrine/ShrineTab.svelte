<script lang="ts">
  import { appData, addActivity, deleteActivity, updateData } from '../../stores/app';
  import { skillStates } from '../../stores/skills';
  import { dailyPlan } from '../../stores/recommendation';
  import { aloneRunning, startAloneTimer, stopAloneTimer } from '../../stores/alone-timer';
  import { penRunning, startPenTimer, stopPenTimer } from '../../stores/pen-timer';
  import { fmtDuration } from '../../utils/format';

  let { ongotoritual, showtoast }: {
    ongotoritual: (skillId: string) => void;
    showtoast: (msg: string, action?: string, onaction?: () => void) => void;
  } = $props();

  // Vigil streak calculation
  function getVigilStreak(): number {
    const sessions = $appData.sessions;
    if (sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

    // Check if there's a session today
    const hasTodaySession = sessions.some(s => {
      const d = new Date(s.dt);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (hasTodaySession) streak = 1;
    else {
      // Check yesterday first
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count backwards
    while (true) {
      if (streak === 0 && !hasTodaySession) {
        // Start from yesterday
      } else {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      const hasSession = sessions.some(s => {
        const d = new Date(s.dt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === checkDate.getTime();
      });
      if (!hasSession) break;
      streak++;
    }

    return streak;
  }

  function quickLog(type: string, subtype: string) {
    const id = addActivity({
      dt: new Date().toISOString(),
      type: type as any,
      subtype,
    });
    showtoast(`Logged ${subtype}`, 'Undo', () => deleteActivity(id));
  }

  function toggleAlone() {
    if ($aloneRunning) {
      stopAloneTimer();
    } else {
      startAloneTimer();
    }
  }

  function togglePen() {
    if ($penRunning) {
      stopPenTimer();
      showtoast('Pen session logged');
    } else {
      startPenTimer();
    }
  }

  const quickActions = [
    { label: 'Bed', type: 'sleep', subtype: 'bedtime', cat: 'routine' },
    { label: 'Wake', type: 'sleep', subtype: 'wakeup', cat: 'routine' },
    { label: 'Pee', type: 'potty', subtype: 'pee', cat: 'routine' },
    { label: 'Poop', type: 'potty', subtype: 'poop', cat: 'routine' },
    { label: 'Walk', type: 'walk', subtype: 'walk', cat: 'routine' },
    { label: 'Play', type: 'play', subtype: 'play', cat: 'routine' },
    { label: 'Pen', type: 'pen', subtype: 'pen', cat: 'routine' },
    { label: 'Kong', type: 'enrichment', subtype: 'kong', cat: 'care' },
    { label: 'Chew', type: 'enrichment', subtype: 'chew', cat: 'care' },
    { label: 'Snuffle', type: 'enrichment', subtype: 'snuffle mat', cat: 'care' },
    { label: 'Meal', type: 'feeding', subtype: 'meal', cat: 'care' },
    { label: 'Note', type: 'grooming', subtype: 'note', cat: 'note' },
  ];

  $effect(() => {
    // reactivity trigger
    $appData;
  });
</script>

<div class="shrine-tab">
  <!-- Profile Header -->
  <div class="shrine-profile">
    <div class="shrine-portrait">
      <svg viewBox="0 0 24 24" fill="var(--pri)" width="36" height="36">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
      </svg>
    </div>
    <div class="shrine-info">
      <h1>{$appData.profile.name}</h1>
      <div class="shrine-sub">{$appData.profile.breed} &middot; {$appData.profile.weight} kg</div>
    </div>
  </div>

  <!-- Stats Row -->
  <div class="shrine-stats">
    <div class="ss">
      <span class="sv">{getVigilStreak()}</span>
      <span class="sl">Vigil</span>
    </div>
    <div class="ss">
      <span class="sv">{Object.values($skillStates).filter(s => s.sealed).length}</span>
      <span class="sl">Sealed</span>
    </div>
    <div class="ss">
      <span class="sv">{$appData.sessions.length}</span>
      <span class="sl">Rituals</span>
    </div>
  </div>

  <!-- Daily Plan -->
  <div class="card">
    <h3>The Daily Rite</h3>
    <div class="rite-list">
      {#each $dailyPlan as rec, i}
        <button class="rite-item" class:rite-primary={i === 0} onclick={() => ongotoritual(rec.skillId)}>
          <div class="rite-abbr">{rec.skill.abbr}</div>
          <div class="rite-name">{rec.skill.name}</div>
          <div class="rite-step">{rec.reason}</div>
        </button>
      {/each}
      {#if $dailyPlan.length === 0}
        <div class="empty-state">No Wards available yet. Complete the assessment to begin.</div>
      {/if}
    </div>
  </div>

  <!-- Quick Log -->
  <div class="card">
    <h3>Quick Log</h3>
    <div class="timer-row">
      <button
        class="alone-btn"
        class:alone-active={$aloneRunning}
        onclick={toggleAlone}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-2-3.5l6-4.5-6-4.5v9z"/>
        </svg>
        {$aloneRunning ? 'End Alone' : 'Alone'}
      </button>
      <button
        class="pen-btn"
        class:pen-active={$penRunning}
        onclick={togglePen}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        </svg>
        {$penRunning ? 'End Pen' : 'Pen'}
      </button>
    </div>
    <div class="quick-grid">
      {#each quickActions as action}
        <button
          class="quick-btn cat-{action.cat}"
          onclick={() => quickLog(action.type, action.subtype)}
        >
          {action.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- IVDD Exercise Note -->
  <div class="card ivdd-card">
    <div class="label">IVDD Health Note</div>
    <div style="font-size: 0.8rem; color: var(--txt2); margin-top: 4px;">
      Goal: 30-60 min daily activity. Multiple shorter walks preferred.
      Avoid jumping on/off furniture, sustained sprinting, sudden direction changes.
    </div>
  </div>
</div>

<style>
  .shrine-tab { padding: 16px 16px 100px; }

  .shrine-profile {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 0;
  }
  .shrine-portrait {
    width: 56px; height: 56px; border-radius: 50%;
    border: 2px solid var(--pri);
    display: flex; align-items: center; justify-content: center;
    background: var(--card);
    box-shadow: var(--glow-gold);
    flex-shrink: 0;
  }
  .shrine-info h1 { font-size: 1.2rem; margin: 0; }
  .shrine-sub { font-size: 0.75rem; color: var(--txt2); margin-top: 2px; }

  .shrine-stats {
    display: flex; gap: 16px; justify-content: center;
    margin: 8px 0 4px;
    padding: 10px 16px;
    background: var(--card);
    border: 1px solid var(--brd);
    border-radius: var(--r2);
  }
  .ss { text-align: center; flex: 1; }
  .sv {
    font-size: 1.1rem; font-weight: 700; color: var(--pri);
    font-family: var(--font-d); display: block;
  }
  .sl { font-size: 0.65rem; color: var(--txt2); }

  .rite-list { display: flex; flex-direction: column; gap: 6px; }
  .rite-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; background: var(--card2);
    border-radius: var(--r); cursor: pointer;
    min-height: 44px; border: none; width: 100%;
    text-align: left; color: var(--txt);
    transition: transform 0.1s;
  }
  .rite-item:active { background: var(--input); transform: scale(0.98); }
  .rite-primary {
    border-left: 3px solid var(--pri);
  }
  .rite-abbr {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--card); border: 1px solid var(--pri-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: 0.65rem; font-weight: 700;
    color: var(--pri);
  }
  .rite-name { font-size: 0.85rem; flex: 1; }
  .rite-step { font-size: 0.7rem; color: var(--txt2); }

  .timer-row {
    display: flex; gap: 8px; margin-bottom: 10px;
  }

  .alone-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    flex: 1; padding: 10px;
    background: var(--card2); border: 1px solid rgba(199,91,91,0.3);
    border-radius: var(--r); color: var(--bad);
    font-family: var(--font-b); font-size: 0.85rem; font-weight: 600;
    min-height: 44px;
    transition: transform 0.1s, background 0.15s;
  }
  .alone-btn:active { transform: scale(0.97); }
  .alone-active {
    background: rgba(199,91,91,0.15);
    border-color: var(--bad);
    animation: pulse 2s infinite;
  }

  .pen-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    flex: 1; padding: 10px;
    background: var(--card2); border: 1px solid rgba(78,205,196,0.3);
    border-radius: var(--r); color: var(--acc);
    font-family: var(--font-b); font-size: 0.85rem; font-weight: 600;
    min-height: 44px;
    transition: transform 0.1s, background 0.15s;
  }
  .pen-btn:active { transform: scale(0.97); }
  .pen-active {
    background: rgba(78,205,196,0.15);
    border-color: var(--acc);
    animation: pulse 2s infinite;
  }

  .quick-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
  }
  .quick-btn {
    display: flex; align-items: center; justify-content: center;
    padding: 10px 4px; border-radius: var(--r);
    border: 1px solid var(--brd); background: var(--card);
    color: var(--txt2); font-family: var(--font-b);
    font-size: 0.8rem; font-weight: 600;
    min-height: 48px; transition: transform 0.1s, background 0.1s;
  }
  .quick-btn:active { transform: scale(0.93); }
  .cat-routine {
    border-color: var(--pri-dim); color: var(--pri);
    background: rgba(212,168,83,0.06);
  }
  .cat-routine:active { background: rgba(212,168,83,0.15); }
  .cat-care {
    border-color: rgba(78,205,196,0.3); color: var(--acc);
    background: rgba(78,205,196,0.06);
  }
  .cat-care:active { background: rgba(78,205,196,0.15); }
  .cat-note {
    border-color: rgba(232,184,75,0.3); color: var(--warn);
    background: rgba(232,184,75,0.06);
  }
  .cat-note:active { background: rgba(232,184,75,0.15); }

  .ivdd-card { border-color: rgba(78,205,196,0.2); }
</style>
