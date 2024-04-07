import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { tags } from '@lezer/highlight'

export const theme = (): Extension => {
  const extension = syntaxHighlighting(
    HighlightStyle.define([
      // ordered by lowest to highest precedence
      {
        tag: tags.atom,
        color: 'var(--ink-internal-syntax-atom-color)',
      },
      {
        tag: tags.meta,
        color: 'var(--ink-internal-syntax-meta-color)',
      },
      // emphasis types
      {
        tag: tags.emphasis,
        color: 'var(--ink-internal-syntax-emphasis-color)',
        fontStyle: 'var(--ink-internal-syntax-emphasis-font-style)',
      },
      {
        tag: tags.strong,
        color: 'var(--ink-internal-syntax-strong-color)',
        fontWeight: 'var(--ink-internal-syntax-strong-font-weight)',
      },
      {
        tag: tags.strikethrough,
        color: 'var(--ink-internal-syntax-strikethrough-color)',
        textDecoration: 'var(--ink-internal-syntax-strikethrough-text-decoration)',
      },
      // comment group
      {
        tag: tags.comment,
        color: 'var(--ink-internal-syntax-comment-color)',
        fontStyle: 'var(--ink-internal-syntax-comment-font-style)',
      },
      // monospace
      {
        tag: tags.monospace,
        color: 'var(--ink-internal-syntax-code-color)',
        fontFamily: 'var(--ink-internal-syntax-code-font-family)',
      },
      // name group
      {
        tag: tags.name,
        color: 'var(--ink-internal-syntax-name-color)',
      },
      {
        tag: tags.labelName,
        color: 'var(--ink-internal-syntax-name-label-color)',
      },
      {
        tag: tags.propertyName,
        color: 'var(--ink-internal-syntax-name-property-color)',
      },
      {
        tag: tags.definition(tags.propertyName),
        color: 'var(--ink-internal-syntax-name-property-definition-color)',
      },
      {
        tag: tags.variableName,
        color: 'var(--ink-internal-syntax-name-variable-color)',
      },
      {
        tag: tags.definition(tags.variableName),
        color: 'var(--ink-internal-syntax-name-variable-definition-color)',
      },
      {
        tag: tags.local(tags.variableName),
        color: 'var(--ink-internal-syntax-name-variable-local-color)',
      },
      {
        tag: tags.special(tags.variableName),
        color: 'var(--ink-internal-syntax-name-variable-special-color)',
      },
      // contextual tag types
      {
        tag: tags.keyword,
        color: 'var(--ink-internal-syntax-keyword-color)',
      },
      {
        tag: tags.number,
        color: 'var(--ink-internal-syntax-number-color)',
      },
      {
        tag: tags.operator,
        color: 'var(--ink-internal-syntax-operator-color)',
      },
      {
        tag: tags.punctuation,
        color: 'var(--ink-internal-syntax-punctuation-color)',
      },
      {
        tag: tags.link,
        color: 'var(--ink-internal-syntax-link-color)',
      },
      {
        tag: tags.url,
        color: 'var(--ink-internal-syntax-url-color)',
      },
      // string group
      {
        tag: tags.string,
        color: 'var(--ink-internal-syntax-string-color)',
      },
      {
        tag: tags.special(tags.string),
        color: 'var(--ink-internal-syntax-string-special-color)',
      },
      // processing instructions
      {
        tag: tags.processingInstruction,
        color: 'var(--ink-internal-syntax-processing-instruction-color)',
      },
    ]),
  )

  return [
    extension,
  ]
}
