export interface State<T> {
  _bindings: Binding[],
  _listeners: Binding[],
  _oldVal: T,
  oldVal: T,
  rawVal: T,
  val: T,
}

// Defining readonly view of State<T> for covariance.
// Basically we want StateView<string> to implement StateView<string | number>
type StateView<T> = Readonly<State<T>>
// type Val<T> = State<T> | T
type Primitive = string | number | boolean | bigint
type PropValue = Primitive | ((e: any) => void) | null
type PropValueOrDerived = PropValue | StateView<PropValue> | (() => PropValue)
type Props = Record<string, PropValueOrDerived> & { class?: PropValueOrDerived }
type PropsWithKnownKeys<ElementType> = Partial<{ [K in keyof ElementType]: PropValueOrDerived }>
type ValidChildDomValue = Primitive | Node | null | undefined
type BindingFunc = (dom?: Element) => ValidChildDomValue
type ChildDom = ValidChildDomValue | StateView<Primitive | null | undefined> | BindingFunc | readonly ChildDom[]
type TagFunc<Result> = (first?: Props & PropsWithKnownKeys<Result> | ChildDom, ...rest: readonly ChildDom[]) => Result

type Tags = Readonly<Record<string, TagFunc<Element>>> & {
  [K in keyof HTMLElementTagNameMap]: TagFunc<HTMLElementTagNameMap[K]>
}

type Binding = {
  f: BindingFunc,
  s?: State<any>,
  _dom?: Element,
}

type Deps = {
  _getters: Set<any>,
  _setters: Set<any>,
}

type Derive = { f: () => any, s: State<any>, _dom?: Element | { isConnected: boolean } | number }

let changedStates: Set<State<any>> | undefined
let derivedStates: Set<State<any>> | undefined
let curDeps: Deps
let curNewDerives: Derive[]
let statesToGc: Set<any> | undefined

const protoOf = Object.getPrototypeOf
const alwaysConnectedDom = { isConnected: 1 }
const gcCycleInMs = 1000
const objProto = protoOf(alwaysConnectedDom)
const funcProto = protoOf(protoOf)

const addAndScheduleOnFirst = <T>(set: Set<T> | undefined, s: T, f: () => void, waitMs?: number) => {
  if (set) {
    set.add(s)

    return set
  }

  setTimeout(f, waitMs)

  return new Set([s])
}

const runAndCaptureDeps = (f: (arg: any) => any, deps: Deps, arg: any) => {
  const prevDeps = curDeps
  curDeps = deps
  try {
    return f(arg)
  } catch (e) {
    console.error(e)
    return arg
  } finally {
    curDeps = prevDeps
  }
}

const keepConnected = (l: Binding[]) => {
  return l.filter(b => b._dom?.isConnected)
}

const addStatesToGc = (d: Deps) => {
  return statesToGc = addAndScheduleOnFirst(statesToGc, d, () => {
    for (const s of statesToGc!) {
      s._bindings = keepConnected(s._bindings)
      s._listeners = keepConnected(s._listeners)
    }

    statesToGc = undefined
  }, gcCycleInMs)
}

const stateKey = Symbol('state')

const isState = (object: unknown): object is State<unknown> => {
  if (Object.hasOwn(object || {}, stateKey)) {
    return true
  }

  return false
}

const bind = (f: BindingFunc, dom?: Element) => {
  const deps: Deps = { _getters: new Set(), _setters: new Set() }
  const binding: Binding = { f }
  const prevNewDerives = curNewDerives

  curNewDerives = []

  let newDom = runAndCaptureDeps(f, deps, dom)

  newDom = (newDom ?? document).nodeType ? newDom : new Text(newDom)

  for (const dep of deps._getters) {
    if (!deps._setters.has(dep)) {
      addStatesToGc(dep)

      dep._bindings.push(binding)
    }
  }

  for (const l of curNewDerives) l._dom = newDom

  curNewDerives = prevNewDerives

  return binding._dom = newDom
}

