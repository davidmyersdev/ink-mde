import { syntaxTree } from '@codemirror/language'
import { Range } from '@codemirror/rangeset'
import { Extension } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view'

interface ImageWidgetParams {
  url: string
}

class ImageWidget extends WidgetType {
  readonly url

  constructor({ url }: ImageWidgetParams) {
    super()

    this.url = url
  }

  eq(imageWidget: ImageWidget) {
    return imageWidget.url === this.url
  }

  toDOM() {
    const container = document.createElement('div')
    const figure = container.appendChild(document.createElement('figure'))
    const image = document.createElement('img')

    container.setAttribute('aria-hidden', 'true')
    container.className = 'cm-image-container'
    figure.className = 'cm-image-figure'
    image.className = 'cm-image-img'
    image.src = this.url

    container.style.backgroundColor = 'var(--hybrid-mde-images-bg-color, rgba(0, 0, 0, 0.3))'
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.justifyContent = 'center'
    container.style.padding = '1rem'
    container.style.marginBottom = '0.5rem'
    container.style.marginTop = '0.5rem'
    container.style.maxWidth = '100%'

    figure.style.margin = '0'

    image.style.display = 'block'
    image.style.maxHeight = 'var(--hybrid-mde-images-max-height, 20rem)'
    image.style.maxWidth = '100%'

    figure.appendChild(image)

    return container
  }
}

const imageRegex = /!\[.*\]\((?<url>.*)\)/

const imageDecoration = (imageWidgetParams: ImageWidgetParams) => Decoration.widget({
  widget: new ImageWidget(imageWidgetParams),
  side: -1,
  block: true,
})

const imagePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = decorate(view)
  }

  update(viewUpdate: ViewUpdate) {
    if (viewUpdate.docChanged || viewUpdate.viewportChanged) {
      this.decorations = decorate(viewUpdate.view)
    }
  }
}, { decorations: (plugin) => plugin.decorations })

const decorate = (view: EditorView) => {
  const widgets: Range<Decoration>[] = []

  for (const { from, to } of view.visibleRanges) {
    for (let position = from; position < to;) {
      const line = view.state.doc.lineAt(position)

      syntaxTree(view.state).iterate({
        enter: (type, from, to) => {
          if (type.name === 'Image') {
            const result = imageRegex.exec(view.state.doc.sliceString(from, to))
            const url = result?.groups?.url

            if (url) {
              widgets.push(imageDecoration({ url }).range(line.from))
            }
          }
        },
        from: line.from,
        to: line.to,
      })

      position = line.to + 1
    }
  }

  return Decoration.set(widgets)
}

export const images = (): Extension => {
  return [
    imagePlugin,
  ]
}
