import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

// import babel from 'vite-plugin-babel'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      lib: {
        entry: {
          'index': join(root, './src/index.ts'),
          'dom-expressions': join(root, './src/dom-expressions.ts'),
        },
      },
      minify: false,
      rollupOptions: {
        external: [
          /@vue\/reactivity/,
        ],
        output: [
          {
            esModule: true,
            exports: 'named',
            format: 'es',
          },
        ],
      },
      sourcemap: true,
    },
    esbuild: {
      include: /\.ts$/,
    },
    resolve: {
      alias: {
        rxcore: join(root, './src/dom-expressions'),
      },
    },
    ssr: {
      noExternal: /.*/,
    },
  }
})