const tag = (ns: string | undefined, name: string, ...args: any[]) => {
  // Split args up into props object and then any number of children.
  const [props, ...children] = protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args]

  // Create the element within the appropriate namespace.
  const dom = ns ? document.createElementNS(ns, name) : document.createElement(name)

  // Handle all props.
  for (let [k, v] of Object.entries<any>(props)) {
    // If the key starts with `on`, we need to add the event listener.
    // Otherwise, we need to set the attribute.
    const setter: (val: any, oldVal?: any) => any = k.startsWith('on')
      ? (v: any, oldV: any) => {
        const event = k.slice(2)

        dom.removeEventListener(event, oldV)
        dom.addEventListener(event, v)
      }
      : dom.setAttribute.bind(dom, k)

    if (!k.startsWith('on')) {
      if (typeof v === 'function') {
        v = derive(v)
      }
    }

    if (isState(v)) {
      bind(() => {
        if (isState(v)) {
          setter(v.val, v._oldVal)
        }

        return dom
      })
    } else {
      setter(v)
    }
  }

  return add(dom, children)
}

const update = (dom: Element, newDom?: Element) => {
  if (newDom) {
    if (newDom !== dom) {
      dom.replaceWith(newDom)
    } else {
      dom.remove()
    }
  }
}

const updateDoms = () => {
  let iter = 0
  let derivedStatesArray: State<any>[] = [...changedStates || []].filter(s => s.rawVal !== s._oldVal)

  do {
    derivedStates = new Set()

    for (const l of new Set(derivedStatesArray.flatMap(s => s._listeners = keepConnected(s._listeners)))) {
      derive(l.f, l.s, l._dom)
      l._dom = undefined
    }

    derivedStatesArray = [...derivedStates]
  } while (++iter < 100 && derivedStatesArray.length)

  const changedStatesArray: State<any>[] = [...changedStates || []].filter(s => s.rawVal !== s._oldVal)

  changedStates = undefined

  for (const b of new Set(changedStatesArray.flatMap(s => s._bindings = keepConnected(s._bindings)))) {
    if (b._dom) {
      update(b._dom, bind(b.f, b._dom))

      b._dom = undefined
    }
  }

  for (const s of changedStatesArray) s._oldVal = s.rawVal
}

const handler = (ns?: string) => ({ get: (_: any, name: string) => tag.bind(undefined, ns, name) })

export const add = (dom: Element, ...children: any[]) => {
  for (const c of children.flat(Infinity)) {
    const protoOfC = protoOf(c ?? 0)
    const child = Object.hasOwn(c, stateKey) ? bind(() => c.val)
      : protoOfC === funcProto ? bind(c) : c
    child !== undefined && dom.append(child)
  }
  return dom
}

export const derive = <T>(f: () => T, s = state<T>(), dom?: Element) => {
  const deps: Deps = { _getters: new Set(), _setters: new Set() }
  const listener: Derive = { f, s }

  listener._dom = dom ?? curNewDerives?.push(listener) ?? alwaysConnectedDom

  s.val = runAndCaptureDeps(f, deps, s.rawVal)

  for (const dep of deps._getters) {
    if (!deps._setters.has(dep)) {
      addStatesToGc(dep)

      dep._listeners.push(listener)
    }
  }

  return s
}

export const hydrate = <T extends Element>(dom: T, f: BindingFunc): void => {
  update(dom, bind(f, dom))
}

export const state: {
  <T>(): State<T>,
  <T>(initVal: T): State<T>,
} = (initVal?: any) => {
  return {
    [stateKey]: true,
    rawVal: initVal,
    _oldVal: initVal,
    _bindings: [],
    _listeners: [],
    get oldVal(): any {
      curDeps?._getters?.add(this)

      return this._oldVal
    },
    get val(): any {
      curDeps?._getters?.add(this)

      return this.rawVal
    },
    set val(v: any) {
      curDeps?._setters?.add(this)

      if (v !== this.rawVal) {
        this.rawVal = v

        if (this._bindings.length + this._listeners.length) {
          derivedStates?.add(this)
          changedStates = addAndScheduleOnFirst(changedStates, this, updateDoms)
        } else {
          this._oldVal = v
        }
      }
    },
  }
}

export const tags: Tags & ((namespaceURI: string) => Readonly<Record<string, TagFunc<Element>>>) = new Proxy((ns: string) => new Proxy(tag, handler(ns)), handler())
