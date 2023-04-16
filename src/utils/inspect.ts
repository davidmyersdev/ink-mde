export type ObjectTypeKey = keyof ObjectTypes
export type ObjectTypeValue = ObjectTypes[ObjectTypeKey]
export type ObjectTypes = typeof objectTypes
export type Thenable<T> = T extends { then: (...args: any[]) => any } ? T : never

export const objectTypes = {
  array: '[object Array]',
  asyncFunction: '[object AsyncFunction]',
  boolean: '[object Boolean]',
  function: '[object Function]',
  null: '[object Null]',
  number: '[object Number]',
  object: '[object Object]',
  promise: '[object Promise]',
  string: '[object String]',
  symbol: '[object Symbol]',
  undefined: '[object Undefined]',
  window: '[object Window]',
} as const

export const is = <T>(type: ObjectTypeValue, object: T): object is T => {
  return Object.prototype.toString.call(object) === type
}

export const isArray = <T extends any[]>(object: T | any): object is T => is(objectTypes.array, object)
export const isAsyncFunction = <T extends (...args: any[]) => Promise<any>>(object: T | any): object is T => is(objectTypes.asyncFunction, object)
export const isBoolean = <T extends boolean>(object: T | any): object is T => is(objectTypes.boolean, object)
export const isFunction = <T extends (...args: any[]) => any>(object: T | any): object is T => is(objectTypes.function, object)
export const isNull = <T>(object: T | any): object is T => is(objectTypes.null, object)
export const isNumber = <T extends number>(object: T | any): object is T => is(objectTypes.number, object)
export const isObject = <T extends Record<any, any>>(object: T | any): object is T => is(objectTypes.object, object)
export const isPromise = <T>(object: T | Promise<T>): object is Promise<T> => is(objectTypes.promise, object)
export const isString = <T extends string>(object: T | any): object is T => is(objectTypes.string, object)
export const isSymbol = <T extends symbol>(object: T | any): object is T => is(objectTypes.symbol, object)
export const isUndefined = <T extends undefined>(object: T | any): object is T => is(objectTypes.undefined, object)
export const isWindow = <T extends Window>(object: T | any): object is T => is(objectTypes.window, object)

export const isThenable = <T extends { then: <A, R>(...args: A[]) => R }>(object: T | any): object is T => {
  if (isPromise(object)) return true

  return isObject(object) && ('then' in object) && (typeof object.then === 'function')
}
