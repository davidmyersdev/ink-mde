import { defaultKeymap, defaultTabBinding } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { history, historyKeymap } from '@codemirror/history'
import { Compartment, EditorState } from '@codemirror/state'
import { keymap, } from '@codemirror/view'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import SyntaxHighlighting from './highlight'

export const createState = (doc: string): EditorState => {
  const language = new Compartment()

  return EditorState.create({
    doc,
    extensions: [
      SyntaxHighlighting,
      history(),
      language.of([
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
      ]),
      keymap.of([
        defaultTabBinding,
        ...defaultKeymap,
        ...historyKeymap,
        ...commentKeymap,
      ]),
    ],
  })
}
