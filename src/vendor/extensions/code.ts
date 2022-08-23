import { syntaxTree } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { RangeSetBuilder } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { Decoration, ViewPlugin } from '@codemirror/view'

const codeBlockSyntaxNodes = [
  'CodeBlock',
  'FencedCode',
  'HTMLBlock',
  'CommentBlock',
]

const codeBlockDecoration = Decoration.line({ attributes: { class: 'cm-codeblock' } })
const codeBlockOpenDecoration = Decoration.line({ attributes: { class: 'cm-codeblock-open' } })
const codeBlockCloseDecoration = Decoration.line({ attributes: { class: 'cm-codeblock-close' } })
const codeDecoration = Decoration.mark({ attributes: { class: 'cm-code' } })
const codeOpenDecoration = Decoration.mark({ attributes: { class: 'cm-code cm-code-open' } })
const codeCloseDecoration = Decoration.mark({ attributes: { class: 'cm-code cm-code-close' } })

const codeBlockPlugin = ViewPlugin.define((view: EditorView) => {
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
      let inlineCode: { from: number, to: number, innerFrom: number, innerTo: number }

      tree.iterate({
        enter({ type, from, to }) {
          if (type.name !== 'Document') {
            if (codeBlockSyntaxNodes.includes(type.name)) {
              builder.add(line.from, line.from, codeBlockDecoration)

              const openLine = view.state.doc.lineAt(from)
              const closeLine = view.state.doc.lineAt(to)

              if (openLine.number === line.number)
                builder.add(line.from, line.from, codeBlockOpenDecoration)

              if (closeLine.number === line.number)
                builder.add(line.from, line.from, codeBlockCloseDecoration)

              return false
            } else if (type.name === 'InlineCode') {
              // Store a reference for the last inline code node.
              inlineCode = { from, to, innerFrom: from, innerTo: to }
            } else if (type.name === 'CodeMark') {
              // Make sure the code mark is a part of the previously stored inline code node.
              if (from === inlineCode.from) {
                inlineCode.innerFrom = to

                builder.add(from, to, codeOpenDecoration)
              } else if (to === inlineCode.to) {
                inlineCode.innerTo = from

                builder.add(inlineCode.innerFrom, inlineCode.innerTo, codeDecoration)
                builder.add(from, to, codeCloseDecoration)
              }
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

export const code = (): Extension => {
  return [
    codeBlockPlugin,
  ]
}
