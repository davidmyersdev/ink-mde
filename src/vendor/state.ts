import { history } from '@codemirror/history'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorSelection, EditorState } from '@codemirror/state'

import { toCodeMirror } from '/src/adapters/selections'
import { buildVendors } from '/src/extensions'
import { getState } from '/src/state'
import { code } from '/src/vendor/extensions/code'
import { keymaps } from '/src/vendor/extensions/keymaps'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { theme } from '/src/vendor/extensions/theme'

import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0) {
    return toCodeMirror(selections)
  }
}

export const createVendorState = (ref: InkInternal.Ref): InkInternal.Vendor.State => {
  const state = getState(ref)

  return EditorState.create({
    doc: state.options.doc,
    selection: toVendorSelection(state.options.selections),
    extensions: [
      ...buildVendors(ref),
      ...state.options.extensions,
      code(),
      history(),
      keymaps(),
      lineWrapping(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      theme(),
    ],
  })
}
