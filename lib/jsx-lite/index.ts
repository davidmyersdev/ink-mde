import van from 'vanjs-core'

export * from './types'

const adaptProps = (rawProps: Record<string, any>): Record<string, any> => {
  const adapted: Record<string, any> = {}

  for (const key in rawProps) {
    adapted[key.toLowerCase()] = rawProps[key]
  }

  return adapted
}

export const Fragment = ({ children }: { children?: Element[] | undefined }) => {
  console.log('Fragment', { children })

  return children || []
}

export const createElement = (tag: string | Function, { children, ...rawProps }: {
  children?: Element | undefined,
}): Element => {
  const props = adaptProps(rawProps)

  if (typeof tag === 'function') {
    return tag({ children, ...props })
  }

  if (typeof tag === 'string') {
    if (typeof children === 'undefined') {
      return van.tags[tag](props)
    }

    if (Array.isArray(children)) {
      return van.tags[tag](props, ...children)
    }

    return van.tags[tag](props, children)
  }

  throw new TypeError('Invalid tag')
}

export {
  createElement as jsx,
  createElement as jsxDEV,
  createElement as jsxs,
}

export const renderToString = (element: JSX.Element): string => {
  if (import.meta.env.SSR) {
    if (typeof element === 'object' && 'render' in element && typeof element.render === 'function') {
      return element.render()
    }
  }

  return ''
}
