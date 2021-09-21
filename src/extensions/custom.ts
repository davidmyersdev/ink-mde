import { RangeSet } from '@codemirror/rangeset'
import { EditorState, Extension, StateField } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView, WidgetType } from '@codemirror/view'
import { StyleSpec } from 'style-mod'

export interface CustomExtensionOptions {
  theme: { [selector: string]: StyleSpec },
  decorator: (state: EditorState) => CustomWidget[],
}

export interface CustomWidget {
  widget: WidgetType,
  from: number,
  to?: number,
}

export const custom = ({ theme, decorator }: CustomExtensionOptions): Extension => {
  const customTheme = EditorView.baseTheme(theme)

  const decoration = (widget: WidgetType) => Decoration.widget({
    widget: widget,
    side: -1,
    block: true,
  })

  const evaluate = (state: EditorState) => {
    const customWidgets = decorator(state)
    const decorations = customWidgets.map((customWidget) => {
      return decoration(customWidget.widget).range(customWidget.from, customWidget.to)
    })

    return decorations.length > 0 ? RangeSet.of(decorations) : Decoration.none
  }

  const customField = StateField.define<DecorationSet>({
    create(state) {
      return evaluate(state)
    },
    update(customs, transaction) {
      if (transaction.docChanged) {
        return evaluate(transaction.state)
      }

      return customs.map(transaction.changes)
    },
    provide(field) {
      return EditorView.decorations.from(field)
    },
  })

  return [
    customTheme,
    customField,
  ]
}
