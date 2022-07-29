import type { Component, JSX } from 'solid-js'

export const Button: Component<{ children: JSX.Element, onclick: JSX.DOMAttributes<HTMLButtonElement>['onclick'] }> = (props) => {
  return (
    <button class='ink-button' onclick={props.onclick}>
      {props.children}
    </button>
  )
}
