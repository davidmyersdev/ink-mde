import { syntaxTree } from '@codemirror/language'
import { RangeSet, StateField } from '@codemirror/state'
import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'
import type { EditorState, Extension, Range } from '@codemirror/state'
import type { DecorationSet, WidgetType } from '@codemirror/view'

interface Widget extends WidgetType {
  compare: (widget: Widget) => boolean,
  isChecked?: boolean,
}

const dotWidget = (): Widget => {
  return {
    compare: (_other: Widget) => {
      return false
    },
    destroy: () => {},
    eq: (_other: Widget) => {
      return false
    },
    estimatedHeight: -1,
    ignoreEvent: () => true,
    toDOM: () => {
      const span = document.createElement('span')

      span.innerHTML = '&#x2022;'
      span.setAttribute('aria-hidden', 'true')

      return span
    },
    updateDOM: () => false,
  }
}

const taskWidget = (isChecked: boolean): Widget => {
  return {
    compare: (other: Widget) => {
      return other.isChecked === isChecked
    },
    destroy: () => {},
    eq: (other: Widget) => {
      return other.isChecked === isChecked
    },
    estimatedHeight: -1,
    ignoreEvent: () => false,
    isChecked,
    toDOM: () => {
      const node = document.createElement('span')
      const input = document.createElement('input')

      node.setAttribute('aria-hidden', 'true')
      node.className = 'ink-mde-task-toggle-wrapper'
      input.className = 'ink-mde-task-toggle'
      input.type = 'checkbox'
      input.checked = isChecked
      node.appendChild(input)

      return node
    },
    updateDOM: () => false,
  }
}

const hasOverlap = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.max(x1, y1) <= Math.min(x2, y2)
}

const isCursorInRange = (state: EditorState, from: number, to: number) => {
  return state.selection.ranges.some((range) => {
    return hasOverlap(from, to, range.from, range.to)
  })
}

const toggleTask = (view: EditorView, position: number) => {
  const before = view.state.sliceDoc(position - 3, position)

  view.dispatch({
    changes: {
      from: position - 3,
      to: position,
      insert: before === '[ ]' ? '[x]' : '[ ]',
    },
  })

  return true
}

export const lists = (): Extension => {
  const dotDecoration = () => Decoration.replace({
    widget: dotWidget(),
  })

  const taskDecoration = (isChecked: boolean) => Decoration.replace({
    widget: taskWidget(isChecked),
  })

  const decorate = (state: EditorState) => {
    const widgets: Range<Decoration>[] = []

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        if (type.name === 'ListMark' && !isCursorInRange(state, from, to)) {
          const task = state.sliceDoc(to + 1, to + 4)

          if (!['[ ]', '[x]'].includes(task)) {
            const marker = state.sliceDoc(from, to)

            if (['-', '*'].includes(marker)) {
              widgets.push(dotDecoration().range(from, to))
            }
          }
        }

        if (type.name === 'TaskMarker' && !isCursorInRange(state, from - 2, to)) {
          const task = state.sliceDoc(from, to)

          widgets.push(taskDecoration(task === '[x]').range(from - 2, to))
        }
      },
    })

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none
  }

  const viewPlugin = ViewPlugin.define(() => ({}), {
    eventHandlers: {
      mousedown: (event, view) => {
        const target = event.target as HTMLElement

        if (target?.nodeName === 'INPUT' && target.classList.contains('ink-mde-task-toggle')) {
          return toggleTask(view, view.posAtDOM(target))
        }
      },
    },
  })
  const stateField = StateField.define<DecorationSet>({
    create(state) {
      return decorate(state)
    },
    update(_references, { state }) {
      return decorate(state)
    },
    provide(field) {
      return EditorView.decorations.from(field)
    },
  })

  return [
    viewPlugin,
    stateField,
  ]
}
