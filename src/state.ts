import { history } from '@codemirror/history'
import { Compartment, EditorState } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import { codeBlocks } from './extensions/code_blocks'
import { images } from './extensions/images'
import { keymaps } from './extensions/keymaps'
import SyntaxHighlighting from './highlight'
import { HybridOptions } from './types/hybrid'

export const createState = (options: HybridOptions): EditorState => {
  const renderImages = new Compartment()

  return EditorState.create({
    doc: options.value,
    extensions: [
      SyntaxHighlighting,
      history(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      codeBlocks(),
      renderImages.of(options.renderImages ? images() : []),
      keymaps(),
    ],
  })
}
