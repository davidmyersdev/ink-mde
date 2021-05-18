import { HighlightStyle, tags } from '@codemirror/highlight'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { InkOptions } from '../types/ink'

const defaults = {

}

export const theme = ({ appearance }: InkOptions): Extension => {
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
  const appearanceTheme = EditorView.theme({}, { dark: appearance === 'dark' })
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
    {
      tag: tags.processingInstruction,
      color: 'var(--ink-processingInstruction, #abb2bf)',
    },
    // comment group
    {
      tag: tags.comment,
      color: 'var(--ink-comment, #abb2bf)',
      fontStyle: 'italic',
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
      fontWeight: 'bold',
    },
    {
      tag: tags.heading1,
      color: 'var(--ink-heading1, var(--ink-heading, #e06c75))',
      fontSize: '1.6em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading2,
      color: 'var(--ink-heading2, var(--ink-heading, #e06c75))',
      fontSize: '1.5em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading3,
      color: 'var(--ink-heading3, var(--ink-heading, #e06c75))',
      fontSize: '1.4em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading4,
      color: 'var(--ink-heading4, var(--ink-heading, #e06c75))',
      fontSize: '1.3em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading5,
      color: 'var(--ink-heading5, var(--ink-heading, #e06c75))',
      fontSize: '1.2em',
      fontWeight: 'bold',
    },
    {
      tag: tags.heading6,
      color: 'var(--ink-heading6, var(--ink-heading, #e06c75))',
      fontSize: '1.1em',
      fontWeight: 'bold',
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
      color: 'var(--ink-punctuation, #36454f)',
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
    // emphasis types
    {
      tag: tags.deleted,
      textDecoration: 'var(--ink-deleted, line-through)',
    },
    {
      tag: tags.emphasis,
      color: 'var(--ink-emphasis, inherit)',
      fontStyle: 'italic',
    },
    {
      tag: tags.strong,
      color: 'var(--ink-strong, inherit)',
      fontWeight: 'bold',
    },
  ])

  return [
    baseTheme,
    appearanceTheme,
    syntaxHighlighting,
  ]
}
