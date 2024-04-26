/// <reference types="vitest" />

import { resolve } from 'node:path'
import * as babel from '@babel/core'
import macros from 'unplugin-macros/vite'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
// import babel from 'vite-plugin-babel'
import solidJs from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: './src/index.tsx',
        fileName: 'client',
      },
      minify: false,
      rollupOptions: {
        external: [
          /@vue\/reactivity/,
          // /\/lib\/jsx-runtime/,
        ],
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
    esbuild: {
      // include: /\.ts$/,
      // jsxSideEffects: false,
      // // jsxInject: `import { h } from '/lib/jsx' with { type: 'macro' }`,
      // jsxFactory: 'h',
      // jsxFragment: 'Fragment',
      jsx: 'automatic',
      jsxImportSource: '/lib/jsx',
    },
    plugins: [
      // externalizeDeps(),
      // solidJs({
      //   solid: {
      //     generate: isSsrBuild ? 'ssr' : 'dom',
      //     omitNestedClosingTags: false,
      //   },
      // }),
      // {
      //   name: 'babel-jsx-stuff',
      //   enforce: 'pre',
      //   transform(code, id) {
      //     if (id.endsWith('.tsx')) {
      //       return babel.transformSync(code, {
      //         // presets: [
      //         //   ['@babel/preset-env'],
      //         // ],
      //         plugins: [
      //           ['jsx-dom-expressions', {
      //             moduleName: '/lib/jsx-runtime/dist/dom-expressions',
      //             generate: isSsrBuild ? 'ssr' : 'dom',
      //           }],
      //         ],
      //       })
      //     }
      //   },
      // },
      // babel({
      //   include: /\.tsx$/,
      //   babelConfig: {
      //     plugins: [
      //       ['jsx-dom-expressions', { moduleName: './lib/jsx' }],
      //     ],
      //   },
      // }),
      // macros({
      //   enforce: 'post',
      // }),
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
      noExternal: /.*/,
      resolve: {
        conditions: [
          'node',
          'solid',
        ],
      },
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
