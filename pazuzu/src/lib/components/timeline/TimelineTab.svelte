<script lang="ts">
  import { todayTimeline, getTimePeriod, periodLabels, type TimePeriod, type TimelineItem } from '../../stores/timeline';
  import { appData, addActivity, updateActivity, deleteActivity, deleteSession, deleteAloneLog, updateSession, updateAloneLog } from '../../stores/app';
  import type { ActivityType } from '../../stores/app';
  import { fmtTime, fmtDateFull, todayISO, localDateStr } from '../../utils/format';
  import Modal from '../layout/Modal.svelte';

  let showAdd = $state(false);
  let editingId: string | null = $state(null);
  let deleteTarget: TimelineItem | null = $state(null);

  // Add/edit form state
  let formType: ActivityType = $state('potty');
  let formSubtype = $state('');
  let formNote = $state('');
  let formTime = $state('');
  let formDate = $state('');
  let formDuration = $state(0);
  let editSource: 'activity' | 'session' | 'alone' = $state('activity');

  const activityTypes: { type: ActivityType; label: string }[] = [
    { type: 'potty', label: 'Potty' },
    { type: 'walk', label: 'Walk' },
    { type: 'play', label: 'Play' },
    { type: 'enrichment', label: 'Enrichment' },
    { type: 'feeding', label: 'Meal' },
    { type: 'cuddle', label: 'Cuddle' },
    { type: 'grooming', label: 'Grooming' },
    { type: 'alone', label: 'Alone' },
    { type: 'sleep', label: 'Sleep' },
    { type: 'pen', label: 'Pen' },
  ];

  const subtypes: Record<string, string[]> = {
    potty: ['pee', 'poop', 'both', 'accident'],
    walk: ['short walk', 'long walk', 'rollerblade', 'sniff walk'],
    play: ['tug', 'fetch', 'play with dog', 'free play'],
    enrichment: ['kong', 'chew', 'snuffle mat', 'puzzle', 'lick mat'],
    feeding: ['breakfast', 'lunch', 'dinner', 'treat'],
    cuddle: ['lap time', 'belly rub', 'brushing'],
    grooming: ['brush', 'nail check', 'ear check', 'bath'],
    alone: ['crate', 'pen', 'room'],
    sleep: ['bedtime', 'wakeup', 'nap'],
    pen: ['pen', 'playpen', 'x-pen'],
  };

  const periodOrder: TimePeriod[] = ['morning', 'afternoon', 'evening', 'night'];

  let groupedTimeline = $derived.by(() => {
    const groups: { period: TimePeriod; label: string; items: TimelineItem[] }[] = [];
    const byPeriod = new Map<TimePeriod, TimelineItem[]>();
    for (const item of $todayTimeline) {
      const p = getTimePeriod(item.dt);
      if (!byPeriod.has(p)) byPeriod.set(p, []);
      byPeriod.get(p)!.push(item);
    }
    for (const period of periodOrder) {
      const items = byPeriod.get(period);
      if (items && items.length > 0) {
        groups.push({ period, label: periodLabels[period], items });
      }
    }
    return groups;
  });

  function openAdd() {
    formType = 'potty';
    formSubtype = '';
    formNote = '';
    formTime = new Date().toTimeString().slice(0, 5);
    formDate = todayISO();
    formDuration = 0;
    editingId = null;
    editSource = 'activity';
    showAdd = true;
  }

  function openEdit(item: TimelineItem) {
    const d = new Date(item.dt);
    formTime = d.toTimeString().slice(0, 5);
    formDate = localDateStr(d);
    editingId = item.id;
    editSource = item.source;

    if (item.source === 'activity') {
      const entry = $appData.activityLog.find(e => e.id === item.id);
      if (!entry) return;
      formType = entry.type;
      formSubtype = entry.subtype;
      formNote = entry.note || '';
      formDuration = entry.duration || 0;
    } else if (item.source === 'session') {
      const session = $appData.sessions.find(s => s.id === item.id);
      if (!session) return;
      formType = 'training' as ActivityType;
      formSubtype = session.skillId;
      formNote = session.note || '';
      formDuration = session.duration || 0;
    } else if (item.source === 'alone') {
      const log = $appData.aloneLogs.find(l => l.id === item.id);
      if (!log) return;
      formType = 'alone';
      formSubtype = 'alone';
      formNote = log.note || '';
      formDuration = Math.round(log.duration / 60);
    }
    showAdd = true;
  }

  function saveEntry() {
    const dt = new Date(`${formDate}T${formTime}`).toISOString();

    if (editingId) {
      if (editSource === 'activity') {
        updateActivity(editingId, {
          type: formType,
          subtype: formSubtype || formType,
          dt,
          note: formNote || undefined,
          duration: formDuration || undefined,
        });
      } else if (editSource === 'session') {
        updateSession(editingId, {
          dt,
          note: formNote || undefined,
          duration: formDuration || undefined,
        });
      } else if (editSource === 'alone') {
        updateAloneLog(editingId, {
          dt,
          note: formNote || undefined,
          duration: formDuration ? formDuration * 60 : undefined,
        });
      }
    } else {
      addActivity({
        dt,
        type: formType,
        subtype: formSubtype || formType,
        note: formNote || undefined,
        duration: formDuration || undefined,
      });
    }
    showAdd = false;
  }

  function handleDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.source === 'activity') deleteActivity(deleteTarget.id);
    else if (deleteTarget.source === 'session') deleteSession(deleteTarget.id);
    else if (deleteTarget.source === 'alone') deleteAloneLog(deleteTarget.id);
    deleteTarget = null;
  }

  const typeBadgeColors: Record<string, string> = {
    training: 'var(--pri)',
    potty: 'var(--ok)',
    walk: 'var(--acc)',
    play: 'var(--acc)',
    enrichment: 'var(--warn)',
    feeding: 'var(--warn)',
    cuddle: 'var(--pri)',
    grooming: 'var(--acc)',
    alone: 'var(--bad)',
    sleep: 'var(--pri)',
    pen: 'var(--acc)',
    session: 'var(--pri)',
  };
