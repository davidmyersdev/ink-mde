import { SearchQuery, findNext, findPrevious, getSearchQuery, search as searchExtension, searchKeymap, setSearchQuery } from '@codemirror/search'
import { keymap, runScopeHandlers } from '@codemirror/view'
import { createRoot, createSignal } from 'solid-js'

export const search = () => {
  return [
    searchExtension({
      top: true,
      createPanel: (view) => {
        return createRoot((dispose) => {
          const [query, setQuery] = createSignal(getSearchQuery(view.state))
          let el: HTMLInputElement | undefined

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

          const updateSearch = (event: InputEvent) => {
            // @ts-expect-error "value" is not a recognized property of EventTarget.
            const { value } = event.target

            setQuery(new SearchQuery({ search: value }))
            view.dispatch({ effects: setSearchQuery.of(query()) })
          }

          return {
            destroy: () => {
              dispose()
            },
            dom: (
              <div class='ink-mde-search-panel' onKeyDown={handleKeyDown}>
                <input attr:main-field='true' class='ink-mde-search-input' onInput={updateSearch} onKeyDown={handleKeyDown} ref={el} type="text" value={query().search} />
              </div>
            ) as HTMLElement,
            mount: () => {
              el?.focus()
            },
            top: true,
          }
        })
      },
    }),
    keymap.of(searchKeymap),
  ]
}
