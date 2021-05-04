type Appearance = 'dark' | 'light'

export interface Hybrid {
  destroy: () => void
  focus: () => void
  setDoc: (doc: string) => void
}

export interface HybridOptions {
  appearance: Appearance
  renderImages: boolean
  value: string
  onChange: (value: string) => void
}

export interface HybridUnsafeOptions {
  appearance?: Appearance
  renderImages?: boolean
  value?: string
  onChange?: (value: string) => void
}
