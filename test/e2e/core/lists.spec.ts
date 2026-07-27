import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('lists', () => {
  test('does not render list decorations by default', async ({ page }) => {
    const { listBullet, listNumber, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- bullet\n1. number\n- [ ] task' })
    })

    await expect(listBullet).toHaveCount(0)
    await expect(listNumber).toHaveCount(0)
    await expect(listTask).toHaveCount(0)
  })

  test('renders all list decorations when lists is enabled', async ({ page }) => {
    const { listBullet, listNumber, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- bullet\n1. number\n- [ ] task', lists: true })
    })

    await expect(listBullet).toHaveCount(2)
    await expect(listNumber).toHaveCount(1)
    await expect(listTask).toHaveCount(1)
  })

  test('enables list decorations through interface.lists', async ({ page }) => {
    const { listBullet } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- bullet', interface: { lists: true } })
    })

    await expect(listBullet).toHaveCount(1)
  })

  test('enables only bullet list decorations when configured', async ({ page }) => {
    const { listBullet, listNumber, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- bullet\n1. number\n- [ ] task', lists: { bullet: true } })
    })

    await expect(listBullet).toHaveCount(2)
    await expect(listNumber).toHaveCount(0)
    await expect(listTask).toHaveCount(0)
  })

  test('enables only numbered list decorations when configured', async ({ page }) => {
    const { listBullet, listNumber, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- bullet\n1. number\n- [ ] task', lists: { number: true } })
    })

    await expect(listBullet).toHaveCount(0)
    await expect(listNumber).toHaveCount(1)
    await expect(listTask).toHaveCount(0)
  })

  test('enables only task list decorations when configured', async ({ page }) => {
    const { listBullet, listNumber, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- bullet\n1. number\n- [ ] task', lists: { task: true } })
    })

    await expect(listBullet).toHaveCount(0)
    await expect(listNumber).toHaveCount(0)
    await expect(listTask).toHaveCount(1)
  })

  test('renders indentation spacers for nested lists', async ({ page }) => {
    const { listIndent } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '- parent\n  - child', lists: true })
    })

    await expect(listIndent).toHaveCount(1)
  })

  test('checks an unchecked task marker', async ({ page }) => {
    const { host, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '- [ ] task', lists: true })

      Object.assign(target, { __inkMdeInstance: instance })
    })

    await listTask.locator('.ink-mde-task-marker').click()

    await expect.poll(() => host.evaluate((target) => (target as HTMLElement & { __inkMdeInstance: { getDoc: () => string } }).__inkMdeInstance.getDoc())).toBe('- [x] task')
  })

  test('unchecks a checked task marker', async ({ page }) => {
    const { host, listTask } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '- [x] task', lists: true })

      Object.assign(target, { __inkMdeInstance: instance })
    })

    await listTask.locator('.ink-mde-task-marker').click()

    await expect.poll(() => host.evaluate((target) => (target as HTMLElement & { __inkMdeInstance: { getDoc: () => string } }).__inkMdeInstance.getDoc())).toBe('- [ ] task')
  })

  test('updates existing list decorations when reconfigured', async ({ page }) => {
    const counts = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '- bullet' })
      const disabled = target.querySelectorAll('.ink-mde-bullet-list').length

      await instance.reconfigure({ lists: true })
      const enabled = target.querySelectorAll('.ink-mde-bullet-list').length

      await instance.reconfigure({ lists: false })
      const disabledAgain = target.querySelectorAll('.ink-mde-bullet-list').length

      return { disabled, disabledAgain, enabled }
    })

    expect(counts).toEqual({ disabled: 0, disabledAgain: 0, enabled: 1 })
  })
})
