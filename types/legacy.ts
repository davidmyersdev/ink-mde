import type { EditorSelection, Extension } from '@codemirror/state'
import type * as Ink from '/types/ink'

export interface InkLegacyOptions {
  appearance: Ink.Values.Appearance
  attribution: boolean
  doc: string
  extensions: Extension[]
  images: boolean
  spellcheck: boolean
  onChange: (doc: string) => void
  selection?: EditorSelection
}
