import { buildVendorUpdates } from '/src/extensions'
import { override } from '/src/utils/merge'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const reconfigure = ([state, setState]: InkInternal.Store, options: Ink.Options) => {
  const effects = buildVendorUpdates(setState(override(state(), { options })))

  state().editor.dispatch({
    effects,
  })
}
