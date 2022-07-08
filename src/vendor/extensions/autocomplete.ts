import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import type { CompletionContext, CompletionSource } from '@codemirror/autocomplete'

const escape = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const fromSuggestion = (suggestion: any) => {
  return {
    apply: suggestion.insert,
    label: suggestion.text,
    type: 'text',
  }
}

export const autocomplete = (suggestions: CompletionSource[]) => {
  // const overrides = suggestions.map((suggestion: CompletionSource) => {
  //   return (context: CompletionContext) => {
  //     const regex = new RegExp(`${escape(completion.prefix)}.*?`)
  //     const match = context.matchBefore(regex)

  //     // Todo: Check match without suffix _and_ with suffix. If matching without suffix, inject suffix too.
  //     if (!match) { return null }

  //     console.log('does this count')

  //     return {
  //       from: match.from + completion.prefix.length,
  //       options: completion.suggestions.map(fromSuggestion),
  //     }
  //   }
  // })

  return [
    autocompletion({
      closeOnBlur: false, // Todo: Remove this.
      defaultKeymap: true,
      icons: false,
      override: suggestions,
      optionClass: () => 'ink-tooltip-option',
    }),
    closeBrackets(),
  ]
}
