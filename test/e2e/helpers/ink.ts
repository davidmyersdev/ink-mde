import { type Page } from '@playwright/test'
import { type ink, type wrap } from '/src/index'

export const getLocators = (page: Page) => {
  const autocomplete = page.locator('.cm-tooltip-autocomplete')
  const blockquote = page.locator('.cm-blockquote')
  const code = page.locator('.cm-code:not(.cm-code-open):not(.cm-code-close)')
  const codeBlock = page.locator('.cm-codeblock')
  const codeBlockClose = page.locator('.cm-codeblock-close')
  const codeBlockOpen = page.locator('.cm-codeblock-open')
  const defaultPluginWidget = page.locator('.e2e-default-plugin-widget')
  const host = page.locator('#editor')
  const content = page.locator('#editor .ink-mde-editor-content')
  const details = host.locator('.ink-mde-details')
  const readability = details.locator('.ink-mde-readability')
  const attribution = details.locator('.ink-mde-attribution')
  const dropZone = page.locator('#editor .ink-drop-zone')
  const dropZonePreview = dropZone.locator('.ink-drop-zone-file-preview-image')
  const imagePreview = host.locator('.cm-image-img')
  const listBullet = host.locator('.ink-mde-bullet-list')
  const listIndent = host.locator('.ink-mde-indent')
  const listNumber = host.locator('.ink-mde-number-list')
  const listTask = host.locator('.ink-mde-task-list')
  const katexTarget = host.locator('.ink-mde-katex-target')
  const placeholder = host.locator('.cm-placeholder')
  const root = host.locator('.ink-mde')
  const searchInput = host.locator('.ink-mde-search-input')
  const searchMatch = host.locator('.cm-searchMatch')
  const searchMatchSelected = host.locator('.cm-searchMatch-selected')
  const searchPanel = host.locator('.ink-mde-search-panel')
  const syntaxObserver = host.locator('.cm-editor[data-e2e-syntax]')
  const textarea = host.locator('textarea')
  const toolbar = host.locator('.ink-mde-toolbar')
  const toolbarBold = toolbar.getByRole('button', { name: 'Bold' })
  const toolbarHeading = toolbar.getByRole('button', { name: 'Heading' })
  const toolbarItalic = toolbar.getByRole('button', { name: 'Italic' })
  const toolbarQuote = toolbar.getByRole('button', { name: 'Quote' })
  const toolbarCodeBlock = toolbar.getByRole('button', { name: 'Code block' })
  const toolbarCode = toolbar.getByRole('button', { name: 'Inline code' })
  const toolbarList = toolbar.getByRole('button', { name: 'Bullet list' })
  const toolbarOrderedList = toolbar.getByRole('button', { name: 'Ordered list' })
  const toolbarTaskList = toolbar.getByRole('button', { name: 'Task list' })
  const toolbarLink = toolbar.getByRole('button', { name: 'Link' })
  const toolbarImage = toolbar.getByRole('button', { name: 'Image' })
  const toolbarUpload = toolbar.getByRole('button', { name: 'Upload' })

  return {
    autocomplete,
    blockquote,
    code,
    codeBlock,
    codeBlockClose,
    codeBlockOpen,
    defaultPluginWidget,
    content,
    details,
    readability,
    attribution,
    dropZone,
    dropZonePreview,
    host,
    imagePreview,
    katexTarget,
    listBullet,
    listIndent,
    listNumber,
    listTask,
    placeholder,
    root,
    searchInput,
    searchMatch,
    searchMatchSelected,
    searchPanel,
    syntaxObserver,
    textarea,
    toolbar,
    toolbarBold,
    toolbarHeading,
    toolbarItalic,
    toolbarQuote,
    toolbarCodeBlock,
    toolbarCode,
    toolbarList,
    toolbarOrderedList,
    toolbarTaskList,
    toolbarLink,
    toolbarImage,
    toolbarUpload,
  }
}

export const withInk = async <Result, Arg>(
  page: Page,
  callback: (
    helpers: {
      arg?: Arg,
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
    return await page.evaluate(callback as never, helpers)
  } finally {
    await helpers.dispose()
  }
}
