import { expect, describe, it } from 'vitest'
import { genImport, genExport, genDynamicImport, genObjectFromRaw, genObjectFromRawEntries, genInterface, genAugmentation, genInlineTypeImport, genTypeImport, genTypeExport } from '../src'

const genImportTests = [
  { names: 'foo', code: 'import foo from "pkg";' },
  { names: ['foo'], code: 'import { foo } from "pkg";' },
  { names: [{ name: 'foo', as: 'bar' }], code: 'import { foo as bar } from "pkg";' },
  { names: { name: '*', as: 'bar' }, code: 'import * as bar from "pkg";' },
  { names: [{ name: 'default', as: 'Test' }], code: 'import { default as Test } from "pkg";' }
]

describe('genImport', () => {
  for (const t of genImportTests) {
    it(t.code, () => {
      const code = genImport('pkg', t.names)
      expect(code).to.equal(t.code)
    })
  }
})

const genExportTests = [
  { names: 'foo', code: 'export foo from "pkg";' },
  { names: ['foo'], code: 'export { foo } from "pkg";' },
  { names: [{ name: 'foo', as: 'bar' }], code: 'export { foo as bar } from "pkg";' },
  { names: { name: '*', as: 'bar' }, code: 'export * as bar from "pkg";' },
  { names: ['default'], code: 'export { default } from "pkg";' }
]

describe('genExport', () => {
  for (const t of genExportTests) {
    it(t.code, () => {
      const code = genExport('pkg', t.names)
      expect(code).to.equal(t.code)
    })
  }
})

const genDynamicImportTests = [
  { code: '() => import("pkg")' },
  { opts: { wrapper: false }, code: 'import("pkg")' },
  { opts: { interopDefault: true }, code: '() => import("pkg").then(m => m.default || m)' },
  {
    opts: { comment: 'webpackChunkName: "chunks/dynamic"' },
    code: '() => import("pkg" /* webpackChunkName: "chunks/dynamic" */)'
  }
]

describe('genDynamicImport', () => {
  for (const t of genDynamicImportTests) {
    it(t.code, () => {
      const code = genDynamicImport('pkg', t.opts)
      expect(code).to.equal(t.code)
    })
  }
})

const genObjectFromRawTests = [
  {
    obj: {
      a: 'null',
      b: null,
      c: undefined,
      1: 'undefined',
      2: true,
      3: 'true',
      'obj 1': '{ literal: () => "test" }',
      'obj 2': { nested: { foo: '"bar"' } },
      arr: ['1', '2', '3']
    },
    code: [
      '{',
      '  1: undefined,',
      '  2: true,',
      '  3: true,',
      '  a: null,',
      '  b: null,',
      '  c: undefined,',
      '  "obj 1": { literal: () => "test" },',
      '  "obj 2": {',
      '    nested: {',
      '      foo: "bar"',
      '    }',
      '  },',
      '  arr: [',
      '    1,',
      '    2,',
      '    3',
      '  ]',
      '}'
    ].join('\n')
  }
]

describe('genObjectFromRaw', () => {
  for (const t of genObjectFromRawTests) {
    it(t.code, () => {
      const code = genObjectFromRaw(t.obj)
      expect(code).to.equal(t.code)
    })
  }
})

describe('genObjectFromRawEntries', () => {
  for (const t of genObjectFromRawTests) {
    it(t.code, () => {
      const code = genObjectFromRawEntries(Object.entries(t.obj))
      expect(code).to.equal(t.code)
    })
  }
})

const genInterfaceTests: Array<{ input: Parameters<typeof genInterface>, code: string }> = [
  { input: ['FooInterface'], code: 'interface FooInterface {}' },
  { input: ['FooInterface', undefined, { extends: ['Other'] }], code: 'interface FooInterface extends Other {}' },
  { input: ['FooInterface', undefined, { extends: 'Other' }], code: 'interface FooInterface extends Other {}' },
  {
    input: ['FooInterface', { name: 'boolean', 'other name"': { value: '() => {}' } }],
    code:
`interface FooInterface {
  name: boolean
  "other name\\"": {
    value: () => {}
  }
}`
  },
  {
    input: ['FooInterface', { "na'me?": 'boolean' }],
    code:
`interface FooInterface {
  "na'me"?: boolean
}`
  }
]

describe('genInterface', () => {
  for (const t of genInterfaceTests) {
    it(t.code, () => {
      const code = genInterface(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genAugmentationTests: Array<{ input: Parameters<typeof genAugmentation>, code: string }> = [
  { input: ['@nuxt/utils'], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ['@nuxt/utils', {
      MyInterface: {
        'test?': 'string'
      }
    }],
    code:
`declare module "@nuxt/utils" {
  interface MyInterface {
    test?: string
  }
}`
  },
  {
    input: ['@nuxt/utils', { MyInterface: [{}, { extends: ['OtherInterface', 'FurtherInterface'] }] }],
    code:
`declare module "@nuxt/utils" {
  interface MyInterface extends OtherInterface, FurtherInterface {}
}`
  }
]

describe('genAugmentation', () => {
  for (const t of genAugmentationTests) {
    it(t.code, () => {
      const code = genAugmentation(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genInlineTypeImportTests: Array<{ input: Parameters<typeof genInlineTypeImport>, code: string }> = [
  { input: ['@nuxt/utils'], code: 'typeof import("@nuxt/utils").default' },
  { input: ['@nuxt/utils', 'genString'], code: 'typeof import("@nuxt/utils").genString' }
]

describe('genInlineTypeImport', () => {
  for (const t of genInlineTypeImportTests) {
    it(t.code, () => {
      const code = genInlineTypeImport(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genTypeImportTests: Array<{ input: Parameters<typeof genTypeImport>, code: string }> = [
  { input: ['@nuxt/utils', ['test']], code: 'import type { test } from "@nuxt/utils";' },
  { input: ['@nuxt/utils', [{ name: 'test', as: 'value' }]], code: 'import type { test as value } from "@nuxt/utils";' }
]

describe('genTypeImport', () => {
  for (const t of genTypeImportTests) {
    it(t.code, () => {
      const code = genTypeImport(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genTypeExportTests: Array<{ input: Parameters<typeof genTypeExport>, code: string }> = [
  { input: ['@nuxt/utils', ['test']], code: 'export type { test } from "@nuxt/utils";' },
  { input: ['@nuxt/utils', [{ name: 'test', as: 'value' }]], code: 'export type { test as value } from "@nuxt/utils";' }
]

describe('genTypeExport', () => {
  for (const t of genTypeExportTests) {
    it(t.code, () => {
      const code = genTypeExport(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})
