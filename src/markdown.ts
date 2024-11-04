import { markdown as markdownExtension, markdownLanguage } from '@codemirror/lang-markdown'
import { languages as baseLanguages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { type MarkdownExtension } from '@lezer/markdown'
import { buildVendorUpdates } from '/src/extensions'
import { filterPlugins, partitionPlugins } from '/src/utils/options'
import { type InkInternal, type OptionsResolved, pluginTypes } from '/types'

const makeExtension = (state: InkInternal.StoreState) => {
  const baseExtensions = [] as MarkdownExtension[]
  const [lazyExtensions, extensions] = filterExtensions(state.options.val)
  const [lazyLanguages, languages] = filterLanguages(state.options.val)

  if (Math.max(lazyExtensions.length, lazyLanguages.length) > 0) {
    state.workQueue.val.enqueue(async () => {
      const effects = await buildVendorUpdates(state)

      state.editor.val.dispatch({ effects })
    })
  }

  return markdownExtension({
    base: markdownLanguage,
    codeLanguages: [...baseLanguages, ...languages],
    extensions: [...baseExtensions, ...extensions],
  })
}

const filterExtensions = (options: OptionsResolved) => {
  return partitionPlugins(filterPlugins(pluginTypes.grammar, options))
}

const filterLanguages = (options: OptionsResolved) => {
  return partitionPlugins(filterPlugins(pluginTypes.language, options))
}

const updateExtension = async (state: InkInternal.StoreState) => {
  const baseExtensions = [] as MarkdownExtension[]
  const extensions = await Promise.all(filterPlugins(pluginTypes.grammar, state.options.val))
  const languages = await Promise.all(filterPlugins(pluginTypes.language, state.options.val))

  return markdownExtension({
    base: markdownLanguage,
    codeLanguages: [...baseLanguages, ...languages],
    extensions: [...baseExtensions, ...extensions],
  })
}

export const markdown = (): InkInternal.Extension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: (state: InkInternal.StoreState) => {
      return compartment.of(makeExtension(state))
    },
    reconfigure: async (state: InkInternal.StoreState) => {
      return compartment.reconfigure(await updateExtension(state))
    },
  }
}
