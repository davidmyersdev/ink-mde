import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('Markdown decorations', () => {
  test('decorates inline code and disables spellcheck', async ({ page }) => {
    const { code } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '`code`' })
    })

    await expect(code).toHaveText('code')
    await expect(code).toHaveAttribute('spellcheck', 'false')
    await expect(code).toHaveAttribute('data-grammarly-skip', 'true')
  })

  test('decorates fenced code block open, body, and close lines', async ({ page }) => {
    const { codeBlock, codeBlockClose, codeBlockOpen } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '```\ncode\n```' })
    })

    await expect(codeBlock).toHaveCount(3)
    await expect(codeBlockOpen).toHaveCount(1)
    await expect(codeBlockClose).toHaveCount(1)
  })

  test('decorates HTML and comment blocks as code blocks', async ({ page }) => {
    const { codeBlock } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '<div>HTML</div>\n\n<!-- comment -->' })
    })

    await expect(codeBlock).toHaveCount(2)
  })

  test('decorates blockquote lines', async ({ page }) => {
    const { blockquote } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '> one\n> two' })
    })

    await expect(blockquote).toHaveCount(2)
  })

  test('updates decorations after Markdown changes', async ({ page }) => {
    const { code } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'code' })

      instance.update('`code`')
    })

    await expect(code).toHaveText('code')
  })
})
