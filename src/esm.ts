import { CodegenOptions } from "./types";
import { genString } from "./string";
import { _genStatement } from "./_utils";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
export type ESMImport = string | { name: string; as?: string };

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports
export type ESMExport = string | { name: string; as?: string };

export interface ESMCodeGenOptions extends CodegenOptions {
  // https://github.com/tc39/proposal-import-attributes
  // https://nodejs.org/api/esm.html#import-attributes
  attributes?: { type: string };
  /** @deprecated use attributes */
  assert?: { type: string };
}

export interface DynamicImportOptions extends ESMCodeGenOptions {
  comment?: string;
  wrapper?: boolean;
  interopDefault?: boolean;
}

/**
 * Generate an ESM `import` statement.
 *
 * @example
 *
 * ```js
 * genImport("pkg", "foo");
 * // ~> `import foo from "pkg";`
 *
 * genImport("pkg", ["foo"]);
 * // ~> `import { foo } from "pkg";`
 *
 * genImport("pkg", ["a", "b"]);
 * // ~> `import { a, b } from "pkg`;
 *
 * genImport("pkg", [{ name: "default", as: "bar" }]);
 * // ~> `import { default as bar } from "pkg`;
 *
 * genImport("pkg", [{ name: "foo", as: "bar" }]);
 * // ~> `import { foo as bar } from "pkg`;
 *
 * genImport("pkg", "foo", { attributes: { type: "json" } });
 * // ~> `import foo from "pkg" with { type: "json" };
 *
 * genExport("pkg", "foo");
 * // ~> `export foo from "pkg";`
 *
 * genExport("pkg", ["a", "b"]);
 * // ~> `export { a, b } from "pkg";`
 *
 * // export * as bar from "pkg"
 * genExport("pkg", { name: "*", as: "bar" });
 * // ~> `export * as bar from "pkg";`
 * ```
 *
 * @group ESM
 */
export function genImport(
  specifier: string,
  imports?: ESMImport | ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("import", specifier, imports, options);
}

/**
 * Generate an ESM `import type` statement.
 *
 * @group ESM
 */
export function genTypeImport(
  specifier: string,
  imports: ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("import type", specifier, imports, options);
}

/**
 * Generate an ESM `export` statement.
 *
 * @group ESM
 */
export function genExport(
  specifier: string,
  exports?: ESMExport | ESMExport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("export", specifier, exports, options);
}

/**
 * Generate an ESM dynamic `import()` statement.
 *
 * @group ESM
 */
export function genDynamicImport(
  specifier: string,
  options: DynamicImportOptions = {},
) {
  const commentString = options.comment ? ` /* ${options.comment} */` : "";
  const wrapperString = options.wrapper === false ? "" : "() => ";
  const ineropString = options.interopDefault
    ? ".then(m => m.default || m)"
    : "";
  const optionsString = _genDynamicImportAttributes(options);
  return `${wrapperString}import(${genString(
    specifier,
    options,
  )}${commentString}${optionsString})${ineropString}`;
}

// --- internal ---

function _genDynamicImportAttributes(options: DynamicImportOptions = {}) {
  // TODO: Remove deprecated `assert` in the next major release
  if (typeof options.assert?.type === "string") {
    return `, { assert: { type: ${genString(options.assert.type)} } }`;
  }

  if (typeof options.attributes?.type === "string") {
    return `, { with: { type: ${genString(options.attributes.type)} } }`;
  }

  return "";
}
