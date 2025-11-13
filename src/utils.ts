import { VALID_IDENTIFIER_RE } from "./_utils";
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

/**
 * Generate a safe javascript variable name for an object key.
 *
 * @group utils
 */
export function genObjectKey(key: string) {
  return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}
