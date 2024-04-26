import { jsx } from './jsx-runtime'

export type * from './jsx'
export { Fragment } from './jsx-runtime'

export const jsxDEV = (type: any, props: any) => {
  return jsx(type, props)
}
