import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ink, wrap } from '/src/index'
import example from '/test/assets/example.md?raw'
import { mockAll } from '../../helpers/dom'

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

    it.todo('matches the snapshot', async () => {
      const target = document.createElement('div')

      // Todo: Use a comprehensive starter doc.
      await ink(target, {
        doc: example,
        interface: {
          images: true,
          toolbar: true,
        },
      })

      expect(target).toMatchSnapshot()
    })
  })

  describe('lists', () => {
    const doc = `- A basic list\n- another item\n  - and another\n\n1. A numbered list\n  2. another item\n3. and another\n\n- [ ] A task list\n  - [x] another item\n- [ ] and another`

    it('disables lists by default', async () => {
      const target = document.createElement('div')

      await ink(target, {
        doc,
      })

      expect(target.querySelector('.ink-mde-indent')).toBeNull()
      expect(target.querySelector('.ink-mde-list')).toBeNull()
      expect(target.querySelector('.ink-mde-bullet-list')).toBeNull()
      expect(target.querySelector('.ink-mde-number-list')).toBeNull()
      expect(target.querySelector('.ink-mde-task-list')).toBeNull()
    })

    it('enables only bullet lists when configured', async () => {
      const target = document.createElement('div')

      await ink(target, {
        doc,
        lists: {
          bullet: true,
        },
      })

      expect(target.querySelector('.ink-mde-indent')).toBeDefined()
      expect(target.querySelector('.ink-mde-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-bullet-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-number-list')).toBeNull()
      expect(target.querySelector('.ink-mde-task-list')).toBeNull()
    })

    it('enables only number lists when configured', async () => {
      const target = document.createElement('div')

      await ink(target, {
        doc,
        lists: {
          number: true,
        },
      })

      expect(target.querySelector('.ink-mde-indent')).toBeDefined()
      expect(target.querySelector('.ink-mde-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-bullet-list')).toBeNull()
      expect(target.querySelector('.ink-mde-number-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-task-list')).toBeNull()
    })

    it('enables only task lists when configured', async () => {
      const target = document.createElement('div')

      await ink(target, {
        doc,
        lists: {
          task: true,
        },
      })

      expect(target.querySelector('.ink-mde-indent')).toBeDefined()
      expect(target.querySelector('.ink-mde-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-bullet-list')).toBeNull()
      expect(target.querySelector('.ink-mde-number-list')).toBeNull()
      expect(target.querySelector('.ink-mde-task-list')).toBeDefined()
    })

    it('enables all lists when configured', async () => {
      const target = document.createElement('div')

      await ink(target, {
        doc,
        lists: true,
      })

      expect(target.querySelector('.ink-mde-indent')).toBeDefined()
      expect(target.querySelector('.ink-mde-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-bullet-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-number-list')).toBeDefined()
      expect(target.querySelector('.ink-mde-task-list')).toBeDefined()
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

    it('sets the textarea to `display: none`', () => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')

      form.appendChild(textarea)

      wrap(textarea)

      expect(textarea.style.display).toEqual('none')
    })

    it('mounts ink after the textarea', () => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')

      form.appendChild(textarea)

      wrap(textarea)

      expect(form.children[0]).toEqual(textarea)
      expect(form.children[1].classList.contains('ink-mde-textarea')).toBe(true)
    })

    it.todo('matches the snapshot', async () => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')

      form.appendChild(textarea)

      await wrap(textarea, {
        doc: example,
        interface: {
          images: true,
          toolbar: true,
        },
      })

      expect(form).toMatchSnapshot()
    })
  })
})
