import { type HNode, type HNodeChildren, type HProps, type HTagOrComponent, h } from './h'

export type * from './jsx'

export const Fragment = /* @__PURE__ */ ({ children }: { children: HNodeChildren }) => {
  return children
}

export const jsx = /* @__PURE__ */ (type: HTagOrComponent, { children, ...props }: HProps & { children: HNodeChildren }) => {
  if (children) {
    return h(type, props)
  }

  return /* @__PURE__ */ h(type, props, [].concat(children))
}

export const jsxs = /* @__PURE__ */ (type: any, props: any) => {
  return /* @__PURE__ */ jsx(type, props)
}
