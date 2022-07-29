import { syntaxTree } from '@codemirror/language'
import type { EditorState, Extension, Range } from '@codemirror/state'
import { RangeSet, StateField } from '@codemirror/state'
import type { DecorationSet } from '@codemirror/view'
import { Decoration, EditorView, WidgetType } from '@codemirror/view'

interface ImageWidgetParams {
  url: string,
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
    const backdrop = container.appendChild(document.createElement('div'))
    const figure = backdrop.appendChild(document.createElement('figure'))
    const image = figure.appendChild(document.createElement('img'))

    container.setAttribute('aria-hidden', 'true')
    container.className = 'cm-image-container'
    backdrop.className = 'cm-image-backdrop'
    figure.className = 'cm-image-figure'
    image.className = 'cm-image-img'
    image.src = this.url

    container.style.paddingBottom = '0.5rem'
    container.style.paddingTop = '0.5rem'

    backdrop.classList.add('cm-image-backdrop')

    backdrop.style.borderRadius = 'var(--ink-internal-border-radius)'
    backdrop.style.display = 'flex'
    backdrop.style.alignItems = 'center'
    backdrop.style.justifyContent = 'center'
    backdrop.style.overflow = 'hidden'
    backdrop.style.maxWidth = '100%'

    figure.style.margin = '0'

    image.style.display = 'block'
    image.style.maxHeight = 'var(--ink-internal-block-max-height)'
    image.style.maxWidth = '100%'
    image.style.width = '100%'

    return container
  }
}

export const images = (): Extension => {
  const imageRegex = /!\[.*?\]\((?<url>.*?)\)/

  const imageDecoration = (imageWidgetParams: ImageWidgetParams) => Decoration.widget({
    widget: new ImageWidget(imageWidgetParams),
    side: -1,
    block: true,
  })

  const decorate = (state: EditorState) => {
    const widgets: Range<Decoration>[] = []

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        if (type.name === 'Image') {
          const result = imageRegex.exec(state.doc.sliceString(from, to))

          if (result && result.groups && result.groups.url)
            widgets.push(imageDecoration({ url: result.groups.url }).range(state.doc.lineAt(from).from))
        }
      },
    })

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none
  }

  const imagesTheme = EditorView.baseTheme({
    '.cm-image-backdrop': {
      backgroundColor: 'var(--ink-internal-block-background-color)',
    },
  })

  const imagesField = StateField.define<DecorationSet>({
    create(state) {
      return decorate(state)
    },
    update(images, transaction) {
      if (transaction.docChanged)
        return decorate(transaction.state)

      return images.map(transaction.changes)
    },
    provide(field) {
      return EditorView.decorations.from(field)
    },
  })

  return [
    imagesTheme,
    imagesField,
  ]
}
