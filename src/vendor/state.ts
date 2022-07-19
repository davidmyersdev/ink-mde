import { autocompletion } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
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
import { extensions as markdownExtensions } from '/src/vendor/extensions/markdown'
import { PluginType } from '/types/values'

import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0) {
    return toCodeMirror(selections)
  }
}

export const createVendorState = (ref: InkInternal.Ref): InkInternal.Vendor.State => {
  const state = getState(ref)
  const completions = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Completion ? plugin.value : [])
  const extensions = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Default ? plugin.value : [])
  const grammars = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Grammar ? plugin.value : [])

  return EditorState.create({
    doc: state.options.doc,
    selection: toVendorSelection(state.options.selections),
    extensions: [
      ...buildVendors(ref),
      autocompletion({
        defaultKeymap: true,
        icons: false,
        override: completions,
        optionClass: () => 'ink-tooltip-option',
      }),
      code(),
      history(),
      keymaps(),
      lineWrapping(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        // Todo: Remove internal extensions...
        extensions: markdownExtensions().concat(grammars),
      }),
      theme(),
      ...extensions,
    ],
  })
}
