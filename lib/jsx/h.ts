export type * from './jsx'

export type H<Tag extends HTagOrComponent = HTag> = Tag extends (() => infer Node extends HNode) ? Node['tag'] : Tag extends HTag ? HTagMap[Tag] : never
export type HProps<_Tag extends HTag = HTag> = Record<string, boolean | number | string>
export type HTag = keyof HTagMap
export type HTagMap = HTMLElementTagNameMap & SVGElementTagNameMap
export type HTagOrComponent = HTag | ((props: HProps) => HNode)

export type HFn = {
  <Tag extends HTag>(tag: Tag): HNode<Tag>,
  <Tag extends HTagOrComponent>(tag: Tag, options: HProps): HNode<Tag>,
  <Tag extends HTag>(tag: Tag, children: HNodeChildren): HNode<Tag>,
  <Tag extends HTag>(tag: Tag, options: HProps, children: HNodeChildren): HNode<Tag>,
}

export type HIfFn = {
  <Tag extends HTag, Condition extends boolean>(condition: Condition, hBuilder: () => HNode<Tag>): Condition extends true ? HNode<Tag> : never,
  <Tag extends HTag, Condition extends boolean>(condition: Condition, hBuilder: () => HNode<Tag>): Condition extends false ? HNode<'span'> : never,
}

export type HNamedFn = {
  <Tag extends HTag>(): HNode<Tag>,
  <Tag extends HTag>(options: HProps): HNode<Tag>,
  <Tag extends HTag>(children: HNodeChildren): HNode<Tag>,
  <Tag extends HTag>(options: HProps, children: HNodeChildren): HNode<Tag>,
}

export type HNode<TagOrComponent extends HTagOrComponent = HTagOrComponent> = TagOrComponent extends (props: any) => any ? HComponentNode<TagOrComponent>
  : TagOrComponent extends HTag ? HElementNode<TagOrComponent>
  : never

export type HComponentNode<Component extends (props: HProps) => HNode> = {
  tag: Component,
  options: Parameters<Component>[0],
  children: HNodeChildren,
  skipNode?: false,
}

export type HElementNode<Tag extends HTag = HTag> = {
  tag: Tag,
  options: HProps<Tag>,
  children: HNodeChildren,
  skipNode?: false,
}

export type HNodeChild<Tag extends HTag = HTag> = HNode<Tag> | HNodeSkip | string
export type HNodeChildren<Tag extends HTag = HTag> = HNodeChild<Tag>[]

export type HNodeSkip = {
  skipNode: true,
}

const isVoidTag = (tag: string): boolean => {
  return voidTags.includes(tag)
}

const voidHtmlTags = Object.freeze([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const voidSvgTags = Object.freeze([
  'path',
])

const voidTags = Object.freeze([
  ...voidHtmlTags,
  ...voidSvgTags,
])

export const createElement = <Tag extends HTagOrComponent>(hNode: HNode<Tag>): H<Tag> => {
  const template = document.createElement('template')

  template.innerHTML = createString(hNode)

  return template.content.cloneNode(true).childNodes[0] as H<Tag>
}

export const createString = <Node extends HNode>(hNode: Node): string => {
  if (typeof hNode !== 'object') {
    return hNode
  }

  const { children = [], options = {}, tag } = hNode

  if (typeof tag === 'function') {
    return createString(tag(options))
  }

  let html = `<${tag}`

  for (const [key, value] of Object.entries(options)) {
    html += ` ${key}="${value}"`
  }

  if (isVoidTag(tag)) {
    html += ' />'

    return html
  }

  html += '>'

  for (const child of children) {
    if (typeof child === 'string') {
      html += child
    } else if (!child.skipNode) {
      html += createString(child)
    }
  }

  html += `</${tag}>`

  return html
}

export const h: HFn = /* @__PURE__ */ (tag, optionsOrChildren?: any, maybeChildren?: any) => {
  const options: HProps = Array.isArray(optionsOrChildren) ? {} : optionsOrChildren
  const children: HNodeChildren = (Array.isArray(optionsOrChildren) ? optionsOrChildren : maybeChildren) ?? []

  return {
    tag,
    options,
    children: isVoidTag(tag) ? [] : children,
  }
}

export const hIf = <Tag extends HTag>(condition: boolean, hBuilder: () => HNode<Tag>): HNode<Tag> | HNodeSkip => {
  if (!condition) {
    return {
      skipNode: true,
    }
  }

  return hBuilder()
}
