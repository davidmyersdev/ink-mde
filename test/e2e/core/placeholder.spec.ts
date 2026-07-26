import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('placeholder', () => {
  test('renders placeholder text for an empty document', async ({ page }) => {
    const { placeholder } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { placeholder: 'Write something' })
    })

    await expect(placeholder).toHaveText('Write something')
  })

  test('hides the placeholder after typing', async ({ page }) => {
    const { content, placeholder } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { placeholder: 'Write something' })
    })
    await content.click()
    await page.keyboard.type('Text')

    await expect(placeholder).toHaveCount(0)
  })

  test('shows the placeholder after the document becomes empty again', async ({ page }) => {
    const { content, placeholder } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { placeholder: 'Write something' })
    })
    await content.click()
    await page.keyboard.type('Text')
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.press('Backspace')

    await expect(placeholder).toHaveText('Write something')
  })

  test('updates displayed placeholder text after reconfiguration', async ({ page }) => {
    const { placeholder } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { placeholder: 'First placeholder' })
      await instance.reconfigure({ placeholder: 'Updated placeholder' })
    })

    await expect(placeholder).toHaveText('Updated placeholder')
  })
})
