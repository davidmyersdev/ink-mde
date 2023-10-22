import { Vim, vim as vimCodemirror } from '@replit/codemirror-vim'

interface MapOption {
  before?: string
  after?: string
  mode?: string
}
interface UnMapOption {
  before?: string
  mode?: string
}
export interface VimOptions {
  map?: MapOption[]
  unmap?: UnMapOption[]
  open?: boolean
}

export const vim = (options: VimOptions) => {
  const { map, unmap } = options
  if (map?.length) {
    map!.forEach(({ before, after, mode }) => {
      Vim.map(before, after, mode)
    })
  }
  if (unmap?.length) {
    unmap!.forEach(({ before, mode }) => {
      Vim.unmap(before, mode)
    })
  }
  return vimCodemirror()
}
