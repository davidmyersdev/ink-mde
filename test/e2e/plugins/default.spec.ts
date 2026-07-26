import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('default extension plugins', () => {
  test('renders a browser-visible CodeMirror extension', async ({ page }) => {
    const { defaultPluginWidget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { defaultPlugin } = await import('/test/e2e/fixtures/default-plugin')

      await mount(target, { plugins: [{ type: 'default', value: defaultPlugin() }] })
    })

    await expect(defaultPluginWidget).toHaveText('default plugin')
  })

  test('awaits async default plugins before the instance is ready', async ({ page }) => {
    const { defaultPluginWidget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { defaultPlugin } = await import('/test/e2e/fixtures/default-plugin')

      await mount(target, { plugins: [{ type: 'default', value: Promise.resolve(defaultPlugin()) }] })
    })

    await expect(defaultPluginWidget).toHaveCount(1)
  })

  test('flattens recursive default-plugin arrays', async ({ page }) => {
    const { defaultPluginWidget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { defaultPlugin } = await import('/test/e2e/fixtures/default-plugin')

      await mount(target, {
        plugins: [[{ type: 'default', value: defaultPlugin() }], [{ type: 'default', value: defaultPlugin() }]],
      })
    })

    await expect(defaultPluginWidget).toHaveCount(2)
  })

  test('does not activate keyed default plugins when their option is false', async ({ page }) => {
    const { defaultPluginWidget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { defaultPlugin } = await import('/test/e2e/fixtures/default-plugin')

      await mount(target, { plugins: [{ key: 'vim', type: 'default', value: defaultPlugin() }], vim: false })
    })

    await expect(defaultPluginWidget).toHaveCount(0)
  })

  test('activates keyed default plugins when their option is true', async ({ page }) => {
    const { defaultPluginWidget } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { defaultPlugin } = await import('/test/e2e/fixtures/default-plugin')

      await mount(target, { plugins: [{ key: 'vim', type: 'default', value: defaultPlugin() }], vim: true })
    })

    await expect(defaultPluginWidget).toHaveCount(1)
  })

  test('updates keyed default plugins after reconfiguration', async ({ page }) => {
    const { defaultPluginWidget, host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const { defaultPlugin } = await import('/test/e2e/fixtures/default-plugin')
      const instance = await mount(target, {
        plugins: [{ key: 'vim', type: 'default', value: defaultPlugin() }],
        vim: false,
      })
      Object.assign(target, { instance })
    })
    await expect(defaultPluginWidget).toHaveCount(0)
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { vim: boolean }) => Promise<void> },
    }) => {
      await target.instance.reconfigure({ vim: true })
    })
    await expect(defaultPluginWidget).toHaveCount(1)
    await host.evaluate(async (target: HTMLElement & {
      instance: { reconfigure: (options: { vim: boolean }) => Promise<void> },
    }) => {
      await target.instance.reconfigure({ vim: false })
    })
    await expect(defaultPluginWidget).toHaveCount(0)
  })
})
