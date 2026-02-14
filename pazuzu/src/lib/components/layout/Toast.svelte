<script lang="ts">
  let { message = '', action = '', onaction = () => {} }: {
    message: string;
    action?: string;
    onaction?: () => void;
  } = $props();
</script>

{#if message}
  <div class="toast-container">
    <div class="toast" class:has-action={!!action}>
      <span class="toast-msg">{message}</span>
      {#if action}
        <button class="toast-action" onclick={onaction}>{action}</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    width: 90%;
    max-width: 400px;
    pointer-events: none;
  }
  .toast {
    background: var(--card2);
    border: 1px solid var(--pri-dim);
    color: var(--pri);
    padding: 12px 16px;
    border-radius: var(--r);
    text-align: center;
    font-size: 0.85rem;
    font-family: var(--font-d);
    animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .toast.has-action {
    pointer-events: auto;
    animation: toastIn 0.3s ease, toastOut 0.3s ease 3.7s forwards;
  }
  .toast-msg { flex: 1; }
  .toast-action {
    background: none;
    border: 1px solid var(--pri);
    color: var(--pri);
    padding: 4px 12px;
    border-radius: var(--r);
    font-family: var(--font-d);
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 32px;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .toast-action:active {
    background: rgba(212,168,83,0.15);
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
</style>
