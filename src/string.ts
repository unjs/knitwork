import type { CodegenOptions } from "./types";

export function genString(input: string, options: CodegenOptions = {}) {
  const str = JSON.stringify(input);
  if (!options.singleQuotes) {
    return str;
  }
  return `'${escapeString(str).slice(1, -1)}'`;
}

// https://github.com/rollup/rollup/blob/master/src/utils/escapeId.ts
const NEEDS_ESCAPE_RE = /[\n\r'\\\u2028\u2029]/;
const QUOTE_NEWLINE_RE = /([\n\r'\u2028\u2029])/g;
const BACKSLASH_RE = /\\/g;
export function escapeString(id: string): string {
  if (!NEEDS_ESCAPE_RE.test(id)) {
    return id;
  }
  return id.replace(BACKSLASH_RE, "\\\\").replace(QUOTE_NEWLINE_RE, "\\$1");
}
