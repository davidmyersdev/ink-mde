import deepmerge from 'deepmerge'

import { defaultOptions } from '/src/configuration/defaults'
import { createDefaults } from '/src/configuration/extensions'
import { init, style } from '/src/ui/root'

import type Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const create = (userOptions: Partial<Ink.Options>): InkInternal.Configuration => {
  const extensions = createDefaults()
  const options = deepmerge(defaultOptions, userOptions)
  const root = init(options)

  style(options, root)

  return {
    extensions,
    options,
    root,
  }
}

export const update = (configuration: InkInternal.Configuration, userOptions: Partial<Ink.Options>) => {
  const options = deepmerge(configuration.options, userOptions)

  configuration.options = options
}
