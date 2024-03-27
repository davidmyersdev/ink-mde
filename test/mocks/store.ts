import { vi } from 'vitest'
import { blankState } from '/src/store'
import type { Options } from '/types/ink'
import type InkInternal from '/types/internal'
import { makeEditor } from './editor'

export const makeState = (partialState: InkInternal.State): InkInternal.StateResolved => {
  return { ...blankState(), ...partialState } as InkInternal.StateResolved
}

export const makeStore = (options: Options = {}, overrides: InkInternal.State = {}): InkInternal.Store => {
  const state = makeState({ editor: makeEditor(), ...overrides, options })
  const stateMock = vi.fn().mockImplementation(() => state)
  const setStateMock = vi.fn().mockImplementation((value: unknown) => (typeof value === 'function' ? value(state) : value))

  return [stateMock, setStateMock]
}
