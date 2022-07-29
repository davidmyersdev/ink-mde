import { override } from './utils/deepmerge'
import { toCodeMirror, toInk } from '/src/adapters/selections'
import { buildVendorUpdates } from '/src/extensions'
import * as formatter from '/src/formatter'
import { makeState } from '/src/vendor/state'

import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const destroy = ([state, _setState]: InkInternal.Store) => {
  const { editor } = state

  editor.destroy()
}

export const doc = ([state, _setState]: InkInternal.Store) => {
  const { editor } = state

  return editor.state.sliceDoc()
}

export const focus = ([state, _setState]: InkInternal.Store) => {
  const { editor } = state

  if (!editor.hasFocus) {
    editor.focus()
  }
}

export const format = ([state, setState]: InkInternal.Store, type: `${Ink.Values.Markup}`, selection?: Ink.Editor.Selection) => {
  return formatter.format([state, setState], type, selection)
}

export const insert = ([state, setState]: InkInternal.Store, text: string, selection?: Ink.Editor.Selection, updateSelection = false) => {
  const { editor } = state

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
    editor.state.update(updates)
  )
}

export const load = ([state, setState]: InkInternal.Store, doc: string) => {
  setState(override(state, { options: { doc } }))

  state.editor.setState(makeState(state))
}

export const makeInstance = (store: InkInternal.Store): Ink.Instance => {
  return {
    destroy: destroy.bind(undefined, store),
    doc: doc.bind(undefined, store),
    focus: focus.bind(undefined, store),
    insert: insert.bind(undefined, store),
    load: load.bind(undefined, store),
    reconfigure: reconfigure.bind(undefined, store),
    select: select.bind(undefined, store),
    selections: selections.bind(undefined, store),
    update: update.bind(undefined, store),
    wrap: wrap.bind(undefined, store),
  }
}

export const reconfigure = ([state, setState]: InkInternal.Store, options: Ink.Options) => {
  const { editor } = state

  setState(override(state, { options }))

  const effects = buildVendorUpdates(state)

  editor.dispatch({
    effects,
  })
}

export const select = ([state, _setState]: InkInternal.Store, selections: Ink.Editor.Selection[]) => {
  const { editor } = state

  editor.dispatch(
    editor.state.update({
      selection: toCodeMirror(selections),
    })
  )
}

export const selections = ([state, _setState]: InkInternal.Store): Ink.Editor.Selection[] => {
  const { editor } = state

  return toInk(editor.state.selection)
}

export const update = ([state, _setState]: InkInternal.Store, doc: string) => {
  const { editor } = state

  editor.dispatch(
    editor.state.update({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: doc,
      },
    })
  )
}

export const wrap = ([state, setState]: InkInternal.Store, { after, before, selection: userSelection }: Ink.Instance.WrapOptions) => {
  const { editor } = state

  const selection = userSelection || selections([state, setState]).pop() || { start: 0, end: 0 }
  const text = editor.state.sliceDoc(selection.start, selection.end)

  insert([state, setState], `${before}${text}${after}`, selection)
  select([state, setState], [{ start: selection.start + before.length, end: selection.end + before.length }])
}
