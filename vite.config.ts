/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidjs from 'vite-plugin-solid'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig(({ ssrBuild }) => {
  return {
    build: {
      emptyOutDir: !ssrBuild,
      lib: {
        entry: './src/index.tsx',
        fileName: 'client',
        formats: [],
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
      externalizeDeps(),
      solidjs({
        solid: {
          generate: ssrBuild ? 'ssr' : 'dom',
          hydratable: true,
        },
      }),
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
    test: {
      deps: {
        inline: [
          'solid-js',
        ],
      },
      transformMode: {
        web: [/\.tsx?$/],
      },
    },
  }
})
