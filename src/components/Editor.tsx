import { createView } from '/src/editor'
import { buildVendorUpdates } from '/src/extensions'
import { updateStore } from '/src/store'
import type { InkInternal } from '/types'

export const Editor = ({ state, target }: { state: InkInternal.StoreState, target?: HTMLElement }) => {
  // Needed for tree-shaking purposes.
  if (import.meta.env.VITE_SSR) {
    return (
      <div class='cm-editor'>
        <div class='cm-scroller'>
          <div class='cm-content' contentEditable={true}>
            <div class='cm-line'>
              <br />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const editor = createView(state, target)
  const { val: workQueue } = state.workQueue

  updateStore(state, { editor })

  workQueue.enqueue(async () => {
    const effects = await buildVendorUpdates(state)

    editor.dispatch({ effects })
  })

  return editor.dom
}
