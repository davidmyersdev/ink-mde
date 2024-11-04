import { Compartment } from '@codemirror/state'
import { markdown } from '/src/markdown'
import { isAutoDark } from '/src/ui/utils'
import { filterPlugins, partitionPlugins } from '/src/utils/options'
import { type InkInternal } from '/types'
import { appearanceTypes, pluginTypes } from '/types/values'
import { appearance } from './editor/extensions/appearance'

export const buildVendors = (state: InkInternal.StoreState) => {
  const extensions = state.extensions.val.map(e => e.initialValue(state))

  return extensions
}

export const buildVendorUpdates = async (state: InkInternal.StoreState) => {
  const effects = await Promise.all(
    state.extensions.val.map(async (extension) => {
      return await extension.reconfigure(state)
    }),
  )

  return effects
}

export const extension = (resolver: InkInternal.ExtensionResolver): InkInternal.Extension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: (state: InkInternal.StoreState) => {
      return compartment.of(resolver(state))
    },
    reconfigure: (state: InkInternal.StoreState) => {
      return compartment.reconfigure(resolver(state))
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
    reconfigure: (state: InkInternal.StoreState) => {
      return reconfigure(state, compartment)
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
  (state: InkInternal.StoreState) => {
    const [_lazyExtensions, extensions] = partitionPlugins(filterPlugins(pluginTypes.default, state.options.val))

    return extensions
  },
  (state: InkInternal.StoreState) => {
    const isDark = state.options.val.interface.appearance === appearanceTypes.dark
    const isAuto = state.options.val.interface.appearance === appearanceTypes.auto
    const extension = appearance(isDark || (isAuto && isAutoDark()))

    return extension
  },
]

export const lazyResolvers: InkInternal.LazyExtensionResolvers = [
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    const [lazyExtensions] = partitionPlugins(filterPlugins(pluginTypes.default, state.options.val))

    if (lazyExtensions.length > 0) {
      return compartment.reconfigure(await Promise.all(lazyExtensions))
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.interface.autocomplete) {
      const { autocomplete } = await import('./editor/extensions/autocomplete')

      return compartment.reconfigure(autocomplete(state.options.val))
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.interface.images) {
      const { images } = await import('./editor/extensions/images')

      return compartment.reconfigure(images())
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    const { keybindings, trapTab } = state.options.val
    const tab = trapTab ?? keybindings.tab
    const shiftTab = trapTab ?? keybindings.shiftTab

    if (tab || shiftTab) {
      const { indentWithTab } = await import('./editor/extensions/indentWithTab')

      return compartment.reconfigure(indentWithTab({ tab, shiftTab }))
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    const { val: options } = state.options

    if (options.lists || options.interface.lists) {
      const { lists } = await import('./editor/extensions/lists')

      let bullet = true
      let number = true
      let task = true

      if (typeof options.lists === 'object') {
        bullet = typeof options.lists.bullet === 'undefined' ? false : options.lists.bullet
        number = typeof options.lists.number === 'undefined' ? false : options.lists.number
        task = typeof options.lists.task === 'undefined' ? false : options.lists.task
      }

      return compartment.reconfigure(lists({ bullet, number, task }))
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.placeholder) {
      const { placeholder } = await import('./editor/extensions/placeholder')

      return compartment.reconfigure(placeholder(state.options.val.placeholder))
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.interface.readonly) {
      const { readonly } = await import('./editor/extensions/readonly')

      return compartment.reconfigure(readonly())
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.search) {
      const { search } = await import('./editor/extensions/search')

      return compartment.reconfigure(search())
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.interface.spellcheck) {
      const { spellcheck } = await import('./editor/extensions/spellcheck')

      return compartment.reconfigure(spellcheck())
    }

    return compartment.reconfigure([])
  },
  async (state: InkInternal.StoreState, compartment: InkInternal.Vendor.Compartment) => {
    if (state.options.val.vim) {
      const { vim } = await import('./editor/extensions/vim')

      return compartment.reconfigure(vim())
    }

    return compartment.reconfigure([])
  },
]
