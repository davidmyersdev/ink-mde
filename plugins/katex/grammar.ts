import { buildMarkNode, buildTaggedNode, defineBlockParser, defineInlineParser, defineMarkdown, getCharCode } from '/lib/codemirror-kit'

export const charCodes = {
  dollarSign: getCharCode('$'),
}

export const mathInlineTestRegex = /\$.*?\$/
export const mathInlineCaptureRegex = /\$(?<math>.*?)\$/

export const mathInline = buildTaggedNode('MathInline')
export const mathInlineMark = buildMarkNode('MathInlineMark')
export const mathInlineMarkOpen = buildMarkNode('MathInlineMarkOpen')
export const mathInlineMarkClose = buildMarkNode('MathInlineMarkClose')
export const mathInlineParser = defineInlineParser({
  name: mathInline.node.name,
  parse: (inlineContext, nextCharCode, position) => {
    // Not a "$" char.
    if (nextCharCode !== charCodes.dollarSign) return -1

    const remainingLineText = inlineContext.slice(position, inlineContext.end)

    // No ending "$" found.
    if (!mathInlineTestRegex.test(remainingLineText)) return -1

    const match = remainingLineText.match(mathInlineCaptureRegex)

    // No match found.
    if (!match?.groups?.math) return -1

    const mathExpressionLength = match.groups.math.length

    return inlineContext.addElement(
      inlineContext.elt(
        mathInline.node.name,
        position,
        position + mathExpressionLength + 2,
        [
          inlineContext.elt(
            mathInlineMark.node.name,
            position,
            position + 1,
            [
              inlineContext.elt(
                mathInlineMarkOpen.node.name,
                position,
                position + 1,
              ),
            ],
          ),
          inlineContext.elt(
            mathInlineMark.node.name,
            position + mathExpressionLength + 1,
            position + mathExpressionLength + 2,
            [
              inlineContext.elt(
                mathInlineMarkClose.node.name,
                position + mathExpressionLength + 1,
                position + mathExpressionLength + 2,
              ),
            ],
          ),
        ],
      ),
    )
  },
})

export const mathBlockTestRegex = /\$.*?\$/
export const mathBlockCaptureRegex = /\$(?<math>.*?)\$/

export const mathBlock = buildTaggedNode('MathBlock')
export const mathBlockMark = buildMarkNode('MathBlockMark')
export const mathBlockMarkOpen = buildMarkNode('MathBlockMarkOpen')
export const mathBlockMarkClose = buildMarkNode('MathBlockMarkClose')
export const mathBlockParser = defineBlockParser({
  name: 'MathBlock',
  parse: (blockContext, line) => {
    // Not "$"
    if (line.next !== charCodes.dollarSign) return false
    // Not "$$"
    if (line.text.charCodeAt(line.pos + 1) !== charCodes.dollarSign) return false

    const openLineStart = blockContext.lineStart + line.pos
    const openLineEnd = openLineStart + line.text.length

    // Move past opening line.
    while (blockContext.nextLine()) {
      // Closing "$$"
      if (line.next === charCodes.dollarSign && line.text.charCodeAt(line.pos + 1) === charCodes.dollarSign) {
        const closeLineStart = blockContext.lineStart + line.pos
        const closeLineEnd = closeLineStart + line.text.length

        blockContext.addElement(
          blockContext.elt(
            mathBlock.node.name,
            openLineStart,
            closeLineEnd,
            [
              blockContext.elt(
                mathBlockMark.node.name,
                openLineStart,
                openLineEnd,
                [
                  blockContext.elt(
                    mathBlockMarkOpen.node.name,
                    openLineStart,
                    openLineEnd,
                  ),
                ],
              ),
              blockContext.elt(
                mathBlockMark.node.name,
                closeLineStart,
                closeLineEnd,
                [
                  blockContext.elt(
                    mathBlockMarkClose.node.name,
                    closeLineStart,
                    closeLineEnd,
                  ),
                ],
              ),
            ],
          ),
        )

        blockContext.nextLine()

        break
      }
    }

    return true
  },
})

export const grammar = defineMarkdown({
  defineNodes: [
    mathInline.node,
    mathInlineMark.node,
    mathInlineMarkClose.node,
    mathInlineMarkOpen.node,
    mathBlock.node,
    mathBlockMark.node,
    mathBlockMarkOpen.node,
    mathBlockMarkClose.node,
  ],
  parseBlock: [
    mathBlockParser,
  ],
  parseInline: [
    mathInlineParser,
  ],
})
