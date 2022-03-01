<script lang="ts">
  import { onMount } from 'svelte'

  import { getState } from '/src/state'
  import { insert } from '/src/instance'

  import type InkInternal from '/types/internal'

  export let ref: InkInternal.Ref

  $: state = getState(ref)
  $: dragAndDrop = state.options.files.dragAndDrop
  $: handler = state.options.files.handler
  $: injectMarkup = state.options.files.injectMarkup

  let depth: number = 0
  let files: File[] = []
  let isLoading = false
  let isVisible = false

  const closeModal = () => {
    isVisible = false
  }

  const dropOnZone = (event: DragEvent) => {
    if (dragAndDrop) {
      event.preventDefault()
      event.stopPropagation()

      const transfer = event.dataTransfer

      if (transfer?.files) {
        Array.from(transfer.files).forEach(file => (files = [...files, file]))

        isLoading = true

        Promise.resolve(handler(transfer.files)).then((url?: string) => {
          if (injectMarkup && url) {
            const markup = `![](${url})`

            insert(ref, markup)
          }
        }).finally(() => {
          depth = 0
          isLoading = false
          isVisible = false
          files = []
        })
      } else {
        depth = 0
        isVisible = false
        files = []
      }
    }
  }

  onMount(() => {
    document.addEventListener('dragenter', (event: DragEvent) => {
      if (dragAndDrop) {
        event.preventDefault()

        depth += 1
        isVisible = true
      }
    })

    document.addEventListener('dragover', (event: DragEvent) => {
      if (dragAndDrop) {
        event.preventDefault()

        isVisible = true
      }
    })

    document.addEventListener('dragleave', (event: DragEvent) => {
      if (dragAndDrop) {
        event.preventDefault()

        depth -= 1

        if (depth === 0) {
          isVisible = false
        }
      }
    })

    document.addEventListener('drop', (event: DragEvent) => {
      if (dragAndDrop) {
        event.preventDefault()

        depth = 0
        isVisible = false
      }
    })
  })
</script>

<div class="ink--drop-zone" class:visible={isVisible}>
  <div class="ink--drop-zone--modal">
    <div class="ink--drop-zone--droppable-area" on:drop={dropOnZone}>
      <div class="ink--drop-zone--file-preview">
        {#each files.slice(0, 8) as file, _i}
          <img class="ink--drop-zone--file-preview-image" alt={file.name} src={URL.createObjectURL(file)}>
        {/each}
      </div>
      {#if isLoading}
        <span>uploading files...</span>
      {:else}
        <span>drop files here</span>
      {/if}
    </div>
    <div class="ink--drop-zone--hide" on:click={closeModal}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>
</div>

<style>
  .ink--drop-zone {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: var(--ink-internal-all-color);
    display: flex;
    inset: 0;
    justify-content: center;
    position: var(--ink-internal-modal-position);
    z-index: 10;
  }

  .ink--drop-zone:not(.visible) {
    display: none;
  }

  .ink--drop-zone--modal {
    background-color: var(--ink-internal-block-background-color);
    border-radius: var(--ink-internal-all-border-radius);
    box-sizing: border-box;
    height: 100%;
    max-height: 20rem;
    max-width: 40rem;
    padding: 1rem;
    position: relative;
    width: 100%;
  }

  .ink--drop-zone--hide {
    cursor: pointer;
    height: 1.75rem;
    position: absolute;
    right: 0.25rem;
    top: 0.25rem;
    width: 1.75rem;
  }

  .ink--drop-zone--hide svg {
    background-color: var(--ink-internal-block-background-color);
  }

  .ink--drop-zone--droppable-area {
    align-items: center;
    border: 0.2rem dashed var(--ink-internal-all-color);
    border-radius: 0.125rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-size: 1.25em;
    gap: 1rem;
    height: 100%;
    justify-content: center;
    padding: 1rem;
    text-align: center;
  }

  .ink--drop-zone--file-preview {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 25.5rem;
  }

  .ink--drop-zone--file-preview-image {
    border: 0.125rem solid #222;
    border-radius: 0.125rem;
    box-sizing: border-box;
    height: 6rem;
    object-fit: cover;
    padding: 0.5rem;
    width: 6rem;
  }
</style>
