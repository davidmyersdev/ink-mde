import { markdown } from '@codemirror/lang-markdown'
import { LanguageDescription } from '@codemirror/language'

export const languagePlugin = () => {
  return LanguageDescription.of({
    alias: ['e2e'],
    load: async () => markdown(),
    name: 'E2E',
  })
}
