
import { genString } from './string'
import { genObjectKey, wrapInDelimiters } from './utils'

export type TypeObject = {
  [key: string]: string | TypeObject
}
export interface GenInterfaceOptions {
  extends?: string | string[]
  export?: boolean
}

export const genTypeObject = (obj: TypeObject, indent = '') => {
  const newIndent = indent + '  '
  return wrapInDelimiters(Object.entries(obj).map(([key, value]) => {
    const [, k = key, optional = ''] = key.match(/^(.*[^?])(\?)?$/) /* c8 ignore next */ || []
    if (typeof value === 'string') {
      return `${newIndent}${genObjectKey(k)}${optional}: ${value}`
    }
    return `${newIndent}${genObjectKey(k)}${optional}: ${genTypeObject(value, newIndent)}`
  }), indent, '{}', false)
}

export const genInterface = (name: string, contents?: TypeObject, options: GenInterfaceOptions = {}, indent = '') => {
  const result = [
    options.export && 'export',
    `interface ${name}`,
    options.extends && `extends ${Array.isArray(options.extends) ? options.extends.join(', ') : options.extends}`,
    contents ? genTypeObject(contents, indent) : '{}'
  ].filter(Boolean).join(' ')
  return result
}

export const genAugmentation = (specifier: string, interfaces?: Record<string, TypeObject | [TypeObject, Omit<GenInterfaceOptions, 'export'>]>) => {
  return `declare module ${genString(specifier)} ${wrapInDelimiters(
    Object.entries(interfaces || {}).map(
      ([key, entry]) => '  ' + (Array.isArray(entry) ? genInterface(key, ...entry, '  ') : genInterface(key, entry, {}, '  '))
    )
  )}`
}
