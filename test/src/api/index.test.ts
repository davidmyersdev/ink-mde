import { describe, expect, it, vi } from 'vitest'
import {
  destroy,
  focus,
} from '/src/api'
import { makeStore } from '/test/mocks/store'

describe('api', () => {
  describe('destroy', () => {
    it('destroys the editor', () => {
      const store = makeStore()
      const [state] = store
      const { editor } = state()

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

      focus(store)

      expect(editor.focus).toHaveBeenCalledOnce()
    })

    it('does not focus the editor when it already has focus', () => {
      const store = makeStore()
      const [state] = store
      const { editor } = state()

      vi.spyOn(editor, 'hasFocus', 'get').mockReturnValue(true)

      focus(store)

      expect(editor.focus).not.toHaveBeenCalledOnce()
    })
  })
})
