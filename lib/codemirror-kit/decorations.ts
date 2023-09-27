import { syntaxTree } from '@codemirror/language'
import { type EditorState, type Range, type RangeCursor, RangeSet, StateField, type Transaction } from '@codemirror/state'
import { Decoration, EditorView, type WidgetType } from '@codemirror/view'
import { type SyntaxNodeRef } from '@lezer/common'

// Todo: Maybe open a PR to expose these types.
// https://github.com/codemirror/view/blob/3f1b991f3db20d152045ae9e6872466fc8d8fdac/src/decoration.ts
export type LineDecorationSpec = { attributes?: { [key: string]: string }, class?: string, [other: string]: any }
export type MarkDecorationSpec = { attributes?: { [key: string]: string }, class?: string, inclusive?: boolean, inclusiveEnd?: boolean, inclusiveStart?: boolean, tagName?: string, [other: string]: any }
export type ReplaceDecorationSpec = { block?: boolean, inclusive?: boolean, inclusiveEnd?: boolean, inclusiveStart?: boolean, widget?: WidgetType, [other: string]: any }
export type WidgetDecorationSpec = { widget: WidgetType, block?: boolean, side?: number, [other: string]: any }

export type Defined<T> = Required<{
  [K in keyof T]: NonNullable<T[K]>
}>

// Custom types.
export type CustomDecorationArgs = Parameters<typeof Decoration.mark>[0]
export type CustomDecoration<T> = T & Decoration
export type CustomDecorationTypes = 'line' | 'mark' | 'replace' | 'widget'
export type CustomWidget<T> = T & WidgetSpec
export type CustomWidgetArgs<T extends PartialWidgetSpec> = {
  [K in keyof T]?: K extends 'eq' ? (other: CustomWidget<Defined<T>>) => boolean : T[K]
}
export type CustomWidgetOptions<T extends PartialWidgetSpec> = {
  [K in keyof T]: K extends 'compare' | 'eq' ? (other: CustomWidget<Defined<T>>) => boolean : T[K]
}
export type CustomWidgetDecoration<T> = T & WidgetDecoration<T> & Decoration
export type CustomWidgetDecorationArgs = WidgetDecorationSpec & Record<string, any>
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
export type TypedDecoration = Decoration & { spec: Decoration['spec'] & { type: CustomDecorationTypes } }
export type WidgetSpec = WidgetType & { id?: string }
export type WidgetDecoration<T> = { block: boolean, side: number, widget: CustomWidget<T> }

export const buildBlockWidgetDecoration = <T extends CustomWidgetDecorationArgs>(options: T) => {
  return buildWidgetDecoration({
    block: true,
    side: -1,
    ...options,
  })
}

export const buildLineDecoration = <T extends MarkDecorationSpec>(options: T) => {
  return Decoration.line({
    ...options,
    type: 'line',
  }) as CustomDecoration<T>
}

export const buildMarkDecoration = <T extends MarkDecorationSpec>(options: T) => {
  return Decoration.mark({
    ...options,
    type: 'mark',
  }) as CustomDecoration<T>
}

export type WidgetOptions<T extends Record<string, any>> = {
  [K in ((keyof T) | 'compare' | 'eq')]?: K extends 'compare' | 'eq' ? (other: WidgetReturn<T>) => boolean
    : K extends keyof WidgetSpec ? WidgetSpec[K]
    : T[K]
}
export type WidgetReturn<T extends Record<string, any>> = {
  [K in keyof (T & WidgetSpec)]: K extends keyof T ? NonNullable<T[K]>
    : K extends keyof WidgetSpec ? WidgetSpec[K]
    : never
}

export const buildWidget = <T extends Record<string, any>>(options: WidgetOptions<T>): WidgetSpec => {
  const eq = (other: WidgetReturn<T>) => {
    if (options.eq) return options.eq(other)
    if (!options.id) return false

    return options.id === other.id
  }

  return {
    compare: (other: WidgetReturn<T>) => {
      return eq(other)
    },
    coordsAt: () => null,
    destroy: () => {},
    eq: (other: WidgetReturn<T>) => {
      return eq(other)
    },
    estimatedHeight: -1,
    ignoreEvent: () => true,
    lineBreaks: 0,
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
    type: 'widget',
  }) as CustomWidgetDecoration<T>
}

export const buildNodeDecorations = <T extends TypedDecoration>(state: EditorState, options: NodeDecoratorArgs<T>) => {
  const decorationRanges: Range<NodeBlockDecoration<T>>[] = []

  syntaxTree(state).iterate({
    enter: (node) => {
      if (options.nodes.includes(node.type.name)) {
        const maybeDecorations = options.onMatch(state, node)

        if (!maybeDecorations) return

        const decorations = Array<T>().concat(maybeDecorations)

        decorations.forEach((decoration) => {
          if (decoration.spec.type === 'line') {
            const wrapped = buildLineDecoration({ ...decoration.spec, node: { ...node } })

            for (let line = state.doc.lineAt(node.from); line.from < node.to; line = state.doc.lineAt(line.to + 1)) {
              decorationRanges.push(wrapped.range(line.from))
            }
          }

          if (decoration.spec.type === 'mark') {
            const wrapped = buildMarkDecoration({ ...decoration.spec, node: { ...node } }).range(node.from, node.to)

            decorationRanges.push(wrapped)
          }

          if (decoration.spec.type === 'widget') {
            const wrapped = buildWidgetDecoration({ ...decoration.spec, node: { ...node } }).range(node.from)

            decorationRanges.push(wrapped)
          }
        })
      }
    },
    from: options.range?.from,
    to: options.range?.to,
  })

  return decorationRanges.sort((left, right) => {
    return left.from - right.from
  })
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
        const nodeLength = cursor.value.spec.node.to - cursor.value.spec.node.from
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
