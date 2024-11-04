import type InkInternal from '/types/internal'

export const update = (state: InkInternal.StoreState, doc: string) => {
  const { val: editor } = state.editor

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
