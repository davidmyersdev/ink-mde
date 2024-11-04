import type InkInternal from '/types/internal'

export const destroy = (state: InkInternal.StoreState) => {
  const { val: editor } = state.editor

  editor.destroy()
}
