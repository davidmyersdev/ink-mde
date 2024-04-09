import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import type { EditorSelection } from '@codemirror/state'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { buildVendors } from '/src/extensions'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import { toCodeMirror } from './adapters/selections'
import { fullConfig } from './config'
import { blockquote } from './extensions/blockquote'
import { code } from './extensions/code'
import { ink } from './extensions/ink'
import { lineWrapping } from './extensions/line_wrapping'
import { theme } from './extensions/theme'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0) {
    return toCodeMirror(selections)
  }
}

export const createState = ([state, setState]: InkInternal.Store): InkInternal.Vendor.State => {
  const { options } = state()

  return EditorState.create({
    doc: state().options.doc,
    selection: toVendorSelection(options.selections),
    extensions: [
      fullConfig.init(() => options),
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
}
