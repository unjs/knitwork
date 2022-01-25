import { genString } from './string'

export function genObjectFromRaw (obj: Record<string, any>, indent = ''): string {
  return genObjectFromRawEntries(Object.entries(obj), indent)
}

export function genArrayFromRaw (array: any[], indent = '') {
  const newIdent = indent + '  '
  return wrapInDelimiters(array.map(i => `${newIdent}${genRawValue(i, newIdent)}`), indent, '[]')
}

export function genObjectFromRawEntries (array: [key: string, value: any][], indent = '') {
  const newIdent = indent + '  '
  return wrapInDelimiters(array.map(([key, value]) => `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent)}`), indent, '{}')
}

// --- Internals ---

function wrapInDelimiters (lines: string[], indent = '', delimiters = '{}') {
  if (!lines.length) {
    return delimiters
  }
  const [start, end] = delimiters
  return `${start}\n` + lines.join(',\n') + `\n${indent}${end}`
}

function genRawValue (value: unknown, indent = ''): string {
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent)
  }
  if (value && typeof value === 'object') {
    return genObjectFromRaw(value, indent)
  }
  return value.toString()
}

const VALID_IDENTIFIER_RE = /^[$_]?[\w\d]*$/

function genObjectKey (key: string) {
  return key.match(VALID_IDENTIFIER_RE) ? key : genString(key)
}
