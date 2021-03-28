import { defaultKeymap, defaultTabBinding } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { history, historyKeymap } from '@codemirror/history'
import { EditorState, Compartment } from '@codemirror/state'
import { keymap, EditorView } from '@codemirror/view'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import SyntaxHighlighting from './highlight'

const HybridMDE = (element) => {
  const language = new Compartment()

  return new EditorView({
    state: EditorState.create({
      doc: '',
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
    }),
    parent: element,
  })
}

export default HybridMDE
