import { makeStore } from '/src/store'
import type { Options } from '/types/ink'
import type InkInternal from '/types/internal'
import { createView } from './editor'

export const makeMockStore = (userOptions: Options = {}, overrides: InkInternal.State = {}): InkInternal.StoreState => {
  return makeStore(userOptions, { editor: createView(), ...overrides })
}
