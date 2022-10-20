import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { PluginType } from '/types/values'
import type * as Ink from '/types/ink'

export const autocomplete = (options: Ink.OptionsResolved) => {
  const completions = options.plugins.flatMap((plugin) => {
    return plugin.type === PluginType.Completion ? plugin.value : []
  })

  return [
    autocompletion({
      defaultKeymap: true,
      icons: false,
      override: completions,
      optionClass: () => 'ink-tooltip-option',
    }),
    closeBrackets(),
  ]
}
