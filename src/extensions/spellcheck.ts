import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const spellcheck = (): Extension => {
  return EditorView.contentAttributes.of({
    'spellcheck': 'true',
  })
}
