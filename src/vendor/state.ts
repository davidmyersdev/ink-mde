import { autocompletion } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import type { EditorSelection } from '@codemirror/state'
import { EditorState } from '@codemirror/state'

import { toCodeMirror } from './adapters/selections'
import { buildVendors } from '/src/extensions'
import { blockquote } from '/src/vendor/extensions/blockquote'
import { code } from '/src/vendor/extensions/code'
import { ink } from '/src/vendor/extensions/ink'
import { keymaps } from '/src/vendor/extensions/keymaps'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { theme } from '/src/vendor/extensions/theme'
import { PluginType } from '/types/values'

import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0)
    return toCodeMirror(selections)
}

export const makeState = (state: InkInternal.StateResolved): InkInternal.Vendor.State => {
  const completions = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Completion ? plugin.value : [])
  const extensions = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Default ? plugin.value : [])
  const grammars = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Grammar ? plugin.value : [])

  return EditorState.create({
    doc: state.options.doc,
    selection: toVendorSelection(state.options.selections),
    extensions: [
      ...buildVendors(state),
      autocompletion({
        defaultKeymap: true,
        icons: false,
        override: completions,
        optionClass: () => 'ink-tooltip-option',
      }),
      blockquote(),
      code(),
      history(),
      ink(),
      keymaps(),
      lineWrapping(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        extensions: grammars,
      }),
      theme(),
      ...extensions,
    ],
  })
}
