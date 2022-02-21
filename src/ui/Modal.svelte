{#if isVisible}
  <div class="ink-modal">
    <div class="ink-modal-window">
      <slot></slot>
    </div>
  </div>
{/if}

<script lang="ts">
  export let isVisible = false
</script>

<style>
  .ink-modal {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    inset: var(--ink-modal-inset, 0);
    justify-content: center;
    position: var(--ink-modal-position, absolute);
    z-index: var(--ink-modal-z-index, 10);
  }

  .ink-modal-window {
    background-color: var(--ink-modal-background-color, #111);
    border-radius: var(--ink-modal-border-radius, 0.25rem);
    /* box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); */
    box-sizing: border-box;
    height: 100%;
    max-height: 20rem;
    max-width: 40rem;
    padding: 1rem;
    width: 100%;
  }
</style>
