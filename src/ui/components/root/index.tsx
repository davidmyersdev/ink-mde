import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { useStore } from '../../app'
import { DropZone } from '../drop_zone'
import { Editor } from '../editor'
import { Toolbar } from '../toolbar'
import { Styles } from './styles'
import { override } from '/src/utils/merge'
import type InkInternal from '/types/internal'

export const Root: Component<{ store: InkInternal.Store }> = () => {
  const [state, setState] = useStore()
  const setRoot = (root: HTMLElement) => {
    setState(override(state(), { root }))
  }

  return (
    <div class='ink ink-mde' ref={setRoot}>
      <Styles />
      <DropZone />
      <Show when={state().options.interface.toolbar}>
        <Toolbar />
      </Show>
      <Editor />
    </div>
  )
}
