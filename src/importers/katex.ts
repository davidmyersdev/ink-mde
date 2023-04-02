export type Katex = Awaited<ReturnType<typeof importer>>

export const importer = async () => {
  const { default: katex } = await import('katex')

  return katex
}
