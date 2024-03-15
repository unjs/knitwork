export function genBytesFromBase64(input: string, urlSafe?: boolean) {
  if (urlSafe) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const paddingLength = input.length % 4;
    if (paddingLength === 2) {
      input += "==";
    } else if (paddingLength === 3) {
      input += "=";
    }
  }
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
