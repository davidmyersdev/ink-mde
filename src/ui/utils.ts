import * as InkValues from '/types/values'

import type InkInternal from '/types/internal'
import type InkUi from '/types/ui'

export const createElement = (): InkUi.Element => {
  return document.createElement('div')
}

export const isAutoDark = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const isDark = (appearance: string) => {
  if (appearance === InkValues.Appearance.Dark)
    return true
  if (appearance === InkValues.Appearance.Light)
    return false

  return isAutoDark()
}

export const makeVars = (state: InkInternal.StateResolved) => {
  // Todo: The syntax nodes should be merged with the tag nodes to ensure values are always set correctly. This might
  // require extracting this out into a separate "constants" file or something similar.
  const styles = [
    // --ink-*
    { suffix: 'border-radius', default: '0.25rem' },
    { suffix: 'color', default: 'currentColor' },
    { suffix: 'flex-direction', default: 'column' },
    { suffix: 'font-family', default: 'inherit' },
    // --ink-block-*
    { suffix: 'block-background-color', default: '#121212', light: '#f5f5f5' },
    { suffix: 'block-background-color-on-hover', default: '#0f0f0f', light: '#e0e0e0' },
    { suffix: 'block-max-height', default: '20rem' },
    { suffix: 'block-padding', default: '0.5rem' },
    // --ink-code-*
    { suffix: 'code-background-color', default: 'var(--ink-internal-block-background-color)' },
    { suffix: 'code-color', default: 'inherit' },
    { suffix: 'code-font-family', default: '\'Monaco\', Courier, monospace' },
    // --ink-editor-*
    { suffix: 'editor-font-size', default: '1em' },
    { suffix: 'editor-line-height', default: '2em' },
    { suffix: 'editor-padding', default: '0.5rem' },
    { suffix: 'inline-padding', default: '0.125rem' },
    // --ink-modal-*
    { suffix: 'modal-position', default: 'fixed' },
    // --ink-syntax-*
    { suffix: 'syntax-atom-color', default: '#d19a66' },
    { suffix: 'syntax-comment-color', default: '#abb2bf' },
    { suffix: 'syntax-comment-font-style', default: 'italic' },
    { suffix: 'syntax-emphasis-color', default: 'inherit' },
    { suffix: 'syntax-emphasis-font-style', default: 'italic' },
    { suffix: 'syntax-hashtag-background-color', default: '#222', light: '#eee' },
    { suffix: 'syntax-hashtag-color', default: 'inherit' },
    { suffix: 'syntax-heading-color', default: 'inherit' },
    { suffix: 'syntax-heading-font-weight', default: '600' },
    { suffix: 'syntax-heading1-color', default: 'var(--ink-internal-syntax-heading-color, inherit)' },
    { suffix: 'syntax-heading1-font-size', default: '1.6em' },
    { suffix: 'syntax-heading1-font-weight', default: '600' },
    { suffix: 'syntax-heading2-color', default: 'var(--ink-internal-syntax-heading-color, inherit)' },
    { suffix: 'syntax-heading2-font-size', default: '1.5em' },
    { suffix: 'syntax-heading2-font-weight', default: '600' },
    { suffix: 'syntax-heading3-color', default: 'var(--ink-internal-syntax-heading-color, inherit)' },
    { suffix: 'syntax-heading3-font-size', default: '1.4em' },
    { suffix: 'syntax-heading3-font-weight', default: '600' },
    { suffix: 'syntax-heading4-color', default: 'var(--ink-internal-syntax-heading-color, inherit)' },
    { suffix: 'syntax-heading4-font-size', default: '1.3em' },
    { suffix: 'syntax-heading4-font-weight', default: '600' },
    { suffix: 'syntax-heading5-color', default: 'var(--ink-internal-syntax-heading-color, inherit)' },
    { suffix: 'syntax-heading5-font-size', default: '1.2em' },
    { suffix: 'syntax-heading5-font-weight', default: '600' },
    { suffix: 'syntax-heading6-color', default: 'var(--ink-internal-syntax-heading-color, inherit)' },
    { suffix: 'syntax-heading6-font-size', default: '1.1em' },
    { suffix: 'syntax-heading6-font-weight', default: '600' },
    { suffix: 'syntax-highlight-background-color', default: '#555555' },
    { suffix: 'syntax-keyword-color', default: '#c678dd' },
    { suffix: 'syntax-link-color', default: 'inherit' },
    { suffix: 'syntax-meta-color', default: '#abb2bf' },
    { suffix: 'syntax-monospace-color', default: 'var(--ink-internal-code-color)' },
    { suffix: 'syntax-monospace-font-family', default: 'var(--ink-internal-code-font-family)' },
    { suffix: 'syntax-name-color', default: '#d19a66' },
    { suffix: 'syntax-name-label-color', default: '#abb2bf' },
    { suffix: 'syntax-name-property-color', default: '#96c0d8' },
    { suffix: 'syntax-name-property-definition-color', default: '#e06c75' },
    { suffix: 'syntax-name-variable-color', default: '#e06c75' },
    { suffix: 'syntax-name-variable-definition-color', default: '#e5c07b' },
    { suffix: 'syntax-name-variable-local-color', default: '#d19a66' },
    { suffix: 'syntax-name-variable-special-color', default: 'inherit' },
    { suffix: 'syntax-number-color', default: '#d19a66' },
    { suffix: 'syntax-operator-color', default: '#96c0d8' },
    { suffix: 'syntax-processing-instruction-color', default: '#444444', light: '#bbbbbb' },
    { suffix: 'syntax-punctuation-color', default: '#abb2bf' },
    { suffix: 'syntax-strikethrough-color', default: 'inherit' },
    { suffix: 'syntax-strikethrough-text-decoration', default: 'line-through' },
    { suffix: 'syntax-string-color', default: '#98c379' },
    { suffix: 'syntax-string-special-color', default: 'inherit' },
    { suffix: 'syntax-strong-color', default: 'inherit' },
    { suffix: 'syntax-strong-font-weight', default: '600' },
    { suffix: 'syntax-url-color', default: '#aaaaaa', light: '#666666' },
  ]

  const isLight = !isDark(state.options.interface.appearance)

  return styles.map((style) => {
    const value = isLight && style.light ? style.light : style.default

    return `--ink-internal-${style.suffix}: var(--ink-${style.suffix}, ${value});`
  })
}
