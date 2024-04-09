import { type Extension } from '@codemirror/state'
import { EditorView, showPanel } from '@codemirror/view'
import { createElement, h } from '/src/helpers'
import { toHuman } from '/src/utils/readability'
import { fullConfig } from '../config'

export const details = (): Extension[] => {
  return [
    showPanel.from(fullConfig, (config) => {
      if (!config.interface.attribution && !config.readability) return null

      return (view) => {
        const dom = createElement(
          h('div', { class: 'ink-mde-details' }, [
            h('div', { class: 'ink-mde-container' }, [
              h('div', { class: 'ink-mde-details-content' }, [
                ...(
                  !config.readability ? [] : [
                    h('span', { class: 'ink-mde-readability' }, [
                      toHuman(view.state.doc.toString()),
                    ]),
                    h('span', ['|']),
                  ]
                ),
                ...(
                  !config.interface.attribution ? [] : [
                    h('span', { class: 'ink-mde-attribution' }, [
                      'powered by ',
                      h('a', {
                        class: 'ink-mde-attribution-link',
                        href: 'https://github.com/davidmyersdev/ink-mde',
                        rel: 'noopener noreferrer',
                        target: '_blank',
                      }, [
                        'ink-mde',
                      ]),
                    ]),
                  ]
                ),
              ]),
            ]),
          ]),
        )

        return {
          dom,
          top: false,
          update(viewUpdate) {
            if (viewUpdate.docChanged) {
              const el = dom.querySelector('.ink-mde-readability')

              if (el) {
                el.textContent = toHuman(viewUpdate.state.doc.toString())
              }
            }
          },
        }
      }
    }),
    EditorView.baseTheme({
      '.ink-mde-details': {
        display: 'flex',
        flexGrow: '0',
        flexShrink: '0',
        padding: '0.5rem',
      },
      '.ink-mde-details-content': {
        color: 'inherit',
        display: 'flex',
        filter: 'brightness(0.75)',
        flexWrap: 'wrap',
        fontSize: '0.75em',
        gap: '0.25rem',
        justifyContent: 'flex-end',
      },
      '.ink-mde-attribution-link': {
        color: 'currentColor',
        fontWeight: '600',
        textDecoration: 'none',
      },
    })
  ]
}
