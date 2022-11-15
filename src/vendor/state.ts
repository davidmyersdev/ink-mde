import { history } from '@codemirror/commands'
import { type EditorSelection, EditorState } from '@codemirror/state'
import { toCodeMirror } from './adapters/selections'
import { buildVendors } from '/src/extensions'
import { blockquote } from '/src/vendor/extensions/blockquote'
import { code } from '/src/vendor/extensions/code'
import { ink } from '/src/vendor/extensions/ink'
import { keymaps } from '/src/vendor/extensions/keymaps'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { theme } from '/src/vendor/extensions/theme'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0)
    return toCodeMirror(selections)
}

export const makeState = (state: InkInternal.StateResolved): InkInternal.Vendor.State => {
  return EditorState.create({
    doc: state.options.doc,
    selection: toVendorSelection(state.options.selections),
    extensions: [
      blockquote(),
      code(),
      history(),
      ink(),
      keymaps(),
      lineWrapping(),
      theme(),
      ...buildVendors(state),
    ],
  })
}
