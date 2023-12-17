import { expect, describe, it } from "vitest";
import {
  genImport,
  genExport,
  genDynamicImport,
  genObjectFromRaw,
  genObjectFromRawEntries,
  genInterface,
  genAugmentation,
  genInlineTypeImport,
  genTypeImport,
  genTypeExport,
  genSafeVariableName,
  genBase64FromString,
  genStringFromBase64,
  genBase64FromBytes,
} from "../src";
import type { CodegenOptions } from "../src";

function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
  return new Uint8Array(
    (hexString.match(/../g) as RegExpMatchArray).map((h) =>
      Number.parseInt(h, 16)
    )
  ).buffer;
}

const genImportTests = [
  { names: "foo", code: 'import foo from "pkg";' },
  { names: ["foo"], code: 'import { foo } from "pkg";' },
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
];

describe("genImport", () => {
  for (const t of genImportTests) {
    it(t.code, () => {
      const code = genImport("pkg", t.names, t.options);
      expect(code).to.equal(t.code);
    });
  }
});

const genExportTests = [
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
    it(t.code, () => {
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
];

describe("genDynamicImport", () => {
  for (const t of genDynamicImportTests) {
    it(t.code, () => {
      const code = genDynamicImport("pkg", t.opts);
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
    it(t.code, () => {
      const code = genSafeVariableName(t.key);
      expect(code).to.equal(t.code);
    });
  }
});

const genObjectFromRawTests = [
  {
    obj: {
      a: "null",
      // eslint-disable-next-line unicorn/no-null
      b: null,
      c: undefined,
      1: "undefined",
      2: true,
      3: "true",
      "obj 1": '{ literal: () => "test" }',
      "obj 2": { nested: { foo: '"bar"' } },
      arr: ["1", "2", "3"],
    },
    code: [
      "{",
      "  1: undefined,",
      "  2: true,",
      "  3: true,",
      "  a: null,",
      "  b: null,",
      "  c: undefined,",
      '  "obj 1": { literal: () => "test" },',
      '  "obj 2": {',
      "    nested: {",
      '      foo: "bar"',
      "    }",
      "  },",
      "  arr: [",
      "    1,",
      "    2,",
      "    3",
      "  ]",
      "}",
    ].join("\n"),
  },
];

describe("genObjectFromRaw", () => {
  for (const t of genObjectFromRawTests) {
    it(t.code, () => {
      const code = genObjectFromRaw(t.obj);
      expect(code).to.equal(t.code);
    });
  }
});

describe("genObjectFromRawEntries", () => {
  for (const t of genObjectFromRawTests) {
    it(t.code, () => {
      const code = genObjectFromRawEntries(Object.entries(t.obj));
      expect(code).to.equal(t.code);
    });
  }
});

const genInterfaceTests: Array<{
  input: Parameters<typeof genInterface>;
  code: string;
}> = [
  { input: ["FooInterface"], code: "interface FooInterface {}" },
  {
    input: ["FooInterface", undefined, { extends: ["Other"] }],
    code: "interface FooInterface extends Other {}",
  },
  {
    input: ["FooInterface", undefined, { extends: "Other" }],
    code: "interface FooInterface extends Other {}",
  },
  {
    input: [
      "FooInterface",
      { name: "boolean", 'other name"': { value: "() => {}" } },
    ],
    code: `interface FooInterface {
  name: boolean
  "other name\\"": {
    value: () => {}
  }
}`,
  },
  {
    input: ["FooInterface", { "na'me?": "boolean" }],
    code: `interface FooInterface {
  "na'me"?: boolean
}`,
  },
];

describe("genInterface", () => {
  for (const t of genInterfaceTests) {
    it(t.code, () => {
      const code = genInterface(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genAugmentationTests: Array<{
  input: Parameters<typeof genAugmentation>;
  code: string;
}> = [
  { input: ["@nuxt/utils"], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ["@nuxt/utils", { MyInterface: {} }],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
  {
    input: [
      "@nuxt/utils",
      {
        MyInterface: [{}, { extends: ["OtherInterface", "FurtherInterface"] }],
      },
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface extends OtherInterface, FurtherInterface {}
}`,
  },
];

describe("genAugmentation", () => {
  for (const t of genAugmentationTests) {
    it(t.code, () => {
      const code = genAugmentation(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genInlineTypeImportTests: Array<{
  input: Parameters<typeof genInlineTypeImport>;
  code: string;
}> = [
  { input: ["@nuxt/utils"], code: 'typeof import("@nuxt/utils").default' },
  {
    input: ["@nuxt/utils", "genString"],
    code: 'typeof import("@nuxt/utils").genString',
  },
];

describe("genInlineTypeImport", () => {
  for (const t of genInlineTypeImportTests) {
    it(t.code, () => {
      const code = genInlineTypeImport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeImportTests: Array<{
  input: Parameters<typeof genTypeImport>;
  code: string;
}> = [
  {
    input: ["@nuxt/utils", ["test"]],
    code: 'import type { test } from "@nuxt/utils";',
  },
  {
    input: ["@nuxt/utils", [{ name: "test", as: "value" }]],
    code: 'import type { test as value } from "@nuxt/utils";',
  },
];

describe("genTypeImport", () => {
  for (const t of genTypeImportTests) {
    it(t.code, () => {
      const code = genTypeImport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeExportTests: Array<{
  input: Parameters<typeof genTypeExport>;
  code: string;
}> = [
  {
    input: ["@nuxt/utils", ["test"]],
    code: 'export type { test } from "@nuxt/utils";',
  },
  {
    input: ["@nuxt/utils", [{ name: "test", as: "value" }]],
    code: 'export type { test as value } from "@nuxt/utils";',
  },
];

describe("genTypeExport", () => {
  for (const t of genTypeExportTests) {
    it(t.code, () => {
      const code = genTypeExport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const base64Tests = [
  {
    input: "Hello, World!",
    output: "SGVsbG8sIFdvcmxkIQ==",
    options: { encoding: "ascii" } as CodegenOptions,
  },
  {
    input: "",
    output: "",
    options: { encoding: "ascii" } as CodegenOptions,
  },
  {
    input: "!@#$%^&*()",
    output: "IUAjJCVeJiooKQ==",
    options: { encoding: "ascii" } as CodegenOptions,
  },
  {
    input: "文",
    output: "5paH",
    options: { encoding: "utf8" } as CodegenOptions,
  },
  {
    input: "🦄",
    output: "8J+mhA==",
    options: { encoding: "utf8" } as CodegenOptions,
  },
  {
    input: "Hello, 文🦄!",
    output: "SGVsbG8sIOaWh/CfpoQh",
    options: { encoding: "utf8" } as CodegenOptions,
  },
  {
    input: "??",
    output: "Pz8",
    options: { encoding: "url" } as CodegenOptions,
  },
  {
    input: "Hello, World!",
    output: "SGVsbG8sIFdvcmxkIQ",
    options: { encoding: "url" } as CodegenOptions,
  },
  {
    input: "Hello, 文🦄!",
    output: "SGVsbG8sIOaWh_CfpoQh",
    options: { encoding: "url" } as CodegenOptions,
  },
];

const base64ErrorTests = [
  {
    input: "🦄",
    options: { encoding: "ascii" } as CodegenOptions,
  },
  {
    input: "文",
    options: { encoding: "ascii" } as CodegenOptions,
  },
];

describe("base64", () => {
  for (const t of base64Tests) {
    it(`${t.options.encoding}: ${t.input}`, () => {
      const output = genBase64FromString(t.input, t.options);
      expect(output).to.equal(t.output);
    });
    it(`${t.options.encoding}: ${t.output}`, () => {
      const output = genStringFromBase64(t.output, t.options);
      expect(output).to.equal(t.input);
    });
  }
  for (const t of base64ErrorTests) {
    it(`Should throw with ${t.options.encoding}: ${t.input}`, () => {
      expect(() => genBase64FromString(t.input, t.options)).toThrow();
    });
  }
  it(`Should correctly url encode bytes`, () => {
    const buffer = hexStringToArrayBuffer(
      "dcf2aee72183ef8fefba101023af98462c289a6d3da9fa32d5957a9da4f62f52"
    );
    const output = genBase64FromBytes(new Uint8Array(buffer), true);
    expect(output).to.equal("3PKu5yGD74_vuhAQI6-YRiwomm09qfoy1ZV6naT2L1I");
  });
});
