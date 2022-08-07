import type { Component, JSX } from 'solid-js'

export const Button: Component<{ children: JSX.Element, onclick: JSX.EventHandler<HTMLButtonElement, MouseEvent> }> = (props) => {
  return (
    <button class='ink-button' onClick={e => props.onclick(e)}>
      {props.children}
    </button>
  )
}
