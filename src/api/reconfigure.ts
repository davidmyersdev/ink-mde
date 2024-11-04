import { buildVendorUpdates } from '/src/extensions'
import { updateStore } from '/src/store'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const reconfigure = async (state: InkInternal.StoreState, options: Ink.Options) => {
  return state.workQueue.val.enqueue(async () => {
    updateStore(state, { options })

    const effects = await buildVendorUpdates(state)

    state.editor.val.dispatch({ effects })
  })
}
