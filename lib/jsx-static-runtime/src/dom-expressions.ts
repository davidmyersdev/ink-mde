/* eslint-disable import/export */
import {
  computed,
  effectScope,
  pauseTracking,
  resetTracking,
  shallowRef,
  stop,
  effect as vEffect,
} from '@vue/reactivity'

import { ssr as deSsr } from 'dom-expressions/src/server'
import type { JSX } from './jsx'

export * from 'dom-expressions/src/client'

export const getOwner = null
export const sharedConfig = {}

export { escape, mergeProps } from 'dom-expressions/src/server'

export const createComponent = <T extends { children?: JSX.Element }>(comp: Component<T>, props: T): JSX.Element => {
  return root(() => comp(props))
}

export const root = <T>(fn: (dispose: () => void) => T): T => {
  return fn(() => {})
}

// Todo: Maybe replace and use the existing `render` and `renderToString` functions instead of wrapping this one?
export const ssr = (template: string | string[], ...nodes: any[]): string => {
  return deSsr(template, ...nodes).t
}

type ContextOwner = {
  disposables: any[],
  owner: ContextOwner | null,
  context?: any,
}
export interface Context {
  id: symbol,
  Provider: (props: any) => any,
  defaultValue: unknown,
}

let globalContext: ContextOwner | null = null

/**
 * Returns the value of a callback without tracking its dependencies.
 */
export function untrack<T>(fn: () => T): T {
  return fn()
}

// Todo: Is this needed? When does the top-level "dispose" happen? Maybe that's why we need to use a `render` function?
export function cleanup(fn: () => void) {
  let ref;
  (ref = globalContext) != null && ref.disposables.push(fn)
}

// Todo: Do we need to track these effects, or can we just let the root scope handle it?
// https://github.com/vuejs/core/blob/v3.4.23/packages/reactivity/src/effect.ts#L193
export function effect<T>(fn: (prev?: T) => T, current?: T) {
  fn(current)
}

// only updates when boolean expression changes
export function memo<T>(fn: () => T, equal?: boolean): () => T {
  const o = shallowRef(untrack(fn))
  effect(prev => {
    const res = fn();
    (!equal || prev !== res) && (o.value = res)
    return res
  })
  return () => o.value
}

type PropsWithChildren<P> = P & { children?: JSX.Element }
export type Component<P = {}> = (props: PropsWithChildren<P>) => JSX.Element
export type ComponentProps<T extends keyof JSX.IntrinsicElements | Component<any>> =
  T extends Component<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {}

// dynamic import to support code splitting
export function lazy<T extends Function>(fn: () => Promise<{ default: T }>) {
  return (props: object) => {
    let Comp: T
    const result = shallowRef()
    fn().then(component => (result.value = component.default))
    const rendered = computed(() => (Comp = result.value) && untrack(() => Comp(props)))
    return () => rendered.value
  }
}

