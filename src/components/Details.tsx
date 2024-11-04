import * as van from '/lib/vanjs'
import { toHuman } from '/src/utils/readability'
import type InkInternal from '/types/internal'
import { Show } from './Show'

export const Details = ({ state }: { state: InkInternal.StoreState }) => {
  const isRe = van.derive(() => state.options.val.readability)
  const isAttr = van.derive(() => state.options.val.interface.attribution)
  const isReAttr = van.derive(() => isRe.val && isAttr.val)
  const text = van.derive(() => toHuman(state.doc.val))

  return (
    <div class='ink-mde-details'>
      <div class='ink-mde-container'>
        <div class='ink-mde-details-content'>
          <Show when={isRe}>
            {() =>
              <div class='ink-mde-readability'>
                <span>{text}</span>
              </div>
            }
          </Show>
          <Show when={isReAttr}>
            {() =>
              <span>&nbsp;|</span>
            }
          </Show>
          <Show when={isAttr}>
            {() =>
              <div class='ink-mde-attribution'>
                <span>&nbsp;powered by <a class='ink-mde-attribution-link' href='https://github.com/davidmyersdev/ink-mde' rel='noopener noreferrer' target='_blank'>ink-mde</a></span>
              </div>
            }
          </Show>
        </div>
      </div>
    </div>
  )
}
