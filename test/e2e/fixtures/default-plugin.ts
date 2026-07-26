import { Decoration, EditorView, WidgetType } from '@codemirror/view'

export const defaultPlugin = () => {
  class Widget extends WidgetType {
    toDOM() {
      const element = document.createElement('span')
      element.className = 'e2e-default-plugin-widget'
      element.textContent = 'default plugin'
      return element
    }
  }

  return EditorView.decorations.of(Decoration.set([
    Decoration.widget({ widget: new Widget() }).range(0),
  ]))
}
