import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
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
  ],
}
