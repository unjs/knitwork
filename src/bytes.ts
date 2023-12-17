export function genBytesFromBase64(input: string) {
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0) as number
  );
}

export function genBase64FromBytes(input: Uint8Array, urlSafe?: boolean) {
  if (urlSafe) {
    return globalThis
      .btoa(String.fromCodePoint(...input))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
