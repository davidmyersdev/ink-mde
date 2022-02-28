import { EditorView } from '@codemirror/view'

import { toCodeMirror, toInk } from '/src/adapters/selections'
import { buildVendorUpdates } from '/src/configuration/extensions'
import { update as updateOptions } from '/src/configuration/instance'
import { create as createState } from '/src/editor/state'
import { style } from '/src/ui/root'

import type Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const api = (configuration: InkInternal.Configuration, view: EditorView): Ink.Instance => {
  const destroy = () => { view.destroy() }
  const doc = () => { return view.state.sliceDoc() }
  const focus = () => { if (!view.hasFocus) { view.focus() } }
  const load = (doc: string) => {
    view.setState(createState({
      ...configuration,
      options: {
        ...configuration.options,
        doc,
      },
    }))
  }
  const reconfigure = (userOptions: Partial<Ink.Options>) => {
    updateOptions(configuration, userOptions)
    style(configuration.options, configuration.root)

    configuration.root.component.$set({ options: configuration.options })

    const effects = buildVendorUpdates(configuration)

    view.dispatch({
      effects,
    })
  }
  const select = (selections: Ink.Editor.Selection[]) => {
    view.dispatch(
      view.state.update({
        selection: toCodeMirror(selections),
      })
    )
  }
  const selections = () => {
    return toInk(view.state.selection)
  }
  const update = (doc: string) => {
    view.dispatch(
      view.state.update({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: doc,
        },
      })
    )
  }

  return {
    destroy,
    doc,
    focus,
    load,
    reconfigure,
    select,
    selections,
    update,
  }
}
