import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('grammar plugins', () => {
  test('adds Markdown syntax recognized by the editor', async ({ page }) => {
    const { syntaxObserver } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { grammar } = await import('/plugins/katex/grammar')
      const { syntaxObserver } = await import('/test/e2e/fixtures/syntax-observer')

      await mount(target, {
        doc: '$$\nx\n$$',
        plugins: [
          { type: 'grammar', value: grammar },
          { type: 'default', value: syntaxObserver(doc => doc.indexOf('x')) },
        ],
      })
    })

    await expect(syntaxObserver).toHaveAttribute('data-e2e-syntax', 'MathBlock')
  })

  test('applies async grammar plugins after mount', async ({ page }) => {
    const { syntaxObserver } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { grammar } = await import('/plugins/katex/grammar')
      const { syntaxObserver } = await import('/test/e2e/fixtures/syntax-observer')

      await mount(target, {
        doc: '$$\nx\n$$',
        plugins: [
          { type: 'grammar', value: Promise.resolve(grammar) },
          { type: 'default', value: syntaxObserver(doc => doc.indexOf('x')) },
        ],
      })
    })

    await expect(syntaxObserver).toHaveAttribute('data-e2e-syntax', 'MathBlock')
  })

  test('updates parsing after grammar plugin reconfiguration', async ({ page }) => {
    const syntax = await withInk(page, async ({ mount, target }) => {
      const { grammar } = await import('/plugins/katex/grammar')
      const { syntaxObserver } = await import('/test/e2e/fixtures/syntax-observer')
      const observer = syntaxObserver(doc => doc.indexOf('x'))
      const instance = await mount(target, {
        doc: '$$\nx\n$$',
        plugins: [{ type: 'default', value: observer }],
      })
      const before = target.querySelector<HTMLElement>('.cm-editor')?.dataset.e2eSyntax
      await instance.reconfigure({
        plugins: [
          { type: 'grammar', value: grammar },
          { type: 'default', value: observer },
        ],
      })
      const after = target.querySelector<HTMLElement>('.cm-editor')?.dataset.e2eSyntax

      return { after, before }
    })

    expect(syntax).toEqual({ after: 'MathBlock', before: 'Paragraph' })
  })
})
