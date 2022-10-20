import { buildVendorUpdates } from '/src/extensions'
import { useStore } from '/src/ui/app'
import { override } from '/src/utils/merge'
import { makeEditor } from '/src/vendor/editor'
import type { Component } from 'solid-js'

export const Editor: Component = () => {
  // Needed for tree-shaking purposes.
  if (import.meta.env.VITE_SSR) {
    return (
      <div class='cm-editor'>
        <div class='cm-scroller'>
          <div class='cm-content' contenteditable={true}>
            <div class='cm-line'>
              <br />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const [state, setState] = useStore()
  const editor = makeEditor(state())

  setState(override(state(), { editor }))
  buildVendorUpdates(state()).then((effects) => {
    editor.dispatch({ effects })
  })

  return editor.dom
}
