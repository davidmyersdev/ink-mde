import { InkValues } from '/types/ink'

import type Ink from '/types/ink'

export const defaultOptions: Ink.Options = {
  doc: '',
  extensions: [],
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
    appearance: InkValues.Appearance.Dark,
    attribution: true,
    images: false,
    spellcheck: true,
  },
  selections: [],
}
