export type FlattenArray<T> = ReturnType<typeof flatten<T>>
export type RecursiveArray<T> = Array<T | RecursiveArray<T>>

export const flatten = <T>(array: RecursiveArray<T>): T[] => {
  return array.reduce<T[]>((flatArray, item) => {
    if (Array.isArray(item)) {
      flatArray.push(...flatten(item))
    } else {
      flatArray.push(item)
    }

    return flatArray
  }, [])
}
