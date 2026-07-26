import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('toolbar', () => {
  test('is hidden by default', async ({ page }) => {
    const { toolbar } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target)
    })

    await expect(toolbar).toHaveCount(0)
  })

  test('renders when enabled', async ({ page }) => {
    const { toolbar } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { toolbar: true } })
    })

    await expect(toolbar).toBeVisible()
  })

  test('hides configured toolbar buttons', async ({ page }) => {
    const { toolbarBold } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { toolbar: true }, toolbar: { bold: false } })
    })

    await expect(toolbarBold).toHaveCount(0)
  })

  test('formats selected text and restores editor focus', async ({ page }) => {
    const { content, host, toolbarBold } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: 'text',
        interface: { toolbar: true },
        toolbar: { bold: true },
      })
      instance.select({ selection: { end: 4, start: 0 } })
      Object.assign(target, { instance })
    })
    await toolbarBold.click()

    await expect(content).toBeFocused()
    await expect.poll(async () => {
      return await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())
    }).toBe('**text**')
  })

  test('formats selected text as a heading', async ({ page }) => {
    const { host, toolbarHeading } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', interface: { toolbar: true } })
      instance.select({ selection: { end: 4, start: 0 } })
      Object.assign(target, { instance })
    })
    await toolbarHeading.click()
    await expect.poll(async () => await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())).toBe('# text')
  })

  test('formats selected text as italic', async ({ page }) => {
    const { host, toolbarItalic } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', interface: { toolbar: true } })
      instance.select({ selection: { end: 4, start: 0 } })
      Object.assign(target, { instance })
    })
    await toolbarItalic.click()
    await expect.poll(async () => await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())).toBe('*text*')
  })

  test('formats selected text as a quote', async ({ page }) => {
    const { host, toolbarQuote } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', interface: { toolbar: true } })
      instance.select({ selection: { end: 4, start: 0 } })
      Object.assign(target, { instance })
    })
    await toolbarQuote.click()
    await expect.poll(async () => await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())).toBe('> text')
  })

  test('formats selected text as a code block', async ({ page }) => {
    const { host, toolbarCodeBlock } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', interface: { toolbar: true } })
      instance.select({ selection: { end: 4, start: 0 } })
      Object.assign(target, { instance })
    })
    await toolbarCodeBlock.click()
    await expect.poll(async () => await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())).toBe('```\ntext\n```')
  })

  test('formats selected text as inline code', async ({ page }) => {
    const { host, toolbarCode } = getLocators(page)
    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'text', interface: { toolbar: true } })
      instance.select({ selection: { end: 4, start: 0 } })
      Object.assign(target, { instance })
    })
    await toolbarCode.click()
    await expect.poll(async () => await host.evaluate((target: HTMLElement & { instance: { getDoc: () => string } }) => target.instance.getDoc())).toBe('`text`')
  })
})
