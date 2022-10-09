import { syntaxTree } from '@codemirror/language'
import { insert, selections, wrap } from '/src/api'
import * as InkValues from '/types/values'
import type { NodeType } from '@lezer/common'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

// Todo:
// - Handle multiline selections

interface FormatDefinition {
  block: boolean,
  line: boolean,
  multiline: boolean,
  nodes: string[],
  prefix: string,
  prefixStates: string[],
  suffix: string,
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

const getBlockSelection = ([state, _setState]: InkInternal.Store, selection: Ink.Editor.Selection): Ink.Editor.Selection => {
  const { editor } = state()
  const startLine = editor.lineBlockAt(selection.start)
  const endLine = editor.lineBlockAt(selection.end)

  return { start: startLine.from, end: endLine.to }
}

const splitSelectionByLines = ([state, _setState]: InkInternal.Store, selection: Ink.Editor.Selection) => {
  const { editor } = state()

  let position = selection.start
  const selections: Ink.Editor.Selection[] = []

  while (position <= selection.end) {
    const line = editor.lineBlockAt(position)
    const start = Math.max(position, line.from)
    const end = Math.min(position, line.to)

    selections.push({ start, end })

    position = line.to + 1
  }

  return selections
}

const getInlineSelection = ([state, _setState]: InkInternal.Store, selection: Ink.Editor.Selection) => {
  const { editor } = state()

  const start = editor.state.wordAt(selection.start)?.from || selection.start
  const end = editor.state.wordAt(selection.end)?.to || selection.end

  return { start, end }
}

const getSelection = ([state, setState]: InkInternal.Store, userSelection?: Ink.Editor.Selection) => {
  // Todo: expose an actual API for getting the current selection or fallback
  return userSelection || selections([state, setState]).pop() || { start: 0, end: 0 }
}

const getText = ([state, _setState]: InkInternal.Store, userSelection: Ink.Editor.Selection) => {
  const { editor } = state()

  return editor.state.sliceDoc(userSelection.start, userSelection.end)
}

const getNode = ([state, _setState]: InkInternal.Store, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const selectionNodes = getNodes(state(), selection)

  return selectionNodes.find(({ type }) => definition.nodes.includes(type.name))
}

const getNodes = ({ editor: { state } }: InkInternal.StateResolved, selection: Ink.Editor.Selection) => {
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

const unformat = ([state, setState]: InkInternal.Store, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const text = getText([state, setState], selection)
  const sliceStart = definition.prefix.length
  const sliceEnd = definition.suffix.length * -1 || text.length
  const unformatted = text.slice(sliceStart, sliceEnd)

  insert([state, setState], unformatted, selection)
}

const formatBlock = ([state, setState]: InkInternal.Store, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const blockSelection = getBlockSelection([state, setState], selection)
  const blockNode = getNode([state, setState], definition, blockSelection)

  if (blockNode) {
    const start = blockNode.from
    const end = blockNode.to

    unformat([state, setState], definition, { start, end })
  } else {
    const before = definition.prefix
    const after = definition.suffix

    wrap([state, setState], { before, after, selection: blockSelection })
  }
}

const formatMultiline = ([state, setState]: InkInternal.Store, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const selections = splitSelectionByLines([state, setState], selection)

  selections.forEach((lineSelection) => {
    formatLine([state, setState], definition, lineSelection)
  })
}

const formatLine = ([state, setState]: InkInternal.Store, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const lineSelection = getBlockSelection([state, setState], selection)
  const lineNode = getNode([state, setState], definition, lineSelection)
  const hasPrefixStates = definition.prefixStates.length > 0

  if (lineNode && hasPrefixStates) {
    definition.prefixStates.find((prefix, index) => {
      // Todo: Use a line-level node (paragraph?) instead of the whole line.
      // This would allow headings to be toggled within quote blocks, for example.
      const start = lineNode.from
      const end = lineNode.to
      const text = getText([state, setState], { start, end })
      const isMatch = text.startsWith(prefix)

      if (isMatch)
        insert([state, setState], text.replace(new RegExp(`^${prefix}`), definition.prefixStates[index + 1]), { start, end })

      return isMatch
    })
  } else if (lineNode) {
    const start = lineNode.from
    const end = lineNode.to

    unformat([state, setState], definition, { start, end })
  } else {
    const before = definition.prefix
    const after = definition.suffix

    wrap([state, setState], { before, after, selection: lineSelection })
  }
}

const formatInline = ([state, setState]: InkInternal.Store, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const node = getNode([state, setState], definition, selection)

  if (node) {
    const start = node.from
    const end = node.to

    unformat([state, setState], definition, { start, end })
  } else {
    const { start, end } = getInlineSelection([state, setState], selection)
    const before = Array.isArray(definition.prefix) ? definition.prefix[0] : definition.prefix
    const after = definition.suffix

    wrap([state, setState], { before, after, selection: { start, end } })
  }
}

export const format = ([state, setState]: InkInternal.Store, formatType: Ink.EnumString<Ink.Values.Markup>, { selection: userSelection }: Ink.Instance.FormatOptions = {}) => {
  const definition = formatting[formatType]
  const selection = getSelection([state, setState], userSelection)

  if (definition.block) {
    formatBlock([state, setState], definition, selection)
  } else if (definition.multiline) {
    // Todo: Handle progressive selection updates (each line throws off following updates)
    // Todo: Perform all updates in a single transaction.
    formatMultiline([state, setState], definition, selection)
  } else if (definition.line) {
    formatLine([state, setState], definition, selection)
  } else {
    formatInline([state, setState], definition, selection)
  }
}
