import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('spellcheck', () => {
  test('enables spellcheck on editor content by default', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target)
    })

    await expect(content).toHaveAttribute('spellcheck', 'true')
  })

  test('sets editor content spellcheck to false when disabled', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { interface: { spellcheck: false } })
    })

    await expect(content).toHaveAttribute('spellcheck', 'false')
  })

  test('disables spellcheck and Grammarly for inline code and code blocks', async ({ page }) => {
    const { code, codeBlock } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '`inline`\n\n```\nblock\n```' })
    })

    await expect(code).toHaveAttribute('spellcheck', 'false')
    await expect(code).toHaveAttribute('data-grammarly-skip', 'true')
    expect(await codeBlock.evaluateAll(blocks => blocks.every(block => {
      return block.getAttribute('spellcheck') === 'false'
        && block.getAttribute('data-grammarly-skip') === 'true'
    }))).toBe(true)
  })

  test('updates editor content spellcheck after reconfiguration', async ({ page }) => {
    const { content, host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)
      Object.assign(target, { instance })
    })
    await expect(content).toHaveAttribute('spellcheck', 'true')
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { interface: { spellcheck: boolean } }) => Promise<void> },
    }) => {
      await target.instance.reconfigure({ interface: { spellcheck: false } })
    })
    await expect(content).toHaveAttribute('spellcheck', 'false')
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { interface: { spellcheck: boolean } }) => Promise<void> },
    }) => {
      await target.instance.reconfigure({ interface: { spellcheck: true } })
    })
    await expect(content).toHaveAttribute('spellcheck', 'true')
  })
})
