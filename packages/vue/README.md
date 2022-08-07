# ink-mde/vue

The [`ink-mde`](https://github.com/voracious/ink-mde) library packaged as a Vue 3 component.

## Install the package

This package is a separate module that ships with `ink-mde`, so you install it the same way.

```bash
# npm
npm i ink-mde

# pnpm
pnpm i ink-mde

# yarn
yarn add ink-mde
```

## Getting Started

The Vue 3 component supports all options that `ink-mde` supports.

### Minimal setup

```vue
<template>
  <Ink v-model="markdown" />
</template>

<script lang="ts" setup>
import Ink from 'ink-mde/vue'
import { ref } from 'vue'

const markdown = ref('# Hello, World!')
</script>
```

### Configuration options

The `options` prop is an [`ink-mde` options](https://github.com/voracious/ink-mde) object.

```vue
<template>
  <input v-model="options.interface.appearance" type="radio" value="dark"> dark
  <input v-model="options.interface.appearance" type="radio" value="light"> light
  <Ink v-model="markdown" :options="options" />
</template>

<script lang="ts" setup>
import Ink from 'ink-mde/vue'
import { reactive, ref } from 'vue'

const markdown = ref('# Hello, World!')
const options = reactive({
  interface: {
    appearance: 'dark',
  },
})
</script>
```
