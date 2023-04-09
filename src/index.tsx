import { hydrate as solidHydrate, render as solidRender, renderToString as solidRenderToString } from 'solid-js/web'
import { HYDRATION_MARKER_SELECTOR } from '/src/constants'
import { makeInstance } from '/src/instance'
import { makeStore } from '/src/store'
import { App } from '/src/ui/app'
import { isPromise } from '/src/utils/inspect'
import { type PluginValueForType } from '/src/utils/options'
import type * as Ink from '/types/ink'

export * from '/types/values'

export const defineConfig = <T extends Ink.Options>(config: T) => config
export const defineOptions = <T extends Ink.Options>(options: T) => options
export const definePlugin = <T extends Ink.Options.RecursivePlugin>(plugin: T) => plugin

export const hydrate = (target: HTMLElement, options: Ink.Options = {}): Ink.Instance => {
  const store = makeStore(options)

  if (!import.meta.env.VITE_SSR) {
    solidPrepareForHydration()
    solidHydrate(() => <App store={store} />, target)
  }

  return makeInstance(store)
}

export const ink = (target: HTMLElement, options: Ink.Options = {}): Ink.Instance => {
  const hasHydrationMarker = !!target.querySelector(HYDRATION_MARKER_SELECTOR)

  if (hasHydrationMarker) {
    return hydrate(target, options)
  }

  return render(target, options)
}

export const inkPlugin = <T extends Ink.Values.PluginType>(type: T, value: () => PluginValueForType<T>, key = '') => {
  return new Proxy({ type, key } as Ink.Options.Plugin, {
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

export const render = (target: HTMLElement, options: Ink.Options = {}): Ink.Instance => {
  const store = makeStore(options)

  if (!import.meta.env.VITE_SSR) {
    solidRender(() => <App store={store} />, target)
  }

  return makeInstance(store)
}

export const renderToString = (options: Ink.Options = {}): string => {
  const store = makeStore(options)

  // Needed for tree-shaking purposes.
  if (!import.meta.env.VITE_SSR) {
    return ''
  }

  return solidRenderToString(() => <App store={store} />)
}

export const solidPrepareForHydration = () => {
  // @ts-expect-error Todo: This is a third-party vendor script.
  // eslint-disable-next-line
  let e,t;e=window._$HY||(window._$HY={events:[],completed:new WeakSet,r:{}}),t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host instanceof Node?e.host:e.parentNode)),['click', 'input'].forEach((o=>document.addEventListener(o,(o=>{let s=o.composedPath&&o.composedPath()[0]||o.target,a=t(s);a&&!e.completed.has(a)&&e.events.push([a,o])})))),e.init=(t,o)=>{e.r[t]=[new Promise(((e,t)=>o=e)),o]},e.set=(t,o,s)=>{(s=e.r[t])&&s[1](o),e.r[t]=[o]},e.unset=t=>{delete e.r[t]},e.load=(t,o)=>{if(o=e.r[t])return o[0]}
}

export const wrap = (textarea: HTMLTextAreaElement, options: Ink.Options = {}) => {
  const replacement = <div class='ink-mde-textarea' /> as HTMLDivElement

  textarea.after(replacement)
  textarea.style.display = 'none'

  const instance = render(textarea, options)

  if (textarea.form) {
    textarea.form.addEventListener('submit', () => {
      textarea.value = instance.getDoc()
    })
  }

  return instance
}

export default ink
