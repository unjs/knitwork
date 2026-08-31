import type { CodegenOptions } from "./types";

/**
 * Generate a string with double or single quotes and handle escapes.
 *
 * @group string
 */
export function genString(input: string, options: CodegenOptions = {}) {
  // `JSON.stringify` escapes backslashes, control characters and `"`, but
  // leaves U+2028/U+2029 raw. They are legal in ES2019+ string literals, but
  // not in JSON, so escape them to keep the output safe to embed anywhere.
  const str = JSON.stringify(input).replace(LINE_SEPARATOR_RE, (char) =>
    char === "\u2028" ? "\\u2028" : "\\u2029",
  );
  if (!options.singleQuotes) {
    return str;
  }
  // Re-quote the escaped body rather than escaping it a second time.
  return `'${singleQuoteBody(str.slice(1, -1))}'`;
}

const LINE_SEPARATOR_RE = /[\u2028\u2029]/g;

/**
 * Convert the body of a double-quoted JSON string literal to a single-quoted
 * one: `\"` no longer needs escaping, `'` now does. Every other escape
 * sequence (`\\`, `\n`, `\uXXXX`, ...) is already valid and is copied as is.
 */
function singleQuoteBody(body: string): string {
  let result = "";
  for (let index = 0; index < body.length; index++) {
    const char = body[index];
    if (char === "\\") {
      // An escape sequence: skip past it so its payload is never re-escaped.
      const escaped = body[index + 1];
      result += escaped === '"' ? '"' : char + escaped;
      index++;
    } else {
      result += char === "'" ? "\\'" : char;
    }
  }
  return result;
}

// https://github.com/rollup/rollup/blob/master/src/utils/escapeId.ts
const NEEDS_ESCAPE_RE = /[\n\r'\\\u2028\u2029]/;
const QUOTE_NEWLINE_RE = /([\n\r'\u2028\u2029])/g;
const BACKSLASH_RE = /\\/g;

/**
 * Escape a string for use in a javascript string.
 *
 * @group string
 */
export function escapeString(id: string): string {
  if (!NEEDS_ESCAPE_RE.test(id)) {
    return id;
  }
  return id.replace(BACKSLASH_RE, "\\\\").replace(QUOTE_NEWLINE_RE, "\\$1");
}

/**
 * Generate a safe javascript variable name.
 *
 * @group string
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
