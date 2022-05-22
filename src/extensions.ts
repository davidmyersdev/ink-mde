import { Compartment, EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'

import { getState } from '/src/state'
import { dark, light } from '/src/vendor/extensions/appearance'
import { attribution as attributionExtension } from '/src/vendor/extensions/attribution'
import { images as imagesExtension } from '/src/vendor/extensions/images'
import { spellcheck as spellcheckExtension } from '/src/vendor/extensions/spellcheck'
import * as InkValues from '/types/values'

import type * as Ink from '/types/ink'
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
    create(InkValues.Extensions.ReadOnly),
    create(InkValues.Extensions.Spellcheck),
    create(InkValues.Extensions.Vim),
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
  readonly(options: Ink.Options) {
    return options.interface.readonly ? EditorState.readOnly.of(true) : EditorState.readOnly.of(false)
  },
  spellcheck(options: Ink.Options) {
    return options.interface.spellcheck ? spellcheckExtension() : []
  },
  vim(options: Ink.Options) {
    return options.vim ? vim() : []
  },
}
