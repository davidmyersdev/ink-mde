import { Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { api } from '/src/editor/api'
import { create as createState } from '/src/editor/state'

import type InkInternal from '/types/internal'

export const create = (configuration: InkInternal.Configuration) => {
  const state = createState(configuration)
  const view = new EditorView({
    dispatch(transaction: Transaction) {
      configuration.options.hooks.beforeUpdate(transaction.newDoc.toString())

      view.update([transaction])

      if (transaction.docChanged) {
        configuration.options.hooks.afterUpdate(transaction.newDoc.toString())
      }
    },
    parent: configuration.root.target,
    state,
  })

  return api(configuration, view)
}
