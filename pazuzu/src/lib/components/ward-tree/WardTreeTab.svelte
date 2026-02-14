<script lang="ts">
  import { skillStates } from '../../stores/skills';
  import type { SkillState } from '../../stores/skills';
  import { TREE_NODES, TREE_CONNECTIONS, BRANCH_LABELS } from '../../data/tree-layout';
  import { SKILL_MAP } from '../../data/skills';
  import { setSkillStep, sealSkill, unsealSkill } from '../../stores/app';
  import { tick } from 'svelte';

  let { showtoast }: {
    showtoast: (msg: string, action?: string, onaction?: () => void) => void;
  } = $props();

  let viewMode: 'tree' | 'list' = $state('tree');
  let selectedSkillId: string | null = $state(null);
  let detailEl: HTMLElement | undefined = $state(undefined);
  let expandedListId: string | null = $state(null);

  const BRANCHES = ['foundation', 'stillness', 'impulse', 'world', 'body', 'voice'] as const;

  function nodeClass(skillId: string): string {
    const state = $skillStates[skillId];
    if (!state) return 'locked';
    if (state.sealed) return 'sealed';
    if (state.started) return 'in-progress';
    if (state.unlocked) return 'available';
    return 'locked';
  }

  function lineClass(from: string, to: string): string {
    const fromState = $skillStates[from];
    const toState = $skillStates[to];
    if (fromState?.sealed && toState?.sealed) return 'sealed';
    if (fromState?.sealed || fromState?.started) return 'active';
    return '';
  }

  function getNodePos(skillId: string) {
    return TREE_NODES.find(n => n.skillId === skillId);
  }

  async function selectNode(skillId: string) {
    if (selectedSkillId === skillId) {
      selectedSkillId = null;
      return;
    }
    selectedSkillId = skillId;
    await tick();
    detailEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  let selectedState = $derived(selectedSkillId ? $skillStates[selectedSkillId] : null);
  let selectedSkill = $derived(selectedSkillId ? SKILL_MAP[selectedSkillId] : null);

  function adjustStep(delta: number) {
    if (!selectedSkillId || !selectedSkill || !selectedState) return;
    const newStep = selectedState.step + delta;
    if (newStep >= selectedSkill.steps.length) {
      sealSkill(selectedSkillId);
      showtoast(`${selectedSkill.name} sealed!`);
    } else {
      setSkillStep(selectedSkillId, Math.max(0, newStep));
      showtoast(`${selectedSkill.name} → Step ${newStep + 1}`);
    }
  }

  // List view: grouped skills by branch
  let groupedSkills = $derived.by(() => {
    const groups: Record<string, { id: string; state: SkillState }[]> = {};
    for (const branch of BRANCHES) {
      groups[branch] = [];
    }
    for (const [id, state] of Object.entries($skillStates)) {
      const branch = state.skill.branch.toLowerCase();
      if (groups[branch]) {
        groups[branch].push({ id, state });
      }
    }
    for (const branch of BRANCHES) {
      groups[branch].sort((a, b) => a.state.skill.name.localeCompare(b.state.skill.name));
    }
    return groups;
  });

  function adjustSkillStep(skillId: string, delta: number) {
    const state = $skillStates[skillId];
    if (!state || !state.unlocked || state.sealed) return;
    const newStep = state.step + delta;
    if (newStep >= state.totalSteps) {
      sealSkill(skillId);
      showtoast(`${state.skill.name} sealed!`);
    } else if (newStep >= 0) {
      setSkillStep(skillId, newStep);
      showtoast(`${state.skill.name} → Step ${newStep + 1}`);
    }
  }

  function toggleListExpand(id: string) {
    expandedListId = expandedListId === id ? null : id;
  }
</script>

<div class="wardtree-tab">
  <h2 style="text-align:center; margin-bottom: 8px;">Pazuzu's Shield</h2>
  <div class="label" style="text-align:center;">The Ward Tree</div>

  <!-- View mode toggle -->
  <div class="view-toggle">
    <button
      class="toggle-btn"
      class:toggle-active={viewMode === 'tree'}
      onclick={() => viewMode = 'tree'}
    >Tree</button>
    <button
      class="toggle-btn"
      class:toggle-active={viewMode === 'list'}
      onclick={() => viewMode = 'list'}
    >List</button>
  </div>

  {#if viewMode === 'tree'}
    <div class="tree-container">
      <svg class="tree-svg" viewBox="0 0 440 600" width="440" height="600">
        <!-- Branch labels -->
        {#each BRANCH_LABELS as bl}
          <text
            x={bl.x} y={bl.y}
            text-anchor="middle"
            font-family="var(--font-d)"
            font-size="11"
            fill="var(--txt3)"
            font-weight="600"
          >{bl.label}</text>
        {/each}

        <!-- Connection lines -->
        {#each TREE_CONNECTIONS as conn}
          {@const from = getNodePos(conn.from)}
          {@const to = getNodePos(conn.to)}
          {#if from && to}
            <line
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              class="tree-line {lineClass(conn.from, conn.to)}"
            />
          {/if}
        {/each}

        <!-- Nodes -->
        {#each TREE_NODES as node}
          {@const state = $skillStates[node.skillId]}
          {@const skill = SKILL_MAP[node.skillId]}
          {#if skill}
            <g
              class="tree-node {nodeClass(node.skillId)}"
              class:selected={selectedSkillId === node.skillId}
              transform="translate({node.x}, {node.y})"
              onclick={() => selectNode(node.skillId)}
              role="button"
              tabindex="0"
              onkeydown={(e) => { if (e.key === 'Enter') selectNode(node.skillId); }}
            >
              <!-- Invisible touch target -->
              <circle r="32" fill="transparent" />
              {#if nodeClass(node.skillId) === 'available'}
                <circle class="pulse-ring" r="30" />
              {/if}
              {#if selectedSkillId === node.skillId}
                <circle class="selection-ring" r="30" />
              {/if}
              {#if state && state.started && !state.sealed}
                <!-- Progress arc -->
                {@const pct = state.progress}
                {@const r = 26}
                {@const circ = 2 * Math.PI * r}
                <circle
                  class="progress-arc"
                  r={r}
                  fill="none"
                  stroke="var(--acc)"
                  stroke-width="4"
                  stroke-dasharray="{circ * pct} {circ * (1 - pct)}"
                  stroke-dashoffset={circ * 0.25}
                  stroke-linecap="round"
                />
              {/if}
              <circle class="node-bg" r="24" />
              <text dy="1">{skill.abbr}</text>
            </g>
          {/if}
        {/each}
      </svg>
    </div>

    <!-- Inline Detail Panel -->
    {#if selectedSkill && selectedState}
      <div class="detail-panel" bind:this={detailEl}>
        <div class="detail-header">
          <h3>{selectedSkill.name}</h3>
          <button class="detail-close" onclick={() => selectedSkillId = null} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="detail-status">
          {#if selectedState.sealed}
            <span class="badge badge-ok">Sealed</span>
          {:else if selectedState.started}
            <span class="badge badge-warn">Step {selectedState.step + 1} / {selectedState.totalSteps}</span>
          {:else if selectedState.unlocked}
            <span class="badge" style="background: var(--pri-glow); color: var(--pri);">Available</span>
          {:else}
            <span class="badge" style="background: var(--card2); color: var(--txt3);">Locked</span>
          {/if}
          <span class="label" style="margin-left: 8px;">{selectedSkill.branch}</span>
        </div>

        <p class="detail-desc">{selectedSkill.description}</p>

        {#if selectedSkill.connections}
          <div class="detail-section">
            <div class="label">Connections</div>
            <p class="detail-text">{selectedSkill.connections}</p>
          </div>
        {/if}

        {#if !selectedState.unlocked && selectedSkill.prerequisites.length > 0}
          <div class="detail-section">
            <div class="label">Requires</div>
            {#each selectedSkill.prerequisites as prereq}
              {@const pSkill = SKILL_MAP[prereq.skillId]}
              <p class="detail-text">
                {pSkill?.name || prereq.skillId}
                {#if prereq.mastery} (mastered){:else if prereq.stepRequired !== undefined} (Step {prereq.stepRequired + 1}){/if}
              </p>
            {/each}
          </div>
        {/if}

        <!-- Step list -->
        <div class="detail-section">
          <div class="label">Steps</div>
          <ol class="step-list">
            {#each selectedSkill.steps as step, i}
              <li class="step-item" class:done={i < selectedState.step} class:current={i === selectedState.step} class:future={i > selectedState.step}>
                <div class="step-num">{i + 1}</div>
                <div class="step-info">
                  <div class="step-title">{step.title}</div>
                  {#if i === selectedState.step}
                    <div class="step-desc">{step.whatToDo}</div>
                  {/if}
                </div>
              </li>
            {/each}
          </ol>
        </div>

        <!-- Action buttons -->
        {#if selectedState.unlocked && !selectedState.sealed}
          <div class="detail-actions">
            <button class="btn btn-sec" disabled={selectedState.step === 0} onclick={() => adjustStep(-1)}>
              Retreat
            </button>
            <button class="btn btn-pri" onclick={() => adjustStep(1)}>
              {selectedState.step + 1 >= selectedSkill.steps.length ? 'Seal Ward' : 'Advance'}
            </button>
          </div>
        {/if}
        {#if selectedState.sealed}
          <div class="detail-actions">
            <button class="btn btn-ghost" onclick={() => unsealSkill(selectedSkillId!)}>Unseal</button>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <!-- List View -->
    <div class="ward-list-view">
      {#each BRANCHES as branch}
        {@const skills = groupedSkills[branch]}
        {#if skills.length > 0}
          <div class="branch-group">
            <div class="branch-header">{branch.charAt(0).toUpperCase() + branch.slice(1)}</div>
            {#each skills as { id, state }}
              <div
                class="ward-row"
                class:ward-row-expanded={expandedListId === id}
                onclick={() => toggleListExpand(id)}
                role="button"
                tabindex="0"
                onkeydown={(e) => { if (e.key === 'Enter') toggleListExpand(id); }}
              >
                <div class="ward-abbr" class:ward-sealed={state.sealed}>{state.skill.abbr}</div>
                <div class="ward-info">
                  <div class="ward-name">{state.skill.name}</div>
                  <div class="ward-meta">
                    {#if state.sealed}
                      <span class="ward-status-ok">Sealed</span>
                    {:else if state.started}
                      In Progress
                    {:else if state.unlocked}
                      Available
                    {:else}
                      <span class="ward-status-locked">Locked</span>
                    {/if}
                  </div>
                </div>
                {#if state.unlocked && !state.sealed}
                  <div class="ward-step">Step {state.step + 1}/{state.totalSteps}</div>
                  <button class="ward-adj" disabled={state.step === 0} onclick={(e) => { e.stopPropagation(); adjustSkillStep(id, -1); }} aria-label="Retreat step">&minus;</button>
                  <button class="ward-adj ward-adj-plus" onclick={(e) => { e.stopPropagation(); adjustSkillStep(id, 1); }} aria-label="Advance step">+</button>
                {:else if state.sealed}
                  <div class="ward-step ward-status-ok">Done</div>
                {:else}
                  <div class="ward-step ward-status-locked">--</div>
                {/if}
              </div>
              {#if expandedListId === id}
                <div class="ward-expand">
                  <p class="ward-expand-desc">{state.skill.description}</p>
                  {#if state.unlocked && !state.sealed}
                    <div class="ward-expand-step">
                      <span class="label">Current:</span> Step {state.step + 1} — {state.skill.steps[state.step]?.title ?? ''}
                    </div>
                  {:else if state.sealed}
                    <div class="ward-expand-step">
                      <span class="label">Status:</span> All {state.totalSteps} steps complete
                    </div>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .wardtree-tab { padding: 16px 16px 100px; }

  /* View toggle */
  .view-toggle {
    display: flex; justify-content: center; gap: 0;
    margin: 12px auto 16px;
    background: var(--card2);
    border-radius: 20px;
    padding: 3px;
    width: fit-content;
    border: 1px solid var(--brd);
  }
  .toggle-btn {
    padding: 6px 20px;
    border-radius: 17px;
    border: none;
    background: transparent;
    color: var(--txt3);
    font-family: var(--font-b);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 32px;
    transition: background 0.15s, color 0.15s;
  }
  .toggle-active {
    background: var(--pri);
    color: var(--bg);
  }

  /* Tree */
  .tree-container { width: 100%; overflow-y: auto; padding: 8px 0; }
  .tree-svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }

  :global(.tree-line) { stroke: var(--brd); stroke-width: 2.5; stroke-dasharray: 4,4; }
  :global(.tree-line.active) { stroke: var(--pri-dim); stroke-dasharray: none; }
  :global(.tree-line.sealed) { stroke: var(--pri); stroke-dasharray: none; }

  :global(.tree-node) { cursor: pointer; }
  :global(.tree-node circle.node-bg) { stroke-width: 2; transition: all 0.3s; }
  :global(.tree-node text) {
    font-family: var(--font-d); font-size: 12px; fill: var(--txt);
    font-weight: 700; pointer-events: none;
    text-anchor: middle; dominant-baseline: central;
  }

  :global(.tree-node.locked circle.node-bg) { fill: #1A1A2A; stroke: var(--txt3); }
  :global(.tree-node.locked text) { fill: var(--txt3); }
  :global(.tree-node.available circle.node-bg) { fill: var(--card2); stroke: var(--pri); }
  :global(.tree-node.in-progress circle.node-bg) { fill: rgba(212,168,83,0.3); stroke: var(--pri); }
  :global(.tree-node.in-progress) { filter: drop-shadow(0 0 4px rgba(212,168,83,0.3)); }
  :global(.tree-node.sealed circle.node-bg) { fill: var(--pri); stroke: var(--pri); }
  :global(.tree-node.sealed text) { fill: var(--bg); }
  :global(.tree-node.sealed) { filter: drop-shadow(0 0 10px rgba(212,168,83,0.6)); }

  :global(.tree-node.selected circle.node-bg) {
    stroke-width: 3;
  }

  :global(.selection-ring) {
    fill: none; stroke: var(--pri); stroke-width: 2; opacity: 0.6;
  }

  :global(.pulse-ring) {
    fill: none; stroke: var(--pri); opacity: 0.4;
    animation: nodePulse 2s infinite;
  }
  @keyframes nodePulse {
    0%, 100% { opacity: 0.15; stroke-width: 2; }
    50% { opacity: 0.6; stroke-width: 4; }
  }

  :global(.progress-arc) { fill: none; stroke: var(--acc); stroke-width: 4; stroke-linecap: round; }

  /* Inline detail panel */
  .detail-panel {
    background: var(--card);
    border: 1px solid var(--brd);
    border-top: 3px solid var(--pri);
    border-radius: var(--r2);
    padding: 16px;
    margin-top: 12px;
    animation: panelSlideIn 0.25s ease;
  }
  @keyframes panelSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .detail-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px;
  }
  .detail-header h3 { margin: 0; font-size: 1rem; }
  .detail-close {
    background: none; border: none; color: var(--txt3);
    padding: 8px; min-width: 40px; min-height: 40px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .detail-close:active { color: var(--txt); }

  .detail-status { display: flex; align-items: center; margin-bottom: 12px; }
  .detail-desc { font-size: 0.85rem; color: var(--txt2); line-height: 1.6; margin-bottom: 12px; }
  .detail-section { margin-bottom: 14px; }
  .detail-text { font-size: 0.85rem; color: var(--txt2); margin-top: 4px; }

  .step-list { list-style: none; padding: 0; margin-top: 8px; }
  .step-item {
    display: flex; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--brd);
  }
  .step-item:last-child { border-bottom: none; }
  .step-num {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid var(--brd);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    color: var(--txt3); font-family: var(--font-d);
  }
  .step-item.done .step-num { background: var(--pri); border-color: var(--pri); color: var(--bg); }
  .step-item.current .step-num { border-color: var(--pri); color: var(--pri); }
  .step-info { flex: 1; }
  .step-title { font-weight: 600; font-size: 0.85rem; }
  .step-desc { font-size: 0.78rem; color: var(--txt2); margin-top: 2px; line-height: 1.5; }
  .step-item.future { opacity: 0.5; }

  .badge {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 10px;
    font-size: 0.7rem; font-weight: 600;
  }
  .badge-ok { background: rgba(123,198,126,0.15); color: var(--ok); }
  .badge-warn { background: rgba(232,184,75,0.15); color: var(--warn); }

  .detail-actions {
    display: flex; gap: 10px; margin-top: 16px; padding-top: 12px;
    border-top: 1px solid var(--brd);
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 10px 20px; border-radius: var(--r);
    font-family: var(--font-b); font-size: 0.85rem; font-weight: 600;
    min-height: 44px; border: none; cursor: pointer;
    transition: transform 0.1s, background 0.15s;
  }
  .btn:active { transform: scale(0.96); }
  .btn:disabled { opacity: 0.4; cursor: default; }
  .btn:disabled:active { transform: none; }
  .btn-pri { background: var(--pri); color: var(--bg); flex: 1; }
  .btn-sec { background: var(--card2); color: var(--txt2); border: 1px solid var(--brd); flex: 1; }
  .btn-ghost { background: none; color: var(--txt3); border: 1px solid var(--brd); flex: 1; }
  .btn-ghost:active { background: var(--card2); }

  /* List View */
  .ward-list-view { display: flex; flex-direction: column; gap: 4px; }

  .branch-group { margin-bottom: 8px; }
  .branch-header {
    font-family: var(--font-d); font-size: 0.72rem; font-weight: 700;
    color: var(--pri); text-transform: uppercase; letter-spacing: 0.05em;
    padding: 8px 4px 4px;
    border-bottom: 1px solid var(--pri-dim);
    margin-bottom: 2px;
  }

  .ward-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 4px; width: 100%;
    border: none; background: none;
    border-bottom: 1px solid var(--brd);
    min-height: 48px; cursor: pointer;
    text-align: left; color: var(--txt);
    transition: background 0.1s;
  }
  .ward-row:active { background: var(--card2); }
  .ward-row:last-child { border-bottom: none; }
  .ward-row-expanded { background: rgba(212,168,83,0.04); }

  .ward-abbr {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--card2); border: 1px solid var(--pri-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-d); font-size: 0.6rem; font-weight: 700;
    color: var(--pri); flex-shrink: 0;
  }
  .ward-sealed {
    background: var(--pri); border-color: var(--pri); color: var(--bg);
  }
  .ward-info { flex: 1; min-width: 0; }
  .ward-name { font-size: 0.82rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ward-meta { font-size: 0.65rem; color: var(--txt3); margin-top: 1px; }
  .ward-status-ok { color: var(--ok); }
  .ward-status-locked { color: var(--txt3); }
  .ward-step {
    font-size: 0.7rem; color: var(--txt2); white-space: nowrap;
    font-variant-numeric: tabular-nums; min-width: 52px; text-align: right;
  }
  .ward-adj {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--card2); border: 1px solid var(--brd);
    color: var(--txt2); font-size: 1rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; cursor: pointer;
    transition: transform 0.1s, background 0.1s;
  }
  .ward-adj:active { transform: scale(0.9); background: var(--input); }
  .ward-adj:disabled { opacity: 0.3; cursor: default; }
  .ward-adj:disabled:active { transform: none; background: var(--card2); }
  .ward-adj-plus { border-color: var(--pri-dim); color: var(--pri); }

  .ward-expand {
    padding: 8px 12px 12px 44px;
    border-bottom: 1px solid var(--brd);
    animation: expandIn 0.15s ease;
  }
  @keyframes expandIn {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 200px; }
  }
  .ward-expand-desc {
    font-size: 0.8rem; color: var(--txt2); line-height: 1.5;
    margin: 0 0 6px;
  }
  .ward-expand-step {
    font-size: 0.75rem; color: var(--txt3);
  }
</style>
