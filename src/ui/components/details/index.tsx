import type { State } from 'vanjs-core'
import { Show } from '/src/ui/components/Show'
import { toHuman } from '/src/utils/readability'
import type InkInternal from '/types/internal'

// eslint-disable-next-line solid/no-destructure
export const Details = ({ state }: { state: State<InkInternal.StateResolved> }) => {
  return (
    <div class='ink-mde-details'>
      <div class='ink-mde-container'>
        <div class='ink-mde-details-content'>
          <Show when={() => state.val.options.readability}>
            {
              <div class='ink-mde-readability'>
                <span>{() => toHuman(state.val.doc)}</span>
              </div>
            }
          </Show>
          {
            () => (state.val.options.readability && state.val.options.interface.attribution)
              ? (
                <span>&nbsp;|</span>
              ) : []
          }
          {
            () => state.val.options.interface.attribution
              ? (
                <div class='ink-mde-attribution'>
                  <span>&nbsp;powered by <a class='ink-mde-attribution-link' href='https://github.com/davidmyersdev/ink-mde' rel='noopener noreferrer' target='_blank'>ink-mde</a></span>
                </div>
              ) : []
          }
        </div>
      </div>
    </div>
  )
}
