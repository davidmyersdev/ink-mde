import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('instance API', () => {
  test('getDoc returns the current document after user typing', async ({ page }) => {
    const { host } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target)

      Object.assign(target, { __inkMdeInstance: instance })
      instance.focus()
    })

    await page.keyboard.type('Hello')

    const doc = await host.evaluate((target) => {
      const instance = (target as HTMLElement & { __inkMdeInstance: { getDoc: () => string } }).__inkMdeInstance

      return instance.getDoc()
    })

    expect(doc).toBe('Hello')
  })

  test('update replaces the whole document', async ({ page }) => {
    const { content } = getLocators(page)

    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one' })

      instance.update('two')

      return instance.getDoc()
    })

    await expect(content).toHaveText('two')
    expect(doc).toBe('two')
  })

  test('load rebuilds editor state while retaining configured extensions', async ({ page }) => {
    const { imagePreview } = getLocators(page)

    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: '![first](https://example.test/first.png)',
        interface: { images: true },
      })

      await instance.load('![second](https://example.test/second.png)')

      return instance.getDoc()
    })

    await expect(imagePreview).toHaveAttribute('src', 'https://example.test/second.png')
    expect(doc).toBe('![second](https://example.test/second.png)')
  })

  test('insert adds text at the current selection', async ({ page }) => {
    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one' })

      instance.select({ at: 'end' })
      instance.insert(' two')

      return instance.getDoc()
    })

    expect(doc).toBe('one two')
  })

  test('insert replaces an explicit selection', async ({ page }) => {
    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one two' })

      instance.insert('three', { end: 7, start: 4 })

      return instance.getDoc()
    })

    expect(doc).toBe('one three')
  })

  test('select moves the cursor to the document start', async ({ page }) => {
    const selections = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one' })

      instance.select({ at: 'start' })

      return instance.selections()
    })

    expect(selections).toEqual([{ end: 0, start: 0 }])
  })

  test('select moves the cursor to the document end', async ({ page }) => {
    const selections = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one' })

      instance.select({ at: 'end' })

      return instance.selections()
    })

    expect(selections).toEqual([{ end: 3, start: 3 }])
  })

  test('select applies one explicit selection', async ({ page }) => {
    const selections = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one two' })

      instance.select({ selection: { end: 7, start: 4 } })

      return instance.selections()
    })

    expect(selections).toEqual([{ end: 7, start: 4 }])
  })

  test('selections returns current editor selections', async ({ page }) => {
    const selections = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: 'one',
        selections: [{ end: 3, start: 0 }],
      })

      return instance.selections()
    })

    expect(selections).toEqual([{ end: 3, start: 0 }])
  })

  test('wrap wraps the current selection', async ({ page }) => {
    const result = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'hello' })

      instance.select({ selection: { end: 5, start: 0 } })
      instance.wrap({ after: '**', before: '**' })

      return { doc: instance.getDoc(), selections: instance.selections() }
    })

    expect(result).toEqual({ doc: '**hello**', selections: [{ end: 7, start: 2 }] })
  })

  test('wrap wraps an explicit selection', async ({ page }) => {
    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'hello world' })

      instance.wrap({ after: ']', before: '[', selection: { end: 11, start: 6 } })

      return instance.getDoc()
    })

    expect(doc).toBe('hello [world]')
  })

  test('options returns resolved options', async ({ page }) => {
    const options = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        interface: { readonly: true },
        placeholder: 'Draft',
      })

      const options = instance.options()

      return {
        placeholder: options.placeholder,
        readonly: options.interface.readonly,
      }
    })

    expect(options).toEqual({ placeholder: 'Draft', readonly: true })
  })

  test('reconfigure applies option changes after mount', async ({ page }) => {
    const imagePreviewCounts = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '![image](https://example.test/image.png)' })
      const disabled = target.querySelectorAll('.cm-image-img').length

      await instance.reconfigure({ interface: { images: true } })
      const enabled = target.querySelectorAll('.cm-image-img').length

      await instance.reconfigure({ interface: { images: false } })
      const disabledAgain = target.querySelectorAll('.cm-image-img').length

      return { disabled, disabledAgain, enabled }
    })

    expect(imagePreviewCounts).toEqual({ disabled: 0, disabledAgain: 0, enabled: 1 })
  })
})
