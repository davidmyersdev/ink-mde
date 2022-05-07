/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format) => `ink.${format}.js`,
      name: 'Ink',
    },
    rollupOptions: {
      output: [{
        esModule: true,
        exports: 'named',
        format: 'es',
      }, {
        format: 'umd',
        inlineDynamicImports: true,
        interop: 'esModule',
        exports: 'named',
      }],
    },
  },
  plugins: [
    svelte({ emitCss: false }),
  ],
  resolve: {
    alias: {
      '/types': path.resolve(__dirname, './types'),
      '@writewithocto/ink': path.resolve(__dirname, './src/index'),
    },
  },
})
