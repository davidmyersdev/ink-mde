import { getState } from '/src/state'
import DropZone from '/src/ui/DropZone.svelte'
import { createToolbar } from '/src/ui/toolbar'
import { InkValues } from '/types/values'

import type InkInternal from '/types/internal'
import type InkUi from '/types/ui'

export const createElement = (): InkUi.Element => {
  return document.createElement('div')
}

export const mountComponent = <T>(Component: InkUi.MountableComponent<T>, { props, target }: { props: T, target: HTMLElement }): InkUi.MountedComponent<T> => {
  return new Component({ props, target })
}

export const mountComponents = (ref: InkInternal.Ref): InkUi.MountedComponent<any>[] => {
  const { options, root } = getState(ref)

  if (options.interface.toolbar) {
    root.prepend(createToolbar(ref))
  }

  return [
    mountComponent<any>(DropZone, { props: { ref }, target: root }),
  ]
}

export const styleRoot = (ref: InkInternal.Ref) => {
  const { root, options } = getState(ref)

  const isLight = options.interface.appearance === InkValues.Appearance.Light
  const styles = [
    { suffix: 'all-accent-color', default: '#e06c75' },
    { suffix: 'all-border-radius', default: '0.25rem' },
    { suffix: 'all-color', default: '#fafafa', light: '#171717' },
    { suffix: 'all-font-family', default: 'sans-serif' },
    { suffix: 'block-background-color', default: '#121212', light: '#ededed' },
    { suffix: 'block-background-hover-color', default: '#0f0f0f', light: '#e0e0e0' },
    { suffix: 'block-max-height', default: '20rem' },
    { suffix: 'block-padding', default: '0.5rem' },
    { suffix: 'editor-font-size', default: '1em' },
    { suffix: 'editor-line-height', default: '2em' },
    { suffix: 'editor-padding', default: '0.5rem' },
    { suffix: 'inline-padding', default: '0.125rem' },
    { suffix: 'modal-position', default: 'fixed' },
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
    { suffix: 'syntax-link-color', default: 'inherit' },
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
    { suffix: 'syntax-processing-instruction-color', default: '#444444', light: '#bbbbbb' },
    { suffix: 'syntax-punctuation-color', default: '#abb2bf' },
    { suffix: 'syntax-strikethrough-color', default: 'inherit' },
    { suffix: 'syntax-strikethrough-text-decoration', default: 'line-through' },
    { suffix: 'syntax-string-color', default: '#98c379' },
    { suffix: 'syntax-string-special-color', default: 'inherit' },
    { suffix: 'syntax-strong-color', default: 'inherit' },
    { suffix: 'syntax-strong-font-weight', default: '600' },
    { suffix: 'syntax-url-color', default: '#96c0d8' },
  ]

  root.classList.add('ink')

  styles.forEach((style) => {
    const value = isLight && style.light ? style.light : style.default

    root.style.setProperty(`--ink-internal-${style.suffix}`, `var(--ink-${style.suffix}, ${value})`)
  })
}
