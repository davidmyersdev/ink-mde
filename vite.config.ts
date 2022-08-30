/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidjs from 'vite-plugin-solid'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.tsx'),
      fileName: (format) => {
        if (format === 'cjs')
          return 'ink.cjs'
        if (format === 'es')
          return 'ink.js'

        return `ink.${format}.js`
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: [
        {
          esModule: true,
          exports: 'named',
          format: 'es',
        },
        {
          exports: 'named',
          format: 'cjs',
          inlineDynamicImports: true,
          interop: 'esModule',
        },
      ],
    },
    target: 'esnext',
  },
  plugins: [
    externalizeDeps(),
    solidjs(),
  ],
  resolve: {
    alias: {
      '/test': resolve(__dirname, './test'),
      '/types': resolve(__dirname, './types'),
      'ink-mde': resolve(__dirname, './src/index'),
    },
    conditions: [
      'browser',
    ],
  },
  test: {
    deps: {
      inline: [
        'solid-js',
      ],
    },
    transformMode: {
      web: [/\.tsx?$/],
    },
  },
})
