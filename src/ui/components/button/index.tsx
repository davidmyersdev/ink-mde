import type { Component, JSX } from 'solid-js'

export const Button: Component<{
  children: JSX.Element,
  onclick: JSX.EventHandler<HTMLButtonElement, MouseEvent>,
  ariaLabel?: string,
}> = (props) => {
  return (
    <button aria-label={props.ariaLabel} class='ink-button' onClick={e => props.onclick(e)} type='button'>
      {props.children}
    </button>
  )
}
