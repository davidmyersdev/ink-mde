import { HighlightStyle, tags } from '@codemirror/highlight'

const SyntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.atom,
    color: 'var(--hybrid-mde-atom, #d19a66)',
  },
  {
    tag: tags.bool,
    class: "cmt-bool",
  },
  {
    tag: tags.comment,
    color: 'var(--hybrid-mde-comment, #5c6370)',
    fontStyle: 'italic',
  },
  {
    tag: tags.definition(tags.variableName),
    color: 'var(--hybrid-mde-definition, #e5c07b)',
  },
  {
    tag: tags.deleted,
    class: "cmt-deleted",
  },
  {
    tag: tags.emphasis,
    fontStyle: 'italic',
  },
  // meta has to be set before headings for precedence
  {
    tag: tags.meta,
    color: 'var(--hybrid-mde-meta, #abb2bf)',
  },
  {
    tag: tags.heading1,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontSize: '1.6em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading2,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontSize: '1.4em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading4,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontSize: '1.3em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading5,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading6,
    color: 'var(--hybrid-mde-heading, #e06c75)',
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  {
    tag: tags.inserted,
    class: "cmt-inserted",
  },
  {
    tag: tags.invalid,
    class: "cmt-invalid",
  },
  {
    tag: tags.keyword,
    color: 'var(--hybrid-mde-keyword, #c678dd)',
  },
  {
    tag: tags.labelName,
    class: "cmt-labelName",
  },
  {
    tag: tags.link,
    color: 'var(--hybrid-mde-link, #96c0d8)',
  },
  {
    tag: tags.literal,
    class: "cmt-literal",
  },
  {
    tag: tags.local(tags.variableName),
    class: "cmt-variableName cmt-local",
  },
  {
    tag: tags.macroName,
    class: "cmt-macroName",
  },
  {
    tag: tags.namespace,
    class: "cmt-namespace",
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
    tag: tags.propertyName,
    color: 'var(--hybrid-mde-propertyName, #d19a66)',
  },
  {
    tag: tags.punctuation,
    color: 'var(--hybrid-mde-punctuation, #abb2bf)',
  },
  {
    tag: tags.special(tags.variableName),
    class: "cmt-variableName2",
  },
  {
    tag: tags.string,
    color: 'var(--hybrid-mde-string, #98c379)',
  },
  {
    tag: tags.strong,
    fontWeight: 'bold',
  },
  {
    tag: tags.typeName,
    class: "cmt-typeName",
  },
  {
    tag: tags.url,
    color: 'var(--hybrid-mde-url, #96c0d8)',
  },
  {
    tag: tags.variableName,
    color: 'var(--hybrid-mde-variableName, #e06c75)',
  },
  {
    tag: [tags.regexp, tags.escape, tags.special(tags.string)],
    class: "cmt-string2",
  },
])

export default SyntaxHighlighting
