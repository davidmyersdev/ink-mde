// https://discuss.codemirror.net/t/adding-support-for-the-additional-inline-syntax-to-markdown/3099
import { styleTags, Tag, tags } from '@lezer/highlight'
import { hashSigns, hashtagBoundaryChars, matchHashtag } from '/lib/hashtag/parser'
import type { DelimiterType, InlineContext, MarkdownConfig } from '@lezer/markdown'

interface ParserContext {
  charCode: number
  index: number
  inline: InlineContext
}

type Parser = (context: InlineContext, charCode: number, index: number) => number
type ParserCallback = (context: ParserContext) => number

const makeParser = (callback: ParserCallback): Parser => {
  return (inline: InlineContext, charCode: number, index: number) => {
    return callback({
      charCode,
      index,
      inline,
    })
  }
}

const getCode = (char: string) => {
  return char.charCodeAt(0)
}

const getMatches = (context: ParserContext, regex: RegExp): RegExpExecArray | null => {
  return regex.exec(context.inline.slice(context.index, context.inline.end))
}

const is = (context: InlineContext, token: string, position: number) => {
  return context.slice(position, Math.min(position + token.length, context.end)) === token
}

const matches = (context: InlineContext, token: RegExp, position: number) => {
  return token.test(context.slice(position, context.end))
}

const HighlightDelim = { resolve: 'Highlight', mark: 'HighlightMark' }

export const hashtag = Tag.define()
export const hashtagMark = Tag.define()
export const highlight = Tag.define()
export const reference = Tag.define()

const Highlight: MarkdownConfig = {
  defineNodes: ['Highlight', 'HighlightMark'],
  parseInline: [
    {
      name: 'Highlight',
      parse(cx, next, pos) {
        if (next != getCode('=') || cx.char(pos + 1) != getCode('=')) { return -1 }

        return cx.addDelimiter(HighlightDelim, pos, pos + 2, true, true)
      },
      after: 'Emphasis',
    },
  ],
  props: [
    styleTags({
      HighlightMark: tags.processingInstruction,
      Highlight: highlight,
    }),
  ],
}

const HashtagDelimiter: DelimiterType = { resolve: 'Hashtag', mark: 'HashtagMark' }
const Hashtag: MarkdownConfig = {
  defineNodes: ['Hashtag', 'HashtagMark', 'HashtagEnd'],
  parseInline: [
    {
      name: 'Hashtag',
      parse: makeParser((context) => {
        // If not the first char, verify a valid "boundary" char is present before this one.
        // Verify the current start char is a hash sign.
        // Match the hashtag.
        const relativeIndex = context.index - context.inline.offset

        if (relativeIndex > 0) {
          const previousChar = context.inline.slice(context.index - 1, context.index)

          if (!hashtagBoundaryChars.test(previousChar)) { return -1 }
        }

        const currentChar = context.inline.slice(context.index, context.index + 1)

        if (!hashSigns.test(currentChar)) { return -1 }

        const match = matchHashtag(
          context.inline.slice(
            context.index,
            context.inline.end
          )
        )

        if (match) {
          console.log(match)

          const offset = match.length

          // Start of hashtag
          // context.inline.addDelimiter(
          //   HashtagDelimiter,
          //   context.index,
          //   context.index + 1,
          //   true,
          //   false
          // )

          // The following implementation will work if we want to keep the hashtag value and the token (#) separate. If
          // so, change the starting point of the next element to `index + 1`.
          // context.inline.addElement(
          //   context.inline.elt(
          //     'HashtagMark',
          //     context.index,
          //     context.index + 1
          //   )
          // )

          return context.inline.addElement(
            context.inline.elt(
              'Hashtag',
              context.index,
              context.index + offset
            )
          )

          // End of hashtag
          // return context.inline.addDelimiter(HashtagDelimiter, context.index + offset, context.index + 1 + offset, false, true)
        }

        return -1
      }),
      after: 'Emphasis',
    },
  ],
  props: [
    styleTags({
      HashtagMark: hashtagMark,
      Hashtag: hashtag,
    }),
  ],
}

const ReferenceStartDelimiter = {}
const Reference: MarkdownConfig = {
  defineNodes: ['Reference', 'ReferenceMark'],
  parseInline: [
    {
      name: 'ReferenceStart',
      parse(cx, next, pos) {
        return next === getCode('[') && cx.char(pos + 1) === getCode('[')
          ? cx.addDelimiter(ReferenceStartDelimiter, pos, pos + 2, true, false)
          : -1
      },
      after: 'Emphasis',
    },
    {
      name: 'Reference',
      parse(cx, next, pos) {
        if (!(next === getCode(']') && cx.char(pos + 1) === getCode(']'))) { return -1 }

        // @ts-ignore
        const parts = cx.parts

        const openIndex = cx.findOpeningDelimiter(ReferenceStartDelimiter)

        console.log({ openIndex })

        if (Number.isInteger(openIndex)) {
          const start = parts[openIndex].from
          const end = pos + 2
          const content = cx.takeContent(openIndex)

          content.unshift(cx.elt('ReferenceMark', start, start + 2))
          content.push(cx.elt('ReferenceMark', end - 2, end))

          let ref = parts[openIndex] = cx.elt('Reference', start, end, content)

          return ref.to
        }

        return -1
      },
      after: 'ReferenceStart',
    },
  ],
  props: [
    styleTags({
      ReferenceMark: tags.processingInstruction,
      Reference: reference,
    }),
  ],
}

export const extensions = () => {
  return [Highlight, Reference, Hashtag]
}
