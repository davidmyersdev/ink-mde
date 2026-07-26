import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('Vim', () => {
  test('edits normally when Vim mode is disabled', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target)
    })
    await content.click()
    await page.keyboard.type('text')

    await expect(content).toHaveText('text')
  })

  test('supports insert mode and a normal-mode delete when enabled', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { vim: true })
    })
    await content.click()
    await page.keyboard.press('i')
    await page.keyboard.type('text')
    await page.keyboard.press('Escape')
    await page.keyboard.press('x')

    await expect(content).toHaveText('tex')
  })

  test('updates keyboard behavior after Vim reconfiguration', async ({ page }) => {
    const { content, host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.type('a')
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { vim: boolean }) => Promise<void>, update: (doc: string) => void },
    }) => {
      await target.instance.reconfigure({ vim: true })
      target.instance.update('')
    })
    await content.click()
    await page.keyboard.press('i')
    await page.keyboard.type('b')
    await page.keyboard.press('Escape')
    await page.keyboard.press('x')
    await expect(content).toHaveText('')
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { vim: boolean }) => Promise<void> },
    }) => {
      await target.instance.reconfigure({ vim: false })
    })
    await page.keyboard.type('c')

    await expect(content).toHaveText('c')
  })
})
