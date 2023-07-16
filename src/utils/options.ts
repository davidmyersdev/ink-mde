import { isPromise } from '/src/utils/inspect'
import { type EnumString, type Options, type OptionsResolved, type Values } from '/types/ink'

export type FlattenArray<T> = ReturnType<typeof flatten<T>>
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
export type RecursiveArray<T> = Array<T | RecursiveArray<T>>
export type UnionToFnUnion<Union> = Union extends unknown ? (k: Union) => void : never
export type UnionToTuple<Union> = FnIntersectionToTuple<FnUnionToFnIntersection<UnionToFnUnion<Union>>>
export type ValidatorFn = (arg: any) => boolean

export const enumString = <T extends string>(value: T) => {
  return `${value}` as EnumString<T>
}

export const partitionPlugins = <T extends Options.Plugin['value']>(plugins: T[]) => {
  return partition(plugins, isPromise)
}

export const isPlugin = <T extends PluginType>(pluginType: T, plugin: Options.Plugin): plugin is PluginMatcher[T] => {
  return plugin.type === pluginType
}

export const isOptionsKey = (key: string, options: OptionsResolved): key is keyof OptionsResolved => {
  return !!key && (key in options)
}

export const filterPlugins = <T extends PluginType>(pluginType: T, options: OptionsResolved): PluginMatcher[T]['value'][] => {
  return flatten(options.plugins).reduce<PluginMatcher[T]['value'][]>((matches, plugin: Options.Plugin) => {
    if (isPlugin(pluginType, plugin)) {
      // Todo: These "plugin" keys might be better suited under a namespace, but they are top-level for now.
      // Individual key resolvers might be a good idea down the road to check for more fine-grained configuration options.
      if (!plugin.key || (isOptionsKey(plugin.key, options) && options[plugin.key])) {
        // @ts-expect-error Todo: Fix this type definition.
        matches.push(plugin.value)
      }
    }

    return matches
  }, [])
}

export const flatten = <T>(array: RecursiveArray<T>): T[] => {
  return array.reduce<T[]>((flatArray, item) => {
    if (Array.isArray(item)) {
      return flatArray.concat(flatten(item))
    }

    return flatArray.concat(item)
  }, [])
}

export const partition = <ArrayTypes, Validator extends ValidatorFn>(array: ArrayTypes[], isValid: Validator): Partition<ArrayTypes, Validator> => {
  return array.reduce<Partition<ArrayTypes, Validator>>((partitions, entry) => {
    isValid(entry) ? partitions[0].push(entry) : partitions[1].push(entry)

    return partitions
  }, [[], []] as unknown as Partition<ArrayTypes, Validator>)
}

// partition(['string'], isNumber)
// partition([1], isNumber)
// partition(['hello', 1, 'yep', 4], isPromise)
// partition(['hello', 1, 'yep', 4], isString)
