import { expect, test } from '@playwright/test'
import { getLocators, withInk } from '../helpers/ink'

const firstUrl = 'https://example.test/first.png'
const secondUrl = 'https://example.test/second.png'

test.describe('image preview', () => {
  test('does not render image previews by default', async ({ page }) => {
    const { imagePreview } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, { doc: '![](https://example.test/first.png)' })
    })

    await expect(imagePreview).toHaveCount(0)
  })

  test('renders Markdown image syntax as an image preview when enabled', async ({ page }) => {
    const { imagePreview } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      await mount(target, {
        doc: '![](https://example.test/first.png)',
        interface: { images: true },
      })
    })

    await expect(imagePreview).toHaveAttribute('src', firstUrl)
  })

  test('updates the image preview after editing its URL', async ({ page }) => {
    const { imagePreview } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: '![](https://example.test/first.png)',
        interface: { images: true },
      })

      instance.update('![](https://example.test/second.png)')
    })

    await expect(imagePreview).toHaveAttribute('src', secondUrl)
  })

  test('removes the image preview when image syntax is removed', async ({ page }) => {
    const { imagePreview } = getLocators(page)

    await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, {
        doc: '![](https://example.test/first.png)',
        interface: { images: true },
      })

      instance.update('text')
    })

    await expect(imagePreview).toHaveCount(0)
  })

  test('updates image previews when reconfigured', async ({ page }) => {
    const previews = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: '![](https://example.test/first.png)' })
      const disabled = target.querySelectorAll('.cm-image-img').length

      await instance.reconfigure({ interface: { images: true } })
      const enabled = target.querySelectorAll('.cm-image-img').length

      await instance.reconfigure({ interface: { images: false } })
      const disabledAgain = target.querySelectorAll('.cm-image-img').length

      return { disabled, disabledAgain, enabled }
    })

    expect(previews).toEqual({ disabled: 0, disabledAgain: 0, enabled: 1 })
  })
})
