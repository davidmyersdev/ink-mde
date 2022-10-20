import { EditorState } from '@codemirror/state'

export const readonly = () => {
  return EditorState.readOnly.of(true)
}
