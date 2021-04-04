import { HighlightStyle, tags } from '@codemirror/highlight'
import { Extension } from '@codemirror/state'

export const syntaxHighlighting = (): Extension => HighlightStyle.define([
  // ordered by lowest to highest precedence
  {
    tag: tags.atom,
    color: 'var(--hybrid-mde-atom, #d19a66)',
  },
  {
    tag: tags.meta,
    color: 'var(--hybrid-mde-meta, #abb2bf)',
  },
  {
    tag: tags.processingInstruction,
    color: 'var(--hybrid-mde-processingInstruction, #abb2bf)',
  },
  // comment group
  {
    tag: tags.comment,
    color: 'var(--hybrid-mde-comment, #abb2bf)',
    fontStyle: 'italic',
  },
  // name group
  {
    tag: tags.name,
    color: 'var(--hybrid-mde-name, #d19a66)',
  },
  {
    tag: tags.labelName,
    color: 'var(--hybrid-mde-labelName, var(--hybrid-mde-name, #abb2bf))',
  },
  {
    tag: tags.propertyName,
    color: 'var(--hybrid-mde-propertyName, var(--hybrid-mde-name, #96c0d8))',
  },
  {
    tag: tags.definition(tags.propertyName),
    color: 'var(--hybrid-mde-propertyName-definition, var(--hybrid-mde-propertyName, var(--hybrid-mde-name, #e06c75)))',
  },
  {
    tag: tags.variableName,
    color: 'var(--hybrid-mde-variableName, var(--hybrid-mde-name, #e06c75))',
  },
  {
    tag: tags.definition(tags.variableName),
    color: 'var(--hybrid-mde-variableName-definition, var(--hybrid-mde-variableName, var(--hybrid-mde-name, #e5c07b)))',
  },
  {
    tag: tags.local(tags.variableName),
    color: 'var(--hybrid-mde-variableName-local, var(--hybrid-mde-variableName, var(--hybrid-mde-name, #d19a66)))',
  },
  {
    tag: tags.special(tags.variableName),
    color: 'var(--hybrid-mde-variableName-special, var(--hybrid-mde-variableName, var(--hybrid-mde-name, inherit)))',
  },
  // headings
  {
    tag: tags.heading,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading1,
    color: 'var(--hybrid-mde-heading1, var(--hybrid-mde-heading, #e06c75))',
    fontSize: '1.6em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading2,
    color: 'var(--hybrid-mde-heading2, var(--hybrid-mde-heading, #e06c75))',
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    color: 'var(--hybrid-mde-heading3, var(--hybrid-mde-heading, #e06c75))',
    fontSize: '1.4em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading4,
    color: 'var(--hybrid-mde-heading4, var(--hybrid-mde-heading, #e06c75))',
    fontSize: '1.3em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading5,
    color: 'var(--hybrid-mde-heading5, var(--hybrid-mde-heading, #e06c75))',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading6,
    color: 'var(--hybrid-mde-heading6, var(--hybrid-mde-heading, #e06c75))',
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  // contextual tag types
  {
    tag: tags.keyword,
    color: 'var(--hybrid-mde-keyword, #c678dd)',
  },
  {
    tag: tags.number,
    color: 'var(--hybrid-mde-number, #d19a66)',
  },
  {
    tag: tags.operator,
    color: 'var(--hybrid-mde-operator, #96c0d8)',
  },
  {
    tag: tags.punctuation,
    color: 'var(--hybrid-mde-punctuation, #36454f)',
  },
  {
    tag: tags.link,
    color: 'var(--hybrid-mde-link, #96c0d8)',
  },
  {
    tag: tags.url,
    color: 'var(--hybrid-mde-url, #96c0d8)',
  },
  // string group
  {
    tag: tags.string,
    color: 'var(--hybrid-mde-string, #98c379)',
  },
  {
    tag: tags.special(tags.string),
    color: 'var(--hybrid-mde-string-special, var(--hybrid-mde-string, inherit))',
  },
  // emphasis types
  {
    tag: tags.emphasis,
    color: 'var(--hybrid-mde-emphasis, inherit)',
    fontStyle: 'italic',
  },
  {
    tag: tags.strong,
    color: 'var(--hybrid-mde-strong, inherit)',
    fontWeight: 'bold',
  },
])
