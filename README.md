# 🧶 knitwork

<!-- automd:badges color=yellow codecov -->

[![npm version](https://img.shields.io/npm/v/knitwork?color=yellow)](https://npmjs.com/package/knitwork)
[![npm downloads](https://img.shields.io/npm/dm/knitwork?color=yellow)](https://npmjs.com/package/knitwork)
[![codecov](https://img.shields.io/codecov/c/gh/unjs/knitwork?color=yellow)](https://codecov.io/gh/unjs/knitwork)

<!-- /automd -->

Utilities to generate JavaScript code.

## Install

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install knitwork

# npm
npm install knitwork

# yarn
yarn add knitwork

# pnpm
pnpm install knitwork

# bun
bun install knitwork
```

<!-- /automd -->

## Usage

**Generating ESM syntax:**

```js
import { genImport, genExport } from "knitwork";

// import foo from "pkg"
console.log(genImport("pkg", "foo"));

// import { foo } from "pkg"
console.log(genImport("pkg", ["foo"]));

// import { a, b } from "pkg"
console.log(genImport("pkg", ["a", "b"]));

// import { default as bar } from "pkg";
console.log(genImport("pkg", [{ name: "default", as: "bar" }]));

// import { foo as bar } from "pkg";
console.log(genImport("pkg", [{ name: "foo", as: "bar" }]));

// import foo from "pkg" assert { type: "json" };
console.log(genImport("pkg", "foo", { assert: { type: "json" } }));

// export foo from "pkg"
console.log(genExport("pkg", "foo"));

// export { a, b } from "pkg"
console.log(genExport("pkg", ["a", "b"]));

// export * as bar from "pkg"
console.log(genExport("pkg", { name: "*", as: "bar" }));

// export foo from "pkg" assert { type: "json" };
console.log(genExport("pkg", "foo", { assert: { type: "json" } }));
```

**Generating TS:**

```js
import {
  genInterface,
  genAugmentation,
  genInlineTypeImport,
  genTypeImport,
  genTypeExport,
} from "knitwork";

// interface FooInterface extends A, B {
//   name: boolean
//   optional?: string
// }
console.log(
  genInterface(
    "FooInterface",
    { name: "boolean", "optional?": "string" },
    { extends: ["A", "B"] },
  ),
);
// declare module "my-module" {
//   interface MyInterface {}
// }
console.log(genAugmentation("my-module", { MyInterface: {} }));
// typeof import("my-module").genString'
console.log(genInlineTypeImport("my-module", "genString"));
// typeof import("my-module").default'
console.log(genInlineTypeImport("my-module"));
// import type { test as value } from "my-module";
console.log(genTypeImport("my-module", [{ name: "test", as: "value" }]));
// export type { test } from "my-module";
console.log(genTypeExport("my-module", ["test"]));
```

**Serializing JS objects:**

```js
import {
  genObjectFromRaw,
  genObjectFromRawEntries,
  genArrayFromRaw,
} from "knitwork";

// { foo: 'bar', test: () => import("pkg") }
console.log(genObjectFromValues({ foo: "bar", test: '() => import("pkg")' }));

// { test: () => import("pkg") }
console.log(genObjectFromRaw({ test: '() => import("pkg")' }));

// { 0: [ test, () => import("pkg") ] }
console.log(genObjectFromRaw([["test", '() => import("pkg")']]));

const entries = Object.entries({
  a: 1,
  b: null,
  c: '"c"',
  nest: { hello: '"world"', fn: () => 1 },
});
// { a: 1, b: null, c: "c", nest: { hello: "world", fn: () => 1 } }
console.log(genObjectFromRawEntries(entries));

// [ 1, 2, () => import("pkg") ]
console.log(genArrayFromRaw(["1", "2", '() => import("pkg")']));
```

**Generating safe variable names:**

```js
import { genSafeVariableName } from "knitwork";

// _123_32foo
genSafeVariableName("123 foo");
// _for
genSafeVariableName("for");
```

## Contribution

<details>
  <summary>Local development</summary>

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `bun install`
- Run tests using `bun dev`

</details>

## License

<!-- automd:contributors license=MIT author="pi0,danielroe" -->

Published under the [MIT](https://github.com/unjs/knitwork/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0), [@danielroe](https://github.com/danielroe) and [community](https://github.com/unjs/knitwork/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/knitwork/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/knitwork" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
