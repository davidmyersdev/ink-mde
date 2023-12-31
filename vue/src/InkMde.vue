<script lang="ts">
import { ink, renderToString } from 'ink-mde'
import type * as Ink from 'ink-mde'
import { type PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'InkMde',
  props: {
    modelValue: {
      type: String,
    },
    options: {
      type: Object as PropType<Ink.Options>,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      html: '',
      instance: undefined,
    } as { html: string, instance?: Ink.Instance }
  },
  watch: {
    modelValue(value) {
      if (this.instance?.getDoc() !== value) {
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
  methods: {
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
      }
    },
  },
})
</script>

<template>
  <div ref="ink" v-html="html" />
</template>
