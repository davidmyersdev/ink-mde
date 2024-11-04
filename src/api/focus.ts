import type InkInternal from '/types/internal'

export const focus = (state: InkInternal.StoreState) => {
  const { val: editor } = state.editor

  if (!editor.hasFocus) {
    editor.focus()
  }
}
