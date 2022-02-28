import { create as createConfiguration } from '/src/configuration/instance'
import { create } from '/src/editor/instance'

import type Ink from '/types/ink'

export * from '/src/vendor/extensions/extension'

const ink = (target: HTMLElement, options: Partial<Ink.Options>): Ink.Instance => {
  const configuration = createConfiguration(options)
  const instance = create(configuration)

  target.append(configuration.root.target)

  return instance
}

export default ink
