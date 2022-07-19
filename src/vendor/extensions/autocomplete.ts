import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import type { CompletionContext, CompletionResult, CompletionSource } from '@codemirror/autocomplete'
import type { Options } from '/types/ink'

const fromSuggestion = (suggestion: Options.Extensions.Suggestion): CompletionSource => {
  return (context: CompletionContext): CompletionResult | null => {
    const match = context.matchBefore(suggestion.prefix)

    if (!match) { return null }

    return {
      from: match.from + suggestion.offset,
      options: suggestion.values.map((value) => {
        return {
          apply: value.value,
          label: value.label || value.value,
          type: 'text',
        }
      })
    }
  }
}

export const autocomplete = (options: Options) => {
  return [
    autocompletion({
      defaultKeymap: true,
      icons: false,
      override: suggestions.map(fromSuggestion),
      optionClass: () => 'ink-tooltip-option',
    }),
    closeBrackets(),
  ]
}
