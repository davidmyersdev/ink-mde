import { createContext, useContext } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import type InkInternal from '/types/internal'
import { blankState } from '../store'
import { Root } from './components/root'

const AppContext = createContext<InkInternal.Store>([
  () => blankState(),
  (value) => {
    if (typeof value === 'function') {
      const state = blankState()

      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/37663
      return value(state)
    }

    return value
  },
])

const AppProvider: Component<{ children: JSX.Element, store: InkInternal.Store }> = (props) => {
  return (
    // eslint-disable-next-line solid/reactivity
    <AppContext.Provider value={props.store}>
      {props.children}
    </AppContext.Provider>
  )
}

export const useStore = () => {
  return useContext(AppContext)
}

export const App: Component<{ store: InkInternal.Store, target?: HTMLElement }> = (props) => {
  return (
    <AppProvider store={props.store}>
      <Root store={props.store} target={props.target} />
    </AppProvider>
  )
}
