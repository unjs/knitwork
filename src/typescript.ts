import { _genStatement } from "./_utils";
import { ESMCodeGenOptions, ESMImport, genDynamicImport } from "./esm";
import { genString } from "./string";
import { genObjectKey, wrapInDelimiters } from "./utils";

export type TypeObject = {
  [key: string]: string | TypeObject;
};
export interface GenInterfaceOptions {
  extends?: string | string[];
  export?: boolean;
}

/**
 * Generate a typescript `export type` statement.
 *
 * @group Typescript
 */
export function genTypeExport(
  specifier: string,
  imports: ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("export type", specifier, imports, options);
}

/**
 * Generate an typescript `typeof import()` statement for default import.
 *
 * @group Typescript
 */
export function genInlineTypeImport(
  specifier: string,
  name = "default",
  options: ESMCodeGenOptions = {},
) {
  return `typeof ${genDynamicImport(specifier, {
    ...options,
    wrapper: false,
  })}.${name}`;
}

/**
 * Generate typescript object type.
 *
 * @group Typescript
 */
export function genTypeObject(object: TypeObject, indent = ""): string {
  const newIndent = indent + "  ";
  return wrapInDelimiters(
    Object.entries(object).map(([key, value]) => {
      const [, k = key, optional = ""] =
        key.match(/^(.*[^?])(\?)?$/) /* c8 ignore next */ || [];
      if (typeof value === "string") {
        return `${newIndent}${genObjectKey(k)}${optional}: ${value}`;
      }
      return `${newIndent}${genObjectKey(k)}${optional}: ${genTypeObject(
        value,
        newIndent,
      )}`;
    }),
    indent,
    "{}",
    false,
  );
}

/**
 * Generate typescript interface.
 *
 * @group Typescript
 */
export function genInterface(
  name: string,
  contents?: TypeObject,
  options: GenInterfaceOptions = {},
): string {
  const result = [
    options.export && "export",
    `interface ${name}`,
    options.extends &&
      `extends ${
        Array.isArray(options.extends)
          ? options.extends.join(", ")
          : options.extends
      }`,
    contents ? genTypeObject(contents) : "{}",
  ]
    .filter(Boolean)
    .join(" ");
  return result;
}

/**
 * Generate typescript `declare module` augmentation.
 *
 * @group Typescript
 */
export function genAugmentation(
  specifier: string,
  interfaces?: Record<
    string,
    TypeObject | [TypeObject, Omit<GenInterfaceOptions, "export">]
  >,
): string {
  return `declare module ${genString(specifier)} ${wrapInDelimiters(
    Object.entries(interfaces || {}).map(
      ([key, entry]) =>
        "  " +
        (Array.isArray(entry)
          ? genInterface(key, ...entry)
          : genInterface(key, entry)),
    ),
  )}`;
}
