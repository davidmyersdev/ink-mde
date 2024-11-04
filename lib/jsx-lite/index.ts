import * as van from '/lib/vanjs'

export * from './types'

const adaptProps = (rawProps: Record<string, any>): Record<string, any> => {
  const adapted: Record<string, any> = {}

  for (const key in rawProps) {
    adapted[key.toLowerCase()] = rawProps[key]
  }

  return adapted
}

export const Fragment = ({ children }: { children?: Element[] | undefined }) => {
  return children || []
}

const getAllAttributes = (el: Element) => {
  return el.getAttributeNames().reduce((obj, name) => ({
    ...obj,
    [name]: el.getAttribute(name),
  }), {})
}

const handleSvg = (tag: string, { children, ...rawProps }: {
  children?: Element | Element[] | undefined,
}): Element => {
  if (children) {
    const childArray = [children].flat(10)

    const newChildren = childArray.map((child) => {
      const childTag = child.tagName.toLowerCase()
      const childProps = getAllAttributes(child)
      const childChildren = Array.from(child.children)

      return handleSvg(childTag, { children: childChildren, ...childProps })
    })

    return van.tags('http://www.w3.org/2000/svg')[tag](rawProps, ...newChildren)
  }

  return van.tags('http://www.w3.org/2000/svg')[tag](rawProps)
}

const handleChildren = (parent: Element, children: Element | Element[]) => {
  if (typeof children === 'object') {
    if (Symbol.iterator in children) {
      for (const child of children) {
        handleChildren(parent, child)
      }

      return
    }
  }

  van.add(parent, children)
}

export const createElement = (tag: string | Function, { children, ...rawProps }: {
  children?: Element | undefined,
}): Element => {
  const props = adaptProps(rawProps)

  if (typeof tag === 'function') {
    // eslint-disable-next-line no-console
    console.debug(tag.name)

    return tag({ children, ...rawProps })
  }

  if (typeof tag === 'string') {
    if (tag === 'svg') {
      if (!import.meta.env.SSR) {
        // Todo: Handle non-element SVG descendants (e.g. functions).
        return handleSvg(tag, { children, ...rawProps })
      }
    }

    if (children) {
      const parent = van.tags[tag](props)

      handleChildren(parent, children)

      return parent
    }

    return Object.assign(van.tags[tag](props))
  }

  throw new TypeError('Invalid tag')
}

export {
  createElement as jsx,
  createElement as jsxDEV,
  createElement as jsxs,
}

export const onMount = (fn: () => void) => {
  if (!import.meta.env.SSR) {
    fn()
  }
}

export const onUnmount = (el: HTMLElement, fn: () => void) => {
  if (!import.meta.env.SSR) {
    const observer = new MutationObserver(() => {
      if (!el.isConnected) {
        fn()

        observer.disconnect()
      }
    })

    observer.observe(el, { childList: true })
  }
}

export const renderToString = (element: JSX.Element): string => {
  if (import.meta.env.SSR) {
    if (typeof element === 'object' && 'render' in element && typeof element.render === 'function') {
      return element.render()
    }
  }

  return ''
}

export {
  van,
}
