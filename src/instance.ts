import { getState, updateState } from '/src/state'
import { toCodeMirror, toInk } from '/src/adapters/selections'
import { buildVendorUpdates } from '/src/extensions'
import { styleRoot } from './ui'
import { createVendorState } from '/src/vendor/state'

import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const destroy = (ref: InkInternal.Ref) => {
  const { editor } = getState(ref)

  editor.destroy()
}

export const doc = (ref: InkInternal.Ref) => {
  const { editor } = getState(ref)

  return editor.state.sliceDoc()
}

export const focus = (ref: InkInternal.Ref) => {
  const { editor } = getState(ref)

  if (!editor.hasFocus) {
    editor.focus()
  }
}

export const insert = (ref: InkInternal.Ref, text: string, selection?: Ink.Editor.Selection) => {
  const { editor } = getState(ref)

  let start = selection?.start
  let end = selection?.end || selection?.start

  if (!start) {
    const current = selections(ref).pop() as Ink.Editor.Selection

    start = current.start
    end = current.end
  }

  const changes = { from: start, to: end, insert: text }
  const anchor = start === end ? start + text.length : start
  const head = start === end ? start + text.length : start + text.length
  const newSelection = { anchor, head }

  editor.dispatch(
    editor.state.update({ changes, selection: newSelection })
  )
}

export const load = (ref: InkInternal.Ref, doc: string) => {
  const { editor } = getState(ref)

  updateState(ref, { options: { doc } })

  editor.setState(createVendorState(ref))
}

export const reconfigure = (ref: InkInternal.Ref, partialOptions: Partial<Ink.Options>) => {
  const { components, editor } = getState(ref)

  updateState(ref, { options: partialOptions })
  styleRoot(ref)

  components.forEach((component) => {
    component.$set({ ref })
  })

  const effects = buildVendorUpdates(ref)

  editor.dispatch({
    effects,
  })
}

export const select = (ref: InkInternal.Ref, selections: Ink.Editor.Selection[]) => {
  const { editor } = getState(ref)

  editor.dispatch(
    editor.state.update({
      selection: toCodeMirror(selections),
    })
  )
}

export const selections = (ref: InkInternal.Ref): Ink.Editor.Selection[] => {
  const { editor } = getState(ref)

  return toInk(editor.state.selection)
}

export const update = (ref: InkInternal.Ref, doc: string) => {
  const { editor } = getState(ref)

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

export const createInstance = (ref: InkInternal.Ref): Ink.Instance => {
  return {
    destroy: (...args) => destroy(ref, ...args),
    doc: (...args) => doc(ref, ...args),
    focus: (...args) => focus(ref, ...args),
    insert: (...args) => insert(ref, ...args),
    load: (...args) => load(ref, ...args),
    reconfigure: (...args) => reconfigure(ref, ...args),
    select: (...args) => select(ref, ...args),
    selections: (...args) => selections(ref, ...args),
    update: (...args) => update(ref, ...args),
  }
}
