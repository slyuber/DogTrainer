<script lang="ts">
  import { aloneElapsed, aloneRunning } from '../../stores/alone-timer';
  import { fmtDuration } from '../../utils/format';

  let { onclick }: { onclick: () => void } = $props();
</script>

{#if $aloneRunning}
  <button class="alone-pill" onclick={onclick}>
    <span class="dot"></span>
    <span>Alone</span>
    <span class="timer-display">{fmtDuration($aloneElapsed)}</span>
  </button>
{/if}

<style>
  .alone-pill {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 150;
    background: var(--card);
    border: 1px solid var(--bad);
    border-radius: 24px;
    padding: 8px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    color: var(--txt);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--bad);
    animation: pulse 1.5s infinite;
  }
  .timer-display {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
</style>
