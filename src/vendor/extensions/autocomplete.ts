import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { filterPlugins, partitionPlugins } from '/src/utils/options'
import { pluginTypes } from '/types/values'
import type * as Ink from '/types/ink'

export const autocomplete = (options: Ink.OptionsResolved) => {
  // Todo: Handle lazy-loaded completions.
  const [_lazyCompletions, completions] = partitionPlugins(filterPlugins(pluginTypes.completion, options))

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
