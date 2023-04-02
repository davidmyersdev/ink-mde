// import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { Tag, tags } from '@lezer/highlight'
import { type BlockParser, type DelimiterType, type InlineParser, type NodeSpec } from '@lezer/markdown'

export const buildMarkNode = (markName: string) => {
  return buildTaggedNode(markName, [tags.processingInstruction])
}

export const buildTag = <T extends Tag>(parent?: T) => {
  return Tag.define(parent)
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
export const defineNode = <T extends NodeSpec>(options: T) => options

export const getCharCode = (char: string) => {
  return char.charCodeAt(0)
}
