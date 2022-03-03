import type { SvelteComponentTyped } from 'svelte'

export namespace InkUi {
  export type Element = HTMLElement
  export type MountableComponent<T> = new (options: { props: T, target: HTMLElement }) => SvelteComponentTyped<T>
  export type MountedComponent<T> = SvelteComponentTyped<T>
  export type Root = HTMLElement
}

export default InkUi
