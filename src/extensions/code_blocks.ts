import { syntaxTree } from '@codemirror/language'
import { RangeSetBuilder } from '@codemirror/rangeset'
import { Extension } from '@codemirror/state'
import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'

const codeBlockBaseTheme = EditorView.baseTheme({
  '.cm-line': { fontFamily: 'var(--ink-font-family, sans-serif)' },
  '.cm-line.cm-codeblock': { fontFamily: 'var(--ink-font-family-mono, monospace)', },
})

const codeBlockSyntaxNodes = [
  'CodeBlock',
  'FencedCode',
  'HTMLBlock',
  'CommentBlock',
]

const codeBlockDecoration = Decoration.line({
  attributes: { class: 'cm-codeblock' }
})

const codeBlockPlugin = ViewPlugin.define((view: EditorView) => {
  return {
    update: () => {
      return decorate(view)
    }
  }
}, { decorations: (plugin) => plugin.update() })

const decorate = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()

  for (const { from, to } of view.visibleRanges) {
    for (let position = from; position < to;) {
      const line = view.state.doc.lineAt(position)

      syntaxTree(view.state).iterate({
        enter: (type, _from, _to) => {
          if (type.name !== 'Document') {
            if (codeBlockSyntaxNodes.includes(type.name)) {
              builder.add(line.from, line.from, codeBlockDecoration)
            }

            return false
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

export const codeBlocks = (): Extension => {
  return [
    codeBlockBaseTheme,
    codeBlockPlugin,
  ]
}
