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

  test('updates bracket completion after reconfiguration', async ({ page }) => {
    const { content, host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { interface: { autocomplete: true } })
      Object.assign(target, { instance })
      instance.focus()
    })
    await page.keyboard.type('[')
    await expect(content).toHaveText('[]')
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { interface: { autocomplete: boolean } }) => Promise<void>, update: (doc: string) => void },
    }) => {
      await target.instance.reconfigure({ interface: { autocomplete: false } })
      target.instance.update('')
    })
    await content.click()
    await page.keyboard.type('[')

    await expect(content).toHaveText('[')
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
