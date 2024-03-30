import type { CodegenOptions } from "./types";
import { genObjectKey, wrapInDelimiters } from "./utils";

export interface GenObjectOptions extends CodegenOptions {
  preserveTypes?: boolean;
}

export function genObjectFromValues(
  obj: Record<string, any>,
  indent = "",
  options: GenObjectOptions = {},
): string {
  return genObjectFromRaw(obj, indent, { preserveTypes: true, ...options });
}

export function genObjectFromRaw(
  object: Record<string, any>,
  indent = "",
  options: GenObjectOptions = {},
): string {
  return genObjectFromRawEntries(Object.entries(object), indent, options);
}

export function genArrayFromRaw(
  array: any[],
  indent = "",
  options: GenObjectOptions = {},
) {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    array.map((index) => `${newIdent}${genRawValue(index, newIdent, options)}`),
    indent,
    "[]",
  );
}

export function genObjectFromRawEntries(
  array: [key: string, value: any][],
  indent = "",
  options: GenObjectOptions = {},
) {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    array.map(
      ([key, value]) =>
        `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent, options)}`,
    ),
    indent,
    "{}",
  );
}

// --- Internals ---

function genRawValue(
  value: unknown,
  indent = "",
  options: GenObjectOptions = {},
): string {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent, options);
  }
  if (value && typeof value === "object") {
    return genObjectFromRaw(value, indent, options);
  }
  if (options.preserveTypes && typeof value !== "function") {
    return JSON.stringify(value);
  }
  return value.toString();
}
