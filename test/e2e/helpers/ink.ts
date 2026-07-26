import { type Page } from '@playwright/test'
import { type ink, type wrap } from '/src/index'

export const getLocators = (page: Page) => {
  const autocomplete = page.locator('.cm-tooltip-autocomplete')
  const content = page.locator('#editor .ink-mde-editor-content')
  const host = page.locator('#editor')
  const root = host.locator('.ink-mde')

  return {
    autocomplete,
    content,
    host,
    root,
  }
}

export const withInk = async <Result, Arg>(
  page: Page,
  callback: (
    helpers: {
      mount: typeof ink,
      target: HTMLElement,
      wrap: typeof wrap,
    },
  ) => Result | Promise<Result>,
  arg?: Arg,
): Promise<Result> => {
  await page.goto('/test/e2e/')

  const helpers = await page.evaluateHandle(async (arg) => {
    const target = document.querySelector<HTMLElement>('#editor')

    if (!target) {
      throw new Error('Missing #editor test target')
    }

    target.replaceChildren()

    const { ink: mount, wrap } = await import('/src/index')

    return { arg, mount, target, wrap }
  }, arg)

  try {
    return await page.evaluate(callback, helpers)
  } finally {
    await helpers.dispose()
  }
}
