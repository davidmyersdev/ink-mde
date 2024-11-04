import { createState } from '/src/editor'
import { updateStore } from '/src/store'
import type InkInternal from '/types/internal'

export const load = (state: InkInternal.StoreState, doc: string) => {
  updateStore(state, { options: { doc } })

  state.editor.val.setState(createState(state))
}
