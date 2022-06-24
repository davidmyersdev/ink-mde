import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/Ink.vue'),
      name: 'Ink',
      fileName: (format) => {
        if (format === 'es') { return 'ink.js' }
        if (format === 'umd') { return 'ink.cjs' }

        return `ink.${format}.cjs`
      },
    },
    outDir: '../../dist/vue',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@writewithocto/ink', 'vue'],
      output: [
        {
          esModule: true,
          exports: 'named',
          format: 'es',
          globals: {
            vue: 'Vue'
          },
        },
        {
          exports: 'named',
          format: 'umd',
          inlineDynamicImports: true,
          interop: 'esModule',
          globals: {
            vue: 'Vue'
          },
        },
      ]
    }
  },
  plugins: [
    vue(),
  ],
})
