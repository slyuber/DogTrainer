<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title?: string;
    onclose: () => void;
    children: Snippet;
  }
  let { open, title = '', onclose, children }: Props = $props();

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onclose();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions a11y_no_noninteractive_element_interactions -->
  <div class="modal-overlay" role="presentation" onclick={handleOverlayClick}>
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      {#if title}
        <div class="modal-header">
          <h2>{title}</h2>
          <button class="modal-close" onclick={onclose}>&times;</button>
        </div>
      {/if}
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .modal-sheet {
    background: var(--card);
    border-top: 1px solid var(--brd);
    border-radius: var(--r3) var(--r3) 0 0;
    width: 100%;
    max-width: 430px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 20px;
    animation: slideUp 0.3s ease;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
  }
  .modal-handle {
    width: 40px;
    height: 4px;
    background: var(--txt3);
    border-radius: 2px;
    margin: 0 auto 16px;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .modal-close {
    background: none;
    border: none;
    color: var(--txt3);
    font-size: 1.5rem;
    padding: 8px;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
