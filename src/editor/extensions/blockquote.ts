import { syntaxTree } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { RangeSetBuilder } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { Decoration, ViewPlugin } from '@codemirror/view'

// const mark = 'QuoteMark'

const blockquoteSyntaxNodes = [
  'Blockquote',
]

const blockquoteDecoration = Decoration.line({ attributes: { class: 'cm-blockquote' } })
const blockquoteOpenDecoration = Decoration.line({ attributes: { class: 'cm-blockquote-open' } })
const blockquoteCloseDecoration = Decoration.line({ attributes: { class: 'cm-blockquote-close' } })

const blockquotePlugin = ViewPlugin.define((view: EditorView) => {
  return {
    update: () => {
      return decorate(view)
    },
  }
}, { decorations: plugin => plugin.update() })

const decorate = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()
  const tree = syntaxTree(view.state)

  for (const visibleRange of view.visibleRanges) {
    for (let position = visibleRange.from; position < visibleRange.to;) {
      const line = view.state.doc.lineAt(position)

      tree.iterate({
        enter({ type, from, to }) {
          if (type.name !== 'Document') {
            if (blockquoteSyntaxNodes.includes(type.name)) {
              builder.add(line.from, line.from, blockquoteDecoration)

              const openLine = view.state.doc.lineAt(from)
              const closeLine = view.state.doc.lineAt(to)

              if (openLine.number === line.number)
                builder.add(line.from, line.from, blockquoteOpenDecoration)

              if (closeLine.number === line.number)
                builder.add(line.from, line.from, blockquoteCloseDecoration)

              return false
            }
          }
        },
        from: line.from,
        to: line.to,
      })

      position = line.to + 1
    }
  }

  return builder.finish()
}

export const blockquote = (): Extension => {
  return [
    blockquotePlugin,
  ]
}
