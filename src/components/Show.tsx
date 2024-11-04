import * as van from '/lib/vanjs'
import type { State } from '/lib/vanjs'

export type WhenType = State<boolean> | boolean | (() => boolean)

export const Show = ({ children, when, fallback = <template /> }: { children: () => any, when: WhenType, fallback?: any }) => {
  const bool = van.derive(() => {
    return typeof when === 'function' ? when()
      : typeof when === 'object' ? when.val
        : when
  })

  return () => bool.val ? children() : fallback
}
