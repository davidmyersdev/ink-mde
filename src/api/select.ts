import { toCodeMirror } from '/src/vendor/adapters/selections'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import * as InkValues from '/types/values'

export const select = (store: InkInternal.Store, options: Ink.Instance.SelectOptions = {}) => {
  if (options.selections)
    return selectMultiple(store, options.selections)
  if (options.selection)
    return selectOne(store, options.selection)
  if (options.at)
    return selectAt(store, options.at)
}

export const selectAt = (store: InkInternal.Store, at: Ink.Values.Selection) => {
  const [state] = store

  if (at === InkValues.Selection.Start)
    return selectOne(store, { start: 0, end: 0 })

  if (at === InkValues.Selection.End) {
    const position = state().editor.state.doc.length

    return selectOne(store, { start: position, end: position })
  }
}

export const selectMultiple = ([state]: InkInternal.Store, selections: Ink.Editor.Selection[]) => {
  const { editor } = state()

  editor.dispatch(
    editor.state.update({
      selection: toCodeMirror(selections),
    }),
  )
}

export const selectOne = (store: InkInternal.Store, selection: Ink.Editor.Selection) => {
  return selectMultiple(store, [selection])
}
