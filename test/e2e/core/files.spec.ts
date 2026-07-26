import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

test.describe('file handling', () => {
  test('does not handle pasted files when clipboard handling is disabled', async ({ page }) => {
    const result = await withInk(page, async ({ mount, target }) => {
      let calls = 0
      const instance = await mount(target, {
        files: {
          handler: () => {
            calls += 1
            return 'https://example.test/image.png'
          },
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'image.png', { type: 'image/png' }))
      const event = new Event('paste', { bubbles: true })
      Object.defineProperty(event, 'clipboardData', { value: transfer })
      target.querySelector<HTMLElement>('.ink-mde')?.dispatchEvent(
        event,
      )

      return { calls, doc: instance.getDoc() }
    })

    expect(result).toEqual({ calls: 0, doc: '' })
  })

  test('sends pasted files to the configured handler', async ({ page }) => {
    const result = await withInk(page, async ({ mount, target }) => {
      let files: string[] = []
      const instance = await mount(target, {
        files: {
          clipboard: true,
          handler: (uploaded) => {
            files = Array.from(uploaded, file => file.name)
          },
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'clipboard.png', { type: 'image/png' }))
      const event = new Event('paste', { bubbles: true })
      Object.defineProperty(event, 'clipboardData', { value: transfer })
      target.querySelector<HTMLElement>('.ink-mde')?.dispatchEvent(
        event,
      )
      await Promise.resolve()

      return { doc: instance.getDoc(), files }
    })

    expect(result).toEqual({ doc: '', files: ['clipboard.png'] })
  })

  test('inserts image markup for pasted files when the handler returns a URL', async ({ page }) => {
    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        files: {
          clipboard: true,
          handler: () => 'https://example.test/clipboard.png',
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'clipboard.png', { type: 'image/png' }))
      const event = new Event('paste', { bubbles: true })
      Object.defineProperty(event, 'clipboardData', { value: transfer })
      target.querySelector<HTMLElement>('.ink-mde')?.dispatchEvent(
        event,
      )
      await Promise.resolve()

      return instance.getDoc()
    })

    expect(doc).toBe('![](https://example.test/clipboard.png)')
  })

  test('does not insert markup when a pasted-file handler returns nothing', async ({ page }) => {
    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        files: {
          clipboard: true,
          handler: () => {},
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'clipboard.png', { type: 'image/png' }))
      const event = new Event('paste', { bubbles: true })
      Object.defineProperty(event, 'clipboardData', { value: transfer })
      target.querySelector<HTMLElement>('.ink-mde')?.dispatchEvent(
        event,
      )
      await Promise.resolve()

      return instance.getDoc()
    })

    expect(doc).toBe('')
  })

  test('does not insert markup when injectMarkup is disabled', async ({ page }) => {
    const doc = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        files: {
          clipboard: true,
          handler: () => 'https://example.test/clipboard.png',
          injectMarkup: false,
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'clipboard.png', { type: 'image/png' }))
      const event = new Event('paste', { bubbles: true })
      Object.defineProperty(event, 'clipboardData', { value: transfer })
      target.querySelector<HTMLElement>('.ink-mde')?.dispatchEvent(
        event,
      )
      await Promise.resolve()

      return instance.getDoc()
    })

    expect(doc).toBe('')
  })

  test('does not handle dropped files when drag and drop handling is disabled', async ({ page }) => {
    const result = await withInk(page, async ({ mount, target }) => {
      let calls = 0
      const instance = await mount(target, {
        files: {
          handler: () => {
            calls += 1
            return 'https://example.test/drop.png'
          },
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'drop.png', { type: 'image/png' }))
      document.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }))

      return { calls, doc: instance.getDoc() }
    })

    expect(result).toEqual({ calls: 0, doc: '' })
  })

  test('shows the drop zone while dragging files when enabled', async ({ page }) => {
    const { dropZone } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { files: { dragAndDrop: true } })
      document.dispatchEvent(new DragEvent('dragenter', { bubbles: true }))
    })

    await expect(dropZone).toBeVisible()
  })

  test('sends dropped files to the handler and inserts returned markup', async ({ page }) => {
    const result = await withInk(page, async ({ mount, target }) => {
      let files: string[] = []
      const instance = await mount(target, {
        files: {
          dragAndDrop: true,
          handler: (uploaded) => {
            files = Array.from(uploaded, file => file.name)
            return 'https://example.test/drop.png'
          },
        },
      })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'drop.png', { type: 'image/png' }))
      document.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer }))
      target.querySelector<HTMLElement>('.ink-drop-zone-droppable-area')?.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer: transfer }),
      )
      await Promise.resolve()

      return { doc: instance.getDoc(), files }
    })

    expect(result).toEqual({ doc: '![](https://example.test/drop.png)', files: ['drop.png'] })
  })

  test('shows upload loading state and hides the drop zone after an async handler completes', async ({ page }) => {
    const { dropZone } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      let complete: (() => void) | undefined
      await mount(target, {
        files: {
          dragAndDrop: true,
          handler: () => new Promise<void>((resolve) => {
            complete = resolve
          }),
        },
      })
      Object.assign(target, { completeUpload: () => complete?.() })
      const transfer = new DataTransfer()
      transfer.items.add(new File(['image'], 'drop.png', { type: 'image/png' }))
      document.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer }))
      target.querySelector<HTMLElement>('.ink-drop-zone-droppable-area')?.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer: transfer }),
      )
    })

    await expect(dropZone).toContainText('uploading files...')
    await page.locator('#editor').evaluate((target: HTMLElement & { completeUpload: () => void }) => target.completeUpload())
    await expect(dropZone).not.toBeVisible()
  })

  test('previews up to eight dropped files', async ({ page }) => {
    const { dropZonePreview } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, {
        files: {
          dragAndDrop: true,
          handler: () => new Promise<void>(() => {}),
        },
      })
      const transfer = new DataTransfer()

      for (let index = 0; index < 9; index += 1) {
        transfer.items.add(new File(['image'], `drop-${index}.png`, { type: 'image/png' }))
      }

      document.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer }))
      target.querySelector<HTMLElement>('.ink-drop-zone-droppable-area')?.dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer: transfer }),
      )
    })

    await expect(dropZonePreview).toHaveCount(8)
  })

  test('hides the drop zone after drag leave and drop', async ({ page }) => {
    const { dropZone } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { files: { dragAndDrop: true } })
      document.dispatchEvent(new DragEvent('dragenter', { bubbles: true }))
    })
    await expect(dropZone).toBeVisible()
    await page.evaluate(() => document.dispatchEvent(new DragEvent('dragleave', { bubbles: true })))
    await expect(dropZone).not.toBeVisible()
    await page.evaluate(() => document.dispatchEvent(new DragEvent('dragenter', { bubbles: true })))
    await expect(dropZone).toBeVisible()
    await page.evaluate(() => document.dispatchEvent(new DragEvent('drop', { bubbles: true })))
    await expect(dropZone).not.toBeVisible()
  })
})
