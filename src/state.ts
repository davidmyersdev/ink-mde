import { defaultKeymap, defaultTabBinding } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { history, historyKeymap } from '@codemirror/history'
import { Compartment, EditorState } from '@codemirror/state'
import { keymap, } from '@codemirror/view'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import { images } from './extensions/images'
import { codeBlocks } from './extensions/code_blocks'
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
      keymap.of([
        defaultTabBinding,
        ...defaultKeymap,
        ...historyKeymap,
        ...commentKeymap,
      ]),
    ],
  })
}
