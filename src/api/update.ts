import type InkInternal from '/types/internal'

export const update = ([state]: InkInternal.Store, doc: string) => {
  const { editor } = state()

  editor.dispatch(
    editor.state.update({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: doc,
      },
    }),
  )
}
