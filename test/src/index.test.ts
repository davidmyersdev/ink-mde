import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAll } from '/test/helpers/dom'
import { ink, wrap } from '/src/index'
import example from '/test/assets/example.md?raw'

describe('ink', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockAll()
  })

  describe('ink', () => {
    it('mounts without errors', () => {
      const instance = ink(document.createElement('div'))

      expect(instance).toBeDefined()
    })

    it('matches the given options', () => {
      const instance = ink(document.createElement('div'), {
        doc: '# Hello',
      })

      expect(instance.getDoc()).toEqual('# Hello')
    })

    it('can be reconfigured', () => {
      const instance = ink(document.createElement('div'), {
        interface: {
          appearance: 'light',
        },
      })

      instance.reconfigure({ interface: { appearance: 'light' } })

      expect(instance.options().interface.appearance).toEqual('light')
    })

    it('matches the snapshot', () => {
      const target = document.createElement('div')

      // Todo: Use a comprehensive starter doc.
      ink(target, {
        doc: example,
        interface: {
          images: true,
          toolbar: true,
        },
      })

      expect(target).toMatchSnapshot()
    })
  })

  describe('wrap', () => {
    it('injects the editor after the textarea', () => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')

      form.appendChild(textarea)

      wrap(textarea)

      expect(form.children.length).toEqual(2)
    })

    it('updates the value of textarea on submit', () => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')

      form.appendChild(textarea)

      const instance = wrap(textarea)

      instance.insert('testing')
      form.dispatchEvent(new Event('submit'))

      expect(textarea.value).toEqual('testing')
    })
  })
})
