import { EditorSelection, Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { createState } from './state'
import * as Types from './types/ink'

const ink = (parentElement: HTMLElement, unsafeOptions: Types.InkUnsafeOptions): Types.Ink => {
  const options: Types.InkOptions = {
    appearance: 'dark',
    doc: '',
    onChange: () => {},
    renderImages: false,
    ...unsafeOptions,
  }

  const view = new EditorView({
    parent: parentElement,
    state: createState(options),
    dispatch(transaction: Transaction) {
      view.update([transaction])

      if (transaction.docChanged) {
        options.onChange(transaction.newDoc.toString())
      }
    },
  })

  return {
    destroy() {
      view.destroy()
    },
    doc() {
      return view.state.sliceDoc()
    },
    focus() {
      if (!view.hasFocus) {
        view.focus()
      }
    },
    load(doc: string) {
      view.setState(createState({ ...options, doc }))
    },
    select(selection) {
      view.dispatch(
        view.state.update({
          selection,
        })
      )
    },
    selection() {
      return view.state.selection
    },
    update(doc) {
      view.dispatch(
        view.state.update({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: doc,
          },
        })
      )
    },
  }
}

export default ink
