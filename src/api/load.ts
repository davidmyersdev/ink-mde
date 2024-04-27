import { createState } from '/src/editor'
import { override } from '/src/utils/merge'
import type InkInternal from '/types/internal'

export const load = ([state, setState]: InkInternal.Store, doc: string) => {
  setState(override(state(), { options: { doc } }))

  state().editor.setState(createState([state, setState]))
}
