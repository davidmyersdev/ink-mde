import { EditorSelection, SelectionRange } from '@codemirror/state'
import Ink from '/types/ink'

export const toCodeMirror = (selections: Ink.Editor.Selection[]) => {
  const ranges = selections.map((selection): SelectionRange => {
    const range = SelectionRange.fromJSON({ anchor: selection.end, head: selection.start })

    return range
  })

  return EditorSelection.create(ranges)
}

export const toInk = (selection: EditorSelection) => {
  const ranges = selection.toJSON()
  const selections = ranges.map((range: SelectionRange): Ink.Editor.Selection => {
    return {
      end: range.anchor,
      start: range.head,
    }
  })

  return selections
}
