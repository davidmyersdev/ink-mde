import { type MarkdownConfig } from '@lezer/markdown'

export const defineMarkdown = <T extends MarkdownConfig>(options: T) => options
