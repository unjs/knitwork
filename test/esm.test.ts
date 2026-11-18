import { expect, describe, it } from "vitest";
import {
  genImport,
  genExport,
  genDynamicImport,
  genSafeVariableName,
  genDynamicTypeImport,
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
    code: '() => import("pkg").then(m => m && (typeof m === "object" || typeof m === "function") && "default" in m ? m.default : m)',
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

  it("preserves falsy default exports with interopDefault", async () => {
    const cases = ["false", "0", '""', "null", "undefined", "NaN"];

    for (const exported of cases) {
      const specifier = `data:text/javascript,export default ${exported}`;
      const expected = (await import(specifier)).default;
      for (const wrapper of [true, false]) {
        const code = genDynamicImport(specifier, {
          wrapper,
          interopDefault: true,
        });
        const executable = wrapper ? code : `() => ${code}`;
        const generatedModule = await import(
          `data:text/javascript,${encodeURIComponent(`export default (Object) => ${executable}`)}`
        );
        const result = await generatedModule.default(undefined)();
        expect(result, code).toEqual(expected);
      }
    }
  });

  it("handles values resolved by a module's then export", async () => {
    const specifier =
      "data:text/javascript,export function then(resolve) { resolve(false) }";
    for (const wrapper of [true, false]) {
      const code = genDynamicImport(specifier, {
        wrapper,
        interopDefault: true,
      });
      const executable = wrapper ? code : `() => ${code}`;
      const generatedModule = await import(
        `data:text/javascript,${encodeURIComponent(`export default (Object) => ${executable}`)}`
      );
      expect(await generatedModule.default(undefined)()).toBe(false);
    }
  });
});

const genDynamicTypeImportTests = [
  {
    code: 'typeof import("pkg")',
  },
  {
    name: "foo",
    code: 'typeof import("pkg").foo',
  },
  {
    name: "foo-bar",
    code: 'typeof import("pkg")["foo-bar"]',
  },
  {
    name: "foo",
    opts: { comment: 'webpackChunkName: "chunks/dynamic"' },
    code: 'typeof import("pkg" /* webpackChunkName: "chunks/dynamic" */).foo',
  },
  {
    name: "foo",
    opts: { attributes: { type: "json" } },
    code: 'typeof import("pkg", { with: { type: "json" } }).foo',
  },
];

describe("genDynamicTypeImport", () => {
  for (const t of genDynamicTypeImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genDynamicTypeImport("pkg", t.name, t.opts);
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
