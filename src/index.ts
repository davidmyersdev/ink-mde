import { makeInstance } from '/src/instance'
import { makeState } from '/src/state'

import type * as Ink from '/types/ink'

export * from '/types/values'
export * from '/src/vendor/extensions/extension'

export const defineOptions = (options: Ink.DeepPartial<Ink.Options>): Ink.DeepPartial<Ink.Options> => {
  return options
}

export const ink = (target: HTMLElement, options: Ink.DeepPartial<Ink.Options> = {}): Ink.Instance => {
  const ref = makeState({ target, options })

  return makeInstance(ref)
}

export default ink
