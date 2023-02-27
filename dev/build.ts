import { build, splitVendorChunk } from 'vite'
import solidjs from 'vite-plugin-solid'

await build({
  build: {
    emptyOutDir: false,
    lib: {
      entry: './src/index.tsx',
      fileName: 'bundle',
    },
    rollupOptions: {
      output: [
        {
          exports: 'named',
          format: 'cjs',
          interop: 'auto',
          manualChunks: splitVendorChunk(),
          name: 'cjs',
        },
        {
          exports: 'auto',
          format: 'es',
          interop: 'auto',
          manualChunks: splitVendorChunk(),
          name: 'es',
        },
      ],
    },
  },
  configFile: false,
  plugins: [
    solidjs({
      solid: {
        generate: 'dom',
        hydratable: true,
      },
    }),
  ],
  resolve: {
    conditions: [
      'browser',
      'node',
      'solid',
    ],
  },
})
