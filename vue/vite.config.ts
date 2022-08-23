import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname),
  build: {
    lib: {
      entry: resolve(__dirname, 'src/InkMde.vue'),
      fileName: 'InkMde',
      formats: [],
    },
    outDir: '../dist/vue',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'ink-mde',
        'ink-mde/ssr',
        'vue',
      ],
      output: [
        {
          esModule: true,
          exports: 'named',
          format: 'es',
          globals: {
            vue: 'Vue',
          },
        },
        {
          exports: 'named',
          format: 'cjs',
          inlineDynamicImports: true,
          interop: 'esModule',
          globals: {
            vue: 'Vue',
          },
        },
      ],
    },
  },
  plugins: [
    externalizeDeps(),
    vue(),
  ],
})
