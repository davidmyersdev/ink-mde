/// <reference types="vitest" />

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
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
  },
  optimizeDeps: {
    exclude: Object.keys(dependencies),
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
