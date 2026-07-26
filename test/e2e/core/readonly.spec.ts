import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('readonly', () => {
  test('accepts keyboard input by default', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)

      instance.focus()
    })

    await page.keyboard.type('Hello')

    await expect(content).toHaveText('Hello')
  })

  test('renders initial content but ignores keyboard input when readonly', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: 'Hello',
        interface: { readonly: true },
      })

      instance.focus()
    })

    await page.keyboard.type(' world')

    await expect(content).toHaveText('Hello')
  })

  test('allows programmatic updates when readonly', async ({ page }) => {
    const { content } = getLocators(page)

    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: 'one',
        interface: { readonly: true },
      })

      instance.update('two')

      return instance.getDoc()
    })

    await expect(content).toHaveText('two')
    expect(doc).toBe('two')
  })

  test('changes keyboard editability when reconfigured', async ({ page }) => {
    const { content, host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)

      Object.assign(target, { __inkMdeInstance: instance })

      await instance.reconfigure({ interface: { readonly: true } })
      instance.focus()
    })

    await page.keyboard.type('one')

    await expect(content).toHaveText('')

    await host.evaluate(async (target) => {
      const instance = (target as HTMLElement & { __inkMdeInstance: { focus: () => void, reconfigure: (options: { interface: { readonly: boolean } }) => Promise<void> } }).__inkMdeInstance

      await instance.reconfigure({ interface: { readonly: false } })
      instance.focus()
    })

    await page.keyboard.type('two')

    await expect(content).toHaveText('two')
  })
})
