import { expect, test } from '@playwright/test'

const content = (page: import('@playwright/test').Page) => page.locator('.cm-content')
const output = (page: import('@playwright/test').Page, name: string) => page.getByTestId(name)

const mountSvelte = async (page: import('@playwright/test').Page) => {
  await page.goto('http://127.0.0.1:5176/e2e')
  await expect(output(page, 'editor-ready')).toHaveText('true')
}

test.describe('Svelte wrapper', () => {
  test('renders the initial value', async ({ page }) => {
    await mountSvelte(page)

    await expect(content(page)).toHaveText('initial Svelte document')
  })

  test('updates the bound value after editing', async ({ page }) => {
    await mountSvelte(page)

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(output(page, 'value')).toHaveText('initial Svelte document updated')
  })

  test('updates the editor when the parent value changes', async ({ page }) => {
    await mountSvelte(page)

    await page.getByTestId('set-value').click()

    await expect(content(page)).toHaveText('parent update')
  })

  test('reconfigures the editor when reactive options change', async ({ page }) => {
    await mountSvelte(page)

    await page.getByTestId('set-readonly').click()

    await expect(content(page)).toHaveAttribute('aria-readonly', 'true')
  })

  test('binds the editor instance', async ({ page }) => {
    await mountSvelte(page)

    await expect(output(page, 'editor-ready')).toHaveText('true')
  })

  test('dispatches document text through update events', async ({ page }) => {
    await mountSvelte(page)

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(output(page, 'before-update')).toHaveText('initial Svelte document updated')
    await expect(output(page, 'after-update')).toHaveText('initial Svelte document updated')
  })

  test('runs user hooks alongside wrapper events', async ({ page }) => {
    await mountSvelte(page)

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(output(page, 'after-update')).toHaveText('initial Svelte document updated')
    await expect(output(page, 'user-hook-calls')).toHaveText(/[1-9]/)
  })
})
