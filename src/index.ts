import { Compartment, Transaction } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { dark, light } from './extensions/appearance'
import { attribution } from './extensions/attribution'
import { images } from './extensions/images'
import { spellcheck } from './extensions/spellcheck'

import { createState } from './state'
import * as Types from './types/ink'

const ink = (parent: HTMLElement, unsafeOptions: Types.InkUnsafeOptions): Types.Ink => {
  const options: Types.InkOptions = {
    appearance: 'dark',
    attribution: true,
    doc: '',
    extensions: [],
    images: false,
    spellcheck: true,
    onChange: () => {},
    ...unsafeOptions,
  }

  const configurables: Types.InkConfigurables = {
    appearance: {
      build: (appearance) => (appearance === 'dark' ? dark() : light()),
      compartment: new Compartment(),
      default: options.appearance,
    },
    attribution: {
      build: (enabled) => (enabled ? attribution() : []),
      compartment: new Compartment(),
      default: options.attribution,
    },
    images: {
      build: (enabled) => (enabled ? images() : []),
      compartment: new Compartment(),
      default: options.images,
    },
    spellcheck: {
      build: (enabled) => (enabled ? spellcheck() : []),
      compartment: new Compartment(),
      default: options.spellcheck,
    },
  }

  const extensions = Object.entries(configurables).map(([_option, configurable]) => {
    return configurable.compartment.of(configurable.build(configurable.default))
  }).concat(options.extensions)

  const state = createState(options, extensions)
  const view = new EditorView({
    parent,
    state,
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
      // todo: use latest configuration instead of initial extensions
      view.setState(createState({ ...options, doc }, extensions))
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
    reconfigure(updates: Types.InkUpdatableOptions) {
      const effects = []

      if (updates.appearance)
        effects.push(configurables.appearance.compartment.reconfigure(configurables.appearance.build(updates.appearance)))
      if (updates.attribution)
        effects.push(configurables.attribution.compartment.reconfigure(configurables.attribution.build(updates.attribution)))
      if (updates.images)
        effects.push(configurables.images.compartment.reconfigure(configurables.images.build(updates.images)))
      if (updates.spellcheck)
        effects.push(configurables.spellcheck.compartment.reconfigure(configurables.spellcheck.build(updates.spellcheck)))

      view.dispatch({
        effects,
      })
    },
  }
}

export default ink
