import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const dark = (): Extension => {
  return [
    EditorView.theme({}, { dark: true }),
  ]
}

export const light = (): Extension => {
  return [
    EditorView.theme({}, { dark: false }),
  ]
}
