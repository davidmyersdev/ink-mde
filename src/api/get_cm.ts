import { type EditorView } from '@codemirror/view'
import { type CodeMirror } from '@replit/codemirror-vim'
import type InkInternal from '/types/internal'

type EditorViewExtended = EditorView & { cm: CodeMirror }

export const getCM = ([state]: InkInternal.Store) => {
  const { editor } = state()
  return (editor as EditorViewExtended).cm
}