</script>

<div class="timeline-tab">
  <div class="timeline-header">
    <h2>Timeline</h2>
    <div class="label">{fmtDateFull(new Date().toISOString())}</div>
  </div>

  <div class="timeline-list">
    {#each groupedTimeline as group}
      <div class="period-header">{group.label}</div>
      {#each group.items as item, i}
        <div class="timeline-entry">
          <div class="te-track">
            <div class="te-dot" style="background: {typeBadgeColors[item.type] || 'var(--txt3)'}; box-shadow: 0 0 6px {typeBadgeColors[item.type] || 'var(--txt3)'}"></div>
            {#if i < group.items.length - 1}
              <div class="te-line" style="background: {typeBadgeColors[item.type] || 'var(--txt3)'}"></div>
            {/if}
          </div>
          <button
            class="te-body"
            onclick={() => openEdit(item)}
          >
            <div class="te-time">{fmtTime(item.dt)}</div>
            <div class="te-content">
              <div class="te-label">{item.label}</div>
              {#if item.detail}
                <div class="te-detail">{item.detail}</div>
              {/if}
            </div>
          </button>
          <button class="te-delete" onclick={() => deleteTarget = item} aria-label="Delete entry">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      {/each}
    {/each}

    {#if $todayTimeline.length === 0}
      <div class="empty-state">No activities logged today. Tap + to add one.</div>
    {/if}
  </div>

  <button class="fab" onclick={openAdd}>+</button>
</div>

<!-- Add/Edit Modal -->
<Modal open={showAdd} title={editingId ? 'Edit Entry' : 'Add Entry'} onclose={() => showAdd = false}>
  {#if editSource === 'activity' || !editingId}
    <div class="chip-group mb-8">
      {#each activityTypes as at}
        <button
          class="chip"
          class:active={formType === at.type}
          onclick={() => { formType = at.type; formSubtype = ''; }}
        >
          {at.label}
        </button>
      {/each}
    </div>

    {#if subtypes[formType]}
      <div class="chip-group mb-8">
        {#each subtypes[formType] as sub}
          <button
            class="chip"
            class:active={formSubtype === sub}
            onclick={() => formSubtype = sub}
          >
            {sub}
          </button>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="label" style="margin-bottom: 12px;">
      Editing {editSource === 'session' ? 'Training Session' : 'Alone Log'}
    </div>
  {/if}

  <div class="form-row">
    <div class="form-group" style="flex:1">
      <label for="entry-date">Date</label>
      <input id="entry-date" type="date" bind:value={formDate} />
    </div>
    <div class="form-group" style="flex:1">
      <label for="entry-time">Time</label>
      <input id="entry-time" type="time" bind:value={formTime} />
    </div>
  </div>

  {#if ['walk', 'play', 'alone', 'enrichment', 'pen'].includes(formType)}
    <div class="form-group">
      <label for="entry-dur">Duration (minutes)</label>
      <input id="entry-dur" type="number" bind:value={formDuration} min="0" max="180" />
    </div>
  {/if}

  <div class="form-group">
    <label for="entry-note">Note</label>
    <textarea id="entry-note" bind:value={formNote} placeholder="Optional note..."></textarea>
  </div>

  <button class="btn btn-pri btn-block" onclick={saveEntry}>
    {editingId ? 'Update' : 'Add'}
  </button>
</Modal>

<!-- Delete Confirmation -->
<Modal open={!!deleteTarget} title="Delete Entry?" onclose={() => deleteTarget = null}>
  <p style="color: var(--txt2); margin-bottom: 16px;">This cannot be undone.</p>
  <div style="display: flex; gap: 10px;">
    <button class="btn btn-sec" style="flex:1" onclick={() => deleteTarget = null}>Cancel</button>
    <button class="btn btn-bad" style="flex:1" onclick={handleDelete}>Delete</button>
  </div>
</Modal>

<style>
  .timeline-tab { padding: 16px 16px 100px; position: relative; }

  .timeline-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }

  .timeline-list { display: flex; flex-direction: column; }

  .period-header {
    font-family: var(--font-d);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--txt3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 12px 0 6px 28px;
  }

  .timeline-entry {
    display: flex;
    align-items: stretch;
    min-height: 52px;
  }

  .te-track {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20px;
    flex-shrink: 0;
    padding-top: 16px;
  }
  .te-dot {
    width: 12px; height: 12px; border-radius: 50%;
    flex-shrink: 0;
  }
  .te-line {
    width: 2px;
    flex: 1;
    opacity: 0.3;
    margin: 2px 0;
  }

  .te-body {
    display: flex; gap: 10px; align-items: flex-start;
    flex: 1;
    padding: 10px 0 10px 8px;
    border: none; background: none;
    text-align: left; color: var(--txt);
    cursor: pointer;
    min-height: 44px;
    transition: background 0.15s;
  }
  .te-body:active { background: var(--card); border-radius: var(--r); }

  .te-time {
    font-size: 0.8rem; color: var(--txt2); min-width: 55px;
    font-variant-numeric: tabular-nums; padding-top: 2px;
  }
  .te-content { flex: 1; }
  .te-label { font-size: 0.85rem; font-weight: 500; }
  .te-detail { font-size: 0.75rem; color: var(--txt2); margin-top: 2px; }

  .te-delete {
    display: flex; align-items: center; justify-content: center;
    width: 36px; flex-shrink: 0;
    background: none; border: none;
    color: var(--txt3); cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.15s, color 0.15s;
  }
  .te-delete:active { opacity: 1; color: var(--bad); }

  .fab {
    position: fixed; bottom: 80px; right: 20px;
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--pri); color: var(--bg);
    font-size: 1.5rem; font-weight: 700;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4), var(--glow-gold-strong);
    display: flex; align-items: center; justify-content: center;
    z-index: 50;
    transition: transform 0.1s;
  }
  .fab:active { transform: scale(0.92); }

  .chip-group { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .chip {
    padding: 8px 14px; border-radius: 20px;
    background: var(--card2); border: 1px solid var(--brd);
    color: var(--txt2); font-size: 0.8rem; cursor: pointer;
    min-height: 40px; display: flex; align-items: center;
    transition: transform 0.1s, background 0.15s;
  }
  .chip:active { transform: scale(0.95); }
  .chip.active { background: var(--pri); color: var(--bg); border-color: var(--pri); }

  .form-row { display: flex; gap: 10px; }
</style>
