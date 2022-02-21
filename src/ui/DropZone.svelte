<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Modal from '/src/ui/Modal.svelte'

  let files: File[] = []
  let form: HTMLElement

  const dispatch = createEventDispatcher()
  const drag = (event: DragEvent) => {
    event.preventDefault()
  }
  const drop = (event: DragEvent) => {
    event.preventDefault()

    const transfer = event.dataTransfer as DataTransfer

    if (transfer.files) {
      Array.from(transfer.files).forEach(file => (files = [...files, file]))

      dispatch('files', transfer.files)
    }
  }
  const file = (event: Event) => {
    const target = event.target as HTMLInputElement

    if (target.files) {
      Array.from(target.files).forEach(file => (files = [...files, file]))

      dispatch('files', target.files)
    }
  }
  const upload = (_event: Event) => {
    form.click()
  }

  export let isVisible = false
</script>

{#if isVisible}
  <Modal isVisible={isVisible}>
    <div class="ink-drop-zone" on:click={upload} on:drop={drop} on:dragover={drag}>
      <input class="ink-drop-zone-input" type="file" multiple bind:this={form} on:change={file}>
      <div class="ink-drop-zone-previews">
        {#each files.slice(0, 8) as file, _i}
          <img class="ink-drop-zone-preview-image" alt={file.name} src={URL.createObjectURL(file)}>
        {/each}
      </div>
      <span>drop files here or click to upload</span>
    </div>
  </Modal>
{/if}

<style>
  .ink-drop-zone {
    align-items: center;
    border: 0.25rem dashed #aaa;
    border-radius: 0.125rem;
    box-sizing: border-box;
    color: #fafafa;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-size: 1.25em;
    gap: 1rem;
    height: 100%;
    justify-content: center;
    padding: 1rem;
    text-align: center;
  }

  .ink-drop-zone-input {
    display: none;
  }

  .ink-drop-zone-previews {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 25.5rem;
  }

  .ink-drop-zone-preview-image {
    border: 0.125rem solid #222;
    border-radius: 0.125rem;
    box-sizing: border-box;
    height: 6rem;
    object-fit: cover;
    padding: 0.5rem;
    width: 6rem;
  }
</style>
