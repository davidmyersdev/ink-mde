const types = {
  array: '[object Array]',
  object: '[object Object]',
  string: '[object String]',
  undefined: '[object Undefined]',
  window: '[object Window]',
}

const getType = (object: any) => {
  const type = Object.prototype.toString.call(object)

  if (type === types.object) {
    return `[object ${object.constructor.name}]`
  }
}

const is = (object: any, type: string) => {
  return getType(object) === type
}

const deepAssign = (target: any, source: any) => {
  const seen = new WeakMap()

  const assign = (target: any, source: any) => {
    if (seen.get(target)) return target
    if (is(target, types.object)) seen.set(target, true)
    if (is(source, types.undefined)) return target

    if (is(target, types.array) && is(source, types.array)) {
      return [...source]
    }

    if (is(target, types.object) && is(source, types.object)) {
      return Object.keys(target).reduce((replacement: Record<PropertyKey, unknown>, key: PropertyKey) => {
        if (Object.hasOwnProperty.call(source, key)) {
          replacement[key] = assign(target[key], source[key])
        } else {
          replacement[key] = target[key]
        }

        return replacement
      }, {})
    }

    return source
  }

  return assign(target, source)
}

export const override = <T>(a: T, b: unknown): T => {
  return deepAssign(a, b) as unknown as T
}
