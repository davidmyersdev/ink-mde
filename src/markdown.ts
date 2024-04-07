import { markdown as markdownExtension, markdownLanguage } from '@codemirror/lang-markdown'
import { languages as coreLanguages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import { flatten } from '/src/helpers'
import { splitPlugins } from '/src/utils/plugins'
import { type InkInternal, type Options } from '/types'

const makeExtension = (plugins: Options.RecursivePlugin[]) => {
  const { languageDescriptions, markdownExtensions } = splitPlugins(flatten(plugins))

  return markdownExtension({
    base: markdownLanguage,
    codeLanguages: [...coreLanguages, ...languageDescriptions],
    extensions: [...markdownExtensions],
  })
}

export const markdown = (): InkInternal.Extension => {
  const compartment = new Compartment()

  return {
    compartment,
    initialValue: ([state]) => {
      const { plugins } = state().options

      return compartment.of(makeExtension(plugins))
    },
    reconfigure: ([state]) => {
      const { plugins } = state().options

      return compartment.reconfigure(makeExtension(plugins))
    },
  }
}
