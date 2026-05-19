import { expect, describe, it } from "vitest";
import {
  genInterface,
  genAugmentation,
  genEnum,
  genInlineTypeImport,
  genTypeImport,
  genTypeExport,
} from "../src";
import { genTestTitle } from "./_utils";

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
    it(genTestTitle(t.code), () => {
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
    input: ["@nuxt/utils", { MyInterface: {}, MyOtherInterface: {} }],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
  interface MyOtherInterface {}
}`,
  },
  {
    input: [
      "@nuxt/utils",
      {
        MyInterface: {
          "test?": "string",
        },
      },
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {
    test?: string
  }
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
    it(genTestTitle(t.code), () => {
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
    it(genTestTitle(t.code), () => {
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
    it(genTestTitle(t.code), () => {
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
    it(genTestTitle(t.code), () => {
      const code = genTypeExport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genEnumTests: Array<{
  input: Parameters<typeof genEnum>;
  code: string;
}> = [
  { input: ["FooEnum", {}], code: "enum FooEnum {}" },
  {
    input: ["Direction", { Up: undefined, Down: undefined }],
    code: `enum Direction {
  Up,
  Down
}`,
  },
  {
    input: ["Status", { Ok: 200, NotFound: 404 }],
    code: `enum Status {
  Ok = 200,
  NotFound = 404
}`,
  },
  {
    input: ["Color", { Red: "red", Green: "green" }],
    code: `enum Color {
  Red = "red",
  Green = "green"
}`,
  },
  {
    input: ["FooEnum", { "foo bar": 1 }],
    code: `enum FooEnum {
  "foo bar" = 1
}`,
  },
  {
    input: ["FooEnum", { A: 0 }, { export: true }],
    code: `export enum FooEnum {
  A = 0
}`,
  },
  {
    input: ["FooEnum", { A: 0 }, { const: true }],
    code: `const enum FooEnum {
  A = 0
}`,
  },
  {
    input: ["FooEnum", { A: 0 }, { export: true, const: true }],
    code: `export const enum FooEnum {
  A = 0
}`,
  },
];

describe("genEnum", () => {
  for (const t of genEnumTests) {
    it(genTestTitle(t.code), () => {
      const code = genEnum(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
