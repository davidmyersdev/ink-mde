import { syntaxTree } from '@codemirror/language'
import { RangeSetBuilder } from '@codemirror/rangeset'
import { Extension } from '@codemirror/state'
import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'

const codeBlockBaseTheme = EditorView.baseTheme({
  '.cm-line': {
    fontFamily: 'var(--ink-internal-all-font-family)',
  },
  '.cm-line.cm-codeblock': {
    backgroundColor: 'var(--ink-internal-block-background-color)',
    fontFamily: 'var(--ink-internal-monospace-font-family)',
    padding: '0 var(--ink-internal-block-padding)',
  },
  '.cm-line.cm-codeblock.cm-codeblock-open': {
    borderRadius: 'var(--ink-internal-all-border-radius) var(--ink-internal-all-border-radius) 0 0',
    paddingTop: 'var(--ink-internal-block-padding)',
  },
  '.cm-line.cm-codeblock.cm-codeblock-close': {
    borderRadius: '0 0 var(--ink-internal-all-border-radius) var(--ink-internal-all-border-radius)',
    paddingBottom: 'var(--ink-internal-block-padding)',
  },
  '.cm-line .cm-code': {
    backgroundColor: 'var(--ink-internal-block-background-color)',
    fontFamily: 'var(--ink-internal-monospace-font-family)',
    padding: 'var(--ink-internal-inline-padding) 0',
  },
  '.cm-line .cm-code.cm-code-open': {
    borderRadius: 'var(--ink-internal-all-border-radius) 0 0 var(--ink-internal-all-border-radius)',
    paddingLeft: 'var(--ink-internal-inline-padding)',
  },
  '.cm-line .cm-code.cm-code-close': {
    borderRadius: '0 var(--ink-internal-all-border-radius) var(--ink-internal-all-border-radius) 0',
    paddingRight: 'var(--ink-internal-inline-padding)',
  },
})

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
    }
  }
}, { decorations: (plugin) => plugin.update() })

const decorate = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()
  const tree = syntaxTree(view.state)

  for (const visibleRange of view.visibleRanges) {
    for (let position = visibleRange.from; position < visibleRange.to;) {
      const line = view.state.doc.lineAt(position)
      let inlineCode: { from: number, to: number, innerFrom: number, innerTo: number }

      tree.iterate({
        enter(type, from, to) {
          if (type.name !== 'Document') {
            if (codeBlockSyntaxNodes.includes(type.name)) {
              builder.add(line.from, line.from, codeBlockDecoration)

              const openLine = view.state.doc.lineAt(from)
              const closeLine = view.state.doc.lineAt(to)

              if (openLine.number === line.number) {
                builder.add(line.from, line.from, codeBlockOpenDecoration)
              }

              if (closeLine.number === line.number) {
                builder.add(line.from, line.from, codeBlockCloseDecoration)
              }

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
    codeBlockBaseTheme,
    codeBlockPlugin,
  ]
}
