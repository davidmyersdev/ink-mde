import { syntaxTree } from '@codemirror/language'
import { type EditorState, type Range, type RangeCursor, RangeSet, StateField, type Transaction } from '@codemirror/state'
import { Decoration, EditorView, type WidgetType } from '@codemirror/view'
import { type SyntaxNodeRef } from '@lezer/common'

export type CustomWidget<T> = T & WidgetSpec & { compare: (other: CustomWidget<T>) => boolean }
export type CustomWidgetArgs = PartialWidgetSpec & Record<string, any>
export type CustomWidgetDecoration<T> = T & WidgetDecorationSpec<T> & Decoration
export type CustomWidgetDecorationArgs = PartialWidgetDecorationSpec & Record<string, any>
export type NodeBlockDecoration<T> = CustomWidgetDecoration<T> & { widget: { node: SyntaxNodeRef } }
export type NodeDecoratorArgs<T extends Decoration> = {
  nodes: string[],
  onMatch: (state: EditorState, node: SyntaxNodeRef) => T | T[] | void,
  optimize?: boolean,
  range?: {
    from?: number,
    to?: number,
  },
}
export type PartialWidgetSpec = Partial<WidgetSpec>
export type PartialWidgetDecorationSpec = { block?: boolean, side?: number, widget?: CustomWidgetArgs }
export type WidgetSpec = WidgetType & { id?: string }
export type WidgetDecorationSpec<T> = { block: boolean, side: number, widget: CustomWidget<T> }

export const buildBlockWidgetDecoration = <T extends CustomWidgetDecorationArgs>(options: T) => {
  return buildWidgetDecoration({
    block: true,
    side: -1,
    ...options,
  })
}

export const buildWidget = <T extends CustomWidgetArgs>(options: T): CustomWidget<T> => {
  const eq = options.eq || ((other: CustomWidget<T>) => {
    if (!options.id) return false

    return options.id === other.id
  })

  return {
    compare: eq,
    destroy: () => {},
    eq,
    estimatedHeight: -1,
    ignoreEvent: () => true,
    toDOM: () => {
      return document.createElement('span')
    },
    updateDOM: () => false,
    ...options,
  }
}

export const buildWidgetDecoration = <T extends CustomWidgetDecorationArgs>(options: T): CustomWidgetDecoration<T> => {
  return Decoration.widget({
    block: false,
    side: 0,
    ...options,
    widget: buildWidget({
      ...options.widget,
    }),
  }) as CustomWidgetDecoration<T>
}

export const buildNodeDecorations = <T extends Decoration>(state: EditorState, options: NodeDecoratorArgs<T>) => {
  const decorationRanges: Range<NodeBlockDecoration<T>>[] = []

  syntaxTree(state).iterate({
    enter: (node) => {
      if (options.nodes.includes(node.type.name)) {
        const maybeDecorations = options.onMatch(state, node)

        if (!maybeDecorations) return

        const decorations = Array<T>().concat(maybeDecorations)

        decorations.forEach((decoration) => {
          const wrappedDecoration = buildWidgetDecoration({
            ...decoration.spec,
            // The node must be destructured to store the values instead of the cursor reference.
            widget: {
              ...decoration.spec.widget,
              node: { ...node },
            },
          })

          decorationRanges.push(wrappedDecoration.range(node.from))
        })
      }
    },
    from: options.range?.from,
    to: options.range?.to,
  })

  return decorationRanges
}

export const buildOptimizedNodeDecorations = <T extends Decoration>(rangeSet: RangeSet<NodeBlockDecoration<T>>, transaction: Transaction, options: NodeDecoratorArgs<T>) => {
  const decorations = [] as Range<NodeBlockDecoration<T>>[]
  const cursor = rangeSet.iter()
  const cursors = [] as RangeCursor<NodeBlockDecoration<T>>[]
  const cursorsToSkip = [] as RangeCursor<NodeBlockDecoration<T>>[]

  while (cursor.value) {
    cursors.push({ ...cursor })
    cursor.next()
  }

  transaction.changes.iterChangedRanges((_beforeFrom, _beforeTo, changeFrom, changeTo) => {
    cursors.forEach((cursor) => {
      if (cursor.value) {
        const nodeLength = cursor.value.widget.node.to - cursor.value.widget.node.from
        const cursorFrom = cursor.from
        const cursorTo = cursor.from + nodeLength

        if (isOverlapping(cursorFrom, cursorTo, changeFrom, changeTo)) {
          cursorsToSkip.push(cursor)
        }
      }
    })

    const range = { from: changeFrom, to: changeTo }

    decorations.push(...buildNodeDecorations(transaction.state, { ...options, range }))
  })

  const cursorDecos = cursors.filter(cursor => !cursorsToSkip.includes(cursor)).flatMap((cursor) => {
    const range = cursor.value?.range(cursor.from) as Range<NodeBlockDecoration<T>>

    if (!range) return []

    return [range]
  })

  decorations.push(...cursorDecos)

  const allDecorations = decorations.sort((left, right) => {
    return left.from - right.from
  })

  // This reprocesses the entire state.
  return allDecorations
}

export const isOverlapping = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.max(x1, y1) <= Math.min(x2, y2)
}

export const nodeDecorator = <T extends Decoration>(options: NodeDecoratorArgs<T>) => {
  return StateField.define<RangeSet<NodeBlockDecoration<T>>>({
    create(state) {
      return RangeSet.of(buildNodeDecorations(state, options))
    },
    update(rangeSet, transaction) {
      // Reconfiguration and state effects will reprocess the entire state to ensure nothing is missed.
      if (transaction.reconfigured || transaction.effects.length > 0) {
        return RangeSet.of(buildNodeDecorations(transaction.state, options))
      }

      const updatedRangeSet = rangeSet.map(transaction.changes)

      if (transaction.docChanged) {
        // Only process the ranges that are affected by this change.
        if (options.optimize) {
          return RangeSet.of(buildOptimizedNodeDecorations(updatedRangeSet, transaction, options))
        }

        return RangeSet.of(buildNodeDecorations(transaction.state, options))
      }

      // No need to redecorate. Instead, just map the decorations through the transaction changes.
      return updatedRangeSet
    },
    provide(field) {
      // Provide the extension to the editor.
      return EditorView.decorations.from(field)
    },
  })
}
