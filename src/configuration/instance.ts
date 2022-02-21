import deepmerge from 'deepmerge'

import { defaultOptions } from '/src/configuration/defaults'
import { createDefaults } from '/src/configuration/extensions'

import type Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const createConfiguration = (userOptions: Partial<Ink.Options>): InkInternal.Configuration => {
  const options = deepmerge(defaultOptions, userOptions)
  const extensions = createDefaults()

  return {
    options,
    extensions,
  }
}

export const updateOptions = (configuration: InkInternal.Configuration, userOptions: Partial<Ink.Options>) => {
  const options = deepmerge(configuration.options, userOptions)

  configuration.options = options
}
