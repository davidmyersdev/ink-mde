import path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'Ink',
      fileName: (format) => `ink.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      output: [{
        esModule: true,
        exports: 'named',
        format: 'es',
      }, {
        format: 'umd',
        inlineDynamicImports: true,
        interop: 'esModule',
        exports: 'named',
      }]
    }
  },
  plugins: [
    svelte(),
  ],
  resolve: {
    alias: {
      '/types': path.resolve(__dirname, './types'),
    },
  },
})
