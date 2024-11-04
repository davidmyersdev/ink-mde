// import { hydrate as solidHydrate, renderToString as solidRenderToString } from 'solid-js/web'
import { renderToString as renderJsxToString } from '/lib/jsx-lite'
import * as van from '/lib/vanjs'
import { App } from '/src/components/App'
import { HYDRATION_MARKER_SELECTOR } from '/src/constants'
import { makeInstance } from '/src/instance'
import { makeStore } from '/src/store'
import { isPromise } from '/src/utils/inspect'
import { type PluginValueForType } from '/src/utils/options'
import type * as Ink from '/types/ink'

export type * from '/types/ink'
export { appearanceTypes, pluginTypes } from '/types/values'

export const defineConfig = <T extends Ink.Options>(config: T) => config
export const defineOptions = <T extends Ink.Options>(options: T) => options
export const definePlugin = <T extends Ink.Options.RecursivePlugin>(plugin: T) => plugin

export const hydrate = (target: HTMLElement, options: Ink.Options = {}): Ink.AwaitableInstance => {
  const state = makeStore(options)

  if (!import.meta.env.VITE_SSR) {
    van.hydrate(target, () => <App state={state} target={target} />)
  }

  return makeInstance(state)
}

export const ink = (target: HTMLElement, options: Ink.Options = {}): Ink.AwaitableInstance => {
  const hasHydrationMarker = !!target.querySelector(HYDRATION_MARKER_SELECTOR)

  if (hasHydrationMarker) {
    return hydrate(target, options)
  }

  return render(target, options)
}

export const inkPlugin = <T extends Ink.Values.PluginType>({ key = '', type, value }: { key?: string, type?: T, value: () => PluginValueForType<T> }) => {
  return new Proxy({ key, type: type || 'default' } as Ink.Options.Plugin, {
    get: (target, prop: keyof Ink.Options.Plugin, _receiver) => {
      if (prop === 'value' && !target[prop]) {
        target.value = value()

        if (isPromise(target.value)) {
          return target.value.then(val => target.value = val)
        }

        return target.value
      }

      return target[prop]
    },
  })
}

export const plugin = inkPlugin

export const render = (target: HTMLElement, options: Ink.Options = {}): Ink.AwaitableInstance => {
  const state = makeStore(options)

  if (!import.meta.env.VITE_SSR) {
    van.add(target, <App state={state} target={target} />)
  }

  return makeInstance(state)
}

export const renderToString = (options: Ink.Options = {}): string => {
  const state = makeStore(options)

  // Needed for tree-shaking purposes.
  if (!import.meta.env.VITE_SSR) {
    return ''
  }

  return renderJsxToString(<App state={state} />)
}

export const wrap = (textarea: HTMLTextAreaElement, options: Ink.Options = {}) => {
  const replacement = <div class='ink-mde-textarea' /> as HTMLDivElement
  const doc = textarea.value

  textarea.after(replacement)
  textarea.style.display = 'none'

  const instance = render(replacement, { doc, ...options })

  if (textarea.form) {
    textarea.form.addEventListener('submit', () => {
      textarea.value = instance.getDoc()
    })
  }

  return instance
}

export default ink
