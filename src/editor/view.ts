import { EditorView } from '@codemirror/view'
import type InkInternal from '/types/internal'
import { createState } from './state'

export const createView = ([state, setState]: InkInternal.Store, target?: HTMLElement): InkInternal.Editor => {
  const rootNode = target?.getRootNode()
  const root = rootNode?.nodeType === 11 ? rootNode as ShadowRoot : undefined

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
    root,
    state: createState([state, setState]),
  })

  return editor
}
