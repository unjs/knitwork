import { ESMCodeGenOptions, ESMExport, ESMImport } from "./esm";
import { genString } from "./string";

type ImportExportType = "import" | "export" | "import type" | "export type";

export function _genStatement(
  type: ImportExportType,
  specifier: string,
  names?: ESMImport | ESMExport | Array<ESMImport | ESMExport>,
  options: ESMCodeGenOptions = {},
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
    )}${_genImportAttributes(type, options)};`;
  }
  return `${type} ${namesString} from ${genString(
    specifier,
    options,
  )}${_genImportAttributes(type, options)};`;
}

function _genImportAttributes(
  type: ImportExportType,
  options: ESMCodeGenOptions,
) {
  // import assertions isn't specified type-only import or export on Typescript
  if (type === "import type" || type === "export type") {
    return "";
  }

  if (typeof options.attributes?.type === "string") {
    return ` with { type: ${genString(options.attributes.type)} }`;
  }

  // TODO: Remove deprecated `assert` in the next major release
  if (typeof options.assert?.type === "string") {
    return ` assert { type: ${genString(options.assert.type)} }`;
  }

  return "";
}
