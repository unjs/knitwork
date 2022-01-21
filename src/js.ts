import type { CodegenOptions } from './types'

export function genString (input: string, opts: CodegenOptions = {}) {
  const str = JSON.stringify(input)
  if (!opts.singleQuotes) {
    return JSON.stringify(input)
  }
  return `'${str.replace(/'/g, "\\'")}'`
}
