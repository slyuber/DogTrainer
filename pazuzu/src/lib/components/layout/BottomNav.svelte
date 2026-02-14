<script lang="ts">
  interface Props {
    activeTab: string;
    onswitch: (tab: string) => void;
  }
  let { activeTab, onswitch }: Props = $props();

  const tabs = [
    { id: 'shrine', label: 'Shrine', icon: 'M3 21h18v-2H3v2zm2-4h14v-2H5v2zm2-4h10v-2H7v2zm3-4h4V7h-4v2z' },
    { id: 'wardtree', label: 'Wards', icon: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z' },
    { id: 'ritual', label: 'Ritual', icon: 'M12 2c-1 6-7 8-7 13a7 7 0 0014 0c0-5-6-7-7-13z' },
    { id: 'timeline', label: 'Timeline', icon: 'M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 4h8v2H8V6zm0 4h8v2H8v-2zm0 4h5v2H8v-2z' },
    { id: 'chronicles', label: 'Chronicles', icon: 'M3 20h2v-8H3v8zm4 0h2V10H7v10zm4 0h2V4h-2v16zm4 0h2v-12h-2v12zm4 0h2v-6h-2v6z' },
  ];
</script>

<nav class="bottom-nav">
  {#each tabs as tab}
    <button
      class="nav-btn"
      class:active={activeTab === tab.id}
      onclick={() => onswitch(tab.id)}
    >
      <div class="nav-indicator" class:active={activeTab === tab.id}>
        <svg viewBox="0 0 24 24"><path d={tab.icon}/></svg>
        <span>{tab.label}</span>
      </div>
    </button>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    display: flex;
    background: var(--card);
    border-top: 1px solid var(--brd);
    padding: 6px 0 env(safe-area-inset-bottom, 8px);
    z-index: 100;
  }
  .nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: none;
    border: none;
    color: var(--txt3);
    font-family: var(--font-b);
    font-size: 0.65rem;
    min-height: 44px;
  }
  .nav-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 12px;
    border-radius: 12px;
    transition: background 0.2s, color 0.2s;
  }
  .nav-indicator.active {
    background: var(--pri-glow);
    color: var(--pri);
  }
  .nav-btn svg { width: 24px; height: 24px; fill: currentColor; }
  .nav-btn.active { color: var(--pri); }
  .nav-btn:active { opacity: 0.7; }
</style>
