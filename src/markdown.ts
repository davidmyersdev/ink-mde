import { markdown as markdownExtension, markdownLanguage } from '@codemirror/lang-markdown'
import { languages as baseLanguages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { type MarkdownExtension } from '@lezer/markdown'
import { reconfigure } from '/src/api/reconfigure'
import { filterPlugins, partitionPlugins } from '/src/utils/options'
import { type InkInternal, type OptionsResolved, pluginTypes } from '/types'

const makeExtension = ([state, setState]: InkInternal.Store) => {
  const baseExtensions = [] as MarkdownExtension[]
  const [lazyExtensions, extensions] = filterExtensions(state().options)
  const [lazyLanguages, languages] = filterLanguages(state().options)

  if (Math.max(lazyExtensions.length, lazyLanguages.length) > 0) {
    Promise.all([...lazyExtensions, ...lazyLanguages]).then(() => {
      reconfigure([state, setState], {})
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

export const markdown = (): InkInternal.Extension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: (store: InkInternal.Store) => {
      return compartment.of(makeExtension(store))
    },
    reconfigure: (store: InkInternal.Store) => {
      return compartment.reconfigure(makeExtension(store))
    },
  }
}
