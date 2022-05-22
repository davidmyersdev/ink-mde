import { syntaxTree } from '@codemirror/language'
import { insert, selections, wrap } from '/src/instance'
import { getState } from '/src/state'
import * as InkValues from '/types/values'

import type { NodeType } from '@lezer/common'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

// Todo:
// - Handle multiline selections
// - Respect readonly setting on all APIs

interface FormatDefinition {
  block: boolean
  line: boolean
  multiline: boolean
  nodes: string[]
  prefix: string
  prefixStates: string[]
  suffix: string
}

type Formats = {
  [K in Ink.Values.Markup]: FormatDefinition
}

const defineConfig = (overrides: Partial<FormatDefinition>): FormatDefinition => {
  const defaults = {
    block: false,
    line: false,
    multiline: false,
    nodes: [],
    prefix: '',
    prefixStates: [],
    suffix: '',
  }

  return { ...defaults, ...overrides }
}

export const formatting: Formats = {
  [InkValues.Markup.Bold]: defineConfig({
    nodes: ['StrongEmphasis'],
    prefix: '**',
    suffix: '**',
  }),
  [InkValues.Markup.Code]: defineConfig({
    nodes: ['InlineCode'],
    prefix: '`',
    suffix: '`',
  }),
  [InkValues.Markup.CodeBlock]: defineConfig({
    block: true,
    nodes: ['FencedCode'],
    prefix: '```\n',
    suffix: '\n```',
  }),
  [InkValues.Markup.Heading]: defineConfig({
    multiline: true,
    nodes: ['ATXHeading1', 'ATXHeading2', 'ATXHeading3', 'ATXHeading4', 'ATXHeading5', 'ATXHeading6'],
    prefix: '# ',
    prefixStates: ['# ', '## ', '### ', '#### ', '##### ', '###### ', ''],
  }),
  [InkValues.Markup.Image]: defineConfig({
    nodes: ['Image'],
    prefix: '![](',
    suffix: ')',
  }),
  [InkValues.Markup.Italic]: defineConfig({
    nodes: ['Emphasis'],
    prefix: '*',
    suffix: '*',
  }),
  [InkValues.Markup.Link]: defineConfig({
    nodes: ['Link'],
    prefix: '[](',
    suffix: ')',
  }),
  [InkValues.Markup.OrderedList]: defineConfig({
    line: true,
    multiline: true,
    nodes: ['OrderedList'],
    prefix: '1. ',
  }),
  [InkValues.Markup.Quote]: defineConfig({
    line: true,
    multiline: true,
    nodes: ['Blockquote'],
    prefix: '> ',
  }),
  [InkValues.Markup.TaskList]: defineConfig({
    line: true,
    multiline: true,
    nodes: ['BulletList'],
    prefix: '- [ ] ',
  }),
  [InkValues.Markup.List]: defineConfig({
    line: true,
    multiline: true,
    nodes: ['BulletList'],
    prefix: '- ',
  }),
}

const getBlockSelection = (ref: InkInternal.Ref, selection: Ink.Editor.Selection): Ink.Editor.Selection => {
  const { editor } = getState(ref)
  const startLine = editor.lineBlockAt(selection.start)
  const endLine = editor.lineBlockAt(selection.end)

  return { start: startLine.from, end: endLine.to }
}

const splitSelectionByLines = (ref: InkInternal.Ref, selection: Ink.Editor.Selection) => {
  const { editor } = getState(ref)

  let position = selection.start
  let selections: Ink.Editor.Selection[] = []

  while (position <= selection.end) {
    const line = editor.lineBlockAt(position)
    const start = Math.max(position, line.from)
    const end = Math.min(position, line.to)

    selections.push({ start, end })

    position = line.to + 1
  }

  return selections
}

const getInlineSelection = (ref: InkInternal.Ref, selection: Ink.Editor.Selection) => {
  const { editor } = getState(ref)

  const start = editor.state.wordAt(selection.start)?.from || selection.start
  const end = editor.state.wordAt(selection.end)?.to || selection.end

  return { start, end }
}

