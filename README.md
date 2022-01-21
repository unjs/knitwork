# knitwork

> Utilities to generate JavaScript code.

## Install

```sh
# npm
npm install knitwork

# yarn
yarn install knitwork

# pnpm
pnpm install knitwork
```

## Usage

### `genImport`

Generate a static import statement.

```js
import { genImport } from 'knitwork'

// import { foo } from "pkg"
console.log(genImport('pkg', 'foo'))

// import { a, b } from "pkg"
console.log(genImport('pkg', 'foo'))

// import { foo as bar } from "pkg"
console.log(genImport('pkg', { name: 'foo', as: 'bar' }))
```

### `genDynamicImport`

Generate a dynamic import statement.

```js
import { genDynamicImport } from 'knitwork'

// () => import("pkg")
console.log(genDynamicImport('pkg'))

// () => import("pkg").then(m => m.default || m)
console.log(genDynamicImport('pkg', { interopDefault: true }))

// import("pkg")
console.log(genDynamicImport('pkg', { wrapper: false }))

// () => import("pkg" /* webpackChunkName: "pkg" */)
console.log(genDynamicImport('pkg', { comment: 'webpackChunkName: "pkg"' }))
```

## License

MIT. Made with ❤️
