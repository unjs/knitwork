import { expect, describe, it } from "vitest";
import {
  genImport,
  genExport,
  genDynamicImport,
  genSafeVariableName,
  genExportDefault,
} from "../src";
import { genTestTitle } from "./_utils";

const genImportTests = [
  {
    names: undefined,
    code: 'import "pkg";',
  },
  { names: "foo", code: 'import foo from "pkg";' },
  { names: ["foo"], code: 'import { foo } from "pkg";' },
  {
    names: "foo",
    code: `import foo from 'pkg';`,
    options: { singleQuotes: true },
  },
  {
    names: [{ name: "foo", as: "foo" }],
    code: 'import { foo } from "pkg";',
  },
  {
    names: [{ name: "foo", as: "bar" }],
    code: 'import { foo as bar } from "pkg";',
  },
  { names: { name: "*", as: "bar" }, code: 'import * as bar from "pkg";' },
  {
    names: [{ name: "default", as: "Test" }],
    code: 'import { default as Test } from "pkg";',
  },
  {
    names: ["foo"],
    code: 'import { foo } from "pkg" assert { type: "json" };',
    options: { assert: { type: "json" } },
  },
  {
    names: ["foo"],
    code: 'import { foo } from "pkg" with { type: "json" };',
    options: { attributes: { type: "json" } },
  },
];

describe("genImport", () => {
  for (const t of genImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genImport("pkg", t.names, t.options);
      expect(code).to.equal(t.code);
    });
  }
});

const genExportTests = [
  { names: undefined, code: 'export "pkg";' },
  { names: "foo", code: 'export foo from "pkg";' },
  { names: ["foo"], code: 'export { foo } from "pkg";' },
  {
    names: [{ name: "foo", as: "bar" }],
    code: 'export { foo as bar } from "pkg";',
  },
  { names: { name: "*", as: "bar" }, code: 'export * as bar from "pkg";' },
  { names: ["default"], code: 'export { default } from "pkg";' },
  {
    names: ["foo"],
    code: 'export { foo } from "pkg" assert { type: "json" };',
    options: { assert: { type: "json" } },
  },
];

describe("genExport", () => {
  for (const t of genExportTests) {
    it(genTestTitle(t.code), () => {
      const code = genExport("pkg", t.names, t.options);
      expect(code).to.equal(t.code);
    });
  }
});

const genDynamicImportTests = [
  { code: '() => import("pkg")' },
  { opts: { wrapper: false }, code: 'import("pkg")' },
  {
    opts: { interopDefault: true },
    code: '() => import("pkg").then(m => m.default || m)',
  },
  {
    opts: { comment: 'webpackChunkName: "chunks/dynamic"' },
    code: '() => import("pkg" /* webpackChunkName: "chunks/dynamic" */)',
  },
  {
    opts: { assert: { type: "json" } },
    code: '() => import("pkg", { assert: { type: "json" } })',
  },
  {
    opts: { attributes: { type: "json" } },
    code: '() => import("pkg", { with: { type: "json" } })',
  },
];

describe("genDynamicImport", () => {
  for (const t of genDynamicImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genDynamicImport("pkg", t.opts);
      expect(code).to.equal(t.code);
    });
  }
});

const genExportDefaultTests = [
  { value: "myFunction", code: "export default myFunction;" },
  { value: "{ a, b }", code: "export default { a, b };" },
  { value: "() => { return 'hello world' }", code: "export default () => { return 'hello world' };" },
  { value: "class MyClass {}", code: "export default class MyClass {};" },
];

describe("genExportDefault", () => {
  for (const t of genExportDefaultTests) {
    it(genTestTitle(t.code), () => {
      const code = genExportDefault(t.value);
      expect(code).to.equal(t.code);
    });
  }
});

const genSafeVariableNameTests = [
  { key: "valid_import", code: "valid_import" },
  { key: "for", code: "_for" },
  { key: "with space", code: "with_32space" },
  { key: "123 numbers", code: "_123_32numbers" },
];

describe("genSafeVariableName", () => {
  for (const t of genSafeVariableNameTests) {
    it(genTestTitle(t.code), () => {
      const code = genSafeVariableName(t.key);
      expect(code).to.equal(t.code);
    });
  }
});
