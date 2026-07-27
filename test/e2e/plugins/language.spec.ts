import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('language plugins', () => {
  test('adds code-language support', async ({ page }) => {
    const { syntaxObserver } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { languagePlugin } = await import('/test/e2e/fixtures/language-plugin')
      const { syntaxObserver } = await import('/test/e2e/fixtures/syntax-observer')

      await mount(target, {
        doc: '```e2e\ntext\n```',
        plugins: [
          { type: 'language', value: languagePlugin() },
          { type: 'default', value: syntaxObserver(doc => doc.indexOf('text')) },
        ],
      })
    })

    await expect(syntaxObserver).toHaveAttribute('data-e2e-syntax', 'Paragraph')
  })

  test('applies async language plugins after mount', async ({ page }) => {
    const { syntaxObserver } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { languagePlugin } = await import('/test/e2e/fixtures/language-plugin')
      const { syntaxObserver } = await import('/test/e2e/fixtures/syntax-observer')

      await mount(target, {
        doc: '```e2e\ntext\n```',
        plugins: [
          { type: 'language', value: Promise.resolve(languagePlugin()) },
          { type: 'default', value: syntaxObserver(doc => doc.indexOf('text')) },
        ],
      })
    })

    await expect(syntaxObserver).toHaveAttribute('data-e2e-syntax', 'Paragraph')
  })

  test('updates parsing after language plugin reconfiguration', async ({ page }) => {
    const syntax = await withInk(page, async ({ mount, target }) => {
      const { languagePlugin } = await import('/test/e2e/fixtures/language-plugin')
      const { syntaxObserver } = await import('/test/e2e/fixtures/syntax-observer')
      const observer = syntaxObserver(doc => doc.indexOf('text'))
      const instance = await mount(target, {
        doc: '```e2e\ntext\n```',
        plugins: [{ type: 'default', value: observer }],
      })
      const before = target.querySelector<HTMLElement>('.cm-editor')?.dataset.e2eSyntax
      await instance.reconfigure({
        plugins: [
          { type: 'language', value: languagePlugin() },
          { type: 'default', value: observer },
        ],
      })
      await new Promise(resolve => setTimeout(resolve, 100))
      const after = target.querySelector<HTMLElement>('.cm-editor')?.dataset.e2eSyntax

      return { after, before }
    })

    expect(syntax.before).toBe('CodeText')
    expect(syntax.after).not.toBe(syntax.before)
  })
})
