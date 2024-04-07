import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { type EditorSelection, EditorState, StateEffect, StateField, type Transaction } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { buildVendors } from '/src/extensions'
import { blockquote } from '/src/vendor/extensions/blockquote'
import { code } from '/src/vendor/extensions/code'
import { ink } from '/src/vendor/extensions/ink'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { theme } from '/src/vendor/extensions/theme'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { toCodeMirror } from './adapters/selections'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0)
    return toCodeMirror(selections)
}

/**
 * Create an updateable state field.
 *
 * @example
 *
 * const counter = initState(0)
 * const editorState = EditorState.create({
 *  extensions: [counter],
 * })
 *
 * const effects = counter.update(editorState, 1)
 * const transaction = editorState.update({ effects })
 */
export const initState = <T>(initial: T) => {
  const effectType = StateEffect.define<T>()
  const field = StateField.define<T>({
    create: () => initial,
    update: (value, transaction) => {
      for (const effect of transaction.effects) {
        if (effect.is(effectType)) {
          return effect.value
        }
      }

      return value
    },
  })

  return Object.assign(field, {
    update: (state: EditorState, value: T): Transaction => {
      return state.update({ effects: effectType.of(value) })
    },
  })
}

export const makeState = ([state, setState]: InkInternal.Store): InkInternal.Vendor.State => {
  const editorState = EditorState.create({
    doc: state().options.doc,
    selection: toVendorSelection(state().options.selections),
    extensions: [
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      blockquote(),
      code(),
      history(),
      ink(),
      lineWrapping(),
      theme(),
      ...buildVendors([state, setState]),
    ],
  })

  return editorState
}
