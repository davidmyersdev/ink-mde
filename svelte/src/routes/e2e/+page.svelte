<script lang="ts">
  import InkMde from '$lib/InkMde.svelte'
  import type { AwaitableInstance, Options } from 'ink-mde'

  let editor: AwaitableInstance | undefined
  let editorReady = false
  let value = 'initial Svelte document'
  let beforeUpdate = ''
  let afterUpdate = ''
  let userHookCalls = 0
  let options: Omit<Options, 'doc'> = {
    hooks: {
      afterUpdate() {
        userHookCalls += 1
      },
    },
  }

  const updateValue = () => {
    value = 'parent update'
  }

  const enableReadonly = () => {
    options = {
      ...options,
      interface: {
        readonly: true,
      },
    }
  }

  $: if (editor) {
    editor.then(() => {
      editorReady = true
    })
  }
</script>

<button data-test-id="set-value" on:click={updateValue}>Set value</button>
<button data-test-id="set-readonly" on:click={enableReadonly}>Set readonly</button>
<output data-test-id="value">{value}</output>
<output data-test-id="editor-ready">{String(editorReady)}</output>
<output data-test-id="before-update">{beforeUpdate}</output>
<output data-test-id="after-update">{afterUpdate}</output>
<output data-test-id="user-hook-calls">{userHookCalls}</output>

<InkMde
  bind:editor
  bind:value
  {options}
  on:beforeUpdate={(event) => (beforeUpdate = event.detail)}
  on:afterUpdate={(event) => (afterUpdate = event.detail)}
/>
