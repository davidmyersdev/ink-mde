import { toInk } from '/src/vendor/adapters/selections'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const selections = ([state]: InkInternal.Store): Ink.Editor.Selection[] => {
  const { editor } = state()

  return toInk(editor.state.selection)
}
