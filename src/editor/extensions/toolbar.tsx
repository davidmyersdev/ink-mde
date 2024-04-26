import { type Extension } from '@codemirror/state'
import { showPanel } from '@codemirror/view'
import { createElement, h, hIf } from '/src/helpers'
import { fullConfig } from '../config'

export const toolbar = (): Extension[] => {
  return [
    showPanel.from(fullConfig, (config) => {
      if (!config.interface.toolbar) return null

      const { toolbar } = config

      const el = (
        <div class="ink-mde-toolbar">
          <div class="ink-mde-container">
            <div class="ink-mde-toolbar-group" />
          </div>
        </div>
      )

      // eslint-disable-next-line no-console
      console.log(el)

      return () => {
        const dom = createElement(
          h('div', { class: 'ink-mde-toolbar' }, [
            h('div', { class: 'ink-mde-container' }, [
              // Maybe implement h-if on JSX implementation?
              hIf(toolbar.heading || toolbar.bold || toolbar.italic, () => (
                h('div', { class: 'ink-mde-toolbar-group' }, [
                  hIf(toolbar.heading, () =>
                    h('button', { class: 'ink-button', type: 'button' }, [
                      h('svg', {
                        'fill': 'none',
                        'stroke': 'currentColor',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-miterlimit': '5',
                        'viewBox': '0 0 20 20',
                        'xmlns': 'http://www.w3.org/2000/svg',
                      }, [
                        h('path', {
                          d: 'M6 4V10M6 16V10M6 10H14M14 10V4M14 10V16',
                        }),
                      ]),
                    ]),
                  ),
                  hIf(toolbar.bold, () =>
                    h('button', { class: 'ink-button', type: 'button' }, [
                      h('svg', {
                        'fill': 'none',
                        'stroke': 'currentColor',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-miterlimit': '5',
                        'stroke-width': '1.5',
                        'viewBox': '0 0 20 20',
                        'xmlns': 'http://www.w3.org/2000/svg',
                      }, [
                        h('path', {
                          d: 'M6.5 10H10.5C12.1569 10 13.5 11.3431 13.5 13C13.5 14.6569 12.1569 16 10.5 16H6.5V4H9.5C11.1569 4 12.5 5.34315 12.5 7C12.5 8.65686 11.1569 10 9.5 10',
                        }),
                      ]),
                    ]),
                  ),
                ])
              )),
            ]),
          ]),
        )

        return {
          dom,
          top: true,
        }
      }
    }),
  ]
}
