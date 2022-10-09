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
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

export const makeInstance = (store: InkInternal.Store): Ink.Instance => {
  return {
    destroy: destroy.bind(undefined, store),
    focus: focus.bind(undefined, store),
    format: format.bind(undefined, store),
    getDoc: getDoc.bind(undefined, store),
    insert: insert.bind(undefined, store),
    load: load.bind(undefined, store),
    options: options.bind(undefined, store),
    reconfigure: reconfigure.bind(undefined, store),
    select: select.bind(undefined, store),
    selections: selections.bind(undefined, store),
    update: update.bind(undefined, store),
    wrap: wrap.bind(undefined, store),
  }
}
