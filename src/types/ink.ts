type Appearance = 'dark' | 'light'

export interface Ink {
  destroy: () => void
  doc: () => string
  focus: () => void
  load: (doc: string) => void
  update: (doc: string) => void
}

export interface InkOptions {
  appearance: Appearance
  doc: string
  onChange: (doc: string) => void
  renderImages: boolean
}

export interface InkUnsafeOptions {
  appearance?: Appearance
  doc?: string
  onChange?: (doc: string) => void
  renderImages?: boolean
}
