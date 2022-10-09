import type InkInternal from '/types/internal'

export const getDoc = ([state]: InkInternal.Store) => {
  const { editor } = state()

  return editor.state.sliceDoc()
}
