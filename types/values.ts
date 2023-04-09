export enum Appearance {
  Auto = 'auto',
  Dark = 'dark',
  Light = 'light',
}

export enum Extensions {
  Appearance = 'appearance',
  Attribution = 'attribution',
  Autocomplete = 'autocomplete',
  Images = 'images',
  ReadOnly = 'readonly',
  Spellcheck = 'spellcheck',
  Vim = 'vim',
}

export enum Markup {
  Bold = 'bold',
  Code = 'code',
  CodeBlock = 'code_block',
  Heading = 'heading',
  Image = 'image',
  Italic = 'italic',
  Link = 'link',
  List = 'list',
  OrderedList = 'ordered_list',
  Quote = 'quote',
  TaskList = 'task_list',
}

export enum PluginType {
  Completion = 'completion',
  Default = 'default',
  Grammar = 'grammar',
  Language = 'language',
}

export enum Selection {
  End = 'end',
  Start = 'start',
}

export const appearanceTypes = {
  auto: 'auto',
  dark: 'dark',
  light: 'light',
}

export const pluginTypes = {
  completion: 'completion',
  default: 'default',
  grammar: 'grammar',
  language: 'language',
} as const
