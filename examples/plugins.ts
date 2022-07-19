import { defineOptions, ink } from '@writewithocto/ink'

// With hooks, you can keep your state in sync with the editor.
const state = { doc: '# Start with some text' }

// Use defineOptions for automatic type hinting.
const options = defineOptions({
  doc: state.doc,
  plugins: [
    { type: 'grammar', value: {} },
  ],
})

const editor = ink(document.getElementById('editor')!, options)
