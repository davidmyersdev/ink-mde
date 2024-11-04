import {
  destroy,
  focus,
  format,
  getDoc,
  insert,
  load,
  options,
  reconfigure,
  select,
  selections,
  update,
  wrap,
} from '/src/api'
import { awaitable } from '/src/utils/awaitable'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const makeInstance = (state: InkInternal.StoreState): Ink.AwaitableInstance => {
  const instance = {
    destroy: destroy.bind(undefined, state),
    focus: focus.bind(undefined, state),
    format: format.bind(undefined, state),
    getDoc: getDoc.bind(undefined, state),
    insert: insert.bind(undefined, state),
    load: load.bind(undefined, state),
    options: options.bind(undefined, state),
    reconfigure: reconfigure.bind(undefined, state),
    select: select.bind(undefined, state),
    selections: selections.bind(undefined, state),
    update: update.bind(undefined, state),
    wrap: wrap.bind(undefined, state),
  }

  return awaitable(instance, (resolve, reject) => {
    try {
      // Ensure all other queued tasks are finished before resolving.
      state.workQueue.val.enqueue(() => resolve(instance))
    } catch (error: any) {
      reject(error)
    }
  })
}
