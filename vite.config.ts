/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import solidjs from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: './src/index.tsx',
        fileName: 'client',
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
            format: 'cjs',
            inlineDynamicImports: true,
            interop: 'esModule',
          },
        ],
      },
      sourcemap: true,
      target: 'esnext',
    },
    plugins: [
      externalizeDeps({
        except: [
          /solid-js/,
        ],
      }),
      solidjs({
        exclude: [
          './src/ui/components/details/index.tsx',
          './src/ui/components/editor/index.tsx',
          './src/ui/components/Show.tsx',
          './src/ui/components/test.tsx',
        ],
        solid: {
          generate: isSsrBuild ? 'ssr' : 'dom',
          hydratable: true,
          omitNestedClosingTags: false,
        },
      }),
      {
        name: 'testing',
        enforce: 'pre',
        config() {
          return {
            esbuild: {
              include: [
                /\.ts$/,
                './src/ui/components/details/index.tsx',
                './src/ui/components/editor/index.tsx',
                './src/ui/components/Show.tsx',
                './src/ui/components/test.tsx',
              ],
            },
          }
        },
      },
    ],
    resolve: {
      alias: {
        '/': resolve(__dirname, './'),
        'ink-mde': resolve(__dirname, './src/index'),
      },
      conditions: [
        'browser',
        'node',
        'solid',
      ],
    },
    ssr: {
      noExternal: true,
    },
    test: {
      clearMocks: true,
      deps: {
        inline: [
          'solid-js',
        ],
      },
      environment: 'jsdom',
      include: [
        './examples/*.test.ts',
        './test/unit/**/*.test.ts',
      ],
    },
  }
})
