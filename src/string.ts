import type { CodegenOptions } from "./types";

export function genString(input: string, options: CodegenOptions = {}) {
  const { singleQuotes = false } = options;

  let string_ = JSON.stringify(input);
  if (singleQuotes) {
    string_ = escapeString(string_);
    // JSON.stringify will always use double quotes, so we need to replace them
    string_ = `'${string_.slice(1, -1)}'`;
  }
  return string_;
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
