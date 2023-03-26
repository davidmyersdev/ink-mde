import { syntaxTree } from '@codemirror/language'
import { type EditorState, type Extension, type Range, type RangeCursor, RangeSet, StateField } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { ink } from 'ink-mde'
import { type Signal, createRoot, createSignal } from 'solid-js'
import { buildWidgetDecoration } from '/lib/codemirror-kit'

const hasOverlap = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.max(x1, y1) <= Math.min(x2, y2)
}

const preview = (text: string, from: number, to: number, [counters, setCounters]: Signal<Record<string, number>>) => {
  setCounters({ ...counters(), buildDecoration: counters().buildDecoration + 1 })

  return buildWidgetDecoration({
    block: true,
    side: -1,
    widget: {
      id: text,
      length: to - from,
      toDOM: () => {
        setCounters({ ...counters(), toDOM: counters().toDOM + 1 })

        return (
          <div>
            <div>Decoration function calls: {counters().buildDecoration}</div>
            <div>Decoration DOM updates: {counters().toDOM}</div>
            <div>DOM updated at: {Date.now()}</div>
            <span>{text}</span>
          </div>
        ) as HTMLElement
      },
    },
  })
}

export const codeBlockDecorator = (): Extension => {
  return createRoot(() => {
    const [counters, setCounters] = createSignal({ buildDecoration: 0, toDOM: 0 })

    const decorate = (state: EditorState, from?: number, to?: number) => {
      const widgets: Range<ReturnType<typeof preview>>[] = []

      syntaxTree(state).iterate({
        enter: ({ type, from, to }) => {
          // Only look at fenced code for right now.
          if (type.name === 'FencedCode') {
            // Grab all text between the opening and closing lines.
            const text = state.sliceDoc(from, to).split('\n').slice(1, -1).join('\n')

            if (text) {
              widgets.push(preview(text, from, to, [counters, setCounters]).range(from))
            }
          }
        },
        from,
        to,
      })

      return widgets
    }

    const stateField = StateField.define<RangeSet<ReturnType<typeof preview>>>({
      create(state) {
        return RangeSet.of(decorate(state))
      },
      update(rangeSet, transaction) {
        // Reconfiguration and state effects will reprocess the entire state to ensure nothing is missed.
        if (transaction.reconfigured || transaction.effects.length > 0) {
          return RangeSet.of(decorate(transaction.state))
        }

        const updatedRangeSet = rangeSet.map(transaction.changes)

        // Doc changes should only process the affected ranges.
        if (transaction.docChanged) {
          const decorations = [] as ReturnType<typeof decorate>
          const cursor = updatedRangeSet.iter()
          const cursors = [] as RangeCursor<ReturnType<typeof preview>>[]
          const cursorsToSkip = [] as RangeCursor<ReturnType<typeof preview>>[]

          while (cursor.value) {
            cursors.push({ ...cursor })
            cursor.next()
          }

          transaction.changes.iterChangedRanges((_beforeFrom, _beforeTo, afterFrom, afterTo) => {
            cursors.forEach((cursor) => {
              const cursorTo = cursor.from + (cursor.value?.widget.length || 0)

              if (hasOverlap(cursor.from, cursorTo, afterFrom, afterTo)) {
                cursorsToSkip.push(cursor)
              }
            })

            decorations.push(...decorate(transaction.state, afterFrom, afterTo))
          })

          const cursorDecos = cursors.filter(cursor => !cursorsToSkip.includes(cursor)).flatMap((cursor) => {
            const range = cursor.value?.range(cursor.from)

            if (!range) return []

            return [range]
          })

          decorations.push(...cursorDecos)

          // I think I need the entire arrays of ranges and changes ahead of time.
          // If a given range has *no* related changes, then it can be kept in the list of decorations.
          // If a given change has no relevant ranges, then it can be processed to create potential new decorations.
          //
          // Maybe the logic is this:
          // If a given change is entirely encapsulated within a decoration range,
          // then that decoration alone can be updated specifically for that change.
          // If a given change is partially encapsulated within a decoration range,
          // then that decoration should be dropped, and the change should be used to calculate a new decoration set.
          // If a given change is not related to a decoration range,
          // then that change should be used to create new decorations without affecting existing decorations.

          const allDecorations = decorations.sort((left, right) => {
            return left.from - right.from
          })

          // This reprocesses the entire state.
          return RangeSet.of(allDecorations)
        }

        // No need to redecorate. Instead, just map the decorations through the transaction changes.
        return updatedRangeSet
      },
      provide(field) {
        // Provide the extension to the editor.
        return EditorView.decorations.from(field)
      },
    })

    return [
      stateField,
    ]
  })
}

ink(document.querySelector('#app')!, {
  doc: '# Start with some text\n\n```\nhi\n```\n\n```\nhello\n```',
  plugins: [
    {
      type: 'default',
      value: codeBlockDecorator(),
    },
  ],
})
