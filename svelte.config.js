import preprocess from 'svelte-preprocess'

export default {
  compilerOptions: {
    accessors: true,
    css: true,
  },
  onwarn(warning, defaultHandler) {
    if (warning.code === 'unused-export-let') { return }

    defaultHandler(warning)
  },
  preprocess: preprocess({ typescript: true }),
}
