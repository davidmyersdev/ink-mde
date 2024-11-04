import type InkInternal from '/types/internal'

export const getDoc = (state: InkInternal.StoreState) => {
  const { val: editor } = state.editor

  return editor.state.sliceDoc()
}
