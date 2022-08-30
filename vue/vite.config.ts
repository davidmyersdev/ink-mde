import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/InkMde.vue'),
      fileName: 'Client',
      formats: [],
    },
    outDir: 'dist/vue',
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
    sourcemap: true,
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
