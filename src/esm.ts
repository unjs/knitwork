import { CodegenOptions } from "./types";
import { genString } from "./string";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-imports
export type ESMImport = string | { name: string; as?: string };

export function genImport(
  specifier: string,
  imports?: ESMImport | ESMImport[],
  options: CodegenOptions = {},
) {
  return _genStatement("import", specifier, imports, options);
}

export function genTypeImport(
  specifier: string,
  imports: ESMImport[],
  options: CodegenOptions = {},
) {
  return _genStatement("import type", specifier, imports, options);
}

export function genTypeExport(
  specifier: string,
  imports: ESMImport[],
  options: CodegenOptions = {},
) {
  return _genStatement("export type", specifier, imports, options);
}

export const genInlineTypeImport = (
  specifier: string,
  name = "default",
  options: CodegenOptions = {},
) => {
  return `typeof ${genDynamicImport(specifier, {
    ...options,
    wrapper: false,
  })}.${name}`;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports
export type ESMExport = string | { name: string; as?: string };

export function genExport(
  specifier: string,
  exports?: ESMExport | ESMExport[],
  options: CodegenOptions = {},
) {
  return _genStatement("export", specifier, exports, options);
}

type ESMImportOrExport = ESMImport | ESMExport;
type ImportExportType = "import" | "export" | "import type" | "export type";
function _genStatement(
  type: ImportExportType,
  specifier: string,
  names?: ESMImportOrExport | ESMImportOrExport[],
  options: CodegenOptions = {},
) {
  const specifierString = genString(specifier, options);
  if (!names) {
    return `${type} ${specifierString};`;
  }

  const nameArray = Array.isArray(names);

  const _names = (nameArray ? names : [names]).map((index) => {
    if (typeof index === "string") {
      return { name: index };
    }
    if (index.name === index.as) {
      index = { name: index.name };
    }
    // TODO: Ensure `name` and `as` are valid identifiers
    // TODO: Ensure `as` is provided for default import
    return index;
  });

  const namesString = _names
    .map((index) => (index.as ? `${index.name} as ${index.as}` : index.name))
    .join(", ");
  if (nameArray) {
    return `${type} { ${namesString} } from ${genString(
      specifier,
      options,
    )}${_genAssertClause(type, options.assert)};`;
  }
  return `${type} ${namesString} from ${genString(
    specifier,
    options,
  )}${_genAssertClause(type, options.assert)};`;
}

function _genAssertClause(type: ImportExportType, assert?: { type: string }) {
  // import assertions isn't specified type-only import or export on Typescript
  if (type === "import type" || type === "export type") {
    return "";
  }
  // currently, `type` only
  if (!assert || typeof assert !== "object") {
    return "";
  }
  return ` assert { type: ${genString(assert.type)} }`;
}

export interface DynamicImportOptions extends CodegenOptions {
  comment?: string;
  wrapper?: boolean;
  interopDefault?: boolean;
  // https://github.com/tc39/proposal-import-assertions
  // https://tc39.es/proposal-import-assertions/
  assert?: {
    type: string;
  };
}
export function genDynamicImport(
  specifier: string,
  options: DynamicImportOptions = {},
) {
  const commentString = options.comment ? ` /* ${options.comment} */` : "";
  const wrapperString = options.wrapper === false ? "" : "() => ";
  const ineropString = options.interopDefault
    ? ".then(m => m.default || m)"
    : "";
  const optionsString = _genDynamicImportOptions(options);
  return `${wrapperString}import(${genString(
    specifier,
    options,
  )}${commentString}${optionsString})${ineropString}`;
}

function _genDynamicImportOptions(options: DynamicImportOptions = {}) {
  // currently, `assert` option only
  return options.assert && typeof options.assert === "object"
    ? `, { assert: { type: ${genString(options.assert.type)} } }`
    : "";
}

export function genSafeVariableName(name: string) {
  if (reservedNames.has(name)) {
    return `_${name}`;
  }
  /* eslint-disable unicorn/prefer-code-point */
  return name
    .replace(/^\d/, (r) => `_${r}`)
    .replace(/\W/g, (r) => "_" + r.charCodeAt(0));
  /* eslint-enable unicorn/prefer-code-point */
}

// Credit: https://mathiasbynens.be/notes/reserved-keywords
const reservedNames = new Set([
  "Infinity",
  "NaN",
  "arguments",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);
