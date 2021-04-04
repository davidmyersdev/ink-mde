import { history } from '@codemirror/history'
import { Compartment, EditorState } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import { codeBlocks } from './extensions/code_blocks'
import { images } from './extensions/images'
import { keymaps } from './extensions/keymaps'
import { syntaxHighlighting } from './extensions/syntax_highlighting'
import { HybridOptions } from './types/hybrid'

export const createState = (options: HybridOptions): EditorState => {
  const renderImages = new Compartment()

  return EditorState.create({
    doc: options.value,
    extensions: [
      syntaxHighlighting(),
      history(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      codeBlocks(),
      keymaps(),
      renderImages.of(options.renderImages ? images() : []),
    ],
  })
}
