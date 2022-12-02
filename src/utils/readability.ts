export const DEFAULT_WORDS_PER_MINUTE = 225

export const toHuman = (text: string, wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE): string => {
  const readTime = toHumanReadTime(text, wordsPerMinute)
  const wordCount = toHumanWordCount(text)
  const lineCount = toHumanLineCount(text)
  const charCount = toHumanCharCount(text)

  return [readTime, wordCount, lineCount, charCount].join(' | ')
}

export const toHumanCharCount = (text: string): string => {
  const charCount = toCharCount(text)

  return `${charCount} chars`
}

export const toHumanLineCount = (text: string): string => {
  const lineCount = toLineCount(text)

  return `${lineCount} lines`
}

export const toHumanReadTime = (text: string, wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE): string => {
  const readTime = toReadTime(text, wordsPerMinute)
  const readTimeMinutes = Math.floor(readTime)
  const readTimeSeconds = Math.floor((readTime % 1) * 60)

  if (readTimeMinutes === 0) {
    return `${readTimeSeconds}s read`
  }

  return `${readTimeMinutes}m ${readTimeSeconds}s to read`
}

export const toHumanWordCount = (text: string): string => {
  const wordCount = toWordCount(text)

  return `${wordCount} words`
}

export const toCharCount = (text: string): number => {
  return text.length
}

export const toLineCount = (text: string): number => {
  return text.split(/\n/).length
}

export const toReadTime = (text: string, wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE): number => {
  return toWordCount(text) / wordsPerMinute
}

export const toWordCount = (text: string): number => {
  const scrubbed = text.replace(/[']/g, '').replace(/[^\w\d]+/g, ' ').trim()

  if (!scrubbed) {
    return 0
  }

  return scrubbed.split(/\s+/).length
}
