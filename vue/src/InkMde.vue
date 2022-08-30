<template>
  <div ref="ink" v-html="html"></div>
</template>

<script lang="ts">
import { ink, renderToString } from 'ink-mde'
import { defineComponent, type PropType } from 'vue'
import type * as Ink from 'ink-mde'

export default defineComponent({
  name: 'InkMde',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
    },
    options: {
      type: Object as PropType<Ink.Options>,
    },
  },
  data() {
    return {
      html: '',
      instance: undefined,
    } as { html: string, instance?: Ink.Instance }
  },
  watch: {
    modelValue(value) {
      if (this.instance?.doc() !== value) {
        this.instance?.update(value)
      }
    },
    options: {
      deep: true,
      handler(newValue, _oldValue) {
        this.instance?.reconfigure(newValue)
      },
    },
  },
  methods: {
    focus() {
      this.instance?.focus()
    },
    select(selections: Ink.Editor.Selection[]) {
      this.instance?.select(selections)
    },
    selections() {
      return this.instance?.selections()
    },
    tryInit() {
      if (this.$refs.ink && !this.instance) {
        this.instance = ink(this.$refs.ink as HTMLElement, {
          ...this.options,
          doc: this.modelValue,
          hooks: {
            ...this.options?.hooks,
            afterUpdate: (doc: string) => {
              this.$emit('update:modelValue', doc)

              if (this.options?.hooks?.afterUpdate) {
                this.options.hooks.afterUpdate(doc)
              }
            },
          },
        })

        // @ts-expect-error Todo: Fix type recognition on $refs.
        this.$refs.ink.addEventListener('input', (event: InputEvent) => {
          event.stopPropagation()
        })

        this.instance.focus()
      }
    },
  },
  created() {
    if (import.meta.env.VITE_SSR) {
      this.html = renderToString(this.options)
    }
  },
  mounted() {
    this.tryInit()
  },
  updated() {
    this.tryInit()
  },
})
</script>
