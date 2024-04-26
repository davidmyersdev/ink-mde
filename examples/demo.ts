import { ink } from '/src/index'
import example from '/test/assets/example.md?raw'
import { type Instance, type Values } from '/types/ink'

declare global {
  interface Window {
    ink: Instance,
    // theme helpers
    auto: () => void,
    dark: () => void,
    light: () => void,
  }
}

window.ink = ink(document.getElementById('app')!, {
  doc: example,
  files: {
    clipboard: true,
    dragAndDrop: true,
    handler: (files) => {
      // eslint-disable-next-line no-console
      console.log({ files })

      const lastFile = Array.from(files).pop()

      if (lastFile) {
        return URL.createObjectURL(lastFile)
      }
    },
    injectMarkup: true,
  },
  interface: {
    appearance: 'light',
    images: true,
    lists: true,
    readonly: false,
    spellcheck: true,
    toolbar: true,
  },
  placeholder: 'Start typing...',
  readability: true,
  // toolbar: {
  //   upload: true,
  // },
})

window.ink.focus()

const toggleTheme = (theme: Values.Appearance) => {
  document.documentElement.classList.remove('auto', 'dark', 'light')
  document.documentElement.classList.add(theme)

  window.ink.reconfigure({ interface: { appearance: theme } })
}

window.auto = toggleTheme.bind(undefined, 'auto')
window.dark = toggleTheme.bind(undefined, 'dark')
window.light = toggleTheme.bind(undefined, 'light')
