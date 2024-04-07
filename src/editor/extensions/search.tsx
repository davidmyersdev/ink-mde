import { SearchQuery, findNext, findPrevious, getSearchQuery, search as searchExtension, searchKeymap, setSearchQuery } from '@codemirror/search'
import { keymap, runScopeHandlers } from '@codemirror/view'
import { createElement, h } from '/src/helpers'

export const search = () => {
  return [
    searchExtension({
      top: true,
      createPanel: (view) => {
        let query = getSearchQuery(view.state)

        const handleKeyDown = (event: KeyboardEvent) => {
          if (runScopeHandlers(view, event, 'search-panel')) return event.preventDefault()

          if (event.code === 'Enter') {
            event.preventDefault()

            if (event.shiftKey) {
              findPrevious(view)
            } else {
              findNext(view)
            }
          }
        }

        const updateSearch = (event: Event) => {
          // @ts-expect-error "value" is not a recognized property of EventTarget.
          const { value } = event.target

          query = new SearchQuery({ search: value })
          view.dispatch({ effects: setSearchQuery.of(query) })
        }

        const dom = createElement(
          h('div', { class: 'ink-mde-search-panel' }, [
            h('input', {
              class: 'ink-mde-search-input',
              type: 'text',
              value: query.search,
            }),
          ]),
        )

        return {
          dom,
          mount() {
            const input = dom.querySelector('input')!

            input.addEventListener('input', updateSearch)
            input.addEventListener('keydown', handleKeyDown)

            input.focus()
          },
          top: true,
        }
      },
    }),
    keymap.of(searchKeymap),
  ]
}
