import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const appearance = (isDark: boolean): Extension => {
  return [
    EditorView.theme({
      '.cm-scroller': {
        fontFamily: 'var(--ink-internal-font-family)',
      },
    }, { dark: isDark }),
  ]
}
