import { expect, describe, it } from 'vitest'
import { genImport, genExport, genDynamicImport, genObjectFromRaw, genObjectFromRawEntries } from '../src'

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
