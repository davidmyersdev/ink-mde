import { partition } from './partition'

export const filter = <T, V>(array: T[], fn: { (i: any): i is V }): V[] => {
  return partition(array, fn)[0]
}
