[![latest tag](https://img.shields.io/github/v/tag/writewithocto/ink?color=blue&label=latest%20tag&sort=semver)](https://github.com/writewithocto/ink/releases)
[![license](https://img.shields.io/github/license/writewithocto/ink)](https://github.com/writewithocto/ink/blob/master/LICENSE)
[![open issues](https://img.shields.io/github/issues-raw/writewithocto/ink)](https://github.com/writewithocto/ink/issues)

# Ink

A plain-text javascript markdown editor that renders text formatting live and in-place without the need for a preview pane. Built on CodeMirror 6. Powers [octo.app](https://octo.app).

![](https://i.imgur.com/YefGzW8.png)

## Install

```shell
npm install --save @writewithocto/ink
```

## Usage

### Minimal Configuration

Create a basic editor without worrying about state.

```js
import ink from '@writewithocto/ink'

ink(document.getElementById('editor'))
```

### State Tracking

Supply some initial data and set a callback to track data changes.

```js
import ink from '@writewithocto/ink'

ink(document.getElementById('editor'), {
  doc: '# Start with some text',
  onChange: (doc) => {
    console.log('Doc edited:', doc)
  },
})
```

### Hot-swap Docs

Swap the active doc without rebuilding the whole DOM or re-supplying configuration.

```js
import ink from '@writewithocto/ink'

const editor = ink(document.getElementById('editor'))

// user performs some action to change the active doc...
editor.load('# New Doc')
```

## Customization

### Fonts

The fonts for `@writewithocto/ink` can be customized with CSS variables.

| CSS Variable             | Description                            | Default Value |
| ----                     | ----                                   | ----          |
| `--ink-font-family`      | Proportional font used for normal text | `sans-serif`  |
| `--ink-font-family-mono` | Monospace font used for code           | `monospace`   |

### Images

When the `renderImages: true` config is used, some image properties can be changed with CSS variables.

| CSS Variable                   | Description                           | Default Value (Dark) | Default Value (Light) |
| ----                           | ----                                  | ----                 | ----                  |
| `--ink-image-background-color` | Background color for image containers | `rgba(0, 0, 0, 0.2)` | `rgba(0, 0, 0, 0.05)` |
| `--ink-image-border-radius`    | Border radius for image containers    | `0.25rem`            | `0.25rem`             |
| `--ink-image-max-height`       | Max height for images                 | `20rem`              | `20rem`               |

### Code / Code Blocks

| CSS Variable                       | Description                      | Default Value (Dark) | Default Value (Light) |
| ----                               | ----                             | ----                 | ----                  |
| `--ink-code-background-color`      | Background color for inline code | `rgba(0, 0, 0, 0.2)` | `rgba(0, 0, 0, 0.05)` |
| `--ink-code-border-radius`         | Border radius for inline code    | `0.25rem`            | `0.25rem`             |
| `--ink-code-padding`               | Padding for inline code          | `0.125rem`           | `0.125rem`            |
| `--ink-codeblock-background-color` | Background color for code blocks | `rgba(0, 0, 0, 0.2)` | `rgba(0, 0, 0, 0.05)` |
| `--ink-codeblock-border-radius`    | Border radius for code blocks    | `0.25rem`            | `0.25rem`             |
| `--ink-codeblock-padding`          | Padding for code blocks          | `0.5rem`             | `0.5rem`              |

### Syntax Highlighting

The syntax highlighting theme is fully configurable through CSS variables. This means we can do things like...

- Change the heading colors
- Change all (or some) colors for individual light and dark modes
- Make adjustments for accessibility

Check out the examples below.

#### Examples

##### Light and Dark modes

Make headings dark for light mode and light for dark mode.

```css
.light {
  --ink-heading: #111;
}

.dark {
  --ink-heading: #eee;
}
```

#### Tags / CSS Variable Reference

Tags are applied to the code by the CodeMirror language parsers. This means things could possibly be a bit off depending on the language being highlighted. If you think something is being incorrectly highlighted, feel free to [open an issue](https://github.com/writewithocto/ink/issues). The CSS variables listed under a given Tag are in order of highest-to-lowest precedence. For more information about Tags, check out the [CodeMirror Tag reference](https://codemirror.net/6/docs/ref/#highlight.tags).

| Tag   | CSS Variable       | CSS Property | Default Value |
| ----  | ----               | ----         | ----      |
| atom  | `--ink-atom`       | `color`      | `#d19a66` |
| meta  | `--ink-meta`       | `color`      | `#abb2bf` |
| processingInstruction | `--ink-processingInstruction` | `color` | `#abb2bf` |
| comment | `--ink-comment` | `color` | `#abb2bf` |
| name | `--ink-name` | `color` | `#d19a66` |
| labelName | `--ink-labelName`<br>`--ink-name` | `color` | `#abb2bf` |
| propertyName | `--ink-propertyName`<br>`--ink-name` | `color` | `#96c0d8` |
| propertyName (definition) | `--ink-propertyName-definition`<br>`--ink-propertyName`<br>`--ink-name` | `color` | `#e06c75` |
| variableName | `--ink-variableName`<br>`--ink-name` | `color` | `#e06c75` |
| variableName (definition) | `--ink-variableName-definition`<br>`--ink-variableName`<br>`--ink-name` | `color` | `#e5c07b` |
| variableName (local) | `--ink-variableName-local`<br>`--ink-variableName`<br>`--ink-name` | `color` | `#d19a66` |
| variableName (special) | `--ink-variableName-special`<br>`--ink-variableName`<br>`--ink-name` | `color` | `inherit` |
| heading | `--ink-heading` | `color` | `#e06c75` |
| heading | `--ink-heading-weight` | `font-weight` | `600` |
| heading1 | `--ink-heading1`<br>`--ink-heading` | `color` | `#e06c75` |
| heading1 | `--ink-heading1-weight`<br>`--ink-heading-weight` | `font-weight` | `600` |
| heading2 | `--ink-heading2`<br>`--ink-heading` | `color` | `#e06c75` |
| heading1 | `--ink-heading2-weight`<br>`--ink-heading-weight` | `font-weight` | `600` |
| heading3 | `--ink-heading3`<br>`--ink-heading` | `color` | `#e06c75` |
| heading1 | `--ink-heading3-weight`<br>`--ink-heading-weight` | `font-weight` | `600` |
| heading4 | `--ink-heading4`<br>`--ink-heading` | `color` | `#e06c75` |
| heading1 | `--ink-heading4-weight`<br>`--ink-heading-weight` | `font-weight` | `600` |
| heading5 | `--ink-heading5`<br>`--ink-heading` | `color` | `#e06c75` |
| heading1 | `--ink-heading5-weight`<br>`--ink-heading-weight` | `font-weight` | `600` |
| heading6 | `--ink-heading6`<br>`--ink-heading` | `color` | `#e06c75` |
| heading1 | `--ink-heading6-weight`<br>`--ink-heading-weight` | `font-weight` | `600` |
| keyword | `--ink-keyword` | `color` | `#c678dd` |
| number | `--ink-number` | `color` | `#d19a66` |
| operator | `--ink-operator` | `color` | `#96c0d8` |
| punctuation | `--ink-punctuation` | `color` | `#36454f` |
| link | `--ink-link` | `color` | `#96c0d8` |
| url | `--ink-url` | `color` | `#96c0d8` |
| string | `--ink-string` | `color` | `#98c379` |
| string (special) | `--ink-string-special`<br>`--ink-string` | `color` | `inherit` |
| emphasis | `--ink-emphasis` | `color` | `inherit` |
| strikethrough | `--ink-strikethrough` | `color` | `inherit` |
| strong | `--ink-strong` | `color` | `inherit` |
| strong | `--ink-strong-weight` | `font-weight` | `600` |

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
