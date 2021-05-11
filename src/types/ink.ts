type Appearance = 'dark' | 'light'

export interface Ink {
  destroy: () => void
  focus: () => void
  setDoc: (doc: string) => void
}

export interface InkOptions {
  appearance: Appearance
  renderImages: boolean
  value: string
  onChange: (value: string) => void
}

export interface InkUnsafeOptions {
  appearance?: Appearance
  renderImages?: boolean
  value?: string
  onChange?: (value: string) => void
}
