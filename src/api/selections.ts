import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { toInk } from '../editor/adapters/selections'

export const selections = (state: InkInternal.StoreState): Ink.Editor.Selection[] => {
  const { val: editor } = state.editor

  return toInk(editor.state.selection)
}
