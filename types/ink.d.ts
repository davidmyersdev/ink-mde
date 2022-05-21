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
  wrap: (options: Instance.WrapOptions) => void
}

export namespace Instance {
  export interface WrapOptions {
    after: string
    before: string
    selection?: Editor.Selection
  }
}

export interface Markup {
  [InkValues.Markup.Bold]: Markup.Definition
  [InkValues.Markup.Code]: Markup.Definition
  [InkValues.Markup.CodeBlock]: Markup.Definition
  [InkValues.Markup.Heading]: Markup.Definition
  [InkValues.Markup.Image]: Markup.Definition
  [InkValues.Markup.Italic]: Markup.Definition
  [InkValues.Markup.Link]: Markup.Definition
  [InkValues.Markup.List]: Markup.Definition
  [InkValues.Markup.OrderedList]: Markup.Definition
  [InkValues.Markup.Quote]: Markup.Definition
  [InkValues.Markup.TaskList]: Markup.Definition
}

export namespace Markup {
  export interface Definition {
    block: boolean
    line: boolean
    multiline: boolean
    nodes: string[]
    prefix: string
    prefixStates: string[]
    suffix: string
  }
}

export interface Options {
  doc: string
  extensions: any[]
  files: Options.Files
  hooks: Options.Hooks
  interface: Options.Interface
  selections: Editor.Selection[]
  toolbar: Options.Toolbar
  vim: boolean
}

export namespace Options {
  export type ExtensionNames = keyof Options.Extensions

  export interface Extensions {
    [InkValues.Extensions.Appearance]: InkValues.Appearance
    [InkValues.Extensions.Attribution]: boolean
    [InkValues.Extensions.Images]: boolean
    [InkValues.Extensions.ReadOnly]: boolean
    [InkValues.Extensions.Spellcheck]: boolean
    [InkValues.Extensions.Vim]: boolean
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
    [InkValues.Extensions.ReadOnly]: Options.Extensions[InkValues.Extensions.ReadOnly]
    [InkValues.Extensions.Spellcheck]: Options.Extensions[InkValues.Extensions.Spellcheck]
    toolbar: boolean
  }

  export interface Toolbar {
    bold: boolean
    code: boolean
    codeBlock: boolean
    heading: boolean
    image: boolean
    italic: boolean
    link: boolean
    list: boolean
    orderedList: boolean
    quote: boolean
    taskList: boolean
    upload: boolean
  }
}

export namespace Values {
  export type Appearance = InkValues.Appearance
  export type Extensions = InkValues.Extensions
  export type Markup = InkValues.Markup
}

export declare function defineOptions(options: DeepPartial<Options>): DeepPartial<Options>
export declare function ink(target: HTMLElement, options?: DeepPartial<Options>): Instance

export default ink
