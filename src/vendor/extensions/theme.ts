import { HighlightStyle, tags } from '@codemirror/highlight'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const theme = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    '.cm-scroller': {
      lineHeight: 'var(--ink-internal-editor-line-height)',
      fontFamily: 'var(--ink-internal-all-font-family)',
      fontSize: 'var(--ink-internal-editor-font-size)',
    },
    '.cm-line': {
      padding: '0',
    },
  })

  const syntaxHighlighting = HighlightStyle.define([
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
      color: 'var(--ink-internal-syntax-monospace-color)',
      fontFamily: 'var(--ink-internal-syntax-monospace-font-family)',
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
    // headings
    {
      tag: tags.heading,
      color: 'var(--ink-internal-syntax-heading-color)',
      fontWeight: 'var(--ink-internal-syntax-heading-font-weight)',
    },
    {
      tag: tags.heading1,
      color: 'var(--ink-internal-syntax-heading1-color)',
      fontSize: 'var(--ink-internal-syntax-heading1-font-size)',
      fontWeight: 'var(--ink-internal-syntax-heading1-font-weight)',
    },
    {
      tag: tags.heading2,
      color: 'var(--ink-internal-syntax-heading2-color)',
      fontSize: 'var(--ink-internal-syntax-heading2-font-size)',
      fontWeight: 'var(--ink-internal-syntax-heading2-font-weight)',
    },
    {
      tag: tags.heading3,
      color: 'var(--ink-internal-syntax-heading3-color)',
      fontSize: 'var(--ink-internal-syntax-heading3-font-size)',
      fontWeight: 'var(--ink-internal-syntax-heading3-font-weight)',
    },
    {
      tag: tags.heading4,
      color: 'var(--ink-internal-syntax-heading4-color)',
      fontSize: 'var(--ink-internal-syntax-heading4-font-size)',
      fontWeight: 'var(--ink-internal-syntax-heading4-font-weight)',
    },
    {
      tag: tags.heading5,
      color: 'var(--ink-internal-syntax-heading5-color)',
      fontSize: 'var(--ink-internal-syntax-heading5-font-size)',
      fontWeight: 'var(--ink-internal-syntax-heading5-font-weight)',
    },
    {
      tag: tags.heading6,
      color: 'var(--ink-internal-syntax-heading6-color)',
      fontSize: 'var(--ink-internal-syntax-heading6-font-size)',
      fontWeight: 'var(--ink-internal-syntax-heading6-font-weight)',
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
  ])

  return [
    baseTheme,
    syntaxHighlighting,
  ]
}
