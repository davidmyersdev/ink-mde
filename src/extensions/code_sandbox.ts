import { syntaxTree } from '@codemirror/language'
import { EditorState, Extension } from '@codemirror/state'
import { WidgetType } from '@codemirror/view'
import { custom, CustomWidget } from './custom'

class CodeSandboxWidget extends WidgetType {
  readonly id: string

  constructor(id: string) {
    super()

    this.id = id
  }

  eq(other: CodeSandboxWidget) {
    return other.id === this.id
  }

  toDOM() {
    const container = document.createElement('div')
    const backdrop = container.appendChild(document.createElement('div'))
    const embeddable = backdrop.appendChild(document.createElement('iframe'))

    container.setAttribute('aria-hidden', 'true')
    container.className = 'cm-image-container'
    backdrop.className = 'cm-image-backdrop'
    embeddable.className = 'cm-image-embeddable'

    container.style.paddingBottom = '0.5rem'
    container.style.paddingTop = '0.5rem'

    backdrop.classList.add('cm-image-backdrop')

    backdrop.style.borderRadius = 'var(--ink-image-border-radius, 0.25rem)'
    backdrop.style.display = 'flex'
    backdrop.style.alignItems = 'center'
    backdrop.style.justifyContent = 'center'
    backdrop.style.padding = '1rem'
    backdrop.style.maxWidth = '100%'

    embeddable.src = `https://codesandbox.io/embed/${this.id}`

    embeddable.setAttribute('allow', 'geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb')
    embeddable.setAttribute('loading', 'lazy')
    embeddable.setAttribute('sandbox', 'allow-modals allow-forms allow-popups allow-scripts allow-same-origin')
    embeddable.height = '100%'
    embeddable.width = '100%'
    embeddable.style.border = 'none'
    embeddable.style.aspectRatio = '2 / 1'

    return container
  }
}

const regex = /\{\%\s+codesandbox\s+(?<identifier>.*)\s+\%\}/

const decorator = (state: EditorState): CustomWidget[] => {
  const customWidgets: CustomWidget[] = []

  syntaxTree(state).iterate({
    enter: (type, from, to) => {
      if (type.name === 'Document') {
        return
      }

      if (type.name === 'Paragraph') {
        const result = regex.exec(state.doc.sliceString(from, to))

        if (result && result.groups && result.groups.identifier) {
          customWidgets.push({
            widget: new CodeSandboxWidget(result.groups.identifier),
            from: state.doc.lineAt(from).from,
          })
        }
      }

      return false
    },
  })

  return customWidgets
}

export const code_sandbox = (): Extension => {
  return custom({ decorator, theme: {} })
}
