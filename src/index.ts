import { createInstance } from '/src/instance'
import { hydrateState } from '/src/state'

import type * as Ink from '/types/ink'

export * from '/src/vendor/extensions/extension'

const ink = (target: HTMLElement, options: Ink.DeepPartial<Ink.Options>): Ink.Instance => {
  const ref = {}
  const state = hydrateState(ref, { target, options })

  target.append(state.root)

  return createInstance(ref)
}

export default ink
