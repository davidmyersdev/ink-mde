import { history } from '@codemirror/history'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorState, Extension } from '@codemirror/state'

import { code } from './extensions/code'
import { code_sandbox } from './extensions/code_sandbox'
import { keymaps } from './extensions/keymaps'
import { lineWrapping } from './extensions/line_wrapping'
import { theme } from './extensions/theme'
import { InkOptions } from './types/ink'

export const createState = (options: InkOptions, extensions: Extension[] = []): EditorState => {
  return EditorState.create({
    doc: options.doc,
    selection: options.selection,
    extensions: [
      history(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      keymaps(),
      code(),
      code_sandbox(),
      lineWrapping(),
      theme(),
      ...extensions,
    ],
  })
}
