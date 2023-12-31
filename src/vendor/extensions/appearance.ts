import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const appearance = (isDark: boolean): Extension => {
  return [
    EditorView.theme({}, { dark: isDark }),
  ]
}
