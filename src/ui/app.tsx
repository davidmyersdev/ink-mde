import { createContext, useContext } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import type InkInternal from '/types/internal'
import { blankState } from '../store'
import { Root } from './root'

const defaultState = blankState()
const AppContext = createContext<InkInternal.Store>([() => defaultState, value => (typeof value === 'function' ? value(defaultState) : value)])
const AppProvider: Component<{ children: JSX.Element, store: InkInternal.Store }> = (props) => {
  return (
    <AppContext.Provider value={props.store}>
      {props.children}
    </AppContext.Provider>
  )
}

export const useStore = () => {
  return useContext(AppContext)
}

export const App: Component<{ store: InkInternal.Store }> = (props) => {
  return (
    <AppProvider store={props.store}>
      <Root store={props.store} />
    </AppProvider>
  )
}
