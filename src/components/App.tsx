import { Root } from '/src/components/Root'
import type InkInternal from '/types/internal'

export const App = ({ state, target }: { state: InkInternal.StoreState, target?: HTMLElement }) => {
  return (
    <Root state={state} target={target} />
  )
}
