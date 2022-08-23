<template>
  <div ref="ink" v-html="html"></div>
</template>

<script lang="ts">
import { ink, ssr } from 'ink-mde/ssr'
import { defineComponent } from 'vue'

import type * as Ink from 'ink-mde'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'InkMde',
  emits: ['input', 'update:modelValue'],
  props: {
    modelValue: {
      type: String,
    },
    options: {
      type: Object as PropType<Ink.Options>,
    },
    value: {
      type: String,
    },
    version: {
      type: Number,
      default: () => 3,
      validator: (value: number) => (
        [2, 3].includes(value)
      ),
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
    value(value) { // Vue 2 support
      if (this.instance?.doc() !== value) {
        this.instance?.update(value)
      }
    },
  },
  computed: {
    doc() {
      return (this.version === 3 ? this.modelValue : this.value) || ''
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
          doc: this.doc,
          hooks: {
            ...this.options?.hooks,
            afterUpdate: (doc: string) => {
              if (this.version === 3) {
                this.$emit('update:modelValue', doc)
              } else {
                this.$emit('input', doc) // Vue 2 support
              }

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
      this.html = ssr(this.options)
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
