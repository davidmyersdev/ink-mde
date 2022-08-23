import { renderToString } from 'solid-js/web'
import { makeStore } from '/src/store'
import { App } from '/src/ui/app'
import type * as Ink from '/types/ink'

export * from '/types/values'
export * from '/src/vendor/extensions/extension'

export const defineOptions = (options: Ink.Options): Ink.Options => {
  return options
}

export { ink } from './client'

export const ssr = (options: Ink.Options = {}): string => {
  const store = makeStore(options)

  // Needed for tree-shaking purposes.
  if (!import.meta.env.VITE_SSR) {
    return ''
  }

  return renderToString(() => <App store={store} />)
}
