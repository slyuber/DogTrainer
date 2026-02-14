<script lang="ts">
  import { appData } from '../../stores/app';
  import { skillStates } from '../../stores/skills';
  import { INSCRIPTIONS, type InscriptionContext } from '../../data/inscriptions';
  import { SKILL_MAP } from '../../data/skills';
  import { localDateStr } from '../../utils/format';

  // Heatmap: last 12 weeks of training activity
  function buildHeatmap(): { date: string; count: number }[][] {
    const weeks: { date: string; count: number }[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count sessions per day
    const counts: Record<string, number> = {};
    for (const s of $appData.sessions) {
      const day = localDateStr(new Date(s.dt));
      counts[day] = (counts[day] || 0) + 1;
    }

    // Build 12 weeks
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 83); // 12 weeks ago
    // Align to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let w = 0; w < 12; w++) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);
        const key = localDateStr(date);
        week.push({ date: key, count: counts[key] || 0 });
      }
      weeks.push(week);
    }
    return weeks;
  }

  function heatLevel(count: number): string {
    if (count === 0) return '';
    if (count <= 1) return 'l1';
    if (count <= 3) return 'l2';
    if (count <= 5) return 'l3';
    return 'l4';
  }

  // Inscriptions
  function getEarnedInscriptions() {
    const uniqueDays = new Set($appData.sessions.map(s => localDateStr(new Date(s.dt))));
    const sealedSkills = Object.entries($skillStates)
      .filter(([, s]) => s.sealed)
      .map(([id]) => id);

    // Count unique branches started
    const branchesStarted = new Set(
      Object.entries($skillStates)
        .filter(([, s]) => s.started)
        .map(([, s]) => s.skill.branch)
    );

    const ctx: InscriptionContext = {
      totalSessions: $appData.sessions.length,
      totalDays: uniqueDays.size,
      sealedSkills,
      currentStreak: getStreak(),
      skillsStarted: branchesStarted.size,
    };

    return INSCRIPTIONS.filter(ins => {
      const earned = ins.check(ctx);
      const alreadyLogged = $appData.milestones.some(m => m.inscriptionId === ins.id);
      return earned;
    });
  }

  function getStreak(): number {
    const sessions = $appData.sessions;
    if (sessions.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let check = new Date(today);

    const hasDay = (d: Date) => sessions.some(s => {
      const sd = new Date(s.dt);
      sd.setHours(0, 0, 0, 0);
      return sd.getTime() === d.getTime();
    });

    if (hasDay(check)) streak = 1;
    else check.setDate(check.getDate() - 1);

    while (true) {
      check.setDate(check.getDate() - 1);
      if (!hasDay(check)) break;
      streak++;
    }
    return streak;
  }

  // Ward progress bars
  let wardProgressList = $derived(
    Object.values($skillStates)
      .filter(s => !s.skill.future)
      .sort((a, b) => {
        // Sealed last, then by branch, then by progress
        if (a.sealed !== b.sealed) return a.sealed ? 1 : -1;
        return b.progress - a.progress;
      })
  );
</script>

<div class="chronicles-tab">
  <h2>Chronicles</h2>

  <!-- Heatmap -->
  <div class="card">
    <h3>Training Activity</h3>
    <div class="heatmap">
      {#each buildHeatmap() as week}
        <div class="heatmap-week">
          {#each week as day}
            <div class="heatmap-cell {heatLevel(day.count)}" title="{day.date}: {day.count} sessions"></div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <!-- Inscriptions -->
  <div class="card">
    <h3>Inscriptions</h3>
    {#each getEarnedInscriptions() as ins}
      <div class="inscription">
        <div class="ins-icon">{ins.id.slice(0, 2).toUpperCase()}</div>
        <div>
          <div class="ins-text">{ins.title}</div>
          <div class="ins-desc">{ins.description}</div>
        </div>
      </div>
    {/each}
    {#if getEarnedInscriptions().length === 0}
      <div class="empty-state">Complete Rituals to earn Inscriptions.</div>
    {/if}
  </div>

  <!-- Ward Progress -->
  <div class="card">
    <h3>Ward Progress</h3>
    {#each wardProgressList as state}
      <div class="ward-progress">
        <div class="abbr" class:sealed={state.sealed}>{state.skill.abbr}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width: {state.progress * 100}%"></div>
        </div>
        <div class="step-text">
          {#if state.sealed}
            Sealed
          {:else if state.started}
            {state.step + 1}/{state.totalSteps}
          {:else if state.unlocked}
            Ready
          {:else}
            Locked
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .chronicles-tab { padding: 16px 16px 100px; }

  .heatmap { display: flex; gap: 3px; overflow-x: auto; padding: 8px 0; }
  .heatmap-week { display: flex; flex-direction: column; gap: 3px; }
  .heatmap-cell {
    width: 14px; height: 14px; border-radius: 3px;
    background: var(--card2);
  }
  .heatmap-cell.l1 { background: rgba(212,168,83,0.2); }
  .heatmap-cell.l2 { background: rgba(212,168,83,0.4); }
  .heatmap-cell.l3 { background: rgba(212,168,83,0.6); }
  .heatmap-cell.l4 { background: rgba(212,168,83,0.9); }

  .inscription {
    display: flex; gap: 12px; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--brd);
  }
  .ins-icon {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(212,168,83,0.2); border: 1px solid var(--pri-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: 0.65rem; color: var(--pri);
    font-weight: 700; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(212,168,83,0.15);
  }
  .ins-text { font-family: var(--font-d); font-size: 0.85rem; color: var(--pri); }
  .ins-desc { font-size: 0.7rem; color: var(--txt2); }

  .ward-progress {
    display: flex; align-items: center; gap: 10px; padding: 8px 0;
  }
  .abbr {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--card2); border: 1px solid var(--brd);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: 0.6rem; font-weight: 700;
    color: var(--txt2); flex-shrink: 0;
  }
  .abbr.sealed {
    background: var(--pri); color: var(--bg); border-color: var(--pri);
    box-shadow: 0 0 8px rgba(212,168,83,0.2);
  }
  .bar-track {
    flex: 1; height: 8px; background: var(--card2);
    border-radius: 4px; overflow: hidden;
  }
  .bar-fill {
    height: 100%; background: var(--pri); border-radius: 4px;
    transition: width 0.3s;
  }
  .step-text { font-size: 0.75rem; color: var(--txt2); min-width: 40px; text-align: right; }
</style>
