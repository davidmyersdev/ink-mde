// Type definitions for ink-mde
import * as InkValues from './values'
import type { CompletionSource } from '@codemirror/autocomplete'
import type { Extension } from '@codemirror/state'
import type { MarkdownConfig } from '@lezer/markdown'

type VendorCompletion = CompletionSource
type VendorExtension = Extension
type VendorGrammar = MarkdownConfig

export * from './values'

export namespace Editor {
  export interface Selection {
    end: number
    start: number
  }
}

export type EnumString<T extends string> = `${T}`

export interface Instance {
  destroy: () => void
  doc: () => string
  focus: () => void
  insert: (text: string, selection: Editor.Selection) => void
  load: (doc: string) => void
  options: () => OptionsResolved
  reconfigure: (updates: Options) => void
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
  doc?: string
  files?: Partial<Options.Files>
  hooks?: Partial<Options.Hooks>
  interface?: Partial<Options.Interface>
  plugins?: Options.Plugin[]
  selections?: Editor.Selection[]
  toolbar?: Partial<Options.Toolbar>
  vim?: boolean
}

export interface OptionsResolved {
  doc: string
  files: Required<Options.Files>
  hooks: Required<Options.Hooks>
  interface: Required<Options.Interface>
  plugins: Options.Plugin[]
  selections: Editor.Selection[]
  toolbar: Required<Options.Toolbar>
  vim: boolean
}

export namespace Options {
  export type ExtensionNames = keyof Options.Extensions

  export type Plugin = Plugins.Completion | Plugins.Default | Plugins.Grammar

  export namespace Plugins {
    export interface Completion {
      type: EnumString<InkValues.PluginType.Completion>
      value: VendorCompletion
    }

    export interface Default {
      type: EnumString<InkValues.PluginType.Default>
      value: VendorExtension
    }

    export interface Grammar {
      type: EnumString<InkValues.PluginType.Grammar>
      value: VendorGrammar
    }
  }


  export interface Extensions {
    [InkValues.Extensions.Appearance]: EnumString<InkValues.Appearance>
    [InkValues.Extensions.Attribution]: boolean
    [InkValues.Extensions.Autocomplete]: boolean
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
    [InkValues.Extensions.Autocomplete]: Options.Extensions[InkValues.Extensions.Autocomplete]
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
  export type PluginType = InkValues.PluginType
}

export declare function defineOptions(options: Options): Options
export declare function ink(target: HTMLElement, options?: Options): Instance

export default ink
