import { selections } from './selections'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const insert = ([state, setState]: InkInternal.Store, text: string, selection?: Ink.Editor.Selection, updateSelection = false) => {
  const { editor } = state()

  let start = selection?.start
  let end = selection?.end || selection?.start

  if (typeof start === 'undefined') {
    const current = selections([state, setState]).pop() as Ink.Editor.Selection

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
