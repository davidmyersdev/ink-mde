import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { selections } from './selections'

export const insert = (state: InkInternal.StoreState, text: string, selection?: Ink.Editor.Selection, updateSelection = false) => {
  const { val: editor } = state.editor

  let start = selection?.start
  let end = selection?.end || selection?.start

  if (typeof start === 'undefined') {
    const current = selections(state).pop() as Ink.Editor.Selection

    start = current.start
    end = current.end
  }

  const updates = { changes: { from: start, to: end, insert: text } }

  if (updateSelection) {
    const anchor = start === end ? start + text.length : start
    const head = start === end ? start + text.length : start + text.length

    Object.assign(updates, { selection: { anchor, head } })
  }

  editor.dispatch(
    editor.state.update(updates),
  )
}
