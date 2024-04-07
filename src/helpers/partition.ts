export const partition = <T, V>(array: T[], fn: { (i: any): i is V }): [V[], Exclude<T, V>[]] => {
  return array.reduce<[V[], Exclude<T, V>[]]>((partitions, item) => {
    if (fn(item)) {
      partitions[0].push(item)
    } else {
      partitions[1].push(item as Exclude<T, V>)
    }

    return partitions
  }, [[], []])
}
