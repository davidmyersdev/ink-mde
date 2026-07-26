import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('autocomplete', () => {
  test('auto-closes square brackets', async ({ page }) => {
    const { content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { interface: { autocomplete: true } })

      instance.focus()
    })

    await page.keyboard.type('[')

    await expect(content).toHaveText('[]')
  })

  test('auto-suggests and accepts relevant text', async ({ page }) => {
    const { autocomplete, content } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        interface: { autocomplete: true },
        plugins: [
          {
            type: 'completion',
            value: (context) => {
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
          },
        ],
      })

      instance.focus()
    })

    await page.keyboard.type('[')

    await expect(autocomplete).toBeVisible()
    await expect(autocomplete).toContainText('Hello')

    await page.keyboard.type('H\n', { delay: 200 })

    await expect(content).toHaveText('[http://example.test/hello]')
  })

  test.describe('when disabled', () => {
    test('does not auto-close square brackets', async ({ page }) => {
      const { content } = getLocators(page)

      await withInk(page, async ({ mount, target }) => {
        const instance = await mount(target, { interface: { autocomplete: false } })

        instance.focus()
      })

      await page.keyboard.type('[')

      await expect(content).toHaveText('[')
    })

    test('does not auto-suggest relevant text', async ({ page }) => {
      const { autocomplete } = getLocators(page)

      await withInk(page, async ({ mount, target }) => {
        const instance = await mount(target, {
          interface: { autocomplete: false },
          plugins: [
            {
              type: 'completion',
              value: (context) => {
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
            },
          ],
        })

        instance.focus()
      })

      await page.keyboard.type('[')

      await expect(autocomplete).not.toBeVisible()
    })
  })
})
