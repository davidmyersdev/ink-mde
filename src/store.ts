import { EditorView } from '@codemirror/view'
import { createSignal } from 'solid-js'
import { override } from '/src/utils/deepmerge'
import { createExtensions } from '/src/extensions'
import { createElement } from './ui/utils'
import * as InkValues from '/types/values'
import type { Options } from '/types/ink'
import type InkInternal from '/types/internal'

export const blankState = (): InkInternal.StateResolved => {
  return {
    editor: new EditorView(),
    extensions: createExtensions(),
    options: {
      doc: '',
      files: {
        clipboard: false,
        dragAndDrop: false,
        handler: () => {},
        injectMarkup: true,
        types: ['image/*'],
      },
      hooks: {
        afterUpdate: () => {},
        beforeUpdate: () => {},
      },
      interface: {
        appearance: InkValues.Appearance.Auto,
        attribution: true,
        autocomplete: false,
        images: false,
        readonly: false,
        spellcheck: true,
        toolbar: false,
      },
      plugins: [],
      selections: [],
      toolbar: {
        bold: true,
        code: true,
        codeBlock: true,
        heading: true,
        image: true,
        italic: true,
        link: true,
        list: true,
        orderedList: true,
        quote: true,
        taskList: true,
        upload: false,
      },
      vim: false,
    },
    root: createElement(),
    target: createElement(),
  }
}

export const makeState = (partialState: InkInternal.State): InkInternal.StateResolved => {
  return override(blankState(), partialState)
}

export const makeStore = (options: Options): InkInternal.Store => {
  const [state, setState] = createSignal(makeState({ options }))

  return [state, setState]
}
