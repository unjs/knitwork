import { genBase64FromBytes, genBytesFromBase64 } from "./bytes";
import type { CodegenOptions } from "./types";

export function genString(input: string, options: CodegenOptions = {}) {
  const string_ = JSON.stringify(input);
  if (!options.singleQuotes) {
    return JSON.stringify(input);
  }
  return `'${escapeString(string_)}'`;
}

export function genBase64FromString(
  input: string,
  options: CodegenOptions = {}
) {
  if (options.encoding === "utf8") {
    return genBase64FromBytes(new TextEncoder().encode(input));
  }
  return globalThis.btoa(input);
}

export function genStringFromBase64(
  input: string,
  options: CodegenOptions = {}
) {
  if (options.encoding === "utf8") {
    return new TextDecoder().decode(genBytesFromBase64(input));
  }
  return globalThis.atob(input);
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
