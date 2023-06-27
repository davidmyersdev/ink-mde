import { Tag } from '@lezer/highlight'

export const buildTag = <T extends Tag>(parent?: T) => {
  return Tag.define(parent)
}

export const getCharCode = (char: string) => {
  return char.charCodeAt(0)
}
