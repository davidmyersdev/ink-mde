import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import type { CompletionContext } from '@codemirror/autocomplete'

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

export const autocomplete = (completions: any) => {
  const overrides = completions.map((completion: any) => {
    return (context: CompletionContext) => {
      const regex = new RegExp(`${escape(completion.prefix)}.*?`)
      const match = context.matchBefore(regex)

      // Todo: Check match without suffix _and_ match with suffix. If matching without suffix, inject suffix too.
      if (!match) { return null }

      console.log('does this count')

      return {
        from: match.from + completion.prefix.length,
        options: completion.suggestions.map(fromSuggestion),
      }
    }
  })

  return [
    autocompletion({
      closeOnBlur: false, // Todo: Remove this.
      defaultKeymap: true,
      icons: false,
      override: overrides,
      optionClass: () => 'ink-tooltip-option',
    }),
    closeBrackets(),
  ]
}
