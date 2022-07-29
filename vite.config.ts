/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidjs from 'vite-plugin-solid'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.tsx'),
      fileName: (format) => {
        if (format === 'cjs') { return 'ink.cjs' }
        if (format === 'es') { return 'ink.js' }

        return `ink.${format}.js`
      },
      // The global name for UMD or IIFE builds.
      name: 'Ink',
    },
    rollupOptions: {
      external: Object.keys(dependencies),
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
        {
          exports: 'named',
          format: 'umd',
          inlineDynamicImports: true,
          interop: 'esModule',
        },
      ],
    },
    target: 'esnext',
  },
  plugins: [
    solidjs(),
  ],
  resolve: {
    alias: {
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
  },
})
