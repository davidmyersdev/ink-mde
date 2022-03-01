import { Compartment } from '@codemirror/state'

import { getState } from '/src/state'
import { dark, light } from '/src/vendor/extensions/appearance'
import { attribution as attributionExtension } from '/src/vendor/extensions/attribution'
import { images as imagesExtension } from '/src/vendor/extensions/images'
import { spellcheck as spellcheckExtension } from '/src/vendor/extensions/spellcheck'
import { InkValues } from '/types/ink'

import type Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const buildVendor = (extension: InkInternal.OptionExtension<Ink.Values.Extensions>, options: Ink.Options) => {
  const result = extension.resolver(options)

  return extension.compartment.of(result)
}

export const buildVendors = (ref: InkInternal.Ref) => {
  const state = getState(ref)

  return state.extensions.map((extension) => {
    return buildVendor(extension, state.options)
  })
}

export const buildVendorUpdate = (extension: InkInternal.OptionExtension<Ink.Values.Extensions>, options: Ink.Options) => {
  const result = extension.resolver(options)

  return extension.compartment.reconfigure(result)
}

export const buildVendorUpdates = (ref: InkInternal.Ref) => {
  const state = getState(ref)

  return state.extensions.map((extension) => {
    return buildVendorUpdate(extension, state.options)
  })
}

export const create = <T extends Ink.Options.ExtensionNames>(name: T): InkInternal.OptionExtension<T> => {
  const compartment = new Compartment()
  const resolver = resolvers[name]

  return {
    compartment,
    name,
    resolver,
  }
}

export const createExtensions = () => {
  return [
    create(InkValues.Extensions.Appearance),
    create(InkValues.Extensions.Attribution),
    create(InkValues.Extensions.Images),
    create(InkValues.Extensions.Spellcheck),
  ]
}

export const resolvers: InkInternal.Vendor.ExtensionResolvers = {
  appearance(options: Ink.Options) {
    return options.interface.appearance === InkValues.Appearance.Light ? light() : dark()
  },
  attribution(options: Ink.Options) {
    return options.interface.attribution ? attributionExtension() : []
  },
  images(options: Ink.Options) {
    return options.interface.images ? imagesExtension() : []
  },
  spellcheck(options: Ink.Options) {
    return options.interface.spellcheck ? spellcheckExtension() : []
  },
}
