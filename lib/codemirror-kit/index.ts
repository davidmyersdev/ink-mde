import { Decoration, type WidgetType } from '@codemirror/view'

export type CustomWidget<T> = T & WidgetSpec & { compare: (other: CustomWidget<T>) => boolean }
export type CustomWidgetArgs = Partial<WidgetSpec> & Record<string, any>
export type CustomWidgetDecoration<T> = T & WidgetDecorationSpec
export type CustomWidgetDecorationArgs = Partial<WidgetDecorationSpec> & Record<string, any>
export type WidgetSpec = WidgetType & { id?: string }
export type WidgetDecorationSpec = { block: boolean, side: number, widget: CustomWidgetArgs }

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
      const text = document.createElement('span')

      text.innerText = 'Testing'

      return text
    },
    updateDOM: () => false,
    ...options,
  }
}

export const buildWidgetDecoration = <T extends CustomWidgetDecorationArgs>(options: T) => {
  return Decoration.widget({
    block: false,
    side: 0,
    ...options,
    widget: buildWidget({
      ...options.widget,
    }),
  })
}
