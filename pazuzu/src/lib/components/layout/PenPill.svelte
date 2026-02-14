<script lang="ts">
  import { penElapsed, penRunning } from '../../stores/pen-timer';
  import { fmtDuration } from '../../utils/format';

  let { onclick }: { onclick: () => void } = $props();
</script>

{#if $penRunning}
  <button class="pen-pill" onclick={onclick}>
    <span class="dot"></span>
    <span>Pen</span>
    <span class="timer-display">{fmtDuration($penElapsed)}</span>
  </button>
{/if}

<style>
  .pen-pill {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 150;
    background: var(--card);
    border: 1px solid var(--acc);
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
    background: var(--acc);
    animation: pulse 1.5s infinite;
  }
  .timer-display {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
</style>
