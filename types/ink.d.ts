// Type definitions for @writewithocto/ink

import { InkValues } from './values'

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? DeepPartial<U>[] : T[K] extends Function
    ? T[K] : T[K] extends object
    ? DeepPartial<T[K]> : T[K]
}

export namespace Editor {
  export interface Selection {
    end: number
    start: number
  }
}

export type Initializer = (target: HTMLElement, options: DeepPartial<Options>) => Instance

export interface Instance {
  destroy: () => void
  doc: () => string
  focus: () => void
  insert: (text: string, selection: Editor.Selection) => void
  load: (doc: string) => void
  reconfigure: (updates: Partial<Options>) => void
  select: (selections: Editor.Selection[]) => void
  selections: () => Editor.Selection[]
  update: (doc: string) => void
}

export interface Options {
  doc: string
  extensions: any[]
  files: Options.Files
  hooks: Options.Hooks
  interface: Options.Interface
  selections: Editor.Selection[]
}

export namespace Options {
  export type ExtensionNames = keyof Options.Extensions

  export interface Extensions {
    [InkValues.Extensions.Appearance]: InkValues.Appearance
    [InkValues.Extensions.Attribution]: boolean
    [InkValues.Extensions.Images]: boolean
    [InkValues.Extensions.Spellcheck]: boolean
  }

  export interface Files {
    clipboard: boolean
    dragAndDrop: boolean
    handler: (files: FileList) => Promise<any> | void
    injectMarkup: boolean
    types: string[]
  }

  export interface Hooks {
    afterUpdate: (doc: string) => void
    beforeUpdate: (doc: string) => void
  }

  export namespace Hooks {
    export type AfterUpdate = (doc: string) => void
    export type BeforeUpdate = (doc: string) => void
  }

  export interface Interface {
    [InkValues.Extensions.Appearance]: Options.Extensions[InkValues.Extensions.Appearance]
    [InkValues.Extensions.Attribution]: Options.Extensions[InkValues.Extensions.Attribution]
    [InkValues.Extensions.Images]: Options.Extensions[InkValues.Extensions.Images]
    [InkValues.Extensions.Spellcheck]: Options.Extensions[InkValues.Extensions.Spellcheck]
  }
}

export namespace Values {
  export type Appearance = InkValues.Appearance
  export type Extensions = InkValues.Extensions
}

declare function ink(target: HTMLElement, options: DeepPartial<Options>): Instance

export default ink
