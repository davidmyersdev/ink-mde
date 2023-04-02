export type RecursiveArray<T> = Array<T | RecursiveArray<T>>

export const flatten = <T>(array: RecursiveArray<T>): T[] => {
  return array.reduce<T[]>((flatArray, item) => {
    if (Array.isArray(item)) {
      return flatArray.concat(flatten(item))
    }

    return flatArray.concat(item)
  }, [])
}
