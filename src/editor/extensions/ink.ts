import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

const inkClassExtensions = () => {
  return [
    EditorView.editorAttributes.of({
      class: 'ink-mde-container',
    }),
    EditorView.contentAttributes.of({
      class: 'ink-mde-editor-content',
    }),
    // Todo: Maybe open a PR to add scrollerAttributes?
  ]
}

export const ink = (): Extension => {
  return [
    ...inkClassExtensions(),
  ]
}
