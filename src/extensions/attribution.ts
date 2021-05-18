import { RangeSetBuilder } from '@codemirror/rangeset'
import { Extension } from '@codemirror/state'
import { Decoration, DecorationSet, PluginValue, ViewPlugin, WidgetType } from '@codemirror/view'

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
    container.style.fontFamily = 'var(--ink-font-family, sans-serif)'
    container.style.fontSize = '0.75em'
    container.style.opacity = '0.5'
    container.style.position = 'absolute'
    container.style.right = '0'

    text.innerText = 'Powered by '

    link.href = 'https://github.com/writewithocto/ink'
    link.innerText = 'Ink'
    link.rel = 'noopener noreferrer'
    link.target = '_blank'
    link.style.color = 'var(--ink-heading, #e06c75)'
    link.style.fontWeight = 'bold'
    link.style.textDecoration = 'none'

    return container
  }
}

class AttributionPlugin implements PluginValue {
  decorations: DecorationSet

  constructor() {
    const rangeSet = new RangeSetBuilder<Decoration>()

    rangeSet.add(0, 0, decoration())

    this.decorations = rangeSet.finish()
  }

  update() {
    // nothing to update
  }
}

const decoration = () => Decoration.widget({
  widget: new AttributionWidget(),
  side: -1,
  block: true,
})

const attributionPlugin = ViewPlugin.fromClass(AttributionPlugin, { decorations: plugin => plugin.decorations })

export const attribution = (): Extension => {
  return [
    attributionPlugin,
  ]
}
