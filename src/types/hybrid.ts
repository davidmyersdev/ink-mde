import { EditorView } from '@codemirror/view'

export interface Hybrid {
  view: EditorView
}

export interface HybridOptions {
  value: string
  onChange: (value: string) => void
}
