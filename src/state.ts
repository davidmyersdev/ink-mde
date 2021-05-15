import { history } from '@codemirror/history'
import { Compartment, EditorState } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import { codeBlocks } from './extensions/code_blocks'
import { images } from './extensions/images'
import { keymaps } from './extensions/keymaps'
import { lineWrapping } from './extensions/line_wrapping'
import { attribution } from './extensions/attribution'
import { spellcheck } from './extensions/spellcheck'
import { theme } from './extensions/theme'
import { InkOptions } from './types/ink'

export const createState = (options: InkOptions): EditorState => {
  const renderImages = new Compartment()
  const enableAttribution = new Compartment()
  const enableSpellcheck = new Compartment()

  return EditorState.create({
    doc: options.doc,
    selection: options.selection,
    extensions: [
      theme(options),
      history(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      codeBlocks(),
      keymaps(),
      lineWrapping(),
      enableAttribution.of(options.disableAttribution ? [] : attribution()),
      enableSpellcheck.of(options.enableSpellcheck ? spellcheck() : []),
      renderImages.of(options.renderImages ? images() : []),
    ],
  })
}
