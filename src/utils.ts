import { genString } from "./string";

/**
 * Wrap an array of strings in delimiters.
 *
 * @group utils
 */
export function wrapInDelimiters(
  lines: string[],
  indent = "",
  delimiters = "{}",
  withComma = true,
) {
  if (lines.length === 0) {
    return delimiters;
  }
  const [start, end] = delimiters;
  return (
    `${start}\n` + lines.join(withComma ? ",\n" : "\n") + `\n${indent}${end}`
  );
}

const VALID_IDENTIFIER_RE = /^[$_]?([A-Z_a-z]\w*|\d)$/;

/**
 * Generate a safe javascript variable name for an object key.
 *
 * @group utils
 */
export function genObjectKey(key: string) {
  return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}

/**
 * Generate a safe javascript property access expression for an object key.
 *
 * @group utils
 */
export function genPropertyAccess(key: string) {
  return VALID_IDENTIFIER_RE.test(key) ? `.${key}` : `[${genString(key)}]`;
}
