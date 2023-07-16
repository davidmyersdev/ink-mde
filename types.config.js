import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import alias from '@rollup/plugin-alias'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  input: join(root, './tmp/types/src/index.d.ts'),
  output: [
    {
      file: join(root, './dist/client.d.ts'),
      format: 'es',
    },
    {
      file: join(root, './dist/index.d.ts'),
      format: 'es',
    },
  ],
  plugins: [
    alias({
      entries: [
        {
          find: '/src',
          replacement: join(root, './tmp/types/src'),
        },
        {
          find: '/types',
          replacement: join(root, './tmp/types/types'),
        },
      ],
    }),
    dts(),
  ],
})
