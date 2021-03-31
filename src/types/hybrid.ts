export interface Hybrid {
  destroy: () => void
  focus: () => void
  setDoc: (doc: string) => void
}

export interface HybridOptions {
  value: string
  onChange: (value: string) => void
}
