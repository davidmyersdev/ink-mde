import { Extension, RangeSet, StateField } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView, WidgetType } from '@codemirror/view'

class AttributionWidget extends WidgetType {
  constructor() {
    super()
  }

  eq() {
    return true
  }

  toDOM() {
    const container = document.createElement('div')
    const text = container.appendChild(document.createElement('span'))
    const link = container.appendChild(document.createElement('a'))

    container.setAttribute('aria-hidden', 'true')
    container.style.bottom = '0'
    container.style.fontSize = '0.75em'
    container.style.opacity = '0.5'
    container.style.position = 'absolute'
    container.style.right = '0'

    text.innerText = 'Powered by '

    link.href = 'https://github.com/voraciousdev/ink-mde'
    link.innerText = 'Ink'
    link.rel = 'noopener noreferrer'
    link.target = '_blank'
    link.style.color = 'var(--ink-internal-color)'
    link.style.fontWeight = '600'
    link.style.textDecoration = 'none'

    return container
  }
}

const attributionTheme = EditorView.baseTheme({
  '.cm-content': {
    paddingBottom: '2em',
  },
})

const attributionField = StateField.define<DecorationSet>({
  create(state) {
    return RangeSet.of(decoration().range(state.doc.length))
  },
  update(_attributions, transaction) {
    return RangeSet.of(decoration().range(transaction.newDoc.length))
  },
  provide(field) {
    return EditorView.decorations.from(field)
  },
})

const decoration = () => Decoration.widget({
  widget: new AttributionWidget(),
  side: 1,
  block: true,
})

export const attribution = (): Extension => {
  return [
    attributionTheme,
    attributionField,
  ]
}
