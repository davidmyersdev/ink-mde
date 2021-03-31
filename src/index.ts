import { defaultKeymap, defaultTabBinding } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { history, historyKeymap } from '@codemirror/history'
import { EditorState, Compartment, Transaction } from '@codemirror/state'
import { keymap, EditorView } from '@codemirror/view'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import SyntaxHighlighting from './highlight'
import { Hybrid, HybridOptions } from './types/hybrid'

const Hybrid = (parentElement: HTMLElement, { value = '', onChange = () => {} }: HybridOptions): Hybrid => {
  const language = new Compartment()
  const view = new EditorView({
    parent: parentElement,
    state: EditorState.create({
      doc: value,
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
    dispatch(transaction: Transaction) {
      if (transaction.docChanged) {
        onChange(transaction.newDoc.toString())
      }

      view.update([transaction])
    },
  })

  return {
    view,
  }
}

export default Hybrid
