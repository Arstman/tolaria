const INLINE_MARKDOWN_PATTERNS = [
  /~~(\S[^~]*\S|\S)~~/gu,
  /\[([^\]]+)\]\([^)]+\)/gu,
  /\[\[[^|\]]+\|([^\]]+)\]\]/gu,
  /\[\[([^\]]+)\]\]/gu,
  /\[\[([^\]]*)$/gu,
]
const LETTER_OR_NUMBER_PATTERN = /[\p{L}\p{N}]/u

function isLetterOrNumber(value: string | undefined): boolean {
  return value !== undefined && LETTER_OR_NUMBER_PATTERN.test(value)
}

function isEscapableInlineMarker(value: string | undefined): boolean {
  return value === '*' || value === '_' || value === '`'
}

function shouldRemoveInlineMarker(
  character: string | undefined,
  previousCharacter: string | undefined,
  nextCharacter: string | undefined,
): boolean {
  if (character === '*' || character === '`') return true
  if (character !== '_') return false
  return !isLetterOrNumber(previousCharacter) || !isLetterOrNumber(nextCharacter)
}

function stripInlineMarkers(text: string): string {
  const characters = [...text]
  let result = ''

  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index]
    const nextCharacter = characters[index + 1]

    if (character === '\\' && isEscapableInlineMarker(nextCharacter)) {
      result += nextCharacter
      index += 1
      continue
    }
    if (shouldRemoveInlineMarker(character, characters[index - 1], nextCharacter)) continue
    result += character
  }

  return result
}

export function stripInlineMarkdown(text: string): string {
  const withoutLinks = INLINE_MARKDOWN_PATTERNS.reduce(
    (result, pattern) => result.replace(pattern, '$1'),
    text,
  )
  return stripInlineMarkers(withoutLinks).trim()
}
