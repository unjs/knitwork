import { genString } from "./string";

export function wrapInDelimiters(
  lines: string[],
  indent = "",
  delimiters = "{}",
  withComma = true
) {
  if (lines.length === 0) {
    return delimiters;
  }
  const [start, end] = delimiters;
  return (
    `${start}\n` + lines.join(withComma ? ",\n" : "\n") + `\n${indent}${end}`
  );
}

const VALID_IDENTIFIER_RE = /^[$_]?\w*$/;

export function genObjectKey(key: string) {
  return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}
