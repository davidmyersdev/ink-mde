import type InkInternal from '/types/internal'

export const options = (state: InkInternal.StoreState) => {
  return state.options.val
}
