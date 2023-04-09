import { EditorView } from '@codemirror/view'
import { makeState } from '/src/vendor/state'
import type InkInternal from '/types/internal'

export const makeEditor = ([state, setState]: InkInternal.Store): InkInternal.Editor => {
  const editor = new EditorView({
    dispatch: (transaction: InkInternal.Vendor.Transaction) => {
      const { options } = state()
      const newDoc = transaction.newDoc.toString()

      options.hooks.beforeUpdate(newDoc)
      editor.update([transaction])

      if (transaction.docChanged) {
        setState({ ...state(), doc: newDoc })

        options.hooks.afterUpdate(newDoc)
      }
    },
    state: makeState([state, setState]),
  })

  return editor
}
