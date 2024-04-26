export namespace JSX {
  type Element = Node | Element[] | (string & {}) | number | boolean | null | undefined | { (): Element }
  type IntrinsicElements = {
    [Name in keyof HTMLElementTagNameMap as Name]: Partial<Omit<HTMLElementTagNameMap[Name], 'children'>> & {
      children?: IntrinsicElements[keyof HTMLElementTagNameMap][],
      class?: string,
    }
  }
}
