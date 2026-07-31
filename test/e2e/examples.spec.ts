import { expect, test } from '@playwright/test'

const content = (page: import('@playwright/test').Page) => page.locator('.cm-content')

test.describe('examples and demo', () => {
  test('loads the root demo without runtime errors', async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', (error) => errors.push(error))

    await page.goto('/')
    await expect(content(page)).toBeVisible()

    expect(errors).toEqual([])
  })

  test('starts the root demo with the example document', async ({ page }) => {
    await page.goto('/')

    await expect(content(page)).toContainText('# ink-mde')
  })

  test('edits the root demo document', async ({ page }) => {
    await page.goto('/')

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(content(page)).toContainText('updated')
  })

  test('updates the doc query parameter after edits', async ({ page }) => {
    await page.goto('/')

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect.poll(() => new URL(page.url()).searchParams.get('doc')).toContain('updated')
  })

  test('reconfigures appearance through demo theme helpers', async ({ page }) => {
    await page.goto('/')

    const appearance = await page.evaluate(async () => {
      await window.ink

      await window.dark()

      return window.ink.options().interface.appearance
    })

    expect(appearance).toBe('dark')
  })

  test('mounts the web component editor in its shadow root', async ({ page }) => {
    await page.goto('/test/e2e/web-component.html')

    await expect(page.locator('ink-mde').locator('.cm-content')).toContainText('#examples')
  })

  test('edits the web component editor in its shadow root', async ({ page }) => {
    await page.goto('/test/e2e/web-component.html')
    const componentContent = page.locator('ink-mde').locator('.cm-content')

    await componentContent.click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(componentContent).toContainText('updated')
  })
})
