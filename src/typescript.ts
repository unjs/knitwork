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
export interface GenEnumOptions {
  export?: boolean;
  const?: boolean;
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
  indent = "",
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
    contents ? genTypeObject(contents, indent) : "{}",
  ]
    .filter(Boolean)
    .join(" ");
  return result;
}

/**
 * Generate typescript enum.
 *
 * @group Typescript
 */
export function genEnum(
  name: string,
  members: Record<string, string | number | undefined>,
  options: GenEnumOptions = {},
  indent = "",
): string {
  const newIndent = indent + "  ";
  let previousValue: string | number | undefined;
  const body = wrapInDelimiters(
    Object.entries(members).map(([key, value]) => {
      const member = `${newIndent}${genObjectKey(key)}`;
      if (value === undefined && typeof previousValue === "string") {
        throw new TypeError(
          `Enum member "${key}" must have an initializer because it follows a string-initialized member.`,
        );
      }
      previousValue = value;
      if (value === undefined) {
        return member;
      }
      return `${member} = ${
        typeof value === "string" ? genString(value) : value
      }`;
    }),
    indent,
    "{}",
  );
  return [
    options.export && "export",
    options.const && "const",
    `enum ${name}`,
    body,
  ]
    .filter(Boolean)
    .join(" ");
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
          : genInterface(key, entry, {}, "  ")),
    ),
    undefined,
    undefined,
    false,
  )}`;
}
