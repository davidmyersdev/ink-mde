import { tags } from '@lezer/highlight'
import { definePlugin, syntaxHighlighter } from '/src/utils/plugins'

export const headings = () => {
  return definePlugin({
    addExtensions: () => [
      syntaxHighlighter({
        tag: tags.heading,
        class: 'syntax-heading',
        color: 'var(--ink-internal-syntax-heading-color)',
        fontWeight: 'var(--ink-internal-syntax-heading-font-weight)',
      }),
      syntaxHighlighter({
        tag: tags.heading1,
        class: 'syntax-heading-1',
        color: 'var(--ink-internal-syntax-heading1-color)',
        fontSize: 'var(--ink-internal-syntax-heading1-font-size)',
        fontWeight: 'var(--ink-internal-syntax-heading1-font-weight)',
      }),
      syntaxHighlighter({
        tag: tags.heading2,
        class: 'syntax-heading-2',
        color: 'var(--ink-internal-syntax-heading2-color)',
        fontSize: 'var(--ink-internal-syntax-heading2-font-size)',
        fontWeight: 'var(--ink-internal-syntax-heading2-font-weight)',
      }),
      syntaxHighlighter({
        tag: tags.heading3,
        class: 'syntax-heading-3',
        color: 'var(--ink-internal-syntax-heading3-color)',
        fontSize: 'var(--ink-internal-syntax-heading3-font-size)',
        fontWeight: 'var(--ink-internal-syntax-heading3-font-weight)',
      }),
      syntaxHighlighter({
        tag: tags.heading4,
        class: 'syntax-heading-4',
        color: 'var(--ink-internal-syntax-heading4-color)',
        fontSize: 'var(--ink-internal-syntax-heading4-font-size)',
        fontWeight: 'var(--ink-internal-syntax-heading4-font-weight)',
      }),
      syntaxHighlighter({
        tag: tags.heading5,
        class: 'syntax-heading-5',
        color: 'var(--ink-internal-syntax-heading5-color)',
        fontSize: 'var(--ink-internal-syntax-heading5-font-size)',
        fontWeight: 'var(--ink-internal-syntax-heading5-font-weight)',
      }),
      syntaxHighlighter({
        tag: tags.heading6,
        class: 'syntax-heading-6',
        color: 'var(--ink-internal-syntax-heading6-color)',
        fontSize: 'var(--ink-internal-syntax-heading6-font-size)',
        fontWeight: 'var(--ink-internal-syntax-heading6-font-weight)',
      }),
    ],
  })
}
