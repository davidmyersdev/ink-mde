<script lang="ts">
  import ink from 'ink-mde'
  import { onMount, createEventDispatcher } from 'svelte'
  import type * as Ink from 'ink-mde'

  type Events = {
    beforeUpdate: string
    afterUpdate: string
  }
  const dispatch = createEventDispatcher<Events>()

  type OptionsWithoutDoc = Omit<Ink.Options, 'doc'>

  export let value: string | undefined = undefined
  export let editor: Ink.Instance | undefined = undefined
  export let options: OptionsWithoutDoc | undefined = undefined

  let divRef: HTMLDivElement
  onMount(() => {
    editor = ink(divRef, {
      doc: value,
      ...options,
      hooks: {
        afterUpdate: (doc) => {
          value = doc
          options?.hooks?.afterUpdate?.(doc)
          dispatch('afterUpdate', doc)
        },
        beforeUpdate: (doc) => {
          options?.hooks?.beforeUpdate?.(doc)
          dispatch('beforeUpdate', doc)
        },
      },
    })
  })

  // reactive configuration
  // if a parent component changes the `option` prop, the editor will be reconfigured
  $: {
    if (editor && options) {
      editor.reconfigure(options)
    }
  }

  // reactive doc
  // if a parent component changes the `value` prop, the editor will update the doc
  $: {
    if (editor && value && editor.getDoc() !== value) {
      editor.update(value)
    }
  }
</script>

<div bind:this={divRef} />
