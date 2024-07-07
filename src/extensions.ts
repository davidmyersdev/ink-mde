import { Compartment } from '@codemirror/state'
import { markdown } from '/src/markdown'
import { isAutoDark } from '/src/ui/utils'
import { filterPlugins, partitionPlugins } from '/src/utils/options'
import { type InkInternal } from '/types'
import { appearanceTypes, pluginTypes } from '/types/values'
import { appearance } from './editor/extensions/appearance'

export const buildVendors = ([state, setState]: InkInternal.Store) => {
  const extensions = state().extensions.map(e => e.initialValue([state, setState]))

  return extensions
}

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
    const [_lazyExtensions, extensions] = partitionPlugins(filterPlugins(pluginTypes.default, state().options))

    return extensions
  },
  ([state]: InkInternal.Store) => {
    const isDark = state().options.interface.appearance === appearanceTypes.dark
    const isAuto = state().options.interface.appearance === appearanceTypes.auto
    const extension = appearance(isDark || (isAuto && isAutoDark()))

    return extension
  },
]

export const lazyResolvers: InkInternal.LazyExtensionResolvers = [
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    const [lazyExtensions] = partitionPlugins(filterPlugins(pluginTypes.default, state().options))

    if (lazyExtensions.length > 0) {
      return compartment.reconfigure(await Promise.all(lazyExtensions))
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.autocomplete) {
      const { autocomplete } = await import('./editor/extensions/autocomplete')

      return compartment.reconfigure(autocomplete(state().options))
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.images) {
      const { images } = await import('./editor/extensions/images')

      return compartment.reconfigure(images())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    const { keybindings, trapTab } = state().options
    const tab = trapTab ?? keybindings.tab
    const shiftTab = trapTab ?? keybindings.shiftTab

    if (tab || shiftTab) {
      const { indentWithTab } = await import('./editor/extensions/indentWithTab')

      return compartment.reconfigure(indentWithTab({ tab, shiftTab }))
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    const { options } = state()

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
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.placeholder) {
      const { placeholder } = await import('./editor/extensions/placeholder')

      return compartment.reconfigure(placeholder(state().options.placeholder))
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.readonly) {
      const { readonly } = await import('./editor/extensions/readonly')

      return compartment.reconfigure(readonly())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.search) {
      const { search } = await import('./editor/extensions/search')

      return compartment.reconfigure(search())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.interface.spellcheck) {
      const { spellcheck } = await import('./editor/extensions/spellcheck')

      return compartment.reconfigure(spellcheck())
    }

    return compartment.reconfigure([])
  },
  async ([state]: InkInternal.Store, compartment: InkInternal.Vendor.Compartment) => {
    if (state().options.vim) {
      const { vim } = await import('./editor/extensions/vim')

      return compartment.reconfigure(vim())
    }

    return compartment.reconfigure([])
  },
]
