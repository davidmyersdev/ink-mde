import { type EnumString, type Options, type Values } from '/types/ink'

export type FnIntersectionToTuple<FnIntersection> = FnIntersection extends { (a: infer A): void, (b: infer B): void } ? [A, B] : never
export type FnUnionToFnIntersection<FnUnion> = (FnUnion extends unknown ? (arg: FnUnion) => void : never) extends ((arg: infer FnIntersection) => void) ? FnIntersection : never
export type Partition<T, V> = UnionToTuple<T> extends never
? [T] extends [infer A]
  ? V extends ((arg: any) => arg is A)
    ? [A[], unknown[]]
    : V extends ((arg: any) => arg is infer AssertionType)
      ? [AssertionType[], Array<A>]
      : never
  : never
: UnionToTuple<T> extends [infer A, infer B]
  ? V extends ((arg: any) => arg is A)
    ? [A[], B[]]
    : V extends ((arg: any) => arg is B)
      ? [B[], A[]]
      : V extends ((arg: any) => arg is infer AssertionType)
        ? [AssertionType[], Array<A | B>]
        : never
  : never
export type PluginHandler<T> = { [P in keyof T]: (variant: T[P]) => any }
export type PluginMatcher = { [K in PluginType]: Extract<Options.Plugin, { type: K }> }
export type PluginType = Options.Plugin['type']
export type PluginForType<T extends Values.PluginType> = Extract<Options.Plugin, { type: T }>
export type PluginValueForType<T extends Values.PluginType> = PluginForType<T>['value']
export type UnionToFnUnion<Union> = Union extends unknown ? (k: Union) => void : never
export type UnionToTuple<Union> = FnIntersectionToTuple<FnUnionToFnIntersection<UnionToFnUnion<Union>>>
export type ValidatorFn = (arg: any) => boolean

export const enumString = <T extends string>(value: T) => {
  return `${value}` as EnumString<T>
}
