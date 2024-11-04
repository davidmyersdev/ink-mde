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

const url = new URL(window.location.href)
const doc = url.searchParams.get('doc') ?? example

window.ink = ink(document.getElementById('app')!, {
  doc,
  files: {
    clipboard: true,
    dragAndDrop: true,
    handler: async (files) => {
      const lastFile = Array.from(files).pop()

      await new Promise((resolve) => setTimeout(resolve, 10000))

      if (lastFile) {
        return URL.createObjectURL(lastFile)
      }
    },
    injectMarkup: true,
  },
  hooks: {
    afterUpdate: (text) => {
      url.searchParams.set('doc', text)

      window.history.replaceState(null, '', url)
    },
  },
  interface: {
    attribution: false,
    images: true,
    readonly: false,
    spellcheck: true,
    toolbar: true,
  },
  lists: true,
  placeholder: 'Start typing...',
  readability: false,
  toolbar: {
    upload: true,
  },
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

toggleTheme('light')
