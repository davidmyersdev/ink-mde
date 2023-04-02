import { type Katex } from './importers/katex'

export type ModuleMap = Partial<{
  katex: Katex | Promise<Katex>,
}>

export const modules = new Proxy({}, {
  get: (target: ModuleMap, prop: keyof ModuleMap, _receiver) => {
    if (target[prop]) return target[prop]

    return target[prop] = (async () => {
      // Todo: Figure out whether including the extension here will pose a problem in the production build.
      const { importer } = await import(`./importers/${prop}.ts`)
      const imported = await importer() as Awaited<typeof target[typeof prop]>

      target[prop] = imported

      return imported!
    })()
  },
})

/**
 *
 * @example useModule('katex', (katex) => katex.render(...))
 */
export const useModule = (name: keyof ModuleMap, callback: (module: Awaited<Required<ModuleMap>[typeof name]>) => void) => {
  if (!modules[name]) return console.error('[katex] module is not resolvable')
  if ('then' in modules[name]!) return Promise.resolve(modules[name]!).then(callback)

  callback(modules[name] as Awaited<Required<ModuleMap>[typeof name]>)
}
