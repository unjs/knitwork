import { genObjectKey, wrapInDelimiters } from "./utils";

export function genObjectFromRaw (object: Record<string, any>, indent = ""): string {
  return genObjectFromRawEntries(Object.entries(object), indent);
}

export function genArrayFromRaw (array: any[], indent = "") {
  const newIdent = indent + "  ";
  return wrapInDelimiters(array.map(index => `${newIdent}${genRawValue(index, newIdent)}`), indent, "[]");
}

export function genObjectFromRawEntries (array: [key: string, value: any][], indent = "") {
  const newIdent = indent + "  ";
  return wrapInDelimiters(array.map(([key, value]) => `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent)}`), indent, "{}");
}

// --- Internals ---

function genRawValue (value: unknown, indent = ""): string {
  if (typeof value === "undefined") {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent);
  }
  if (value && typeof value === "object") {
    return genObjectFromRaw(value, indent);
  }
  if (value && typeof value === "function") {
    return value.toString().replace(new RegExp(`^${value.name}`), "function ");
  }
  return value.toString();
}
