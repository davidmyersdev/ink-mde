import { EditorView } from '@codemirror/view'
import { makeState } from '/src/vendor/state'
import type InkInternal from '/types/internal'

export const makeEditor = (state: InkInternal.StateResolved): InkInternal.Editor => {
  const editor = new EditorView({
    dispatch: (transaction: InkInternal.Vendor.Transaction) => {
      const { options } = state

      options.hooks.beforeUpdate(transaction.newDoc.toString())
      editor.update([transaction])

      if (transaction.docChanged)
        options.hooks.afterUpdate(transaction.newDoc.toString())
    },
    state: makeState(state),
  })

  return editor
}
