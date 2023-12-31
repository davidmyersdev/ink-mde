import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

const root = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: join(root, './src/index.ts'),
        fileName: isSsrBuild ? 'index' : 'client',
      },
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
    root,
    server: {
      port: 5173,
    },
  }
})
