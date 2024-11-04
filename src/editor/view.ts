import { EditorView } from '@codemirror/view'
import { updateStore } from '/src/store'
import type InkInternal from '/types/internal'
import { createState } from './state'

export const createView = (state: InkInternal.StoreState, target?: HTMLElement): InkInternal.Editor => {
  const rootNode = target?.getRootNode()
  const root = rootNode?.nodeType === 11 ? rootNode as ShadowRoot : undefined

  const editor = new EditorView({
    dispatch: (transaction: InkInternal.Vendor.Transaction) => {
      const { val: options } = state.options
      const newDoc = transaction.newDoc.toString()

      options.hooks.beforeUpdate(newDoc)
      editor.update([transaction])

      if (transaction.docChanged) {
        updateStore(state, { doc: newDoc })

        options.hooks.afterUpdate(newDoc)
      }
    },
    root,
    state: createState(state),
  })

  return editor
}