const getSelection = (ref: InkInternal.Ref, userSelection?: Ink.Editor.Selection) => {
  // Todo: expose an actual API for getting the current selection or fallback
  return userSelection || selections(ref).pop() || { start: 0, end: 0 }
}

const getText = (ref: InkInternal.Ref, userSelection: Ink.Editor.Selection) => {
  const { editor } = getState(ref)

  return editor.state.sliceDoc(userSelection.start, userSelection.end)
}

const getNode = (ref: InkInternal.Ref, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const selectionNodes = getNodes(ref, selection)

  return selectionNodes.find(({ type }) => definition.nodes.includes(type.name))
}

const getNodes = (ref: InkInternal.Ref, selection: Ink.Editor.Selection) => {
  const { editor: { state } } = getState(ref)
  const types: { type: NodeType, from: number, to: number }[] = []

  syntaxTree(state).iterate({
    from: selection.start,
    to: selection.end,
    enter: ({ type, from, to }) => {
      types.push({ type, from, to })
    },
  })

  return types
}

const unformat = (ref: InkInternal.Ref, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const text = getText(ref, selection)
  const sliceStart = definition.prefix.length
  const sliceEnd = definition.suffix.length * -1 || text.length
  const unformatted = text.slice(sliceStart, sliceEnd)

  insert(ref, unformatted, selection)
}

const formatBlock = (ref: InkInternal.Ref, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const blockSelection = getBlockSelection(ref, selection)
  const blockNode = getNode(ref, definition, blockSelection)

  if (blockNode) {
    const start = blockNode.from
    const end = blockNode.to

    unformat(ref, definition, { start, end })
  } else {
    const before = definition.prefix
    const after = definition.suffix

    wrap(ref, { before, after, selection: blockSelection })
  }
}

const formatMultiline = (ref: InkInternal.Ref, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const selections = splitSelectionByLines(ref, selection)

  selections.forEach((lineSelection) => {
    formatLine(ref, definition, lineSelection)
  })
}

const formatLine = (ref: InkInternal.Ref, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const lineSelection = getBlockSelection(ref, selection)
  const lineNode = getNode(ref, definition, lineSelection)
  const hasPrefixStates = definition.prefixStates.length > 0

  if (lineNode && hasPrefixStates) {
    definition.prefixStates.find((prefix, index) => {
      // Todo: Use a line-level node (paragraph?) instead of the whole line.
      // This would allow headings to be toggled within quote blocks, for example.
      const start = lineNode.from
      const end = lineNode.to
      const text = getText(ref, { start, end })
      const isMatch = text.startsWith(prefix)

      if (isMatch) {
        insert(ref, text.replace(new RegExp(`^${prefix}`), definition.prefixStates[index + 1]), { start, end })
      }

      return isMatch
    })
  } else if (lineNode) {
    const start = lineNode.from
    const end = lineNode.to

    unformat(ref, definition, { start, end })
  } else {
    const before = definition.prefix
    const after = definition.suffix

    wrap(ref, { before, after, selection: lineSelection })
  }
}

const formatInline = (ref: InkInternal.Ref, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const node = getNode(ref, definition, selection)

  if (node) {
    const start = node.from
    const end = node.to

    unformat(ref, definition, { start, end })
  } else {
    const { start, end } = getInlineSelection(ref, selection)
    const before = Array.isArray(definition.prefix) ? definition.prefix[0] : definition.prefix
    const after = definition.suffix

    wrap(ref, { before, after, selection: { start, end } })
  }
}

export const format = (ref: InkInternal.Ref, formatType: `${Ink.Values.Markup}`, userSelection?: Ink.Editor.Selection) => {
  const definition = formatting[formatType]
  const selection = getSelection(ref, userSelection)

  if (definition.block) {
    formatBlock(ref, definition, selection)
  } else if (definition.multiline) {
    // Todo: Handle progressive selection updates (each line throws off following updates)
    // Todo: Perform all updates in a single transaction.
    formatMultiline(ref, definition, selection)
  } else if (definition.line) {
    formatLine(ref, definition, selection)
  } else {
    formatInline(ref, definition, selection)
  }
}
