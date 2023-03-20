import { syntaxTree } from '@codemirror/language'
import { type EditorState, type Extension, type Range, RangeSet, StateField } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view'
import { ink } from 'ink-mde'
import { buildWidgetDecoration } from '/lib/codemirror-kit'

const preview = (text: string) => {
  return buildWidgetDecoration({
    block: true,
    side: -1,
    widget: {
      id: text,
      toDOM: () => {
        return (<span>{text}</span>) as HTMLElement
      },
    },
  })
}

export const codeBlockDecorator = (): Extension => {
  const decorate = (state: EditorState) => {
    const widgets: Range<Decoration>[] = []

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        // Only look at fenced code for right now.
        if (type.name === 'FencedCode') {
          // Grab all text between the opening and closing lines.
          const text = state.sliceDoc(from, to).split('\n').slice(1, -1).join('\n')

          if (text) {
            widgets.push(preview(text).range(from))
          }
        }
      },
    })

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none
  }

  const stateField = StateField.define<DecorationSet>({
    create(state) {
      return decorate(state)
    },
    update(rangeSets, transaction) {
      // In these scenarios, we need to update decorations.
      if (transaction.docChanged || transaction.reconfigured || transaction.effects.length > 0) {
        // This reprocesses the entire state.
        return decorate(transaction.state)
      }

      // No need to redecorate. Instead, just map the decorations through the transaction changes.
      return rangeSets.map(transaction.changes)
    },
    provide(field) {
      // Provide the extension to the editor.
      return EditorView.decorations.from(field)
    },
  })

  return [
    stateField,
  ]
}

ink(document.querySelector('#app')!, {
  doc: '# Start with some text\n\n```\nhi\n```',
  plugins: [
    {
      type: 'default',
      value: codeBlockDecorator(),
    },
  ],
})
