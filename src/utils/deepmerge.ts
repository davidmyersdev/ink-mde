import { deepmergeCustom } from 'deepmerge-ts'

export const deepmergePartial = deepmergeCustom({
  mergeOthers: (values, utils, _meta) => {
    if (typeof values === 'undefined')
      return utils.actions.skip

    return utils.actions.defaultMerge
  },
})

export const override = <T>(a: T, ...rest: unknown[]): T => {
  return deepmergePartial(a, ...rest) as unknown as T
}
