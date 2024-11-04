import { JSXElementType, VanElement, InnerElement, Key, TagOption } from './types'

declare global {
  declare namespace JSX {
    type ElementType = string | JSXElementType<any>
    interface ElementAttributesProperty {
        props: object,
    }
    interface ElementChildrenAttribute {
        children: object,
    }
    interface Element extends VanElement {}
    interface IntrinsicAttributes {}

    type IntrinsicElements = {
        [K in keyof InnerElement]: TagOption<K>;
    }
  }
}

export {}
