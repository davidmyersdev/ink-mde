import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'

const execFile = promisify(execFileCallback)

type VueE2E = {
  setModelValue: (value: string) => Promise<void>,
  setOptions: (options: Record<string, unknown>) => Promise<void>,
}

const mountVue = async (page: import('@playwright/test').Page, modelValue = 'initial document', options: Record<string, unknown> = {}) => {
  await page.goto('/test/e2e/vue.html')
  await page.evaluate(async ({ modelValue, options }) => {
    const { mountVue } = await import('/test/e2e/fixtures/vue')
    await mountVue({ modelValue, options })
  }, { modelValue, options })
}

const content = (page: import('@playwright/test').Page) => page.locator('.cm-content')

const renderVueToString = async (modelValue: string) => {
  const { stdout } = await execFile(process.execPath, ['test/e2e/helpers/vue-ssr.cjs', modelValue])
  return stdout
}

test.describe('Vue wrapper', () => {
  test('renders the initial model value', async ({ page }) => {
    await mountVue(page, 'initial Vue document')

    await expect(content(page)).toHaveText('initial Vue document')
  })

  test('emits model updates after editing', async ({ page }) => {
    await mountVue(page, 'initial')

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(page.locator('#editor')).toHaveAttribute('data-model-value', 'initial updated')
  })

  test('updates the editor when the parent model value changes', async ({ page }) => {
    await mountVue(page)

    await page.evaluate(async () => {
      await (window as typeof window & { vueE2E: VueE2E }).vueE2E.setModelValue('parent update')
    })

    await expect(content(page)).toHaveText('parent update')
  })

  test('reconfigures the editor when reactive options change', async ({ page }) => {
    await mountVue(page)

    await page.evaluate(async () => {
      await (window as typeof window & { vueE2E: VueE2E }).vueE2E.setOptions({ interface: { readonly: true } })
    })

    await expect(content(page)).toHaveAttribute('aria-readonly', 'true')
  })

  test('runs user hooks alongside model update handling', async ({ page }) => {
    await page.goto('/test/e2e/vue.html')
    await page.evaluate(async () => {
      const { mountVueWithUserHook } = await import('/test/e2e/fixtures/vue')
      await mountVueWithUserHook()
    })

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(page.locator('#editor')).toHaveAttribute('data-model-value', 'initial updated')
    await expect(page.locator('#editor')).toHaveAttribute('data-user-hook-calls', /[1-9]/)
  })

  test('stops editor input events from bubbling to the parent', async ({ page }) => {
    await mountVue(page)
    await page.locator('#editor').evaluate((target) => {
      target.addEventListener('input', () => {
        target.dataset.inputEvents = String(Number(target.dataset.inputEvents ?? 0) + 1)
      })
    })

    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')

    await expect(page.locator('#editor')).not.toHaveAttribute('data-input-events')
  })

  test('renders editor HTML during SSR', async () => {
    const markup = await renderVueToString('server document')

    expect(markup).toContain('data-ink-mde-ssr-hydration-marker')
    expect(markup).toContain('class="ink ink-mde')
  })

  test('hydrates one working editor', async ({ page }) => {
    const markup = await renderVueToString('server document')
    await page.goto('/test/e2e/vue.html')
    await page.locator('#editor').evaluate((target, html) => {
      target.innerHTML = html
    }, markup)
    const before = await page.locator('#editor .ink-mde').count()

    await page.evaluate(async () => {
      const { hydrateVue } = await import('/test/e2e/fixtures/vue')
      await hydrateVue({ modelValue: 'server document', options: {} })
    })

    await expect(page.locator('#editor .ink-mde')).toHaveCount(before)
    await content(page).click()
    await page.keyboard.press('End')
    await page.keyboard.type(' updated')
    await expect(content(page)).toHaveText('server document updated')
  })
})
