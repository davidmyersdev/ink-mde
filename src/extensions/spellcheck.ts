import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const spellcheck = (): Extension => {
  return EditorView.contentAttributes.of({
    'data-gramm': 'false',
    // This is a hacky fix to negate the data-gramm='false' attribute which disables grammarly.
    // For some reason, the presence of this attribute re-enables it.
    // https://github.com/ianstormtaylor/slate/issues/4124
    'data-slate-editor': 'true',
    'spellcheck': 'true',
  })
}
