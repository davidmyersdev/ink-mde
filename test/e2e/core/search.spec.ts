import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

const selectedMatchOffset = async (page: import('@playwright/test').Page) => {
  return await page.locator('.cm-searchMatch-selected').evaluate((match) => {
    const content = match.closest('.ink-mde-editor-content')

    if (!content) {
      throw new Error('Missing editor content')
    }

    const range = document.createRange()
    range.setStart(content, 0)
    range.setEndBefore(match)

    return range.toString().length
  })
}

test.describe('search', () => {
  test('opens and focuses the search panel with the search shortcut', async ({ page }) => {
    const { content, searchInput, searchPanel } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target)
    })
    await content.click()
    await page.keyboard.press('ControlOrMeta+f')

    await expect(searchPanel).toBeVisible()
    await expect(searchInput).toBeFocused()
  })

  test('updates search matches after typing a query', async ({ page }) => {
    const { content, searchInput, searchMatch } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: 'match other match' })
    })
    await content.click()
    await page.keyboard.press('ControlOrMeta+f')
    await searchInput.fill('match')

    await expect(searchMatch).toHaveCount(2)
  })

  test('moves to the next search match on Enter', async ({ page }) => {
    const { content, searchInput, searchMatchSelected } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: 'match other match' })
    })
    await content.click()
    await page.keyboard.press('ControlOrMeta+f')
    await searchInput.fill('match')
    await searchInput.press('Enter')
    await expect(searchMatchSelected).toHaveCount(1)
    const firstOffset = await selectedMatchOffset(page)
    await searchInput.press('Enter')

    await expect(searchMatchSelected).toHaveCount(1)
    expect(await selectedMatchOffset(page)).toBeGreaterThan(firstOffset)
  })

  test('moves to the previous search match on Shift+Enter', async ({ page }) => {
    const { content, searchInput, searchMatchSelected } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: 'match other match' })
    })
    await content.click()
    await page.keyboard.press('ControlOrMeta+f')
    await searchInput.fill('match')
    await searchInput.press('Enter')
    await searchInput.press('Enter')
    await expect(searchMatchSelected).toHaveCount(1)
    const secondOffset = await selectedMatchOffset(page)
    await searchInput.press('Shift+Enter')

    await expect(searchMatchSelected).toHaveCount(1)
    expect(await selectedMatchOffset(page)).toBeLessThan(secondOffset)
  })

  test('does not open the search panel when search is disabled', async ({ page }) => {
    const { content, searchPanel } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { search: false })
    })
    await content.click()
    await page.keyboard.press('ControlOrMeta+f')

    await expect(searchPanel).toHaveCount(0)
  })
})
