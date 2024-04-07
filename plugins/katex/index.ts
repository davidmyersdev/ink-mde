import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { plugin, pluginTypes } from 'ink-mde'
import { buildBlockWidgetDecoration, buildLineDecoration, buildWidget, nodeDecorator } from '/lib/codemirror-kit'
import { grammar, mathInline, mathInlineMark, mathInlineMarkClose, mathInlineMarkOpen } from './grammar'

export const katex = () => {
  return [
    plugin({
      key: 'katex',
      type: pluginTypes.grammar,
      value: async () => grammar,
    }),
    plugin({
      key: 'katex',
      value: async () => {
        return nodeDecorator({
          nodes: ['MathBlock', 'MathBlockMarkClose', 'MathBlockMarkOpen'],
          onMatch: (_state, node) => {
            const classes = ['ink-mde-line-math-block']

            if (node.name === 'MathBlockMarkOpen') classes.push('ink-mde-line-math-block-open')
            if (node.name === 'MathBlockMarkClose') classes.push('ink-mde-line-math-block-close')

            return buildLineDecoration({
              attributes: {
                class: classes.join(' '),
              },
            })
          },
          optimize: false,
        })
      },
    }),
    plugin({
      key: 'katex',
      value: async () => {
        return nodeDecorator({
          nodes: ['MathBlock'],
          onMatch: (state, node) => {
            const text = state.sliceDoc(node.from, node.to).split('\n').slice(1, -1).join('\n')

            if (text) {
              return buildBlockWidgetDecoration({
                widget: buildWidget({
                  id: text,
                  toDOM: (view) => {
                    const container = document.createElement('div')
                    const katexTarget = document.createElement('div')

                    container.className = 'ink-mde-block-widget-container'
                    katexTarget.className = 'ink-mde-block-widget ink-mde-katex-target'
                    container.appendChild(katexTarget)

                    import('katex').then(({ default: lib }) => {
                      lib.render(text, katexTarget, { output: 'html', throwOnError: false })

                      view.requestMeasure()
                    })

                    return container
                  },
                  updateDOM: (dom, view) => {
                    const katexTarget = dom.querySelector<HTMLElement>('.ink-mde-katex-target')

                    if (katexTarget) {
                      import('katex').then(({ default: lib }) => {
                        lib.render(text, katexTarget, { output: 'html', throwOnError: false })

                        view.requestMeasure()
                      })

                      return true
                    }

                    return false
                  },
                }),
              })
            }
          },
          optimize: false,
        })
      },
    }),
    plugin({
      key: 'katex',
      value: async () => {
        return syntaxHighlighting(
          HighlightStyle.define([
            {
              tag: [mathInline.tag, mathInlineMark.tag],
              backgroundColor: 'var(--ink-internal-block-background-color)',
            },
            {
              tag: [mathInlineMarkClose.tag],
              backgroundColor: 'var(--ink-internal-block-background-color)',
              borderRadius: '0 var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0',
              paddingRight: 'var(--ink-internal-inline-padding)',
            },
            {
              tag: [mathInlineMarkOpen.tag],
              backgroundColor: 'var(--ink-internal-block-background-color)',
              borderRadius: 'var(--ink-internal-border-radius) 0 0 var(--ink-internal-border-radius)',
              paddingLeft: 'var(--ink-internal-inline-padding)',
            },
          ]),
        )
      },
    }),
    plugin({
      key: 'katex',
      value: async () => {
        return EditorView.theme({
          '.ink-mde-line-math-block': {
            backgroundColor: 'var(--ink-internal-block-background-color)',
            padding: '0 var(--ink-internal-block-padding) !important',
          },
          '.ink-mde-line-math-block-open': {
            borderRadius: 'var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0 0',
          },
          '.ink-mde-line-math-block-close': {
            borderRadius: '0 0 var(--ink-internal-border-radius) var(--ink-internal-border-radius)',
          },
        })
      },
    }),
  ]
}
