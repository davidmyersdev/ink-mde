import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidjs from 'vite-plugin-solid'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig(({ ssrBuild }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: ssrBuild ? './ssr/server.tsx' : './ssr/client.tsx',
        // The fileName field is not actually used for the SSR build name, but that might change in the future.
        fileName: ssrBuild ? 'server' : 'client',
        formats: [],
      },
      outDir: 'dist/ssr',
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
        '/': resolve(__dirname, '..'),
      },
      conditions: [
        'browser',
        'node',
        'solid',
      ],
    },
  }
})
