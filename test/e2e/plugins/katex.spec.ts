import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('KaTeX plugin', () => {
  test('is inactive by default', async ({ page }) => {
    const { katexTarget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '$$\nx\n$$' })
    })

    await expect(katexTarget).toHaveCount(0)
  })

  test('parses and renders block math when enabled', async ({ page }) => {
    const { katexTarget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '$$\nx\n$$', katex: true })
    })

    await expect(katexTarget).toContainText('x')
  })

  test('styles inline math when enabled', async ({ page }) => {
    const backgrounds = await withInk(page, async ({ mount, target }) => {
      await mount(target, {
        doc: 'inline $x$',
        katex: true,
      })

      return Array.from(target.querySelectorAll('span')).map((span) => {
        return {
          background: getComputedStyle(span).backgroundColor,
          text: span.textContent,
        }
      })
    })

    expect(backgrounds).toContainEqual(expect.objectContaining({
      background: expect.not.stringMatching(/transparent|rgba\(0, 0, 0, 0\)/),
      text: '$',
    }))
  })

  test('updates rendered block math after document changes', async ({ page }) => {
    const { katexTarget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '$$\nx\n$$', katex: true })
      const host = target as HTMLElement & { instance: typeof instance }
      host.instance = instance
    })

    await expect(katexTarget).toContainText('x')
    await page.locator('#editor').evaluate((target) => {
      const host = target as HTMLElement & { instance: { update: (doc: string) => void } }
      host.instance.update('$$\ny\n$$')
    })
    await expect(katexTarget).toContainText('y')
  })

  test('keeps the editor usable for invalid math', async ({ page }) => {
    const { content, katexTarget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '$$\n\\invalid\n$$', katex: true })
    })

    await expect(katexTarget).toBeVisible()
    await content.click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')
    await expect(content).toContainText('updated')
  })
})
