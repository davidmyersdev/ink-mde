import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const baseTheme = (dark: boolean = true): Extension => {
  return EditorView.baseTheme({
    '&': {
      color: 'inherit',
      backgroundColor: 'transparent',
    },
    '.cm-scroller': {
      lineHeight: 'var(--hybrid-mde-line-height, 2em)',
      fontSize: 'var(--hybrid-mde-font-size, 1.1em)',
    },
    '.cm-content': {
      caretColor: 'var(--hybrid-mde-cursor-color, #fff)',
    },
    '::selection': {
      backgroundColor: 'var(--hybrid-mde-selection-color, #557bab)',
    },
  })
}
