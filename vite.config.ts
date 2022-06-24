/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: (format) => {
        if (format === 'es') { return 'ink.js' }
        if (format === 'umd') { return 'ink.cjs' }

        return `ink.${format}.cjs`
      },
      name: 'ink',
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
          format: 'umd',
          inlineDynamicImports: true,
          interop: 'esModule',
        },
      ],
    },
  },
  plugins: [
    svelte({ emitCss: false }),
  ],
  resolve: {
    alias: {
      '/types': resolve(__dirname, './types'),
      '@writewithocto/ink': resolve(__dirname, './src/index'),
    },
  },
})
