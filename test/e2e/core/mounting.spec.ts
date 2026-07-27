import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('core editor mounting and lifecycle', () => {
  test('mounts into an empty target', async ({ page }) => {
    const { root } = getLocators(page)

    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)

      return instance.getDoc()
    })

    await expect(root).toBeVisible()
    expect(doc).toBe('')
  })

  test('mounts with an initial document', async ({ page }) => {
    const { content } = getLocators(page)

    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '# Hello' })

      return instance.getDoc()
    })

    await expect(content).toContainText('# Hello')
    expect(doc).toBe('# Hello')
  })

  test('focuses the editor', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)

      instance.focus()
    })

    await page.keyboard.type('Hello')

    await expect(content).toHaveText('Hello')
  })

  test('destroys the editor', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)

      instance.destroy()
    })

    await expect(content).toHaveCount(0)
  })

  test('allows repeated setup on the same page', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: 'first document' })
    })

    await expect(content).toHaveText('first document')

    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'second document' })

      return instance.getDoc()
    })

    await expect(content).toHaveText('second document')
    expect(doc).toBe('second document')
  })
})
