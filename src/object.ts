import { genObjectKey, wrapInDelimiters } from './utils'

export function genObjectFromRaw (obj: Record<string, any>, indent = '', preserveString: boolean = false): string {
  return genObjectFromRawEntries(Object.entries(obj), indent, preserveString)
}

export function genArrayFromRaw (array: any[], indent = '', preserveString: boolean = false) {
  const newIdent = indent + '  '
  return wrapInDelimiters(array.map(i => `${newIdent}${genRawValue(i, newIdent, preserveString)}`), indent, '[]')
}

export function genObjectFromRawEntries (array: [key: string, value: any][], indent = '', preserveString: boolean = false) {
  const newIdent = indent + '  '
  return wrapInDelimiters(array.map(([key, value]) => `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent, preserveString)}`), indent, '{}')
}

// --- Internals ---

function genRawValue (value: unknown, indent = '', preserveString: boolean = false): string {
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent, preserveString)
  }
  if (value && typeof value === 'object') {
    return genObjectFromRaw(value, indent, preserveString)
  }
  if (preserveString && typeof value !== 'function') {
    return JSON.stringify(value)
  }
  return value.toString()
}
