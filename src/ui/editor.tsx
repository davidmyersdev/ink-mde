import { makeEditor } from '/src/vendor/editor'
import { useStore } from '/src/ui/app'
import { override } from '/src/utils/deepmerge'
import type { Component } from 'solid-js'

export const Editor: Component = () => {
  const [state, setState] = useStore()
  const editor = makeEditor(state())

  setState(override(state(), { editor }))

  return editor.dom
}
