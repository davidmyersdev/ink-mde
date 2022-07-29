import type {
  Compartment as VendorCompartment,
  EditorState as VendorState,
  Extension as VendorExtension,
  StateEffect as VendorStateEffect,
  Transaction as VendorTransaction,
} from '@codemirror/state'
import type { EditorView as VendorView } from '@codemirror/view'
import type { SetStoreFunction } from 'solid-js/store'
import type * as Ink from '/types/ink'
import type InkUi from '/types/ui'

export namespace InkInternal {
  export type Editor = InkInternal.Vendor.View

  export interface Extension {
    compartment: InkInternal.Vendor.Compartment
    resolver: InkInternal.Vendor.ExtensionResolver
  }

  export type Extensions = {
    [ExtensionName in Ink.Options.ExtensionNames]: InkInternal.Extension
  }

  export interface OptionExtension<OptionName extends Ink.Values.Extensions> extends InkInternal.Extension {
    effect?: InkInternal.Vendor.StateEffect<any>
    name: OptionName
  }

  export interface State {
    extensions?: InkInternal.OptionExtension<Ink.Values.Extensions>[]
    options?: Ink.Options
    target?: HTMLElement
    root?: InkUi.Root
    editor?: InkInternal.Editor
  }

  export interface StateResolved {
    extensions: InkInternal.OptionExtension<Ink.Values.Extensions>[]
    options: Ink.OptionsResolved
    target: HTMLElement
    root: InkUi.Root
    editor: InkInternal.Editor
  }

  export type Store = [get: InkInternal.StateResolved, set: SetStoreFunction<InkInternal.StateResolved>]

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
