import { Compartment, EditorSelection, Extension } from '@codemirror/state'

export type InkAppearance = 'dark' | 'light'
export type InkUpdatableOption = 'appearance' | 'attribution' | 'images' | 'spellcheck'

export interface Ink {
  destroy: () => void
  doc: () => string
  focus: () => void
  load: (doc: string) => void
  reconfigure: (updates: InkUpdatableOptions) => void
  select: (selection: EditorSelection) => void
  selection: () => EditorSelection
  update: (doc: string) => void
}

export interface InkOptions {
  appearance: InkAppearance
  attribution: boolean
  doc: string
  extensions: Extension[]
  images: boolean
  spellcheck: boolean
  onChange: (doc: string) => void
  selection?: EditorSelection
}

export interface InkUnsafeOptions {
  appearance?: InkAppearance
  attribution?: boolean
  doc?: string
  images?: boolean
  selection?: EditorSelection
  spellcheck?: boolean
  onChange?: (doc: string) => void
}

export interface InkUpdatableOptions {
  appearance?: InkAppearance
  attribution?: boolean
  images?: boolean
  spellcheck?: boolean
}

export interface InkConfigurable {
  build: (value: any) => Extension
  compartment: Compartment
  default: any
}

export interface InkConfigurables {
  appearance: InkConfigurable
  attribution: InkConfigurable
  images: InkConfigurable
  spellcheck: InkConfigurable
}
