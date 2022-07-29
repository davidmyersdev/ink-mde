import { defaultKeymap, historyKeymap, indentLess, indentMore } from '@codemirror/commands'
import type { Extension } from '@codemirror/state'
import { Transaction } from '@codemirror/state'
import type { KeyBinding } from '@codemirror/view'
import { keymap } from '@codemirror/view'

const keyMaps: KeyBinding[] = [
  {
    key: 'Tab',
    run: ({ state, dispatch }) => {
      if (state.selection.ranges.some(r => !r.empty))
        return indentMore({ state, dispatch })

      dispatch(
        state.update(state.replaceSelection('  '), {
          scrollIntoView: true,
          annotations: Transaction.userEvent.of('input'),
        }),
      )

      return true
    },
    shift: indentLess,
  },
]

export const keymaps = (): Extension => {
  return keymap.of([
    ...keyMaps,
    ...defaultKeymap,
    ...historyKeymap,
  ])
}
