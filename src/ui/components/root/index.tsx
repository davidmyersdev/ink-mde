import { Show, createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import van from 'vanjs-core'
import { getHydrationMarkerProps } from '/src/constants'
import { override } from '/src/utils/merge'
import type InkInternal from '/types/internal'
import { useStore } from '../../app'
import { Details } from '../details'
import { DropZone } from '../drop_zone'
import { Editor } from '../editor'
import { Toolbar } from '../toolbar'
import { Styles } from './styles'

export const Root: Component<{ store: InkInternal.Store, target?: HTMLElement }> = (props) => {
  const [state, setState] = useStore()
  const setRoot = (root: HTMLElement) => {
    setState(override(state(), { root }))
  }

  const vanState = van.state(state())

  createEffect(() => {
    vanState.val = state()

    console.log('vanState', vanState.val)
  })

  return (
    <div class='ink ink-mde' ref={setRoot} {...getHydrationMarkerProps()}>
      <Styles />
      <Show when={state().options.files.clipboard || state().options.files.dragAndDrop}>
        <DropZone />
      </Show>
      <Show when={state().options.interface.toolbar}>
        <Toolbar />
      </Show>
      <div class='ink-mde-editor'>
        <Editor target={props.target} />
      </div>
      <Show when={state().options.readability || state().options.interface.attribution}>
        <Details state={vanState} />
      </Show>
    </div>
  )
}
