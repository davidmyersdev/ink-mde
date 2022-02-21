import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const lineWrapping = (): Extension => {
  return EditorView.lineWrapping
}
