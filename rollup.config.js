import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/es',
      format: 'es',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'auto',
    },
  ],
  plugins: [
    nodeResolve(),
    typescript(),
  ],
}
