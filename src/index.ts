import { Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { createState } from './state'
import { Hybrid, HybridOptions } from './types/hybrid'

const Hybrid = (parentElement: HTMLElement, { value = '', onChange = () => {} }: HybridOptions): Hybrid => {
  const view = new EditorView({
    parent: parentElement,
    state: createState(value),
    dispatch(transaction: Transaction) {
      if (transaction.docChanged) {
        onChange(transaction.newDoc.toString())
      }

      view.update([transaction])
    },
  })

  return {
    destroy() {
      view.destroy()
    },
    focus() {
      view.focus()
    },
    setDoc(doc: string) {
      view.setState(createState(doc))
    },
  }
}

export default Hybrid
