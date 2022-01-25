import type { CodegenOptions } from './types'

export function genString (input: string, opts: CodegenOptions = {}) {
  const str = JSON.stringify(input)
  if (!opts.singleQuotes) {
    return JSON.stringify(input)
  }
  return `'${escapeString(str)}'`
}

// https://github.com/rollup/rollup/blob/master/src/utils/escapeId.ts
const NEEDS_ESCAPE_RE = /[\\'\r\n\u2028\u2029]/
const QUOTE_NEWLINE_RE = /(['\r\n\u2028\u2029])/g
const BACKSLASH_RE = /\\/g
export function escapeString (id: string): string {
  if (!id.match(NEEDS_ESCAPE_RE)) { return id }
  return id.replace(BACKSLASH_RE, '\\\\').replace(QUOTE_NEWLINE_RE, '\\$1')
}
