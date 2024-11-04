/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: './src/index.tsx',
        fileName: isSsrBuild ? 'server' : 'client',
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
    ],
    resolve: {
      alias: {
        '/': resolve(__dirname, './'),
        'ink-mde': resolve(__dirname, './src/index'),
        'vanjs-core': isSsrBuild ? 'mini-van-plate/van-plate' : 'vanjs-core',
      },
      conditions: [
        'browser',
        'node',
      ],
    },
    ssr: {
      // noExternal: true,
    },
    test: {
      clearMocks: true,
      environment: 'jsdom',
      include: [
        './examples/*.test.ts',
        './test/unit/**/*.test.ts',
      ],
    },
  }
})
