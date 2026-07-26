import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('details', () => {
  test('shows attribution by default', async ({ page }) => {
    const { attribution } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target)
    })

    await expect(attribution).toContainText('powered by ink-mde')
  })

  test('hides attribution when disabled', async ({ page }) => {
    const { attribution } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { attribution: false } })
    })

    await expect(attribution).toHaveCount(0)
  })

  test('renders readability details when enabled', async ({ page }) => {
    const { readability } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: 'hello world', readability: true })
    })

    await expect(readability).toHaveText('0s read | 2 words | 1 lines | 11 chars')
  })

  test('updates readability details after document edits', async ({ page }) => {
    const { readability } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { readability: true })
      instance.update('hi\nthere')
    })

    await expect(readability).toHaveText('0s read | 2 words | 2 lines | 8 chars')
  })

  test('renders one separator when readability and attribution are enabled', async ({ page }) => {
    const { details } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { readability: true })
    })

    await expect(details.getByText('|', { exact: true })).toHaveCount(1)
  })
})
