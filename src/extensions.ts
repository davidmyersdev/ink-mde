import { Compartment } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { isAutoDark } from '/src/ui/utils'
import { flatten } from '/src/utils/options'
import { appearance } from '/src/vendor/extensions/appearance'
import * as InkValues from '/types/values'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const buildVendors = (state: InkInternal.StateResolved) => {
  const extensions = state.extensions.map(e => e.initialValue(state))

  return extensions
}

export const buildVendorUpdates = (state: InkInternal.StateResolved) => {
  const effects = Promise.all(
    state.extensions.map((extension) => {
      return extension.reconfigure(state.options)
    }),
  )

  return effects
}

export const extension = (resolver: InkInternal.ExtensionResolver): InkInternal.Extension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: (state: InkInternal.StateResolved) => {
      return compartment.of(resolver(state.options))
    },
    reconfigure: (options: Ink.OptionsResolved) => {
      return compartment.reconfigure(resolver(options))
    },
  }
}

export const lazyExtension = (reconfigure: InkInternal.LazyExtensionResolver): InkInternal.LazyExtension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: (_state: InkInternal.StateResolved) => {
      return compartment.of([])
    },
    reconfigure: (options: Ink.OptionsResolved) => {
      return reconfigure(options, compartment)
    },
  }
}

export const createExtensions = () => {
  return [
    ...resolvers.map(r => extension(r)),
    ...lazyResolvers.map(r => lazyExtension(r)),
  ]
}

export const resolvers: InkInternal.ExtensionResolvers = [
  (options: Ink.OptionsResolved) => {
    const extensions = flatten(options.plugins).reduce((matches, plugin) => {
      if (plugin.type === InkValues.PluginType.Default) {
        matches.push(plugin.value)
      }

      return matches
    }, <Ink.VendorExtension[]>[])

    return extensions
  },
  (options: Ink.OptionsResolved) => {
    const grammarPlugins = flatten(options.plugins).reduce((matches, plugin) => {
      if (plugin.type === InkValues.PluginType.Grammar) {
        matches.push(plugin.value)
      }

      return matches
    }, <Ink.VendorGrammar[]>[])
    const languagePlugins = flatten(options.plugins).reduce((matches, plugin) => {
      if (plugin.type === InkValues.PluginType.Language) {
        matches.push(plugin.value)
      }

      return matches
    }, <Ink.VendorLanguage[]>[])

    return markdown({
      base: markdownLanguage,
      codeLanguages: [...languages, ...languagePlugins],
      extensions: [...grammarPlugins],
    })
  },
  (options: Ink.OptionsResolved) => {
    const isDark = options.interface.appearance === InkValues.Appearance.Dark
    const isAuto = options.interface.appearance === InkValues.Appearance.Auto
    const extension = appearance(isDark || (isAuto && isAutoDark()))

    return extension
  },
]

export const lazyResolvers: InkInternal.LazyExtensionResolvers = [
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.interface.autocomplete) {
      const { autocomplete } = await import('/src/vendor/extensions/autocomplete')

      return compartment.reconfigure(autocomplete(options))
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.interface.images) {
      const { images } = await import('/src/vendor/extensions/images')

      return compartment.reconfigure(images())
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.interface.lists) {
      const { lists } = await import('/src/vendor/extensions/lists')

      return compartment.reconfigure(lists())
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.placeholder) {
      const { placeholder } = await import('/src/vendor/extensions/placeholder')

      return compartment.reconfigure(placeholder(options.placeholder))
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.interface.readonly) {
      const { readonly } = await import('/src/vendor/extensions/readonly')

      return compartment.reconfigure(readonly())
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.search) {
      const { search } = await import('/src/vendor/extensions/search')

      return compartment.reconfigure(search())
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.interface.spellcheck) {
      const { spellcheck } = await import('/src/vendor/extensions/spellcheck')

      return compartment.reconfigure(spellcheck())
    }

    return compartment.reconfigure([])
  },
  async (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => {
    if (options.vim) {
      const { vim } = await import('/src/vendor/extensions/vim')

      return compartment.reconfigure(vim())
    }

    return compartment.reconfigure([])
  },
]
