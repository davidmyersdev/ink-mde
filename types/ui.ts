import type { SvelteComponentTyped } from 'svelte'
import type Ink from '/types/ink'

export namespace InkUi {
  export type Element = HTMLElement | undefined
  export type MountableComponent<T> = new (options: { props: T, target: HTMLElement }) => SvelteComponentTyped<T>
  export type MountedComponent<T> = { component: SvelteComponentTyped<T>, target: HTMLElement }
  export type Root = MountedComponent<{ options: Ink.Options }>
}

export default InkUi
