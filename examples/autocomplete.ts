import { defineOptions, ink } from '@writewithocto/ink'

const autocompletions = [
  {
    prefix: '[[',
    suffix: ']]',
    suggestions: [
      { text: 'Hello, World!', insert: '123' },
      { text: 'Goodbye, World!', insert: '456' },
    ],
  },
]

// Use defineOptions for automatic type hinting.
const options = defineOptions({
  // @ts-ignore
  autocompletions,
  doc: '# Hello',
})

const editor = ink(document.getElementById('editor')!, options)
