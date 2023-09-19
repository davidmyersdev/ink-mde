import { indentLess, indentMore } from '@codemirror/commands'
import { type Extension } from '@codemirror/state'
import { keymap } from '@codemirror/view'

export const indentWithTab = ({ tab = true, shiftTab = true } = {}): Extension => {
  return keymap.of([
    {
      key: 'Tab',
      run: tab ? indentMore : undefined,
    },
    {
      key: 'Shift-Tab',
      run: shiftTab ? indentLess : undefined,
    },
  ])
}
