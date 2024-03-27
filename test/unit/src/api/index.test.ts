import { describe, expect, it, vi } from 'vitest'
import {
  destroy,
  focus,
} from '/src/api'
import { makeStore } from '../../../mocks/store'

describe('api', () => {
  describe('destroy', () => {
    it('destroys the editor', () => {
      const store = makeStore()
      const [state] = store
      const { editor } = state()

      vi.spyOn(editor, 'destroy')

      destroy(store)

      expect(editor.destroy).toHaveBeenCalledOnce()
    })
  })

  describe('focus', () => {
    it('focuses the editor', () => {
      const store = makeStore()
      const [state] = store
      const { editor } = state()

      vi.spyOn(editor, 'hasFocus', 'get').mockReturnValue(false)
      vi.spyOn(editor, 'focus')

      focus(store)

      expect(editor.focus).toHaveBeenCalledOnce()
    })

    it('does not focus the editor when it already has focus', () => {
      const store = makeStore()
      const [state] = store
      const { editor } = state()

      vi.spyOn(editor, 'hasFocus', 'get').mockReturnValue(true)
      vi.spyOn(editor, 'focus')

      focus(store)

      expect(editor.focus).not.toHaveBeenCalledOnce()
    })
  })
})
