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

/**
 * Generate a safe javascript variable name.
 */
export function genSafeVariableName(name: string) {
  if (reservedNames.has(name)) {
    return `_${name}`;
  }
  /* eslint-disable unicorn/prefer-code-point */
  return name
    .replace(/^\d/, (r) => `_${r}`)
    .replace(/\W/g, (r) => "_" + r.charCodeAt(0));
  /* eslint-enable unicorn/prefer-code-point */
}

// -- internal --

// Credit: https://mathiasbynens.be/notes/reserved-keywords
const reservedNames = new Set([
  "Infinity",
  "NaN",
  "arguments",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);
