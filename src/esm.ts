import { CodegenOptions } from './types'
import { genString } from './string'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-imports
export type ESMImport = string | { name: string, as?: string }

export function genImport(specifier: string, imports?: ESMImport | ESMImport[], opts: CodegenOptions = {}) {
  return _genStatement('import', specifier, imports, opts)
}

export function genTypeImport(specifier: string, imports: ESMImport[], opts: CodegenOptions = {}) {
  return _genStatement('import type', specifier, imports, opts)
}

export function genTypeExport(specifier: string, imports: ESMImport[], opts: CodegenOptions = {}) {
  return _genStatement('export type', specifier, imports, opts)
}

export const genInlineTypeImport = (specifier: string, name = 'default', opts: CodegenOptions = {}) => {
  return `typeof ${genDynamicImport(specifier, { ...opts, wrapper: false })}.${name}`
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports
export type ESMExport = string | { name: string, as?: string }

export function genExport(specifier: string, exports?: ESMExport | ESMExport[], opts: CodegenOptions = {}) {
  return _genStatement('export', specifier, exports, opts)
}

type ESMImportOrExport = ESMImport | ESMExport
function _genStatement(type: 'import' | 'export' | 'import type' | 'export type', specifier: string, names?: ESMImportOrExport | ESMImportOrExport[], opts: CodegenOptions = {}) {
  const specifierStr = genString(specifier, opts)
  if (!names) {
    return `${type} ${specifierStr};`
  }

  const nameArray = Array.isArray(names)

  const _names = (nameArray ? names : [names]).map((i) => {
    if (typeof i === 'string') { return { name: i } }
    if (i.name === i.as) { i = { name: i.name } }
    // TODO: Ensure `name` and `as` are valid identifiers
    // TODO: Ensure `as` is provided for default import
    return i
  })

  const namesStr = _names.map(i => i.as ? `${i.name} as ${i.as}` : i.name).join(', ')
  if (nameArray) {
    return `${type} { ${namesStr} } from ${genString(specifier, opts)};`
  }
  return `${type} ${namesStr} from ${genString(specifier, opts)};`
}

export interface DynamicImportOptions extends CodegenOptions {
  comment?: string
  wrapper?: boolean
  interopDefault?: boolean
}
export function genDynamicImport(specifier: string, opts: DynamicImportOptions = {}) {
  const commentStr = opts.comment ? ` /* ${opts.comment} */` : ''
  const wrapperStr = (opts.wrapper === false) ? '' : '() => '
  const ineropStr = opts.interopDefault ? '.then(m => m.default || m)' : ''
  return `${wrapperStr}import(${genString(specifier, opts)}${commentStr})${ineropStr}`
}

export function genSafeVariableName(name: string) {
  if (reservedNames.has(name)) { return `_${name}` }
  return name.replace(/^[0-9]/, r => `_${r}`).replace(/[^_a-zA-Z0-9]/g, r => '_' + r.charCodeAt(0))
}

// Credit: https://mathiasbynens.be/notes/reserved-keywords
const reservedNames = new Set([
  'Infinity', 'NaN', 'arguments', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'finally', 'for', 'function',
  'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'null', 'package', 'private',
  'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof',
  'undefined', 'var', 'void', 'while', 'with', 'yield'
])
