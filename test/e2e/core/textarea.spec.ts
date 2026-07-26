import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('native textarea wrapping', () => {
  test('hides the original textarea', async ({ page }) => {
    const { textarea } = getLocators(page)

    await withInk(page, async ({ target, wrap }) => {
      const textarea = document.createElement('textarea')

      target.append(textarea)
      await wrap(textarea)
    })

    await expect(textarea).toBeHidden()
  })

  test('inserts the editor after the textarea', async ({ page }) => {
    const isInsertedAfterTextarea = await withInk(page, async ({ target, wrap }) => {
      const textarea = document.createElement('textarea')

      target.append(textarea)
      await wrap(textarea)

      return textarea.nextElementSibling?.classList.contains('ink-mde-textarea')
    })

    expect(isInsertedAfterTextarea).toBe(true)
  })

  test('initializes the editor from the textarea value', async ({ page }) => {
    const { content } = getLocators(page)

    const doc = await withInk(page, async ({ target, wrap }) => {
      const textarea = document.createElement('textarea')
      textarea.value = '# Hello'

      target.append(textarea)

      const instance = await wrap(textarea)

      return instance.getDoc()
    })

    await expect(content).toContainText('# Hello')
    expect(doc).toBe('# Hello')
  })

  test('updates the textarea value on form submit', async ({ page }) => {
    const value = await withInk(page, async ({ target, wrap }) => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')

      form.append(textarea)
      target.append(form)

      const instance = await wrap(textarea)

      instance.insert('Hello')
      form.dispatchEvent(new Event('submit'))

      return textarea.value
    })

    expect(value).toBe('Hello')
  })

  test('creates a working editor without a form', async ({ page }) => {
    const doc = await withInk(page, async ({ target, wrap }) => {
      const textarea = document.createElement('textarea')

      target.append(textarea)

      const instance = await wrap(textarea)

      instance.insert('Hello')

      return instance.getDoc()
    })

    expect(doc).toBe('Hello')
  })
})
