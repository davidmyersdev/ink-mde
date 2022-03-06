[![latest tag](https://img.shields.io/github/v/tag/writewithocto/ink?color=blue&label=latest%20tag&sort=semver)](https://github.com/writewithocto/ink/releases)
[![license](https://img.shields.io/github/license/writewithocto/ink)](https://github.com/writewithocto/ink/blob/master/LICENSE)
[![open issues](https://img.shields.io/github/issues-raw/writewithocto/ink)](https://github.com/writewithocto/ink/issues)

# Ink

The flexible TypeScript Markdown editor that powers https://octo.app.

![](https://i.imgur.com/1tOS335.png)

## Installation

```bash
# yarn
yarn add @writewithocto/ink

# npm
npm install --save @writewithocto/ink
```

## Usage

### No configuration needed

Mount the component and grab some data when you need it (e.g. on a form submit).

```ts
import ink from '@writewithocto/ink'
import type * as Ink from '@writewithocto/ink'

const instance: Ink.Instance = ink(document.getElementById('editor'))

// When a user submits a form, we can pull the markdown text from Ink.
const markdown: string = instance.doc()
```

### Listen for changes with hooks

To listen for changes, we can specify hooks.

```ts
import ink from '@writewithocto/ink'
import type * as Ink from '@writewithocto/ink'

const options: Ink.Options = {
  doc: '# Start with some text',
  hooks: {
    beforeUpdate(doc: string) => {
      console.log('About to update with:', doc)
    },
    afterUpdate(doc: string) => {
      console.log('Updated with:', doc)
    },
  },
}

const instance: Ink.Instance = ink(document.getElementById('editor'), options)
```

### Replace the current doc with another

To replace the current doc without rebuilding the UI, we can use the `Ink.Instance.load()` method. This is useful for interfaces where we want to present multiple docs to a user and let them switch between docs without leaving the page.

```ts
import ink from '@writewithocto/ink'
import type * as Ink from '@writewithocto/ink'

const instance: Ink.Instance = ink(document.getElementById('editor'))

// Load a new doc without preserving the previous state, history, etc.
instance.load('# New Doc')
```

## Full Configuration Options

| Option                          | Description                                | Type                                        | Default    |
| ----                            | ----                                       | ----                                        | ----       |
| `options.doc`                   | Initialize the editor with an existing doc | `string`                                    | `''`       |
| `options.files.dragAndDrop`     | Enable drag-and-drop file uploads          | `boolean`                                   | `false`    |
| `options.files.handler`         | Handle file uploads (not handled by Ink)   | `(files: FileList) => Promise<any> \| void` | `() => {}` |
| `options.hooks.afterUpdate`     | Run some code after the doc is updated     | `(doc: string) => void`                     | `() => {}` |
| `options.hooks.beforeUpdate`    | Run some code before the doc is updated    | `(doc: string) => void`                     | `() => {}` |
| `options.interface.appearance`  | Change the editor theme                    | `'dark' \| 'light'`                         | `'dark'`   |
| `options.interface.attribution` | Show the "Powered by Ink" attribution      | `boolean`                                   | `true`     |
| `options.interface.images`      | Render images in the editor                | `boolean`                                   | `false`    |
| `options.interface.spellcheck`  | Enable spellcheck                          | `boolean`                                   | `true`     |
| `options.selections`            | Initialize the editor with selections      | `Ink.Editor.Selection[]`                    | `[]`       |

## Customization

Many styles can be customized with CSS custom properties (aka variables).

| CSS Custom Property                           | CSS Property       | Default (Dark) | Override (Light) |
| ----                                          | ----               | ----           | ----             |
| `--ink-all-accent-color`                      | `color`            | `#e06c75`      |                  |
| `--ink-all-border-radius`                     | `border-radius`    | `0.25rem`      |                  |
| `--ink-all-color`                             | `color`            | `#fafafa`      | `#171717`        |
| `--ink-all-font-family`                       | `font-family`      | `sans-serif`   |                  |
| `--ink-block-background-color`                | `background-color` | `#121212`      | `#ededed`        |
| `--ink-block-max-height`                      | `max-height`       | `20rem`        |                  |
| `--ink-block-padding`                         | `padding`          | `0.5rem`       |                  |
| `--ink-monospace-font-family`                 | `font-family`      | `monospace`    |                  |
| **Syntax Highlighting**                       |                    |                |                  |
| `--ink-syntax-atom-color`                     | `color`            | `#d19a66`      |                  |
| `--ink-syntax-comment-color`                  | `color`            | `#abb2bf`      |                  |
| `--ink-syntax-emphasis-color`                 | `color`            | `inherit`      |                  |
| `--ink-syntax-emphasis-font-style`            | `font-style`       | `italic`       |                  |
| `--ink-syntax-heading-color`                  | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading-font-size`              | `font-size`        | `1em`          |                  |
| `--ink-syntax-heading-font-weight`            | `font-weight`      | `600`          |                  |
| `--ink-syntax-heading1-color`                 | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading1-font-size`             | `font-size`        | `1.6em`        |                  |
| `--ink-syntax-heading1-font-weight`           | `font-weight`      | `600`          |                  |
| `--ink-syntax-heading2-color`                 | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading2-font-size`             | `font-size`        | `1.5em`        |                  |
| `--ink-syntax-heading2-font-weight`           | `font-weight`      | `600`          |                  |
| `--ink-syntax-heading3-color`                 | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading3-font-size`             | `font-size`        | `1.4em`        |                  |
| `--ink-syntax-heading3-font-weight`           | `font-weight`      | `600`          |                  |
| `--ink-syntax-heading4-color`                 | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading4-font-size`             | `font-size`        | `1.3em`        |                  |
| `--ink-syntax-heading4-font-weight`           | `font-weight`      | `600`          |                  |
| `--ink-syntax-heading5-color`                 | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading5-font-size`             | `font-size`        | `1.2em`        |                  |
| `--ink-syntax-heading5-font-weight`           | `font-weight`      | `600`          |                  |
| `--ink-syntax-heading6-color`                 | `color`            | `#e06c75`      |                  |
| `--ink-syntax-heading6-font-size`             | `font-size`        | `1.1em`        |                  |
| `--ink-syntax-heading6-font-weight`           | `font-weight`      | `600`          |                  |
| `--ink-syntax-keyword-color`                  | `color`            | `#c678dd`      |                  |
| `--ink-syntax-link-color`                     | `color`            | `#96c0d8`      |                  |
| `--ink-syntax-meta-color`                     | `color`            | `#abb2bf`      |                  |
| `--ink-syntax-name-color`                     | `color`            | `#d19a66`      |                  |
| `--ink-syntax-name-label-color`               | `color`            | `#abb2bf`      |                  |
| `--ink-syntax-name-property-color`            | `color`            | `#96c0d8`      |                  |
| `--ink-syntax-name-property-definition-color` | `color`            | `#e06c75`      |                  |
| `--ink-syntax-name-variable-color`            | `color`            | `#e06c75`      |                  |
| `--ink-syntax-name-variable-definition-color` | `color`            | `#e5c07b`      |                  |
| `--ink-syntax-name-variable-local-color`      | `color`            | `#d19a66`      |                  |
| `--ink-syntax-name-variable-special-color`    | `color`            | `inherit`      |                  |
| `--ink-syntax-number-color`                   | `color`            | `#d19a66`      |                  |
| `--ink-syntax-operator-color`                 | `color`            | `#96c0d8`      |                  |
| `--ink-syntax-processing-instruction-color`   | `color`            | `#36454f`      |                  |
| `--ink-syntax-punctuation-color`              | `color`            | `#abb2bf`      |                  |
| `--ink-syntax-strikethrough-color`            | `color`            | `inherit`      |                  |
| `--ink-syntax-strikethrough-text-decoration`  | `text-decoration`  | `line-through` |                  |
| `--ink-syntax-string-color`                   | `color`            | `#98c379`      |                  |
| `--ink-syntax-string-special-color`           | `color`            | `inherit`      |                  |
| `--ink-syntax-strong-color`                   | `color`            | `inherit`      |                  |
| `--ink-syntax-strong-font-weight`             | `font-weight`      | `600`          |                  |
| `--ink-syntax-url-color`                      | `color`            | `#96c0d8`      |                  |

## Support

Your support is appreciated. Here are some ways you can help. ♥️

### Leave the Attribution enabled

There is a small `Powered by Ink` attribution in the bottom-right corner of all Ink instances by default. Ink is a free MIT-licensed library under independent development, and that attribution helps to increase awareness of this project.

### Provide Feedback

Your feedback is immensely important for building Ink into a library that we all love. Consider [starting a discussion](https://github.com/writewithocto/octo/discussions) under [Octo](https://github.com/writewithocto/octo) if you have a question or just want to chat about ideas!

### Open a Pull Request

If you feel comfortable tackling [an existing issue](https://github.com/writewithocto/ink/issues), please consider opening a Pull Request! I am happy to introduce you to the codebase and work with you to get it merged!

### Donate

Donations help support the development of Ink.

- [GitHub Sponsors](https://github.com/sponsors/voraciousdev)
- [Patreon](https://patreon.com/voraciousdev)
- [Ko-Fi](https://ko-fi.com/voraciousdev)
- [Buy Me a Coffee](https://www.buymeacoffee.com/voraciousdev)
