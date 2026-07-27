import { createRequire } from 'node:module'
import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const { renderToString } = require('../../../dist/index.cjs') as {
  renderToString: (options: { doc?: string }) => string,
}

const installServerMarkup = async (page: import('@playwright/test').Page, doc: string) => {
  await page.goto('/test/e2e/')
  const markup = renderToString({ doc })

  await page.locator('#editor').evaluate((target, html) => {
    target.innerHTML = html
  }, markup)
}

test.describe('SSR and hydration', () => {
  test('renders server editor markup with hydration markers', async () => {
    const markup = renderToString({})

    expect(markup).toContain('data-ink-mde-ssr-hydration-marker')
    expect(markup).toContain('class=\"ink ink-mde')
  })

  test('hydrates server markup without duplicating editor DOM', async ({ page }) => {
    await installServerMarkup(page, 'server document')
    const before = await page.locator('#editor .ink-mde').count()
    await page.evaluate(async () => {
      const { hydrate } = await import('/src/index')
      const target = document.querySelector<HTMLElement>('#editor')

      if (!target) throw new Error('Missing editor target')

      await hydrate(target, { doc: 'server document' })
    })

    await expect(page.locator('#editor .ink-mde')).toHaveCount(before)
  })

  test('ink detects server markup and hydrates an editable editor', async ({ page }) => {
    await installServerMarkup(page, 'server document')
    await page.evaluate(async () => {
      const { ink } = await import('/src/index')
      const target = document.querySelector<HTMLElement>('#editor')

      if (!target) throw new Error('Missing editor target')

      await ink(target, { doc: 'server document' })
    })
    const content = page.locator('#editor .ink-mde-editor-content')
    await content.click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(content).toContainText('server document updated')
  })
})
