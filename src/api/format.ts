import { syntaxTree } from '@codemirror/language'
import type { NodeType } from '@lezer/common'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'
import * as InkValues from '/types/values'
import { toInk } from '../editor/adapters/selections'

// Todo:
// - [ ] Handle special scenarios (e.g. headings in quote blocks).
// - [ ] Handle multiline selections (e.g. bolding multiple lines worth of content).

interface ChangeDetails {
  editor: InkInternal.Editor,
  formatDefinition: FormatDefinition,
  selection: Ink.Editor.Selection,
  node?: NodeDefinition,
}

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

interface NodeDefinition {
  type: NodeType,
  from: number,
  to: number,
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

const splitSelectionByLines = ({ editor, selection }: ChangeDetails) => {
  let position = selection.start
  const selections: Ink.Editor.Selection[] = []

  while (position <= selection.end) {
    const line = editor.lineBlockAt(position)
    const start = Math.max(selection.start, line.from)
    const end = Math.min(selection.end, line.to)

    selections.push({ start, end })

    position = line.to + 1
  }

  return selections
}

const getSelection = ({ editor, formatDefinition, selection }: Partial<ChangeDetails>) => {
  if (!editor || !formatDefinition) return selection || { start: 0, end: 0 }

  // Todo: expose an actual API for getting the current selection or fallback
  const initialSelection = selection || toInk(editor.state.selection).pop() || { start: 0, end: 0 }

  if (formatDefinition.block || formatDefinition.line || formatDefinition.multiline) {
    const start = editor.lineBlockAt(initialSelection.start).from
    const end = editor.lineBlockAt(initialSelection.end).to

    return { start, end }
  }

  const start = editor.state.wordAt(initialSelection.start)?.from || initialSelection.start
  const end = editor.state.wordAt(initialSelection.end)?.to || initialSelection.end

  return { start, end }
}

const getText = (changeDetails: ChangeDetails) => {
  return changeDetails.editor.state.sliceDoc(changeDetails.selection.start, changeDetails.selection.end)
}

const getNode = (editor: InkInternal.Editor, definition: FormatDefinition, selection: Ink.Editor.Selection) => {
  const selectionNodes = getNodes(editor, selection)

  return selectionNodes.find(({ type }) => definition.nodes.includes(type.name))
}

const getNodes = (editor: InkInternal.Editor, selection: Ink.Editor.Selection) => {
  const nodeDefinitions: NodeDefinition[] = []

  syntaxTree(editor.state).iterate({
    from: selection.start,
    to: selection.end,
    enter: ({ type, from, to }) => {
      nodeDefinitions.push({ type, from, to })
    },
  })

  return nodeDefinitions
}

const unformat = (changeDetails: ChangeDetails) => {
  const text = getText(changeDetails)
  const sliceStart = changeDetails.formatDefinition.prefix.length
  const sliceEnd = changeDetails.formatDefinition.suffix.length * -1 || text.length
  const unformatted = text.slice(sliceStart, sliceEnd)

  return [{ from: changeDetails.selection.start, to: changeDetails.selection.end, insert: unformatted }]
}

const formatBlock = (changeDetails: ChangeDetails) => {
  if (changeDetails.node) {
    const start = changeDetails.node.from
    const end = changeDetails.node.to

    return unformat({ ...changeDetails, selection: { start, end } })
  } else {
    const before = changeDetails.formatDefinition.prefix
    const after = changeDetails.formatDefinition.suffix

    const changes = [
      { from: changeDetails.selection.start, insert: before },
      { from: changeDetails.selection.end, insert: after },
    ]

    return changes
  }
}

const formatMultiline = (changeDetails: ChangeDetails) => {
  const selections = splitSelectionByLines(changeDetails)
  const changes = <{ from: number, to?: number, insert: string }[]>[]

  selections.forEach((selection) => {
    const lineChanges = formatLine({ ...changeDetails, selection })

    changes.push(...lineChanges)
  })

  return changes
}

const formatLine = (changeDetails: ChangeDetails) => {
  const hasPrefixStates = changeDetails.formatDefinition.prefixStates.length > 0
  const text = getText(changeDetails)

  if (changeDetails.node && hasPrefixStates) {
    const prefixState = changeDetails.formatDefinition.prefixStates.find(prefix => text.startsWith(prefix))

    if (prefixState) {
      const prefixStateIndex = changeDetails.formatDefinition.prefixStates.indexOf(prefixState)
      const nextPrefixState = changeDetails.formatDefinition.prefixStates[prefixStateIndex + 1]
      const updatedText = text.replace(new RegExp(`^${prefixState}`), nextPrefixState)

      return [{ from: changeDetails.selection.start, to: changeDetails.selection.end, insert: updatedText }]
    }
  } else if (changeDetails.node && text.startsWith(changeDetails.formatDefinition.prefix)) {
    return unformat(changeDetails)
  }

  return [{ from: changeDetails.selection.start, insert: changeDetails.formatDefinition.prefix }]
}

const formatInline = (changeDetails: ChangeDetails) => {
  if (changeDetails.node) {
    const start = changeDetails.node.from
    const end = changeDetails.node.to

    return unformat({ ...changeDetails, selection: { start, end } })
  } else {
    const { formatDefinition, selection } = changeDetails
    const before = Array.isArray(formatDefinition.prefix) ? formatDefinition.prefix[0] : formatDefinition.prefix
    const after = formatDefinition.suffix

    return [
      { from: selection.start, insert: before },
      { from: selection.end, insert: after },
    ]
  }
}

const getChanges = (changeDetails: ChangeDetails) => {
  if (changeDetails.formatDefinition.block) {
    return formatBlock(changeDetails)
  } else if (changeDetails.formatDefinition.multiline) {
    return formatMultiline(changeDetails)
  } else if (changeDetails.formatDefinition.line) {
    return formatLine(changeDetails)
  }

  return formatInline(changeDetails)
}

export const format = (state: InkInternal.StoreState, formatType: Ink.EnumString<Ink.Values.Markup>, { selection: maybeSelection }: Ink.Instance.FormatOptions = {}) => {
  const { val: editor } = state.editor
  const formatDefinition = formatting[formatType]
  const selection = getSelection({ editor, formatDefinition, selection: maybeSelection })
  const node = getNode(editor, formatDefinition, selection)
  const changeDetails: ChangeDetails = {
    editor,
    formatDefinition,
    node,
    selection,
  }
  const changes = getChanges(changeDetails)
  const offset = changes.reduce((total, change: { from: number, insert: string, to?: number }) => {
    const offset = change.insert.length - ((change.to || change.from) - change.from)

    return total + offset
  }, 0)

  const updates = editor.state.update({ changes, selection: { head: selection.start, anchor: selection.end + offset } })

  editor.dispatch(updates)
}
