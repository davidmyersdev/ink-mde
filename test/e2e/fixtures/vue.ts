import { createApp, createSSRApp, h, nextTick, ref } from 'vue'
import InkMde from '../../../vue/src/InkMde.vue'

type VueE2E = {
  setModelValue: (value: string) => Promise<void>,
  setOptions: (options: Record<string, unknown>) => Promise<void>,
}

export const mountVue = async ({ modelValue, options }: { modelValue: string, options: Record<string, unknown> }) => {
  await createVueApp({ modelValue, options })
}

export const hydrateVue = async ({ modelValue, options }: { modelValue: string, options: Record<string, unknown> }) => {
  await createVueApp({ hydrate: true, modelValue, options })
}

const createVueApp = async ({ hydrate = false, modelValue, options }: { hydrate?: boolean, modelValue: string, options: Record<string, unknown> }) => {
  const target = document.querySelector<HTMLElement>('#editor')!
  const value = ref(modelValue)
  const editorOptions = ref(options)

  const app = (hydrate ? createSSRApp : createApp)({
    setup() {
      return () => h(InkMde, {
        'modelValue': value.value,
        'options': editorOptions.value,
        'onUpdate:modelValue': (nextValue: string) => {
          value.value = nextValue
          target.dataset.modelValue = nextValue
        },
      })
    },
  })

  app.mount(target)
  await nextTick()

  ;(window as typeof window & { vueE2E: VueE2E }).vueE2E = {
    async setModelValue(nextValue) {
      value.value = nextValue
      await nextTick()
    },
    async setOptions(nextOptions) {
      editorOptions.value = nextOptions
      await nextTick()
    },
  }
}

export const mountVueWithUserHook = async () => {
  const target = document.querySelector<HTMLElement>('#editor')!
  const app = createApp({
    setup() {
      return () => h(InkMde, {
        'modelValue': 'initial',
        'options': {
          hooks: {
            afterUpdate() {
              target.dataset.userHookCalls = String(Number(target.dataset.userHookCalls ?? 0) + 1)
            },
          },
        },
        'onUpdate:modelValue': (value: string) => {
          target.dataset.modelValue = value
        },
      })
    },
  })

  app.mount(target)
  await nextTick()
}
