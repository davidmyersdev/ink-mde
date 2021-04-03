export interface Hybrid {
  destroy: () => void
  focus: () => void
  setDoc: (doc: string) => void
}

export interface HybridOptions {
  renderImages: boolean
  value: string
  onChange: (value: string) => void
}

export interface HybridUnsafeOptions {
  renderImages?: boolean
  value?: string
  onChange?: (value: string) => void
}
