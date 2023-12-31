import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { insert } from './insert'
import { select } from './select'
import { selections } from './selections'

export const wrap = ([state, setState]: InkInternal.Store, { after, before, selection: userSelection }: Ink.Instance.WrapOptions) => {
  const { editor } = state()

  const selection = userSelection || selections([state, setState]).pop() || { start: 0, end: 0 }
  const text = editor.state.sliceDoc(selection.start, selection.end)

  insert([state, setState], `${before}${text}${after}`, selection)
  select([state, setState], { selections: [{ start: selection.start + before.length, end: selection.end + before.length }] })
}
