import { EditorSelection } from '@codemirror/state'

type Appearance = 'dark' | 'light'

export interface Ink {
  destroy: () => void
  doc: () => string
  focus: () => void
  load: (doc: string) => void
  select: (selection: EditorSelection) => void
  selection: () => EditorSelection
  update: (doc: string) => void
}

export interface InkOptions {
  appearance: Appearance
  doc: string
  onChange: (doc: string) => void
  renderImages: boolean
  selection?: EditorSelection
}

export interface InkUnsafeOptions {
  appearance?: Appearance
  doc?: string
  onChange?: (doc: string) => void
  renderImages?: boolean
  selection?: EditorSelection
}
