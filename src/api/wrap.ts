import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { insert } from './insert'
import { select } from './select'
import { selections } from './selections'

export const wrap = (state: InkInternal.StoreState, { after, before, selection: userSelection }: Ink.Instance.WrapOptions) => {
  const { val: editor } = state.editor

  const selection = userSelection || selections(state).pop() || { start: 0, end: 0 }
  const text = editor.state.sliceDoc(selection.start, selection.end)

  insert(state, `${before}${text}${after}`, selection)
  select(state, { selections: [{ start: selection.start + before.length, end: selection.end + before.length }] })
}
