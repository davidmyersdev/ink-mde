import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'
import { definePlugin } from '/src/index'

export const autocomplete = () => {
  return definePlugin({
    addExtensions: () => [
      autocompletion({
        defaultKeymap: true,
        icons: false,
        optionClass: () => 'autocomplete-tooltip-option',
        tooltipClass: () => 'autocomplete-tooltip',
      }),
      closeBrackets(),
      EditorView.baseTheme({
        '.autocomplete-tooltip': {
          'background-color': 'var(--ink-internal-block-background-color)',
          'border-radius': 'var(--ink-internal-border-radius)',
          'font-family': 'inherit',
          'padding': '0.25rem',
        },
        '.autocomplete-tooltip ul': {
          'font-family': 'inherit !important',
        },
        '.autocomplete-tooltip .autocomplete-tooltip-option': {
          'border-radius': 'var(--ink-internal-border-radius)',
          'padding': '0.25rem',
        },
        '.autocomplete-tooltip .autocomplete-tooltip-option[aria-selected]': {
          'background-color': 'rgba(150, 150, 150, 0.25)',
        },
        'autocomplete-tooltip .autocomplete-tooltip-option .cm-completionLabel': {
          'font-family': 'inherit',
        },
      }),
    ],
  })
}
