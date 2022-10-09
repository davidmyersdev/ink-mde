import type InkInternal from '/types/internal'

export const focus = ([state]: InkInternal.Store) => {
  const { editor } = state()

  if (!editor.hasFocus) {
    editor.focus()
  }
}
