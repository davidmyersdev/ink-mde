export type H<Tag extends HTag = HTag> = HTagMap[Tag]
export type HProps<_Tag extends HTag = HTag> = Record<string, boolean | number | string>
export type HTag = keyof HTagMap
export type HTagMap = HTMLElementTagNameMap & SVGElementTagNameMap

export type HFn = {
  <Tag extends HTag>(tag: Tag): HNode<Tag>,
  <Tag extends HTag>(tag: Tag, options: HProps): HNode<Tag>,
  <Tag extends HTag>(tag: Tag, children: HNodeChildren): HNode<Tag>,
  <Tag extends HTag>(tag: Tag, options: HProps, children: HNodeChildren): HNode<Tag>,
}

export type HNamedFn = {
  <Tag extends HTag>(): HNode<Tag>,
  <Tag extends HTag>(options: HProps): HNode<Tag>,
  <Tag extends HTag>(children: HNodeChildren): HNode<Tag>,
  <Tag extends HTag>(options: HProps, children: HNodeChildren): HNode<Tag>,
}

export type HNode<Tag extends HTag = HTag> = {
  tag: Tag,
  options: HProps<Tag>,
  children: HNodeChildren,
}

export type HNodeChild<Tag extends HTag = HTag> = HNode<Tag> | string
export type HNodeChildren<Tag extends HTag = HTag> = HNodeChild<Tag>[]

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

export const createElement = <Tag extends HTag>(hNode: HNode<Tag>): H<Tag> => {
  const { children, options, tag } = hNode
  const element = document.createElement(tag) as H<Tag>

  for (const [key, value] of Object.entries(options)) {
    element.setAttribute(key, value?.toString())
  }

  if (!isVoidTag(tag)) {
    for (const child of children) {
      element.append(
        typeof child === 'string' ? document.createTextNode(child) : createElement(child),
      )
    }
  }

  return element
}

export const createString = <Tag extends HTag>(hNode: HNode<Tag>): string => {
  const { tag } = hNode

  const attributes = Object.entries(hNode.options).map(([key, value]) => `${key}="${value}"`).join(' ')

  if (isVoidTag(tag)) {
    return `<${tag} ${attributes} />`
  }

  const children = hNode.children.map((child) => {
    return typeof child === 'string' ? child : createString(child)
  }).join('')

  return `<${tag} ${attributes}>${children}</${tag}>`
}

export const h: HFn = (tag, optionsOrChildren?: any, maybeChildren?: any) => {
  const options: HProps = Array.isArray(optionsOrChildren) ? {} : optionsOrChildren
  const children: HNodeChildren = (Array.isArray(optionsOrChildren) ? optionsOrChildren : maybeChildren) ?? []

  return {
    tag,
    options,
    children: isVoidTag(tag) ? [] : children,
  }
}