export function splitProps<T extends object, K1 extends keyof T>(
  props: T,
  ...keys: [K1[]]
): [Pick<T, K1>, Omit<T, K1>]
export function splitProps<T extends object, K1 extends keyof T, K2 extends keyof T>(
  props: T,
  ...keys: [K1[], K2[]]
): [Pick<T, K1>, Pick<T, K2>, Omit<T, K1 | K2>]
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
>(
  props: T,
  ...keys: [K1[], K2[], K3[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Omit<T, K1 | K2 | K3>]
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
  K4 extends keyof T,
>(
  props: T,
  ...keys: [K1[], K2[], K3[], K4[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Pick<T, K4>, Omit<T, K1 | K2 | K3 | K4>]
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
  K4 extends keyof T,
  K5 extends keyof T,
>(
  props: T,
  ...keys: [K1[], K2[], K3[], K4[], K5[]]
): [
  Pick<T, K1>,
  Pick<T, K2>,
  Pick<T, K3>,
  Pick<T, K4>,
  Pick<T, K5>,
  Omit<T, K1 | K2 | K3 | K4 | K5>,
]
export function splitProps<T>(props: T, ...keys: [(keyof T)[]]) {
  const descriptors = Object.getOwnPropertyDescriptors(props)
  const split = (k: (keyof T)[]) => {
    const clone: Partial<T> = {}
    for (let i = 0; i < k.length; i++) {
      const key = k[i]
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key])
        delete descriptors[key]
      }
    }
    return clone
  }
  return keys.map(split).concat(split(Object.keys(descriptors) as (keyof T)[]))
}

// Modified version of mapSample from S-array[https://github.com/adamhaile/S-array] by Adam Haile
export function map<T, U>(list: () => T[], mapFn: (v: T, i: number) => U): () => U[] {
  let items = [] as T[]
  let mapped = [] as U[]
  let disposers = [] as (() => void)[]
  let len = 0

  // Clean up everything
  cleanup(() => {
    for (let i = 0, length = disposers.length; i < length; i++) {
      disposers[i]()
    }
  })

  return () => {
    const newItems = list() || []
    let i: number
    let j: number
    return untrack(() => {
      const newLen = newItems.length
      let newIndices: Map<T, number>
      let newIndicesNext: number[]
      let temp: U[]
      let tempdisposers: (() => void)[]
      let start: number
      let end: number
      let newEnd: number
      let item: T

      // fast path for empty arrays
      if (newLen === 0) {
        if (len !== 0) {
          for (i = 0; i < len; i++) disposers[i]()
          disposers = []
          items = []
          mapped = []
          len = 0
        }
      } else if (len === 0) {
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j]
          mapped[j] = root(mapper)
        }
        len = newLen
      } else {
        temp = new Array(newLen)
        tempdisposers = new Array(newLen)

        // skip common prefix
        for (
          start = 0, end = Math.min(len, newLen);
          start < end && items[start] === newItems[start];
          start++
        );

        // common suffix
        for (
          end = len - 1, newEnd = newLen - 1;
          end >= start && newEnd >= start && items[end] === newItems[newEnd];
          end--, newEnd--
        ) {
          temp[newEnd] = mapped[end]
          tempdisposers[newEnd] = disposers[end]
        }

        // remove any remaining nodes and we're done
        if (start > newEnd) {
          for (j = end; start <= j; j--) disposers[j]()
          const rLen = end - start + 1
          if (rLen > 0) {
            mapped.splice(start, rLen)
            disposers.splice(start, rLen)
          }
          items = newItems.slice(0)
          len = newLen
          return mapped
        }

        // insert any remaining updates and we're done
        if (start > end) {
          for (j = start; j <= newEnd; j++) mapped[j] = root(mapper)
          for (; j < newLen; j++) {
            mapped[j] = temp[j]
            disposers[j] = tempdisposers[j]
          }
          items = newItems.slice(0)
          len = newLen
          return mapped
        }
        // 0) prepare a map of all indices in newItems, scanning backwards so we encounter them in natural order
        newIndices = new Map<T, number>()
        newIndicesNext = new Array(newEnd + 1)
        for (j = newEnd; j >= start; j--) {
          item = newItems[j]
          i = newIndices.get(item)!
          newIndicesNext[j] = i === undefined ? -1 : i
          newIndices.set(item, j)
        }
        // 1) step through all old items and see if they can be found in the new set; if so, save them in a temp array and mark them moved; if not, exit them
        for (i = start; i <= end; i++) {
          item = items[i]
          j = newIndices.get(item)!
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i]
            tempdisposers[j] = disposers[i]
            j = newIndicesNext[j]
            newIndices.set(item, j)
          } else disposers[i]()
        }
        // 2) set all the new values, pulling from the temp array if copied, otherwise entering the new value
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j]
            disposers[j] = tempdisposers[j]
          } else mapped[j] = root(mapper)
        }
        // 3) in case the new set is shorter than the old, set the length of the mapped array
        len = mapped.length = newLen
        // 4) save a copy of the mapped items for the next update
        items = newItems.slice(0)
      }
      return mapped
    })
    function mapper(disposer: () => void) {
      disposers[j] = disposer
      return mapFn(newItems[j], j)
    }
  }
}
