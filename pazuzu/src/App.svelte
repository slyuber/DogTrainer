<script lang="ts">
  import { appData } from './lib/stores/app';
  import { initSkillMap } from './lib/stores/skills';
  import { initAloneTimer } from './lib/stores/alone-timer';
  import { initPenTimer } from './lib/stores/pen-timer';
  import { stopPenTimer } from './lib/stores/pen-timer';
  import { SKILL_MAP } from './lib/data/skills';
  import BottomNav from './lib/components/layout/BottomNav.svelte';
  import AlonePill from './lib/components/layout/AlonePill.svelte';
  import PenPill from './lib/components/layout/PenPill.svelte';
  import Toast from './lib/components/layout/Toast.svelte';
  import ShrineTab from './lib/components/shrine/ShrineTab.svelte';
  import WardTreeTab from './lib/components/ward-tree/WardTreeTab.svelte';
  import RitualTab from './lib/components/ritual/RitualTab.svelte';
  import TimelineTab from './lib/components/timeline/TimelineTab.svelte';
  import ChroniclesTab from './lib/components/chronicles/ChroniclesTab.svelte';
  import AssessmentFlow from './lib/components/onboarding/AssessmentFlow.svelte';
  import { stopAloneTimer } from './lib/stores/alone-timer';

  // Initialize skill map for derived stores
  initSkillMap(SKILL_MAP);
  initAloneTimer();
  initPenTimer();

  let activeTab = $state('shrine');
  let toastMsg = $state('');
  let toastAction = $state('');
  let toastCallback: (() => void) | null = $state(null);
  let ritualSkillId = $state('');

  let showOnboarding = $derived(!$appData.assessment);

  function switchTab(tab: string) {
    activeTab = tab;
  }

  function gotoRitual(skillId: string) {
    ritualSkillId = skillId;
    activeTab = 'ritual';
  }

  function showToast(msg: string, action?: string, onaction?: () => void) {
    toastMsg = msg;
    toastAction = action || '';
    toastCallback = onaction || null;
    const delay = action ? 4000 : 3000;
    setTimeout(() => { toastMsg = ''; toastAction = ''; toastCallback = null; }, delay);
  }

  function handleAlonePillClick() {
    stopAloneTimer();
    showToast('Alone session logged');
  }

  function handlePenPillClick() {
    stopPenTimer();
    showToast('Pen session logged');
  }

  function onboardingComplete() {
    showToast('Assessment complete! Your training plan is ready.');
  }
</script>

{#if showOnboarding}
  <AssessmentFlow oncomplete={onboardingComplete} />
{:else}
  <AlonePill onclick={handleAlonePillClick} />
  <PenPill onclick={handlePenPillClick} />

  <div class="tab-panel" class:active={activeTab === 'shrine'}>
    {#if activeTab === 'shrine'}
      <ShrineTab ongotoritual={gotoRitual} showtoast={showToast} />
    {/if}
  </div>

  <div class="tab-panel" class:active={activeTab === 'wardtree'}>
    {#if activeTab === 'wardtree'}
      <WardTreeTab showtoast={showToast} />
    {/if}
  </div>

  <div class="tab-panel" class:active={activeTab === 'ritual'}>
    {#if activeTab === 'ritual'}
      <RitualTab initialSkillId={ritualSkillId} />
    {/if}
  </div>

  <div class="tab-panel" class:active={activeTab === 'timeline'}>
    {#if activeTab === 'timeline'}
      <TimelineTab />
    {/if}
  </div>

  <div class="tab-panel" class:active={activeTab === 'chronicles'}>
    {#if activeTab === 'chronicles'}
      <ChroniclesTab />
    {/if}
  </div>

  <BottomNav {activeTab} onswitch={switchTab} />
{/if}

<Toast message={toastMsg} action={toastAction} onaction={toastCallback || (() => {})} />

<style>
  .tab-panel {
    display: none;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .tab-panel.active {
    display: block;
  }
</style>
