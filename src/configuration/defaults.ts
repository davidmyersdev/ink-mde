import { InkValues } from '/types/ink'

import type Ink from '/types/ink'

export const defaultOptions: Ink.Options = {
  doc: '',
  extensions: [],
  files: {
    clipboard: true,
    dragAndDrop: true,
    hook(files: FileList) {
      console.log({ files })
    },
    injectMarkup: true,
    types: ['image/*'],
  },
  hooks: {
    afterUpdate(_doc) {},
    beforeUpdate(_doc) {},
  },
  interface: {
    appearance: InkValues.Appearance.Dark,
    attribution: true,
    images: false,
    spellcheck: true,
  },
  selections: [],
}
