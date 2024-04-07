import { expect, test } from '@playwright/test'

test.describe('autocomplete', () => {
  test('auto-closes square brackets', async ({ page }) => {
    await page.goto('/test/e2e/')

    const target = page.locator('#editor')

    await target.evaluate(async (el: HTMLElement) => {
      const { ink } = await import('/src/index')

      const instance = await ink(el, { interface: { autocomplete: true } })

      instance.focus()
    })

    await page.keyboard.type('[')

    await expect(target.locator('.ink-mde-editor-content')).toHaveText('[]')
  })

  test('auto-suggests and accepts relevant text', async ({ page }) => {
    await page.goto('/test/e2e/')

    const target = page.locator('#editor')

    await target.evaluate(async (el: HTMLElement) => {
      const { ink } = await import('/src/index')

      const instance = await ink(el, {
        interface: { autocomplete: true },
        plugins: [
          {
            name: 'test-suggestions',
            addCodeMirrorCompletionSources: () => [
              (context) => {
                const match = context.matchBefore(/\[(?:.(?!\[))*?/)

                if (!match) {
                  return null
                }

                return {
                  from: match.from + 1,
                  options: [
                    {
                      apply: 'http://example.test/hello',
                      label: 'Hello',
                      type: 'text',
                    },
                  ],
                }
              },
            ],
          },
        ],
      })

      instance.focus()
    })

    await page.keyboard.type('[')

    await expect(target.locator('.cm-tooltip-autocomplete')).toBeVisible()
    await expect(target.locator('.cm-tooltip-autocomplete')).toContainText('Hello')

    await page.keyboard.type('H\n', { delay: 100 })

    await expect(target.locator('.ink-mde-editor-content')).toHaveText('[http://example.test/hello]')
  })

  test.describe('when disabled', () => {
    test('does not auto-close square brackets', async ({ page }) => {
      await page.goto('/test/e2e/')

      const target = page.locator('#editor')

      await target.evaluate(async (el: HTMLElement) => {
        const { ink } = await import('/src/index')

        const instance = await ink(el, { interface: { autocomplete: false } })

        instance.focus()
      })

      await page.keyboard.type('[')

      await expect(target.locator('.ink-mde-editor-content')).toHaveText('[')
    })

    test('does not auto-suggest relevant text', async ({ page }) => {
      await page.goto('/test/e2e/')

      const target = page.locator('#editor')

      await target.evaluate(async (el: HTMLElement) => {
        const { ink } = await import('/src/index')

        const instance = await ink(el, {
          interface: { autocomplete: false },
          plugins: [
            {
              name: 'test-suggestions',
              addCodeMirrorCompletionSources: () => [
                (context) => {
                  const match = context.matchBefore(/\[(?:.(?!\[))*?/)

                  if (!match) {
                    return null
                  }

                  return {
                    from: match.from + 1,
                    options: [
                      {
                        apply: 'http://example.test/hello',
                        label: 'Hello',
                        type: 'text',
                      },
                    ],
                  }
                },
              ],
            },
          ],
        })

        instance.focus()
      })

      await page.keyboard.type('[')

      await expect(target.locator('.cm-tooltip-autocomplete')).not.toBeVisible()
    })
  })
})
