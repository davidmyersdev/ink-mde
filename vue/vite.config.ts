import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig(({ ssrBuild }) => {
  return {
    build: {
      emptyOutDir: !ssrBuild,
      lib: {
        entry: './src/InkMde.vue',
        fileName: 'client',
        formats: [],
      },
      outDir: './dist',
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
    root: resolve(__dirname),
    server: {
      port: 5173,
    },
  }
})
