import { syntaxTree } from '@codemirror/language'
import { ViewPlugin } from '@codemirror/view'
import type { EditorView, ViewUpdate } from '@codemirror/view'

export const syntaxObserver = (position: (doc: string) => number) => {
  return ViewPlugin.fromClass(class {
    constructor(view: EditorView) {
      this.write(view)
    }

    update(update: ViewUpdate) {
      this.write(update.view)
    }

    write(view: EditorView) {
      const offset = position(view.state.doc.toString())
      view.dom.dataset.e2eSyntax = syntaxTree(view.state).resolve(offset, 1).name
    }
  })
}
