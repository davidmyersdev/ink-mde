import { type CompletionSource } from '@codemirror/autocomplete'
import { markdownLanguage } from '@codemirror/lang-markdown'
import { Compartment, type Extension } from '@codemirror/state'
import { flatten } from '/src/helpers'
import { type InkPlugin } from '/src/index'
import { markdown } from '/src/markdown'
import { isAutoDark } from '/src/ui/utils'
import { splitPlugins } from '/src/utils/plugins'
import { appearance } from '/src/vendor/extensions/appearance'
import { type InkInternal } from '/types'
import { appearanceTypes, pluginTypes } from '/types/values'

export const buildVendors = ([state, setState]: InkInternal.Store) => {
  const extensions = state().extensions.map(e => e.initialValue([state, setState]))

  return extensions
}

// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/ExtensionManager.ts#L33
// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/ExtensionManager.ts#L143
// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/helpers/getExtensionField.ts#L13
// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/ExtensionManager.ts#L150
// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/ExtensionManager.ts#L34
// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/ExtensionManager.ts#L48
// https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/ExtensionManager.ts#L56

export const buildVendorUpdates = async ([state, setState]: InkInternal.Store) => {
  const effects = await Promise.all(
    state().extensions.map(async (extension) => {
      return await extension.reconfigure([state, setState])
    }),
  )

  return effects
}

export const extension = (resolver: InkInternal.ExtensionResolver): InkInternal.Extension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: (store: InkInternal.Store) => {
      return compartment.of(resolver(store))
    },
    reconfigure: (store: InkInternal.Store) => {
      return compartment.reconfigure(resolver(store))
    },
  }
}

export const lazyExtension = (reconfigure: InkInternal.LazyExtensionResolver): InkInternal.LazyExtension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: () => {
      return compartment.of([])
    },
    reconfigure: (store: InkInternal.Store) => {
      return reconfigure(store, compartment)
    },
  }
}

export const createExtensions = () => {
  return [
    markdown(),
    ...resolvers.map(r => extension(r)),
    ...lazyResolvers.map(r => lazyExtension(r)),
  ]
}

export const resolvers: InkInternal.ExtensionResolvers = [
  ([state]: InkInternal.Store) => {
    const { plugins } = state().options
    const { extensions } = splitPlugins(flatten(plugins))

    return extensions
  },
  ([state]: InkInternal.Store) => {
    const { plugins } = state().options
    const { completionSources } = splitPlugins(flatten(plugins))
    const extensions = completionSources.map((completionSource) => markdownLanguage.data.of({
      autocomplete: completionSource,
    }))

    return extensions
  },
  ([state]: InkInternal.Store) => {
    const isDark = state().options.interface.appearance === appearanceTypes.dark
    const isAuto = state().options.interface.appearance === appearanceTypes.auto
    const extension = appearance(isDark || (isAuto && isAutoDark()))

    return extension
  },
]

// Todo: Look into RFC templates to maybe start opening up proposals for community feedback?
export const lazyResolvers: InkInternal.LazyExtensionResolvers = [
  // async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
  //   const [lazyExtensions] = partitionPlugins(filterPlugins(pluginTypes.default, state().options))

  //   if (lazyExtensions.length > 0) {
  //     return compartment.reconfigure(await Promise.all(lazyExtensions))
  //   }

  //   return compartment.reconfigure([])
  // },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.images) {
      const { images } = await import('/src/vendor/extensions/images')

      return compartment.reconfigure(images())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    const { keybindings, trapTab } = state().options
    const tab = trapTab ?? keybindings.tab
    const shiftTab = trapTab ?? keybindings.shiftTab

    if (tab || shiftTab) {
      const { indentWithTab } = await import('/src/vendor/extensions/indentWithTab')

      return compartment.reconfigure(indentWithTab({ tab, shiftTab }))
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.lists) {
      const { lists } = await import('/src/vendor/extensions/lists')

      return compartment.reconfigure(lists())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.placeholder) {
      const { placeholder } = await import('/src/vendor/extensions/placeholder')

      return compartment.reconfigure(placeholder(state().options.placeholder))
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.readonly) {
      const { readonly } = await import('/src/vendor/extensions/readonly')

      return compartment.reconfigure(readonly())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.search) {
      const { search } = await import('/src/vendor/extensions/search')

      return compartment.reconfigure(search())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.spellcheck) {
      const { spellcheck } = await import('/src/vendor/extensions/spellcheck')

      return compartment.reconfigure(spellcheck())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.vim) {
      const { vim } = await import('/src/vendor/extensions/vim')

      return compartment.reconfigure(vim())
    }

    return compartment.reconfigure([])
  },
]
