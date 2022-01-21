# 🧶 knitwork

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

```js
import { genImport, genExport } from 'knitwork'

// import { foo } from "pkg"
// import foo from "pkg"
console.log(genImport('pkg', 'foo'))

// import { a, b } from "pkg"
console.log(genImport('pkg', 'foo'))
console.log(genImport('pkg', ['a', 'b']))

// import { foo as bar } from "pkg"
console.log(genImport('pkg', { name: 'foo', as: 'bar' }))
console.log(genImport('pkg', [{ name: 'foo', as: 'bar' }]))

// export foo from "pkg"
console.log(genExport('pkg', 'foo'))

// export { a, b } from "pkg"
console.log(genExport('pkg', ['a', 'b']))

// export * as bar from "pkg"
console.log(genExport('pkg', { name: '*foo*', as: 'bar' }))
```

## License

MIT. Made with 💛
