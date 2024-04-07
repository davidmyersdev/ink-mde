import { type CompletionSource } from '@codemirror/autocomplete'
import { HighlightStyle, type LanguageDescription, type TagStyle, syntaxHighlighting } from '@codemirror/language'
import { type Extension } from '@codemirror/state'
import { type MarkdownExtension } from '@lezer/markdown'
import { type Options } from '/src/index'

export type CodeMirrorCompletionSource = CompletionSource
export type CodeMirrorExtension = Extension
export type CodeMirrorLanguageDescription = LanguageDescription
export type CodeMirrorMarkdownExtension = MarkdownExtension

export type CompletionSourcePlugin = {
  /**
   * A hook for adding one or more CodeMirror
   * [`CompletionSource`](https://codemirror.net/docs/ref/#autocomplete.CompletionSource)
   * instances to the editor. These sources will be provided directly to the
   * `@codemirror/autocomplete` extension (when enabled) to prompt the user
   * with custom completion options.
   */
  addCompletionSources: () => CodeMirrorCompletionSource | CodeMirrorCompletionSource[],
}

export type ExtensionPlugin = {
  /**
   * A hook for adding one or more CodeMirror
   * [`Extension`](https://codemirror.net/docs/ref/#state.Extension) instances
   * to the editor. These extensions will be provided directly to the
   * [`EditorState`](https://codemirror.net/docs/ref/#state.EditorState)
   * instance used by `ink-mde`.
   */
  addExtensions: () => CodeMirrorExtension | CodeMirrorExtension[],
}

export type LanguageDescriptionPlugin = {
  /**
   * A hook for adding one or more CodeMirror
   * [`LanguageDescription`](https://codemirror.net/docs/ref/#language.LanguageDescription)
   * instances to the editor. These descriptions will be provided directly to the
   * `@codemirror/lang-markdown` extension to enable syntax highlighting for
   * more languages in code blocks.
   */
  addLanguageDescriptions: () => CodeMirrorLanguageDescription | CodeMirrorLanguageDescription[],
}

export type MarkdownExtensionPlugin = {
  /**
   * A hook for adding one or more CodeMirror
   * [`MarkdownExtension`](https://github.com/lezer-parser/markdown?tab=readme-ov-file#user-content-markdownextension)
   * instances to the editor. These extensions will be provided directly to the
   * `@codemirror/lang-markdown` extension to enable additional Markdown
   * features, such as new grammars.
   */
  addMarkdownExtensions: () => CodeMirrorMarkdownExtension | CodeMirrorMarkdownExtension[],
}

export type InkPlugin = CompletionSourcePlugin | ExtensionPlugin | LanguageDescriptionPlugin | MarkdownExtensionPlugin

export const definePlugin = (plugin: InkPlugin): InkPlugin => plugin

export const getCompletionSources = (plugins: Options.Plugin[]): CompletionSource[] => {
  return plugins.flatMap((plugin) => {
    if ('addCompletionSources' in plugin) {
      return plugin.addCompletionSources()
    }

    if ('type' in plugin && plugin.type === 'completion') {
      return plugin.value
    }

    return []
  })
}

export const getExtensions = (plugins: Options.Plugin[]): Extension[] => {
  return plugins.flatMap((plugin) => {
    if ('addExtensions' in plugin) {
      return plugin.addExtensions()
    }

    if ('type' in plugin && plugin.type === 'default') {
      return plugin.value
    }

    return []
  })
}

export const getLanguageDescriptions = (plugins: Options.Plugin[]): LanguageDescription[] => {
  return plugins.flatMap((plugin) => {
    if ('addLanguageDescriptions' in plugin) {
      return plugin.addLanguageDescriptions()
    }

    if ('type' in plugin && plugin.type === 'language') {
      return plugin.value
    }

    return []
  })
}

export const getMarkdownExtensions = (plugins: Options.Plugin[]): MarkdownExtension[] => {
  return plugins.flatMap((plugin) => {
    if ('addMarkdownExtensions' in plugin) {
      return plugin.addMarkdownExtensions()
    }

    if ('type' in plugin && plugin.type === 'grammar') {
      return plugin.value
    }

    return []
  })
}

export const splitPlugins = (plugins: Options.Plugin[]): {
  completionSources: CompletionSource[],
  extensions: Extension[],
  languageDescriptions: LanguageDescription[],
  markdownExtensions: MarkdownExtension[],
} => {
  const completionSources = getCompletionSources(plugins)
  const extensions = getExtensions(plugins)
  const languageDescriptions = getLanguageDescriptions(plugins)
  const markdownExtensions = getMarkdownExtensions(plugins)

  return {
    completionSources,
    extensions,
    languageDescriptions,
    markdownExtensions,
  }
}

export const syntaxHighlighter = ({ tag, class: className, ...styles }: TagStyle): Extension => {
  const extensions: Extension[] = []

  if (className) {
    extensions.push(
      syntaxHighlighting(
        HighlightStyle.define([
          {
            tag,
            class: className,
          },
        ]),
      ),
    )
  }

  if (styles) {
    extensions.push(
      syntaxHighlighting(
        HighlightStyle.define([
          {
            tag,
            ...styles,
          },
        ]),
      ),
    )
  }

  return extensions
}
