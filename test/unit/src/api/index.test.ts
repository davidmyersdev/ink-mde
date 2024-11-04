import { describe, expect, it, vi } from 'vitest'
import {
  destroy,
  focus,
} from '/src/api'
import { makeMockStore } from '/test/mocks/store'

describe('api', () => {
  describe('destroy', () => {
    it('destroys the editor', () => {
      const state = makeMockStore()
      const { editor } = state

      const spy = vi.spyOn(editor.val, 'destroy')

      destroy(state)

      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe('focus', () => {
    it('focuses the editor', () => {
      const state = makeMockStore()
      const { editor } = state

      vi.spyOn(editor.val, 'hasFocus', 'get').mockReturnValue(false)

      const spy = vi.spyOn(editor.val, 'focus')

      focus(state)

      expect(spy).toHaveBeenCalledOnce()
    })

    it('does not focus the editor when it already has focus', () => {
      const state = makeMockStore()
      const { editor } = state

      vi.spyOn(editor.val, 'hasFocus', 'get').mockReturnValue(true)

      const spy = vi.spyOn(editor.val, 'focus')

      focus(state)

      expect(spy).not.toHaveBeenCalledOnce()
    })
  })
})
