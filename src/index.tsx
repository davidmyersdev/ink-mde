import { render } from 'solid-js/web'
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

  render(() => <App store={store} />, target)

  return makeInstance(store)
}

export { ssr } from '/ssr/server'

export default ink
