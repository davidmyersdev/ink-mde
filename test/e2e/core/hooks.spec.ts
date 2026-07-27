import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('hooks', () => {
  test('beforeUpdate receives the next document before a user edit commits', async ({ page }) => {
    const { host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const calls: string[] = []
      const instance = await mount(target, {
        hooks: {
          beforeUpdate: (doc) => calls.push(doc),
        },
      })

      Object.assign(target, { __hookCalls: calls })
      instance.focus()
    })

    await page.keyboard.type('Hello')

    await expect.poll(() => host.evaluate((target) => (target as HTMLElement & { __hookCalls: string[] }).__hookCalls)).toEqual([
      'H',
      'He',
      'Hel',
      'Hell',
      'Hello',
    ])
  })

  test('afterUpdate receives the committed document after a user edit', async ({ page }) => {
    const { host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const calls: string[] = []
      const instance = await mount(target, {
        hooks: {
          afterUpdate: (doc) => calls.push(doc),
        },
      })

      Object.assign(target, { __hookCalls: calls })
      instance.focus()
    })

    await page.keyboard.type('Hello')

    await expect.poll(() => host.evaluate((target) => (target as HTMLElement & { __hookCalls: string[] }).__hookCalls)).toEqual([
      'H',
      'He',
      'Hel',
      'Hell',
      'Hello',
    ])
  })

  test('hooks fire for instance-driven edits', async ({ page }) => {
    const calls = await withInk(page, async ({ mount, target }) => {
      const calls: string[] = []
      const instance = await mount(target, {
        hooks: {
          afterUpdate: (doc) => calls.push(`after:${doc}`),
          beforeUpdate: (doc) => calls.push(`before:${doc}`),
        },
      })

      instance.insert('one')
      instance.update('two')

      return calls
    })

    expect(calls).toEqual(['before:one', 'after:one', 'before:two', 'after:two'])
  })

  test('hooks do not fire for non-document transactions', async ({ page }) => {
    const calls = await withInk(page, async ({ mount, target }) => {
      const calls: string[] = []
      const instance = await mount(target, {
        doc: 'one',
        hooks: {
          afterUpdate: (doc) => calls.push(`after:${doc}`),
          beforeUpdate: (doc) => calls.push(`before:${doc}`),
        },
      })

      instance.focus()
      instance.select({ at: 'end' })

      return calls
    })

    expect(calls).toEqual([])
  })
})
