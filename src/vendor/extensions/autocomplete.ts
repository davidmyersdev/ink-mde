import { autocompletion } from '@codemirror/autocomplete'
import type { CompletionContext, CompletionSource } from '@codemirror/autocomplete'

const example: CompletionSource = (context: CompletionContext) => {
  const match = context.matchBefore(/\[\[.+/)

  if (!match) { return null }

  console.log({ match })

  return {
    from: match.from + 2,
    options: [
      { label: 'Hello Friend', type: 'text', info: '(World)', apply: 'hi' },
      { label: 'Goodbye Friend', type: 'text', info: '(World)', apply: 'bye' },
      { label: 'What is up', type: 'text', info: '(World)', apply: 'what' },
    ],
  }
}

const completions = <CompletionSource[]>[example]

export const autocomplete = () => {
  return autocompletion({
    defaultKeymap: false,
    override: completions,
  })
}
