import {
  type EditorState,
  StateEffect,
  StateField,
  type Transaction,
} from '@codemirror/state'
import type * as Ink from '/types/ink'

/**
 * Create an updateable state field.
 *
 * @example
 *
* const counter = createConfig(0)
* const editorState = EditorState.create({
*  extensions: [counter],
* })
*
* const effects = counter.update(editorState, 1)
* const transaction = editorState.update({ effects })
*/
export const createConfig = <T>(initial: T, spec: Partial<Parameters<typeof StateField.define<T>>[0]> = {}) => {
  const effectType = StateEffect.define<T>()
  const field = StateField.define<T>({
    create: () => initial,
    update: (value, transaction) => {
      for (const effect of transaction.effects) {
        if (effect.is(effectType)) {
          return effect.value
        }
      }

      return value
    },
    ...spec,
  })

  return Object.assign(field, {
    effectType,
    update: (state: EditorState, value: T): Transaction => {
      return state.update({ effects: effectType.of(value) })
    },
  })
}

export const fullConfig = createConfig<Ink.OptionsResolved>({
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
    appearance: 'auto',
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
  placeholder: '',
  plugins: [],
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
})
