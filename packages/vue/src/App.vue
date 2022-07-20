<template>
  <div class="app">
    <div class="toggle">
      <label>
        <input v-model="appearance" type="radio" value="auto">
        <span>auto</span>
      </label>
      <label>
        <input v-model="appearance" type="radio" value="dark">
        <span>dark</span>
      </label>
      <label>
        <input v-model="appearance" type="radio" value="light">
        <span>light</span>
      </label>
    </div>
    <Ink ref="editor" v-model="doc" :options="options" class="editor" />
  </div>
</template>

<script lang="ts" setup>
import { defineOptions } from 'ink-mde'
import { computed, ref, watch } from 'vue'
import Ink from '/src/components/Ink.vue'
import doc from '/src/assets/example.md?raw'

const appearance = ref<'auto' | 'dark' | 'light'>('auto')
const options = computed(() => defineOptions({
  files: {
    dragAndDrop: true,
    handler: (files: FileList) => {
      console.log({ files })
    },
  },
  interface: {
    appearance: appearance.value,
    images: true,
    toolbar: true,
  },
}))

watch(appearance, () => {
  document.documentElement.className = appearance.value
})
</script>
