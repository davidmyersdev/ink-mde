import type InkInternal from '/types/internal'

export const options = ([state]: InkInternal.Store) => {
  return state().options
}
