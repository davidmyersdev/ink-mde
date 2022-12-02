import type {
  Compartment as VendorCompartment,
  Extension as VendorExtension,
  EditorState as VendorState,
  StateEffect as VendorStateEffect,
  Transaction as VendorTransaction,
} from '@codemirror/state'
import type { EditorView as VendorView } from '@codemirror/view'
import type { Accessor, Setter } from 'solid-js'
import type * as Ink from '/types/ink'
import type InkUi from '/types/ui'

export namespace InkInternal {
  export type Editor = InkInternal.Vendor.View

  export interface Extension {
    compartment: InkInternal.Vendor.Compartment,
    initialValue: (state: InkInternal.StateResolved) => InkInternal.Vendor.Extension,
    reconfigure: (options: Ink.OptionsResolved) => InkInternal.Vendor.StateEffect<unknown>,
  }

  export interface LazyExtension {
    compartment: InkInternal.Vendor.Compartment,
    initialValue: (state: InkInternal.StateResolved) => InkInternal.Vendor.Extension,
    reconfigure: (options: Ink.OptionsResolved) => Promise<InkInternal.Vendor.StateEffect<unknown>>,
  }

  export type ExtensionResolver = (options: Ink.OptionsResolved) => InkInternal.Vendor.Extension
  export type ExtensionResolvers = ExtensionResolver[]
  export type LazyExtensionResolver = (options: Ink.OptionsResolved, compartment: InkInternal.Vendor.Compartment) => Promise<InkInternal.Vendor.StateEffect<unknown>>
  export type LazyExtensionResolvers = LazyExtensionResolver[]

  export type Extensions = {
    [ExtensionName in Ink.Options.ExtensionNames]: InkInternal.Extension
  }

  export interface OptionExtension<OptionName extends Ink.Values.Extensions> extends InkInternal.Extension {
    effect?: InkInternal.Vendor.StateEffect<any>,
    name: OptionName,
  }

  export interface State {
    doc?: string,
    editor?: InkInternal.Editor,
    extensions?: Array<InkInternal.Extension | InkInternal.LazyExtension>,
    options?: Ink.Options,
    root?: InkUi.Root,
    ssr?: boolean,
    target?: HTMLElement,
  }

  export interface StateResolved {
    doc: string,
    editor: InkInternal.Editor,
    extensions: Array<InkInternal.Extension | InkInternal.LazyExtension>,
    options: Ink.OptionsResolved,
    root: InkUi.Root,
    target: HTMLElement,
  }

  export type Store = [get: Accessor<InkInternal.StateResolved>, set: Setter<InkInternal.StateResolved>]

  export namespace Vendor {
    // All vendor types (and adapters) should be encapsulated here.
    export type Compartment = VendorCompartment
    export type Extension = VendorExtension
    export type ExtensionResolver = (options: Ink.OptionsResolved) => InkInternal.Vendor.Extension
    export type ExtensionResolvers = {
      [ExtensionName in Ink.Options.ExtensionNames]: ExtensionResolver
    }
    export type State = VendorState
    export type StateEffect<Type> = VendorStateEffect<Type>
    export type Transaction = VendorTransaction
    export type View = VendorView
  }
}

export default InkInternal
