import { createState } from '/src/editor'
import { buildVendorUpdates } from '/src/extensions'
import { override } from '/src/utils/merge'
import type InkInternal from '/types/internal'

export const load = async ([state, setState]: InkInternal.Store, doc: string) => {
  const { workQueue } = state()

  return workQueue.enqueue(async () => {
    setState(override(state(), { doc, options: { doc } }))
    state().editor.setState(createState([state, setState]))

    const effects = await buildVendorUpdates([state, setState])

    state().editor.dispatch({ effects })
  })
}
