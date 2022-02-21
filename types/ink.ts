export namespace Ink {
  export namespace Editor {
    export interface Selection {
      end: number
      start: number
    }
  }

  export interface Instance {
    destroy: () => void
    doc: () => string
    focus: () => void
    load: (doc: string) => void
    reconfigure: (updates: Partial<Ink.Options>) => void
    select: (selections: Ink.Editor.Selection[]) => void
    selections: () => Ink.Editor.Selection[]
    update: (doc: string) => void
  }

  export interface Options {
    doc: string
    extensions: any[]
    files: Ink.Options.Files
    hooks: Ink.Options.Hooks
    interface: Ink.Options.Interface
    selections: Ink.Editor.Selection[]
  }

  export namespace Options {
    export type ExtensionNames = keyof Ink.Options.Extensions

    export interface Extensions {
      [Ink.Values.Extensions.Appearance]: Ink.Values.Appearance
      [Ink.Values.Extensions.Attribution]: boolean
      [Ink.Values.Extensions.Images]: boolean
      [Ink.Values.Extensions.Spellcheck]: boolean
    }

    export interface Files {
      clipboard: boolean
      dragAndDrop: boolean
      hook: Ink.Options.Hooks.Files
      injectMarkup: boolean
      types: string[]
    }

    export interface Hooks {
      afterUpdate: Ink.Options.Hooks.AfterUpdate
      beforeUpdate: Ink.Options.Hooks.BeforeUpdate
    }

    export namespace Hooks {
      export type AfterUpdate = (doc: string) => void
      export type BeforeUpdate = (doc: string) => void
      export type Files = (files: FileList) => void
    }

    export interface Interface {
      [Ink.Values.Extensions.Appearance]: Ink.Options.Extensions[Ink.Values.Extensions.Appearance]
      [Ink.Values.Extensions.Attribution]: Ink.Options.Extensions[Ink.Values.Extensions.Attribution]
      [Ink.Values.Extensions.Images]: Ink.Options.Extensions[Ink.Values.Extensions.Images]
      [Ink.Values.Extensions.Spellcheck]: Ink.Options.Extensions[Ink.Values.Extensions.Spellcheck]
    }
  }

  export namespace Values {
    export enum Appearance {
      Dark = 'dark',
      Light = 'light',
    }

    export enum Extensions {
      Appearance = 'appearance',
      Attribution = 'attribution',
      Images = 'images',
      Spellcheck = 'spellcheck',
    }
  }
}

export const InkValues = Ink.Values

export default Ink
