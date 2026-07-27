import { expect, test } from '@playwright/test'
import { withInk } from '../helpers/ink'

const formatAndUnformat = async (page: Parameters<typeof withInk>[0], type: 'bold' | 'italic' | 'code' | 'link' | 'image' | 'code_block' | 'quote' | 'list' | 'ordered_list' | 'task_list', doc = 'word') => {
  return withInk(page, async ({ arg, mount, target }) => {
    const { doc, type } = arg!
    const instance = await mount(target, { doc })

    instance.format(type, { selection: { end: doc.length, start: 0 } })
    const formatted = instance.getDoc()

    instance.format(type, {})

    return { formatted, unformatted: instance.getDoc() }
  }, { doc, type })
}

test.describe('formatting API', () => {
  test('formats and unformats bold text', async ({ page }) => {
    await expect(formatAndUnformat(page, 'bold')).resolves.toEqual({ formatted: '**word**', unformatted: 'word' })
  })

  test('formats and unformats italic text', async ({ page }) => {
    await expect(formatAndUnformat(page, 'italic')).resolves.toEqual({ formatted: '*word*', unformatted: 'word' })
  })

  test('formats and unformats inline code', async ({ page }) => {
    await expect(formatAndUnformat(page, 'code')).resolves.toEqual({ formatted: '`word`', unformatted: 'word' })
  })

  test('formats and unformats links', async ({ page }) => {
    await expect(formatAndUnformat(page, 'link')).resolves.toEqual({ formatted: '[](word)', unformatted: 'word' })
  })

  test('formats and unformats images', async ({ page }) => {
    await expect(formatAndUnformat(page, 'image')).resolves.toEqual({ formatted: '![](word)', unformatted: 'word' })
  })

  test('formats and unformats fenced code blocks', async ({ page }) => {
    await expect(formatAndUnformat(page, 'code_block')).resolves.toEqual({ formatted: '```\nword\n```', unformatted: 'word' })
  })

  test('cycles headings through the supported prefix states', async ({ page }) => {
    const docs = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'word' })
      const docs: string[] = []

      for (let index = 0; index < 7; index++) {
        instance.format('heading', { selection: { end: instance.getDoc().length, start: 0 } })
        docs.push(instance.getDoc())
      }

      return docs
    })

    expect(docs).toEqual(['# word', '## word', '### word', '#### word', '##### word', '###### word', 'word'])
  })

  test('formats and unformats blockquotes', async ({ page }) => {
    await expect(formatAndUnformat(page, 'quote')).resolves.toEqual({ formatted: '> word', unformatted: 'word' })
  })

  test('formats and unformats bullet lists', async ({ page }) => {
    await expect(formatAndUnformat(page, 'list')).resolves.toEqual({ formatted: '- word', unformatted: 'word' })
  })

  test('formats and unformats ordered lists', async ({ page }) => {
    await expect(formatAndUnformat(page, 'ordered_list')).resolves.toEqual({ formatted: '1. word', unformatted: 'word' })
  })

  test('formats and unformats task lists', async ({ page }) => {
    await expect(formatAndUnformat(page, 'task_list')).resolves.toEqual({ formatted: '- [ ] word', unformatted: 'word' })
  })

  test('formats multiline selections for line-oriented markup', async ({ page }) => {
    const result = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'one\ntwo' })

      instance.format('quote', { selection: { end: 7, start: 0 } })
      const formatted = instance.getDoc()

      instance.format('quote', { selection: { end: formatted.length, start: 0 } })

      return { formatted, unformatted: instance.getDoc() }
    })

    expect(result).toEqual({ formatted: '> one\n> two', unformatted: 'one\ntwo' })
  })

  test('leaves the selection around formatted text', async ({ page }) => {
    const selections = await withInk(page, async ({ mount, target }) => {
      const instance = await mount(target, { doc: 'word' })

      instance.format('bold', { selection: { end: 4, start: 0 } })

      return instance.selections()
    })

    expect(selections).toEqual([{ end: 8, start: 0 }])
  })
})
