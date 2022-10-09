import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { vi } from 'vitest'
import type InkInternal from '/types/internal'

vi.mock('@codemirror/state')
vi.mock('@codemirror/view')

export const makeEditor = (): InkInternal.Editor => {
  return new EditorView({
    state: EditorState.create(),
  })
}
