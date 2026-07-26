import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

const getDoc = async (host: ReturnType<typeof getLocators>['host']) => {
  return await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())
}

test.describe('tab keybindings', () => {
  test('indents with Tab by default', async ({ page }) => {
    const { content, host } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text' })
      instance.select({ at: 'start' })
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.press('Tab')
    expect((await getDoc(host)).trimStart()).toBe('text')
    expect(await getDoc(host)).not.toBe('text')
  })

  test('outdents with Shift+Tab by default', async ({ page }) => {
    const { content, host } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '  text' })
      instance.select({ at: 'start' })
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.press('Shift+Tab')
    expect(await getDoc(host)).toBe('text')
  })

  test('does not indent when Tab is disabled', async ({ page }) => {
    const { content, host } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', keybindings: { tab: false } })
      instance.select({ at: 'start' })
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.press('Tab')
    await expect.poll(() => getDoc(host)).toBe('text')
  })

  test('does not outdent when Shift+Tab is disabled', async ({ page }) => {
    const { content, host } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '  text', keybindings: { shiftTab: false } })
      instance.select({ at: 'start' })
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.press('Shift+Tab')
    await expect.poll(() => getDoc(host)).toBe('  text')
  })

  test('trapTab enables both tab bindings', async ({ page }) => {
    const { content, host } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', keybindings: { tab: false }, trapTab: true })
      instance.select({ at: 'start' })
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.press('Tab')
    expect(await getDoc(host)).not.toBe('text')
  })

  test('trapTab disables both tab bindings', async ({ page }) => {
    const { content, host } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', trapTab: false })
      instance.select({ at: 'start' })
      Object.assign(target, { instance })
    })
    await content.click()
    await page.keyboard.press('Tab')
    await expect.poll(() => getDoc(host)).toBe('text')
  })
})
