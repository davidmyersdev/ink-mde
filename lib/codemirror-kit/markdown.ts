import { type Tag, tags } from '@lezer/highlight'
import { type BlockParser, type DelimiterType, type InlineParser, type MarkdownConfig, type NodeSpec } from '@lezer/markdown'
import { buildTag, getCharCode } from './parsers'

export const buildMarkNode = (markName: string) => {
  return buildTaggedNode(markName, [tags.processingInstruction])
}

export const buildTaggedNode = (nodeName: string, styleTags: Tag[] = []) => {
  const tag = buildTag()
  const node = defineNode({
    name: nodeName,
    style: [tag, ...styleTags],
  })

  return {
    node,
    tag,
  }
}

export const defineBlockParser = <T extends BlockParser>(options: T) => options
export const defineDelimiter = <T extends DelimiterType>(options?: T) => ({ ...options })
export const defineInlineParser = <T extends InlineParser>(options: T) => options
export const defineMarkdown = <T extends MarkdownConfig>(options: T) => options
export const defineNode = <T extends NodeSpec>(options: T) => options

/**
 * Build an inline Markdown parser that matches a custom expression. E.g. `[[hello]]` for wikilinks.
 *
 * @param options
 * @param options.name The name of the new node type. E.g. `WikiLink` for wikilinks.
 * @param options.prefix The tokens that indicate the start of the custom expression. E.g. `[[` for wikilinks.
 * @param options.suffix The tokens that indicate the end of the custom expression. E.g. `]]` for wikilinks.
 * @param options.matcher The regex that matches the custom expression. E.g. `/(?<prefix>\[\[)(?<content>.*?)(?<suffix>\]\])/` for wikilinks.
 */
export const buildInlineParser = (options: { name: string, prefix: string, matcher?: RegExp, suffix?: string }) => {
  const { name, prefix, suffix } = options
  const matcher = options.matcher || new RegExp(`(?<prefix>${prefix})(?<content>.*?)(?<suffix>${suffix})`)
  const [firstCharCode, ...prefixCharCodes] = prefix.split('').map(getCharCode)

  const taggedNode = buildTaggedNode(name)
  const taggedNodeMark = buildMarkNode(`${name}Mark`)
  const taggedNodeMarkStart = buildMarkNode(`${name}MarkStart`)
  const taggedNodeMarkEnd = buildMarkNode(`${name}MarkEnd`)

  return defineInlineParser({
    name: taggedNode.node.name,
    parse: (inlineContext, nextCharCode, position) => {
      // Match the first char code as efficiently as possible.
      if (nextCharCode !== firstCharCode) return -1

      // Check the remaining char codes.
      for (let i = 0; i < prefixCharCodes.length; i++) {
        const prefixCharCode = prefixCharCodes[i]
        const nextCharPosition = position + i + 1

        if (inlineContext.text.charCodeAt(nextCharPosition) !== prefixCharCode) return -1
      }

      // Get all the line text left after the current position.
      const remainingLineText = inlineContext.slice(position, inlineContext.end)

      if (!matcher.test(remainingLineText)) return -1

      const match = remainingLineText.match(matcher)

      // Todo: Add config to allow empty?
      if (!match?.groups?.content) return -1

      const prefixLength = prefix.length
      const contentLength = match.groups.content.length
      const suffixLength = suffix?.length || 0

      return inlineContext.addElement(
        inlineContext.elt(
          taggedNode.node.name,
          position,
          position + prefixLength + contentLength + suffixLength,
          [
            inlineContext.elt(
              taggedNodeMark.node.name,
              position,
              position + prefixLength,
              [
                inlineContext.elt(
                  taggedNodeMarkStart.node.name,
                  position,
                  position + prefixLength,
                ),
              ],
            ),
            inlineContext.elt(
              taggedNodeMark.node.name,
              position + prefixLength + contentLength,
              position + prefixLength + contentLength + suffixLength,
              [
                inlineContext.elt(
                  taggedNodeMarkEnd.node.name,
                  position + prefixLength + contentLength,
                  position + prefixLength + contentLength + suffixLength,
                ),
              ],
            ),
          ],
        ),
      )
    },
  })
}
