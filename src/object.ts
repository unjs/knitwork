import { genObjectKey, wrapInDelimiters } from './utils'

export function genObjectFromValues (obj: Record<string, any>, indent = ''): string {
  return genObjectFromRaw(obj, indent, true)
}

export function genObjectFromRaw (obj: Record<string, any>, indent = '', preserveTypes = false): string {
  return genObjectFromRawEntries(Object.entries(obj), indent, preserveTypes)
}

export function genArrayFromRaw (array: any[], indent = '', preserveTypes: boolean = false) {
  const newIdent = indent + '  '
  return wrapInDelimiters(array.map(i => `${newIdent}${genRawValue(i, newIdent, preserveTypes)}`), indent, '[]')
}

export function genObjectFromRawEntries (array: [key: string, value: any][], indent = '', preserveTypes = false) {
  const newIdent = indent + '  '
  return wrapInDelimiters(array.map(([key, value]) => `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent, preserveTypes)}`), indent, '{}')
}

// --- Internals ---

function genRawValue (value: unknown, indent = '', preserveTypes = false): string {
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent, preserveTypes)
  }
  if (value && typeof value === 'object') {
    return genObjectFromRaw(value, indent, preserveTypes)
  }
  if (preserveTypes && typeof value !== 'function') {
    return JSON.stringify(value)
  }
  return value.toString()
}
