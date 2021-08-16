import { HighlightStyle, tags } from '@codemirror/highlight'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { InkOptions } from '../types/ink'

export const theme = (): Extension => {
  const baseTheme = EditorView.baseTheme({
    '&': {
      color: 'inherit',
      backgroundColor: 'transparent',
    },
    '.cm-scroller': {
      lineHeight: 'var(--ink-line-height, 2em)',
      fontSize: 'var(--ink-font-size, 1.1em)',
    },
    '.cm-line': {
      padding: '0',
    },
  })
  const syntaxHighlighting = HighlightStyle.define([
    // ordered by lowest to highest precedence
    {
      tag: tags.atom,
      color: 'var(--ink-atom, #d19a66)',
    },
    {
      tag: tags.meta,
      color: 'var(--ink-meta, #abb2bf)',
    },
    // emphasis types
    {
      tag: tags.emphasis,
      color: 'var(--ink-emphasis, inherit)',
      fontStyle: 'italic',
    },
    {
      tag: tags.strong,
      color: 'var(--ink-strong, inherit)',
      fontWeight: 'var(--ink-strong-weight, 600)',
    },
    {
      tag: tags.strikethrough,
      color: 'var(--ink-strikethrough, inherit)',
      textDecoration: 'line-through',
    },
    // processing instructions
    {
      tag: tags.processingInstruction,
      color: 'var(--ink-processingInstruction, #36454f)',
    },
    // comment group
    {
      tag: tags.comment,
      color: 'var(--ink-comment, #abb2bf)',
      fontStyle: 'italic',
    },
    // monospace
    {
      tag: tags.monospace,
      fontFamily: 'var(--ink-font-family-mono, monospace)',
    },
    // name group
    {
      tag: tags.name,
      color: 'var(--ink-name, #d19a66)',
    },
    {
      tag: tags.labelName,
      color: 'var(--ink-labelName, var(--ink-name, #abb2bf))',
    },
    {
      tag: tags.propertyName,
      color: 'var(--ink-propertyName, var(--ink-name, #96c0d8))',
    },
    {
      tag: tags.definition(tags.propertyName),
      color: 'var(--ink-propertyName-definition, var(--ink-propertyName, var(--ink-name, #e06c75)))',
    },
    {
      tag: tags.variableName,
      color: 'var(--ink-variableName, var(--ink-name, #e06c75))',
    },
    {
      tag: tags.definition(tags.variableName),
      color: 'var(--ink-variableName-definition, var(--ink-variableName, var(--ink-name, #e5c07b)))',
    },
    {
      tag: tags.local(tags.variableName),
      color: 'var(--ink-variableName-local, var(--ink-variableName, var(--ink-name, #d19a66)))',
    },
    {
      tag: tags.special(tags.variableName),
      color: 'var(--ink-variableName-special, var(--ink-variableName, var(--ink-name, inherit)))',
    },
    // headings
    {
      tag: tags.heading,
      color: 'var(--ink-heading, #e06c75)',
      fontWeight: 'var(--ink-heading-weight, 600)',
    },
    {
      tag: tags.heading1,
      color: 'var(--ink-heading1, var(--ink-heading, #e06c75))',
      fontSize: '1.6em',
      fontWeight: 'var(--ink-heading1-weight, var(--ink-heading-weight, 600))',
    },
    {
      tag: tags.heading2,
      color: 'var(--ink-heading2, var(--ink-heading, #e06c75))',
      fontSize: '1.5em',
      fontWeight: 'var(--ink-heading2-weight, var(--ink-heading-weight, 600))',
    },
    {
      tag: tags.heading3,
      color: 'var(--ink-heading3, var(--ink-heading, #e06c75))',
      fontSize: '1.4em',
      fontWeight: 'var(--ink-heading3-weight, var(--ink-heading-weight, 600))',
    },
    {
      tag: tags.heading4,
      color: 'var(--ink-heading4, var(--ink-heading, #e06c75))',
      fontSize: '1.3em',
      fontWeight: 'var(--ink-heading4-weight, var(--ink-heading-weight, 600))',
    },
    {
      tag: tags.heading5,
      color: 'var(--ink-heading5, var(--ink-heading, #e06c75))',
      fontSize: '1.2em',
      fontWeight: 'var(--ink-heading5-weight, var(--ink-heading-weight, 600))',
    },
    {
      tag: tags.heading6,
      color: 'var(--ink-heading6, var(--ink-heading, #e06c75))',
      fontSize: '1.1em',
      fontWeight: 'var(--ink-heading6-weight, var(--ink-heading-weight, 600))',
    },
    // contextual tag types
    {
      tag: tags.keyword,
      color: 'var(--ink-keyword, #c678dd)',
    },
    {
      tag: tags.number,
      color: 'var(--ink-number, #d19a66)',
    },
    {
      tag: tags.operator,
      color: 'var(--ink-operator, #96c0d8)',
    },
    {
      tag: tags.punctuation,
      color: 'var(--ink-punctuation, #abb2bf)',
    },
    {
      tag: tags.link,
      color: 'var(--ink-link, #96c0d8)',
    },
    {
      tag: tags.url,
      color: 'var(--ink-url, #96c0d8)',
    },
    // string group
    {
      tag: tags.string,
      color: 'var(--ink-string, #98c379)',
    },
    {
      tag: tags.special(tags.string),
      color: 'var(--ink-string-special, var(--ink-string, inherit))',
    },
  ])

  return [
    baseTheme,
    syntaxHighlighting,
  ]
}
