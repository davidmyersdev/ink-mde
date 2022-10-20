import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'

export const appearance = (isDark: boolean): Extension => {
  return [
    EditorView.theme({}, { dark: isDark }),
  ]
}
