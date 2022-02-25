import DropZone from '/src/ui/DropZone.svelte'
import { InkValues } from '/types/ink'

import type Ink from '/types/ink'
import type InkUi from '/types/ui'

export const init = (options: Ink.Options): InkUi.Root => {
  const root = mount<any>(DropZone, { options: options })

  return root
}

export const mount = <T>(Component: InkUi.MountableComponent<T>, props: T): InkUi.MountedComponent<T> => {
  const target = document.createElement('div')
  const component = new Component({ props, target })

  return {
    component,
    target,
  }
}

export const style = (options: Ink.Options, root: InkUi.Root) => {
  const isLight = options.interface.appearance === InkValues.Appearance.Light
  const styles = [
    { suffix: 'all-accent-color', default: '#e06c75' },
    { suffix: 'all-border-radius', default: '0.25rem' },
    { suffix: 'all-color', default: '#fafafa', light: '#171717' },
    { suffix: 'all-font-family', default: 'sans-serif' },
    { suffix: 'block-background-color', default: '#121212', light: '#ededed' },
    { suffix: 'block-max-height', default: '20rem' },
    { suffix: 'block-padding', default: '0.5rem' },
    { suffix: 'editor-font-size', default: '1em' },
    { suffix: 'editor-line-height', default: '2em' },
    { suffix: 'editor-padding', default: '0.5rem' },
    { suffix: 'inline-padding', default: '0.125rem' },
    { suffix: 'modal-position', default: 'absolute' },
    { suffix: 'monospace-font-family', default: 'monospace' },
    { suffix: 'syntax-atom-color', default: '#d19a66' },
    { suffix: 'syntax-comment-color', default: '#abb2bf' },
    { suffix: 'syntax-comment-font-style', default: 'italic' },
    { suffix: 'syntax-emphasis-color', default: 'inherit' },
    { suffix: 'syntax-emphasis-font-style', default: 'italic' },
    { suffix: 'syntax-heading-color', default: '#e06c75' },
    { suffix: 'syntax-heading-font-weight', default: '600' },
    { suffix: 'syntax-heading1-color', default: '#e06c75' },
    { suffix: 'syntax-heading1-font-size', default: '1.6em' },
    { suffix: 'syntax-heading1-font-weight', default: '600' },
    { suffix: 'syntax-heading2-color', default: '#e06c75' },
    { suffix: 'syntax-heading2-font-size', default: '1.5em' },
    { suffix: 'syntax-heading2-font-weight', default: '600' },
    { suffix: 'syntax-heading3-color', default: '#e06c75' },
    { suffix: 'syntax-heading3-font-size', default: '1.4em' },
    { suffix: 'syntax-heading3-font-weight', default: '600' },
    { suffix: 'syntax-heading4-color', default: '#e06c75' },
    { suffix: 'syntax-heading4-font-size', default: '1.3em' },
    { suffix: 'syntax-heading4-font-weight', default: '600' },
    { suffix: 'syntax-heading5-color', default: '#e06c75' },
    { suffix: 'syntax-heading5-font-size', default: '1.2em' },
    { suffix: 'syntax-heading5-font-weight', default: '600' },
    { suffix: 'syntax-heading6-color', default: '#e06c75' },
    { suffix: 'syntax-heading6-font-size', default: '1.1em' },
    { suffix: 'syntax-heading6-font-weight', default: '600' },
    { suffix: 'syntax-keyword-color', default: '#c678dd' },
    { suffix: 'syntax-link-color', default: '#96c0d8' },
    { suffix: 'syntax-meta-color', default: '#abb2bf' },
    { suffix: 'syntax-monospace-color', default: 'inherit' },
    { suffix: 'syntax-monospace-font-family', default: 'var(--ink-internal-monospace-font-family)' },
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
    { suffix: 'syntax-processing-instruction-color', default: '#36454f' },
    { suffix: 'syntax-punctuation-color', default: '#abb2bf' },
    { suffix: 'syntax-strikethrough-color', default: 'inherit' },
    { suffix: 'syntax-strikethrough-text-decoration', default: 'line-through' },
    { suffix: 'syntax-string-color', default: '#98c379' },
    { suffix: 'syntax-string-special-color', default: 'inherit' },
    { suffix: 'syntax-strong-color', default: 'inherit' },
    { suffix: 'syntax-strong-font-weight', default: '600' },
    { suffix: 'syntax-url-color', default: '#96c0d8' },
  ]

  styles.forEach((style) => {
    const value = isLight && style.light ? style.light : style.default

    root.target.style.setProperty(`--ink-internal-${style.suffix}`, `var(--ink-${style.suffix}, ${value})`)
  })
}
