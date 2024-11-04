import * as van from '/lib/vanjs'
import { katex } from '/plugins/katex'
import { createExtensions } from '/src/extensions'
import { override } from '/src/utils/merge'
import { makeQueue } from '/src/utils/queue'
import type { Options } from '/types/ink'
import type InkInternal from '/types/internal'
import * as InkValues from '/types/values'
import { createElement } from './ui/utils'

export const blankState = (): InkInternal.StateResolved => {
  const options = {
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
      lists: false,
      readonly: false,
      spellcheck: true,
      toolbar: false,
    },
    katex: false,
    keybindings: {
      // Todo: Set these to false by default. https://codemirror.net/examples/tab
      tab: true,
      shiftTab: true,
    },
    lists: false,
    placeholder: '',
    plugins: [
      katex(),
    ],
    readability: false,
    search: true,
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
    // This value overrides both `tab` and `shiftTab` keybindings.
    trapTab: undefined,
    vim: false,
  }

  return {
    doc: '',
    editor: {} as InkInternal.Editor,
    extensions: createExtensions(),
    options,
    root: createElement(),
    target: createElement(),
    workQueue: makeQueue(),
  }
}

export const makeState = (partialState: InkInternal.State): InkInternal.StateResolved => {
  return override(blankState(), partialState)
}

export const makeStore = (userOptions: Options, overrides: InkInternal.State = {}): InkInternal.StoreState => {
  const {
    doc,
    editor,
    extensions,
    options,
    root,
    target,
    workQueue,
  } = makeState({ ...overrides, doc: userOptions.doc || '', options: userOptions })

  return {
    doc: van.state(doc),
    editor: van.state(editor),
    extensions: van.state(extensions),
    options: van.state(options),
    root: van.state(root),
    // root: { val: root, rawVal: root, oldVal: root },
    target: van.state(target),
    // target: { val: target, rawVal: target, oldVal: target },
    workQueue: van.state(workQueue),
  }
}

export const updateStore = (state: InkInternal.StoreState, overrides: InkInternal.State = {}) => {
  const {
    doc,
    editor,
    extensions,
    options,
    root,
    target,
    workQueue,
  } = overrides

  if (doc) state.doc.val = override(state.doc.val, doc)
  if (editor) state.editor.val = override(state.editor.val, editor)
  if (extensions) state.extensions.val = override(state.extensions.val, extensions)
  if (options) state.options.val = override(state.options.val, options)
  if (root) state.root.val = override(state.root.val, root)
  if (target) state.target.val = override(state.target.val, target)
  if (workQueue) state.workQueue.val = override(state.workQueue.val, workQueue)
}
