import { history } from '@codemirror/history'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorSelection, EditorState } from '@codemirror/state'

import { toCodeMirror } from '/src/adapters/selections'
import { buildVendors } from '/src/configuration/extensions'
import { code } from '/src/vendor/extensions/code'
import { keymaps } from '/src/vendor/extensions/keymaps'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { theme } from '/src/vendor/extensions/theme'

import type Ink from '/types/ink'
import type InkInternal from '/types/internal'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0) {
    return toCodeMirror(selections)
  }
}

export const create = (configuration: InkInternal.Configuration): EditorState => {
  return EditorState.create({
    doc: configuration.options.doc,
    selection: toVendorSelection(configuration.options.selections),
    extensions: [
      history(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      code(),
      keymaps(),
      lineWrapping(),
      theme(),
      ...buildVendors(configuration),
      ...configuration.options.extensions,
    ],
  })
}
