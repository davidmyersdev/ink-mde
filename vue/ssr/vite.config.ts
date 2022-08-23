import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'InkMde.vue'),
      // The fileName field is not actually used for the SSR build name, but that might change in the future.
      fileName: 'Client',
      formats: [],
    },
    outDir: 'dist/vue/ssr',
    rollupOptions: {
      external: [
        /^ink-mde(?:\/.+)?$/,
        /^vue(?:\/.+)?$/,
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
  resolve: {
    conditions: [
      'browser',
      'node',
    ],
  },
})
