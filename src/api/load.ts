import { override } from '/src/utils/merge'
import { makeState } from '/src/vendor/state'
import type InkInternal from '/types/internal'

export const load = ([state, setState]: InkInternal.Store, doc: string) => {
  setState(override(state(), { options: { doc } }))

  state().editor.setState(makeState([state, setState]))
}
