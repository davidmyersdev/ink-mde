import { EditorView } from '@codemirror/view'
import { deepmerge } from 'deepmerge-ts'
import { makeEditor } from '/src/editor'
import { createExtensions } from '/src/extensions'
import { createElement, mountComponents } from '/src/ui'
import * as InkValues from '/types/values'
import type InkInternal from '/types/internal'

const store = new WeakMap<InkInternal.Ref, InkInternal.State>()

export const blankState = (): InkInternal.State => {
  return {
    components: [],
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
    ref: {},
    root: createElement(),
    target: createElement(),
  }
}

export const getState = (ref: InkInternal.Ref): InkInternal.State => {
  const state = store.get(ref)

  if (!state) {
    return setState(ref, blankState())
  }

  return state
}

export const makeState = (partialState: Partial<InkInternal.State>): InkInternal.Ref => {
  const ref = {}

  // Todo: Generate a blank state object, and then perform a single update (reorganize dependency chain if necessary).
  updateState(ref, partialState)
  updateState(ref, { editor: makeEditor(ref) })
  updateState(ref, { components: mountComponents(ref) })

  return ref
}

export const setState = (ref: InkInternal.Ref, state: InkInternal.State) => {
  store.set(ref, state)

  return state
}

export const updateState = (ref: InkInternal.Ref, partialState: Partial<InkInternal.State>): InkInternal.State => {
  const state = getState(ref)
  const newState = deepmerge(state, partialState) as InkInternal.State

  console.log({ newState })

  return setState(ref, newState)
}
