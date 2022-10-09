import type InkInternal from '/types/internal'

export const destroy = ([state]: InkInternal.Store) => {
  const { editor } = state()

  editor.destroy()
}
