<div class="ink-container" bind:this={props.dom}>
  <DropZone isVisible={$isVisible} on:files></DropZone>
</div>

<script context="module" lang="ts">
  import { isVisible } from '/src/ui/store'
  import DropZone from '/src/ui/DropZone.svelte'

  import type InkUi from '/types/ui'

  export const props: InkUi.App.Props = {}
</script>

<style>
  .ink-container {
    height: var(--ink-height, 100%);
    position: var(--ink-position, relative);
  }
</style>
