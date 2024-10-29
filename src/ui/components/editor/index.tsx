import { buildVendorUpdates } from '/src/extensions'
import { useStore } from '/src/ui/app'
import { override } from '/src/utils/merge'
import { createView } from '../../../editor'

export const Editor = (props: { target?: HTMLElement }) => {
  // Needed for tree-shaking purposes.
  if (import.meta.env.VITE_SSR) {
    return (
      <div class='cm-editor'>
        <div class='cm-scroller'>
          <div class='cm-content' contentEditable={true}>
            <div class='cm-line'>
              <br />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const [state, setState] = useStore()
  // eslint-disable-next-line solid/reactivity
  const editor = createView([state, setState], props.target)

  const { workQueue } = state()
  setState(override(state(), { editor }))

  workQueue.enqueue(async () => {
    const effects = await buildVendorUpdates([state, setState])

    editor.dispatch({ effects })
  })

  return editor.dom
}
