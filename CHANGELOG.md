# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## v1.3.0

[compare changes](https://github.com/unjs/knitwork/compare/v1.2.0...v1.3.0)

### 🚀 Enhancements

- Add `genDynamicTypeImport` ([#125](https://github.com/unjs/knitwork/pull/125))

### 🩹 Fixes

- Remove commas in module augmentation ([#114](https://github.com/unjs/knitwork/pull/114))

### ❤️ Contributors

- 山吹色御守 ([@KazariEX](https://github.com/KazariEX))
- Bobbie Goede <bobbiegoede@gmail.com>

## v1.2.0

[compare changes](https://github.com/unjs/knitwork/compare/v1.1.0...v1.2.0)

### 🚀 Enhancements

- Expose `genObjectKey` and `wrapInDelimiters` utils ([227ec06](https://github.com/unjs/knitwork/commit/227ec06))

### 📖 Documentation

- Correct jsdocs for `genObjectFromRaw` ([#97](https://github.com/unjs/knitwork/pull/97))

### 🏡 Chore

- Update deps ([02a2f68](https://github.com/unjs/knitwork/commit/02a2f68))
- Update eslint ([c58341b](https://github.com/unjs/knitwork/commit/c58341b))
- Apply automated updates ([63cd869](https://github.com/unjs/knitwork/commit/63cd869))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v1.1.0

[compare changes](https://github.com/unjs/knitwork/compare/v1.0.0...v1.1.0)

### 🚀 Enhancements

- Add `genObjectFromValues` ([#9](https://github.com/unjs/knitwork/pull/9))
- **esm:** Support new import attributes syntax ([#89](https://github.com/unjs/knitwork/pull/89))

### 🩹 Fixes

- Stringify key identifier starting with number literal ([#86](https://github.com/unjs/knitwork/pull/86))
- **genString:** Respect `singleQuotes` option ([#88](https://github.com/unjs/knitwork/pull/88))
- **typescript:** Indent generated augmentation interfaces ([#4](https://github.com/unjs/knitwork/pull/4))

### 💅 Refactors

- **object:** Use namespace for options ([ba67797](https://github.com/unjs/knitwork/commit/ba67797))

### 📖 Documentation

- Fix `genImport` example with `default` name ([#87](https://github.com/unjs/knitwork/pull/87))
- Add jsdocs ([8a8a673](https://github.com/unjs/knitwork/commit/8a8a673))

### 🏡 Chore

- Fix renovate config ([d5284eb](https://github.com/unjs/knitwork/commit/d5284eb))
- Add @danielroe to license ([daf973d](https://github.com/unjs/knitwork/commit/daf973d))
- Update repo ([#62](https://github.com/unjs/knitwork/pull/62))
- Update deps ([0f8fb07](https://github.com/unjs/knitwork/commit/0f8fb07))
- Lint ([2138f9a](https://github.com/unjs/knitwork/commit/2138f9a))
- Update ci scripts ([a5828ce](https://github.com/unjs/knitwork/commit/a5828ce))
- Fix lint ([f735700](https://github.com/unjs/knitwork/commit/f735700))
- Update readme with automd ([749daf7](https://github.com/unjs/knitwork/commit/749daf7))
- Update jsdocs ([79d3ae0](https://github.com/unjs/knitwork/commit/79d3ae0))
- Update jsdocs ([c8fe63f](https://github.com/unjs/knitwork/commit/c8fe63f))
- Provide `CODECOV_TOKEN` ([c205569](https://github.com/unjs/knitwork/commit/c205569))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Pooya Parsa ([@pi0](http://github.com/pi0))
- Ricardo Gobbo De Souza ([@ricardogobbosouza](http://github.com/ricardogobbosouza))
- Max ([@onmax](http://github.com/onmax))
- 魏 ([@wsypower](http://github.com/wsypower))
- Romain Hamel ([@romhml](http://github.com/romhml))
- Nozomu Ikuta ([@NozomuIkuta](http://github.com/NozomuIkuta))

## [1.0.0](https://github.com/unjs/knitwork/compare/v0.1.3...v1.0.0) (2022-11-14)

### [0.1.3](https://github.com/unjs/knitwork/compare/v0.1.2...v0.1.3) (2022-11-11)


### Features

* import assertions for `genImport` and `genDynamicImport` ([#34](https://github.com/unjs/knitwork/issues/34)) ([71c4ad2](https://github.com/unjs/knitwork/commit/71c4ad2155fdf28d08d339ee10620109c12b4baf))

### [0.1.2](https://github.com/unjs/knitwork/compare/v0.1.1...v0.1.2) (2022-06-10)


### Features

* add `genSafeVariableName` ([#10](https://github.com/unjs/knitwork/issues/10)) ([c19a2ee](https://github.com/unjs/knitwork/commit/c19a2eeef8b7ec3d30cf79fa85e92251b4800107))

### [0.1.1](https://github.com/unjs/knitwork/compare/v0.0.2...v0.1.1) (2022-03-08)


### Features

* add typescript codegen utils ([#3](https://github.com/unjs/knitwork/issues/3)) ([b74fbe2](https://github.com/unjs/knitwork/commit/b74fbe281c82fcaa92dc85e481a5b374f29a4f61))

### [0.0.2](https://github.com/unjs/knitwork/compare/v0.0.1...v0.0.2) (2022-01-25)


### Features

* generate objects and arrays from raw source ([beb4297](https://github.com/unjs/knitwork/commit/beb42973888413fc403c67f20ca1feebc3643555))

### 0.0.1 (2022-01-21)


### Features

* genExport utils ([9135548](https://github.com/unjs/knitwork/commit/91355482e18e2984f06e537f6a96a0cf9224f34f))


### Bug Fixes

* fix pkg exports ([d5014c2](https://github.com/unjs/knitwork/commit/d5014c2df1d3e0300c21c098a659d0ce5de65f70))
