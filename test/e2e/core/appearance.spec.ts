import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('appearance', () => {
  test('does not apply the dark editor theme for light appearance', async ({ page }) => {
    const { root } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { appearance: 'light' } })
    })

    await expect(root).toHaveCSS('border-top-color', 'rgb(245, 245, 245)')
  })

  test('applies the dark editor theme for dark appearance', async ({ page }) => {
    const { root } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { appearance: 'dark' } })
    })

    await expect(root).toHaveCSS('border-top-color', 'rgb(18, 18, 18)')
  })

  test('follows the browser color scheme for auto appearance', async ({ page }) => {
    const { root } = getLocators(page)

    await page.emulateMedia({ colorScheme: 'dark' })
    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { appearance: 'auto' } })
    })

    await expect(root).toHaveCSS('border-top-color', 'rgb(18, 18, 18)')
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(root).toHaveCSS('border-top-color', 'rgb(245, 245, 245)')
  })

  test('updates the editor theme after appearance reconfiguration', async ({ page }) => {
    const { host, root } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { interface: { appearance: 'light' } })
      Object.assign(target, { instance })
    })
    await expect(root).toHaveCSS('border-top-color', 'rgb(245, 245, 245)')
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { interface: { appearance: string } }) => Promise<void> },
    }) => {
      await target.instance.reconfigure({ interface: { appearance: 'dark' } })
    })
    await expect(root).toHaveCSS('border-top-color', 'rgb(18, 18, 18)')
  })
})
