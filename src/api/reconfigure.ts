import { buildVendorUpdates } from '/src/extensions'
import { override } from '/src/utils/merge'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const reconfigure = async ([state, setState]: InkInternal.Store, options: Ink.Options) => {
  const { workQueue } = state()
  setState(override(state(), { options }))

  return workQueue.enqueue(async () => {
    const effects = await buildVendorUpdates([state, setState])

    state().editor.dispatch({ effects })
  })
}
