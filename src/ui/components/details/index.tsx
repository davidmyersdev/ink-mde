import { type Component, Show } from 'solid-js'
import type InkInternal from '/types/internal'
import { toHuman } from '/src/utils/readability'
import { useStore } from '../../app'

export const Details: Component<{ store: InkInternal.Store }> = () => {
  const [state] = useStore()

  return (
    <div class='ink-mde-details'>
      <Show when={ state().options.readability }>
        <div class='ink-mde-readability'>
          <span>{ toHuman(state().doc) }</span>
        </div>
      </Show>
      <Show when={ state().options.readability && state().options.interface.attribution }>
        <span>&nbsp;|</span>
      </Show>
      <Show when={state().options.interface.attribution}>
        <div class='ink-mde-attribution'>
          <span>&nbsp;powered by <a class='ink-mde-attribution-link' href='https://github.com/voracious/ink-mde' rel='noopener noreferrer' target='_blank'>ink-mde</a></span>
        </div>
      </Show>
    </div>
  )
}
