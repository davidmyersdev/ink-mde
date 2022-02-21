import type InkUi from '/types/ui'

declare module '/src/ui/App.svelte' {
  // VSCode thinks we are redeclaring the export, but TS does not understand the import without it.
  export const props: InkUi.App.Props
}
