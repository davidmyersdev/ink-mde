import * as van from '/lib/vanjs'
import { onMount } from '/lib/jsx-lite'
import { buildVendorUpdates } from '/src/extensions'
import { makeVars } from '/src/ui/utils'
import type { InkInternal } from '/types'

export const Vars = ({ state }: { state: InkInternal.StoreState }) => {
  const vars = van.state(makeVars(state.options.val))

  van.derive(() => {
    vars.val = makeVars(state.options.val)
  })

  onMount(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (_event: MediaQueryListEvent) => {
      const { editor, root, workQueue } = state

      if (root.val.isConnected) {
        workQueue.val.enqueue(async () => {
          const effects = await buildVendorUpdates(state)

          editor.val.dispatch({ effects })

          vars.val = makeVars(state.options.val)
        })
      } else {
        mediaQueryList.removeEventListener('change', listener)
      }
    }

    mediaQueryList.addEventListener('change', listener)
  })

  return (
    <style>
      {() => `.ink {\n  ${vars.val.join('\n  ')}\n}`}
    </style>
  )
}
