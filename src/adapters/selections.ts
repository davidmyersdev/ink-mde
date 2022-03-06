import { EditorSelection, SelectionRange } from '@codemirror/state'
import type * as Ink from '/types/ink'

export const toCodeMirror = (selections: Ink.Editor.Selection[]) => {
  const ranges = selections.map((selection): SelectionRange => {
    const range = SelectionRange.fromJSON({ anchor: selection.start, head: selection.end })

    return range
  })

  return EditorSelection.create(ranges)
}

export const toInk = (selection: EditorSelection) => {
  const selections = selection.ranges.map((range: SelectionRange): Ink.Editor.Selection => {
    return {
      end: range.anchor < range.head ? range.head : range.anchor,
      start: range.head < range.anchor ? range.head : range.anchor,
    }
  })

  return selections
}
