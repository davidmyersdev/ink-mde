import { Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { createState } from './state'
import { Hybrid, HybridOptions, HybridUnsafeOptions } from './types/hybrid'

const Hybrid = (parentElement: HTMLElement, unsafeOptions: HybridUnsafeOptions): Hybrid => {
  const options: HybridOptions = {
    renderImages: false,
    value: '',
    onChange: () => {},
    ...unsafeOptions,
  }

  const view = new EditorView({
    parent: parentElement,
    state: createState(options),
    dispatch(transaction: Transaction) {
      if (transaction.docChanged) {
        options.onChange(transaction.newDoc.toString())
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
    setDoc(value: string) {
      view.setState(createState({ ...options, value }))
    },
  }
}

export default Hybrid
