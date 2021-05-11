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

| CSS Variable                    | Description                            | Default Value |
| ----                            | ----                                   | ----          |
| `--ink-font-family`      | Proportional font used for normal text | `sans-serif`  |
| `--ink-font-family-mono` | Monospace font used for code           | `monospace`   |

### Images

When the `renderImages: true` config is used, some image properties can be changed with CSS variables.

| CSS Variable                        | Description                 | Default Value        |
| ----                                | ----                        | ----                 |
| `--ink-image-backdrop-color` | Color of the image backdrop | `rgba(0, 0, 0, 0.3)` |
| `--ink-image-max-height`     | Max height of the image     | `20rem`              |

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

| Tag   | Override Variables | Default |
| ----  | ----               | ----    |
| atom  | --ink-atom | #d19a66 |
| meta  | --ink-meta | #abb2bf |
| processingInstruction | --ink-processingInstruction | #abb2bf |
| comment | --ink-comment | #abb2bf |
| name | --ink-name | #d19a66 |
| labelName | --ink-labelName<br>--ink-name | #abb2bf |
| propertyName | --ink-propertyName<br>--ink-name | #96c0d8 |
| propertyName (definition) | --ink-propertyName-definition<br>--ink-propertyName<br>--ink-name | #e06c75 |
| variableName | --ink-variableName<br>--ink-name | #e06c75 |
| variableName (definition) | --ink-variableName-definition<br>--ink-variableName<br>--ink-name | #e5c07b |
| variableName (local) | --ink-variableName-local<br>--ink-variableName<br>--ink-name | #d19a66 |
| variableName (special) | --ink-variableName-special<br>--ink-variableName<br>--ink-name | inherit |
| heading | --ink-heading | #e06c75 |
| heading1 | --ink-heading1<br>--ink-heading | #e06c75 |
| heading2 | --ink-heading2<br>--ink-heading | #e06c75 |
| heading3 | --ink-heading3<br>--ink-heading | #e06c75 |
| heading4 | --ink-heading4<br>--ink-heading | #e06c75 |
| heading5 | --ink-heading5<br>--ink-heading | #e06c75 |
| heading6 | --ink-heading6<br>--ink-heading | #e06c75 |
| keyword | --ink-keyword | #c678dd |
| number | --ink-number | #d19a66 |
| operator | --ink-operator | #96c0d8 |
| punctuation | --ink-punctuation | #36454f |
| link | --ink-link | #96c0d8 |
| url | --ink-url | #96c0d8 |
| string | --ink-string | #98c379 |
| string (special) | --ink-string-special<br>--ink-string | inherit |
| emphasis | --ink-emphasis | inherit |
| strong | --ink-strong | inherit |
