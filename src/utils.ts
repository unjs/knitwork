import { genString } from './string'

export function wrapInDelimiters (lines: string[], indent = '', delimiters = '{}', withComma = true) {
  if (!lines.length) {
    return delimiters
  }
  const [start, end] = delimiters
  return `${start}\n` + lines.join(withComma ? ',\n' : '\n') + `\n${indent}${end}`
}

const VALID_IDENTIFIER_RE = /^[$_]?[\w\d]*$/

export function genObjectKey (key: string) {
  return key.match(VALID_IDENTIFIER_RE) ? key : genString(key)
}
