import { EditorView } from '@codemirror/view'

import { getState } from '/src/state'
import { createVendorState } from '/src/vendor/state'

import type InkInternal from '/types/internal'

export const createEditor = (ref: InkInternal.Ref): InkInternal.Editor => {
  const { root } = getState(ref)

  return new EditorView({
    dispatch(transaction: InkInternal.Vendor.Transaction) {
      const { editor, options } = getState(ref)

      options.hooks.beforeUpdate(transaction.newDoc.toString())
      editor.update([transaction])

      if (transaction.docChanged) {
        options.hooks.afterUpdate(transaction.newDoc.toString())
      }
    },
    parent: root,
    state: createVendorState(ref)
  })
}
