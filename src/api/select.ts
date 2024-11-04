import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import * as InkValues from '/types/values'
import { toCodeMirror } from '../editor/adapters/selections'

export const select = (state: InkInternal.StoreState, options: Ink.Instance.SelectOptions = {}) => {
  if (options.selections)
    return selectMultiple(state, options.selections)
  if (options.selection)
    return selectOne(state, options.selection)
  if (options.at)
    return selectAt(state, options.at)
}

export const selectAt = (state: InkInternal.StoreState, at: Ink.Values.Selection) => {
  if (at === InkValues.Selection.Start)
    return selectOne(state, { start: 0, end: 0 })

  if (at === InkValues.Selection.End) {
    const position = state.editor.val.state.doc.length

    return selectOne(state, { start: position, end: position })
  }
}

export const selectMultiple = (state: InkInternal.StoreState, selections: Ink.Editor.Selection[]) => {
  const { val: editor } = state.editor

  editor.dispatch(
    editor.state.update({
      selection: toCodeMirror(selections),
    }),
  )
}

export const selectOne = (state: InkInternal.StoreState, selection: Ink.Editor.Selection) => {
  return selectMultiple(state, [selection])
}
