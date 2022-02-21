import { Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { toCodeMirror, toInk } from '/src/adapters/selections'
import { buildVendorUpdates } from '/src/configuration/extensions'
import { createConfiguration, updateOptions } from '/src/configuration/instance'
import { createState } from '/src/state'

import type Ink from '/types/ink'

export * from '/src/vendor/extensions/extension'

const ink = (parent: HTMLElement, options: Partial<Ink.Options>): Ink.Instance => {
  const configuration = createConfiguration(options)
  const state = createState(configuration)
  const view = new EditorView({
    state,
    parent,
    dispatch(transaction: Transaction) {
      configuration.options.hooks.beforeUpdate(transaction.newDoc.toString())

      view.update([transaction])

      if (transaction.docChanged) {
        configuration.options.hooks.afterUpdate(transaction.newDoc.toString())
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
      view.setState(createState({
        ...configuration,
        options: {
          ...configuration.options,
          doc,
        },
      }))
    },
    select(selections) {
      view.dispatch(
        view.state.update({
          selection: toCodeMirror(selections),
        })
      )
    },
    selections() {
      return toInk(view.state.selection)
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
    reconfigure(userOptions: Partial<Ink.Options>) {
      updateOptions(configuration, userOptions)

      const effects = buildVendorUpdates(configuration)

      view.dispatch({
        effects,
      })
    },
  }
}

export default ink
