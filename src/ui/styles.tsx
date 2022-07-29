import { createSignal, onMount, type Component } from 'solid-js'
import { buildVendorUpdates } from '/src/extensions'
import styles from './styles.css?inline'
import { makeVars } from './utils'
import { useStore } from './app'

export const Styles: Component = () => {
  const [state] = useStore()
  const [vars, setVars] = createSignal(makeVars(state))

  onMount(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (_event: MediaQueryListEvent) => {
      const { editor, root } = state

      if (root.isConnected) {
        const effects = buildVendorUpdates(state)

        editor.dispatch({
          effects,
        })

        setVars(makeVars(state))
      } else {
        mediaQueryList.removeEventListener('change', listener)
      }
    }

    mediaQueryList.addEventListener('change', listener)
  })

  return (
    <style>
      {`.ink {\n  ${vars().join('\n  ')}\n}`}
      {styles}
    </style>
  )
}
