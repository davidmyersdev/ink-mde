import preprocess from 'svelte-preprocess'

export default {
  compilerOptions: {
    accessors: true,
  },
  preprocess: preprocess({ typescript: true }),
}
