[![latest tag](https://img.shields.io/github/v/tag/writewithocto/hybrid-mde?color=blue&label=latest%20tag&sort=semver)](https://github.com/writewithocto/hybrid-mde/releases)
[![license](https://img.shields.io/github/license/writewithocto/hybrid-mde)](https://github.com/writewithocto/hybrid-mde/blob/master/LICENSE)
[![open issues](https://img.shields.io/github/issues-raw/writewithocto/hybrid-mde)](https://github.com/writewithocto/hybrid-mde/issues)

# hybrid-mde

A plain-text javascript markdown editor that renders text formatting live and in-place without the need for a preview pane. Built on CodeMirror 6.

![](https://i.imgur.com/S0SQEGc.png)

## Install

```shell
npm install --save hybrid-mde
```

## Usage

### Minimal Configuration

Create a basic editor without worrying about state.

```js
import Hybrid from 'hybrid-mde'

Hybrid(document.getElementById('editor'))
```

### State Tracking

Supply some initial data and set a callback to track data changes.

```js
import Hybrid from 'hybrid-mde'

Hybrid(document.getElementById('editor'), {
  value: '# Start with some text',
  onChange: (value) => {
    console.log('Doc edited:', value)
  },
})
```

### Hot-swap Docs

Swap the active doc without rebuilding the whole DOM or re-supplying configuration.

```js
import Hybrid from 'hybrid-mde'

const editor = Hybrid(document.getElementById('editor'))

// user performs some action to change the active doc...
editor.setDoc('# New Doc')
```

## Customization

### Fonts

The fonts for `hybrid-mde` can be customized with CSS variables.

| CSS Variable                    | Description                            | Default Value |
| ----                            | ----                                   | ----          |
| `--hybrid-mde-font-family`      | Proportional font used for normal text | `sans-serif`  |
| `--hybrid-mde-font-family-mono` | Monospace font used for code           | `monospace`   |

### Images

When the `renderImages: true` config is used, some image properties can be changed with CSS variables.

| CSS Variable                        | Description                 | Default Value        |
| ----                                | ----                        | ----                 |
| `--hybrid-mde-image-backdrop-color` | Color of the image backdrop | `rgba(0, 0, 0, 0.3)` |
| `--hybrid-mde-image-max-height`     | Max height of the image     | `20rem`              |

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
  --hybrid-mde-heading: #111;
}

.dark {
  --hybrid-mde-heading: #eee;
}
```

#### Tags / CSS Variable Reference

Tags are applied to the code by the CodeMirror language parsers. This means things could possibly be a bit off depending on the language being highlighted. If you think something is being incorrectly highlighted, feel free to [open an issue](https://github.com/writewithocto/hybrid-mde/issues). The CSS variables listed under a given Tag are in order of highest-to-lowest precedence. For more information about Tags, check out the [CodeMirror Tag reference](https://codemirror.net/6/docs/ref/#highlight.tags).

| Tag   | Override Variables | Default |
| ----  | ----               | ----    |
| atom  | --hybrid-mde-atom | #d19a66 |
| meta  | --hybrid-mde-meta | #abb2bf |
| processingInstruction | --hybrid-mde-processingInstruction | #abb2bf |
| comment | --hybrid-mde-comment | #abb2bf |
| name | --hybrid-mde-name | #d19a66 |
| labelName | --hybrid-mde-labelName<br>--hybrid-mde-name | #abb2bf |
| propertyName | --hybrid-mde-propertyName<br>--hybrid-mde-name | #96c0d8 |
| propertyName (definition) | --hybrid-mde-propertyName-definition<br>--hybrid-mde-propertyName<br>--hybrid-mde-name | #e06c75 |
| variableName | --hybrid-mde-variableName<br>--hybrid-mde-name | #e06c75 |
| variableName (definition) | --hybrid-mde-variableName-definition<br>--hybrid-mde-variableName<br>--hybrid-mde-name | #e5c07b |
| variableName (local) | --hybrid-mde-variableName-local<br>--hybrid-mde-variableName<br>--hybrid-mde-name | #d19a66 |
| variableName (special) | --hybrid-mde-variableName-special<br>--hybrid-mde-variableName<br>--hybrid-mde-name | inherit |
| heading | --hybrid-mde-heading | #e06c75 |
| heading1 | --hybrid-mde-heading1<br>--hybrid-mde-heading | #e06c75 |
| heading2 | --hybrid-mde-heading2<br>--hybrid-mde-heading | #e06c75 |
| heading3 | --hybrid-mde-heading3<br>--hybrid-mde-heading | #e06c75 |
| heading4 | --hybrid-mde-heading4<br>--hybrid-mde-heading | #e06c75 |
| heading5 | --hybrid-mde-heading5<br>--hybrid-mde-heading | #e06c75 |
| heading6 | --hybrid-mde-heading6<br>--hybrid-mde-heading | #e06c75 |
| keyword | --hybrid-mde-keyword | #c678dd |
| number | --hybrid-mde-number | #d19a66 |
| operator | --hybrid-mde-operator | #96c0d8 |
| punctuation | --hybrid-mde-punctuation | #36454f |
| link | --hybrid-mde-link | #96c0d8 |
| url | --hybrid-mde-url | #96c0d8 |
| string | --hybrid-mde-string | #98c379 |
| string (special) | --hybrid-mde-string-special<br>--hybrid-mde-string | inherit |
| emphasis | --hybrid-mde-emphasis | inherit |
| strong | --hybrid-mde-strong | inherit |
