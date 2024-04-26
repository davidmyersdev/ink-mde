# `@metaljs/h`

A simple, lightweight HyperScript-like abstraction for DOM composition with support for JSX and SSR out of the box. No virtual DOM, no diffing, just plain old DOM manipulation.

## Installation

```sh
npm install @metaljs/h
```

## Usage

### Without JSX

```ts
import { createElement } from '@metaljs/h'

const title = 'Hello, world!'
const content = 'This is a paragraph.'

const div = createElement(
  h('div', [
    h('h1', [title]),
    h('p', [content]),
  ]),
)

document.body.appendChild(div)
```

### With JSX

I recommend using Vite for its built-in JSX support.

```tsx
import { createElement } from '@metaljs/h'

const title = 'Hello, world!'
const content = 'This is a paragraph.'

const div = createElement(
  <div>
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
)

document.body.appendChild(div)
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "/lib/jsx"
  }
}
```

#### `vite.config.ts`

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '/lib/jsx',
  },
})
```
