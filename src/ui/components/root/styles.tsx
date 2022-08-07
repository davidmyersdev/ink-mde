import { type Component, createEffect, createSignal, onMount } from 'solid-js'
import { buildVendorUpdates } from '/src/extensions'
import { makeVars } from '../../utils'
import { useStore } from '../../app'
import styles from './styles.css?inline'

export const Styles: Component = () => {
  const [state] = useStore()
  const [vars, setVars] = createSignal(makeVars(state()))

  createEffect(() => {
    setVars(makeVars(state()))
  })

  onMount(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (_event: MediaQueryListEvent) => {
      const { editor, root } = state()

      if (root.isConnected) {
        const effects = buildVendorUpdates(state())

        editor.dispatch({
          effects,
        })

        setVars(makeVars(state()))
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
