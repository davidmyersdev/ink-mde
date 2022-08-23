/* eslint-disable eslint-comments/no-unlimited-disable */
import { hydrate } from 'solid-js/web'
import { makeStore } from '/src/store'
import { makeInstance } from '/src/instance'
import { App } from '/src/ui/app'
import type * as Ink from '/types/ink'

export * from '/types/values'
export * from '/src/vendor/extensions/extension'

export const defineOptions = (options: Ink.Options): Ink.Options => {
  return options
}

export const ink = (target: HTMLElement, options: Ink.Options = {}): Ink.Instance => {
  const store = makeStore(options)

  if (!import.meta.env.VITE_SSR) {
    prepareHydration()
    hydrate(() => <App store={store} />, target)
  }

  return makeInstance(store)
}

export { ssr } from './server'

export const prepareHydration = () => {
  // @ts-expect-error Todo: This is a third-party vendor script.
  // eslint-disable-next-line
  let e,t;e=window._$HY||(window._$HY={events:[],completed:new WeakSet,r:{}}),t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host instanceof Node?e.host:e.parentNode)),['click', 'input'].forEach((o=>document.addEventListener(o,(o=>{let s=o.composedPath&&o.composedPath()[0]||o.target,a=t(s);a&&!e.completed.has(a)&&e.events.push([a,o])})))),e.init=(t,o)=>{e.r[t]=[new Promise(((e,t)=>o=e)),o]},e.set=(t,o,s)=>{(s=e.r[t])&&s[1](o),e.r[t]=[o]},e.unset=t=>{delete e.r[t]},e.load=(t,o)=>{if(o=e.r[t])return o[0]}
}

export default ink
