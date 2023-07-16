import { ink } from 'ink-mde'

const targetElement = document.getElementById('editor')

ink(targetElement!, {
  doc: 'Hello, world!',
})
