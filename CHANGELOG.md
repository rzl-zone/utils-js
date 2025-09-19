# Changelog

## [3.4.0](https://github.com/rzl-zone/utils-js/compare/v3.3.1...v3.4.0) (2025-09-19)


### Features

* Adding Script package **`@rzl-zone/ts-types-plus`** for types-helpers and drop internal types-helper. ([ad5e038](https://github.com/rzl-zone/utils-js/commit/ad5e03894952c663aecadbea4e32ae1359374a54))

## [3.3.1](https://github.com/rzl-zone/utils-js/compare/v3.3.0...v3.3.1) (2025-09-18)


### Bug Fixes

* Fixing readme.md at subtitle desc. ([d59086a](https://github.com/rzl-zone/utils-js/commit/d59086a9bb4ecc54b04d900fc011fb9675386a3c))
* Fixing readme.md at tip Hint: Autocomplete section. ([20b1c4f](https://github.com/rzl-zone/utils-js/commit/20b1c4f7885ac5d7406cd20acfcb32e21dbcf1b4))
* readme.md at docs about hint. ([1868e8e](https://github.com/rzl-zone/utils-js/commit/1868e8e4df9be179a17e6cb30134075b3dd935fe))
* readme.md at docs about hint. ([dee811c](https://github.com/rzl-zone/utils-js/commit/dee811cf9ddfba07c8d11d99b0dc89f0bbdd63af))

## [3.3.0](https://github.com/rzl-zone/utils-js/compare/v3.2.0...v3.3.0) (2025-09-18)


### Features

* add `generate-reference` script and update package.json exports. ([2e58ef8](https://github.com/rzl-zone/utils-js/commit/2e58ef86e54f4da10a5f70d09c734f9a2f20d333))

## [3.2.0](https://github.com/rzl-zone/utils-js/compare/v3.1.1...v3.2.0) (2025-09-17)


### Features

* add new class `CustomPromise`, add new utility type `ExtractStrict`, fixing function `formatPhoneNumber`, move `isServer` from `"@rzl-zone/utils-js/env"` to `"@rzl-zone/utils-js/predicates"`, rename folder structures: (`src/formatting` ➔ `src/formatters`, `src/generator` ➔ `src/generators`, `src/promise` ➔ `src/promises`), drop folder structure: `src/env` because empty, fix almost of functions and type, refactors almost folders `src` structures, fix README.md, fix `exports` at package.json, and fix other configs. ([c5ef41e](https://github.com/rzl-zone/utils-js/commit/c5ef41e75bb1aca71b920c90734756ffa1eac8e4))

## [3.1.1](https://github.com/rzl-zone/utils-js/compare/v3.1.0...v3.1.1) (2025-09-11)


### Bug Fixes

* add extra options ***keepUndefined*** to handling undefined value at `safeStableStringify`. ([e848bef](https://github.com/rzl-zone/utils-js/commit/e848befa3c39d9d70a0edbdf363342e58bfeb009))
* fixing `toStringDeepForce` making support handling like ***Primitives Boxed*** (`new Number`, `new String`, `new Boolean`). ([93f16f8](https://github.com/rzl-zone/utils-js/commit/93f16f86add826c83879cb7ba04ff5e0ebd50e10))
* fixing tsDoc `toStringDeep` and `toNumberDeep`. ([340e9cc](https://github.com/rzl-zone/utils-js/commit/340e9cc52d65b56f3dcc7aa93e7d72f4670b81c3))

## [3.1.0](https://github.com/rzl-zone/utils-js/compare/v3.0.0...v3.1.0) (2025-09-11)


### Features

* add new function `isBooleanObject`, `isStringObject`, `isNumberObject`, `isInfinityNumber`, (with the tests),  fixing `toNumberDeep` and `toStringDeep` also narrows type and tests, update all of function which using (`isBooleanObject`, `isStringObject`, `isNumberObject`), update `isDate` will extra options include with tests, and rest fixing tsDoc. ([b26c5a5](https://github.com/rzl-zone/utils-js/commit/b26c5a5210b95a38a41bfdaa3af77f60b531097c))


### Bug Fixes

* fixing `safeStableStringify` enhance more safe for handling NaN, Infinity, -Infinity for boxed primitives (new Number()). ([e89d28a](https://github.com/rzl-zone/utils-js/commit/e89d28a2ac31156b07183322ec3f1002640e37cf))
* fixing `toStringDeep`  to support handling boolean. ([1bd62be](https://github.com/rzl-zone/utils-js/commit/1bd62be4bc23101dd699b2d6efe18c8947a4f7e2))
* fixing to support handling Infinity and -Infinity at `toStringDeep` and fixing `toNumberDeep`. ([89ebcbc](https://github.com/rzl-zone/utils-js/commit/89ebcbc65c462f5eff8af94258a2570578343b33))

## [3.0.0](https://github.com/rzl-zone/utils-js/compare/v2.0.1...v3.0.0) (2025-09-03)


### ⚠ BREAKING CHANGES

* Stable 3.0.0 release, converting the beta version to stable.
* Core API stabilized; all subsequent changes follow semantic versioning.

### Features

* Enhanced `getPreciseType` for full type detection with tests.
* Added extra `tailwind` utilities.
* Added `assertionIs*` function.
* Added `isPropertyKey` function and fixed `doesKeyExist`.
* New overloads for `isArray`, `isObject`, `isObjectOrArray`, `isPlainObject`, `isNonEmptyArray` to support generic types.
* Refactored and improved core utilities like `constructURL`, `formatEnvPort`, `getPrefixPathname`, and `normalizePathname`.
* Improved validation and error messages across multiple functions: `censorEmail`, `createBeApiUrl`, `filterNilArray`, `dedupeArray`, `formatCurrency`, `randomInt`, `randomIntByLength`, `isEmptyObject`, `isEmptyValue`, `isNonEmptyString`, isNumber, etc.


### Bug Fixes

* Fixed type and logic issues in `isObject`, `isObjectOrArray`, `deleteNestedKey`, `isArray`. 
* Corrected tsDoc comments and error messages in multiple functions.
* Synchronized types and tests for core logic.
* Minor fixes: exported ClassesValue type for Tailwind, updated dev scripts, minification, and CI beta workflow.

### ⚠️ For full details, visit the website <a href="https://docs-rzl-utils-js.vercel.app?ver=3.0.0" target="_blank" rel="nofollow noreferrer noopener">Rzl UtilsJS</a> – coming soon.


## [2.1.0](https://github.com/rzl-zone/utils-js/compare/v2.0.1...v2.1.0) (2025-08-07)


### Features

* add new enhance `getPreciseType` function with full type detection and comprehensive tests ([603a5c8](https://github.com/rzl-zone/utils-js/commit/603a5c8aa2768d73503345056d684585ddffde66))

## [2.0.1](https://github.com/rzl-zone/utils-js/compare/v2.0.0...v2.0.1) (2025-08-07)


### Bug Fixes

* resolve bug in types return func `isArray` ([7643e91](https://github.com/rzl-zone/utils-js/commit/7643e91398c6c70d0664083b114dcb2791062509))

## [2.0.0](https://github.com/rzl-zone/utils-js/compare/v1.0.4...v2.0.0) (2025-08-06)


### ⚠ BREAKING CHANGES

* **core:** Version 1.0.0 marks the first stable release. This version establishes a consistent and reliable API surface. All breaking changes moving forward will adhere to semantic versioning.

### Features

* bump 1.1.0 ([af887bf](https://github.com/rzl-zone/utils-js/commit/af887bfe12e186ba3fec360a393cd4ce015c42f9))
* **core:** initiate stable API ([c412f48](https://github.com/rzl-zone/utils-js/commit/c412f48b12447f5f4397827e72bc5c6f8824edfd))


### Bug Fixes

* 'isObject' generic narrowing types on result logic with custom types, change unknown props as Record&lt;string, unknown&gt; result ([a4364f8](https://github.com/rzl-zone/utils-js/commit/a4364f8f49509aedc0afaf7b607c3cbadb58eccd))
* `deleteNestedKey` generic types props ([b656df6](https://github.com/rzl-zone/utils-js/commit/b656df68b8f243e55f24f90032126a05982dd24c))
* `isObject` generic narrowing types on result logic ([1c53ff6](https://github.com/rzl-zone/utils-js/commit/1c53ff699c4f7a25d48be61a72f37d66e57e0b50))
* `isObject` generic narrowing types on result logic with custom types ([fd251c9](https://github.com/rzl-zone/utils-js/commit/fd251c90e2098cab58c9edf3eb82212ce2010d87))
* `isObject` result types generic ([9ec1978](https://github.com/rzl-zone/utils-js/commit/9ec19787fee6aec25cc55e7ba1da7d14eb17e3cb))
* `isObject` with internal func isNil && isArray ([efec254](https://github.com/rzl-zone/utils-js/commit/efec254375db2231370c395c7a0f6430bc7ddc4d))
* `isObjectOrArray` generic narrowing types on result logic with custom types ([38dda18](https://github.com/rzl-zone/utils-js/commit/38dda18ffb1c1af7f62b94646644029262bf16d0))
* add overload to `isArray` to handle unknown and generic cases ([0320718](https://github.com/rzl-zone/utils-js/commit/0320718c4e57cd916569739423e9a86cf9272ce7))
* add overload to `isObject` to handle unknown and generic cases ([651c0d1](https://github.com/rzl-zone/utils-js/commit/651c0d13215e4f2359447c042ff8f8b4be083373))
* add overloads and ensure correct type guard for `isSet` ([633b117](https://github.com/rzl-zone/utils-js/commit/633b117b5d66c95c8b7e7b2e7102e59497f9c458))
* correct type guard in `isSafeInteger` ([ebca4a6](https://github.com/rzl-zone/utils-js/commit/ebca4a6d927dfe5652f9de23dcb00b3099055074))
* improve `formatDateIntl` type safety and fix optional locale destructuring ([e1dc600](https://github.com/rzl-zone/utils-js/commit/e1dc600be642083f26b20c487f5141cdbc6da96c))
* improve `isArray` generic narrowing using Extract&lt;T, unknown[]&gt; ([f6410d5](https://github.com/rzl-zone/utils-js/commit/f6410d5db91c9175ec1cad7e0ffc070f36280ac9))
* improve `isNonEmptyArray` generic narrowing using Extract&lt;T, unknown[]&gt; and support overload to handle unknown with generic class ([202f6ef](https://github.com/rzl-zone/utils-js/commit/202f6efd490539dbd63ec605092c598690d67d7f))
* improve `isObjectLoose` generic narrowing type ([f15af2c](https://github.com/rzl-zone/utils-js/commit/f15af2c8b0a67b93b92ec37dd95b0912221ff81c))
* improve `isObjectOrArray` generic narrowing types and support overload to handle unknown with generic class ([2a8000c](https://github.com/rzl-zone/utils-js/commit/2a8000c17fcb9b4619377bf9bf0bedb7021bb003))
* improve `isPlainObject` by adding overloads, using internal isObject, and stricter checks ([8ab1d42](https://github.com/rzl-zone/utils-js/commit/8ab1d42db944e8279c6d57b9bd3ede29af7243f3))
* **release:** bump version to 1.0.3 ([bef7064](https://github.com/rzl-zone/utils-js/commit/bef70641fc169483a3099e6e8181af6443171006))
* **release:** bump version to 1.0.4 ([c90c061](https://github.com/rzl-zone/utils-js/commit/c90c06109dca36eec16381cb3a522cd680abcf3f))
* resolve bug in core logic and sync types/tests ([ad03f7a](https://github.com/rzl-zone/utils-js/commit/ad03f7a7732fe3d87eced817271ab1d6fa797f45))

## [1.0.4](https://github.com/rzl-zone/utils-js/compare/v1.0.3...v1.0.4) (2025-08-06)


### Bug Fixes

* **release:** bump version to 1.0.4 ([c90c061](https://github.com/rzl-zone/utils-js/commit/c90c06109dca36eec16381cb3a522cd680abcf3f))

## [1.0.3](https://github.com/rzl-zone/utils-js/compare/v1.0.2...v1.0.3) (2025-08-06)


### Bug Fixes

* **release:** bump version to 1.0.3 ([bef7064](https://github.com/rzl-zone/utils-js/commit/bef70641fc169483a3099e6e8181af6443171006))

## [1.0.2](https://github.com/rzl-zone/utils-js/compare/v1.0.1...v1.0.2) (2025-08-06)


### Bug Fixes

* 'isObject' generic narrowing types on result logic with custom types, change unknown props as Record&lt;string, unknown&gt; result ([a4364f8](https://github.com/rzl-zone/utils-js/commit/a4364f8f49509aedc0afaf7b607c3cbadb58eccd))
* `deleteNestedKey` generic types props ([b656df6](https://github.com/rzl-zone/utils-js/commit/b656df68b8f243e55f24f90032126a05982dd24c))
* `isObject` generic narrowing types on result logic ([1c53ff6](https://github.com/rzl-zone/utils-js/commit/1c53ff699c4f7a25d48be61a72f37d66e57e0b50))
* `isObject` generic narrowing types on result logic with custom types ([fd251c9](https://github.com/rzl-zone/utils-js/commit/fd251c90e2098cab58c9edf3eb82212ce2010d87))
* `isObject` with internal func isNil && isArray ([efec254](https://github.com/rzl-zone/utils-js/commit/efec254375db2231370c395c7a0f6430bc7ddc4d))
* `isObjectOrArray` generic narrowing types on result logic with custom types ([38dda18](https://github.com/rzl-zone/utils-js/commit/38dda18ffb1c1af7f62b94646644029262bf16d0))
* improve `formatDateIntl` type safety and fix optional locale destructuring ([e1dc600](https://github.com/rzl-zone/utils-js/commit/e1dc600be642083f26b20c487f5141cdbc6da96c))
* resolve bug in core logic and sync types/tests ([ad03f7a](https://github.com/rzl-zone/utils-js/commit/ad03f7a7732fe3d87eced817271ab1d6fa797f45))

## [1.0.1](https://github.com/rzl-zone/utils-js/compare/v1.0.0...v1.0.1) (2025-08-06)


### Bug Fixes

* `isObject` result types generic ([9ec1978](https://github.com/rzl-zone/utils-js/commit/9ec19787fee6aec25cc55e7ba1da7d14eb17e3cb))
* add overload to `isArray` to handle unknown and generic cases ([0320718](https://github.com/rzl-zone/utils-js/commit/0320718c4e57cd916569739423e9a86cf9272ce7))
* add overload to `isObject` to handle unknown and generic cases ([651c0d1](https://github.com/rzl-zone/utils-js/commit/651c0d13215e4f2359447c042ff8f8b4be083373))
* add overloads and ensure correct type guard for `isSet` ([633b117](https://github.com/rzl-zone/utils-js/commit/633b117b5d66c95c8b7e7b2e7102e59497f9c458))
* correct type guard in `isSafeInteger` ([ebca4a6](https://github.com/rzl-zone/utils-js/commit/ebca4a6d927dfe5652f9de23dcb00b3099055074))
* improve `isArray` generic narrowing using Extract&lt;T, unknown[]&gt; ([f6410d5](https://github.com/rzl-zone/utils-js/commit/f6410d5db91c9175ec1cad7e0ffc070f36280ac9))
* improve `isNonEmptyArray` generic narrowing using Extract&lt;T, unknown[]&gt; and support overload to handle unknown with generic class ([202f6ef](https://github.com/rzl-zone/utils-js/commit/202f6efd490539dbd63ec605092c598690d67d7f))
* improve `isObjectLoose` generic narrowing type ([f15af2c](https://github.com/rzl-zone/utils-js/commit/f15af2c8b0a67b93b92ec37dd95b0912221ff81c))
* improve `isObjectOrArray` generic narrowing types and support overload to handle unknown with generic class ([2a8000c](https://github.com/rzl-zone/utils-js/commit/2a8000c17fcb9b4619377bf9bf0bedb7021bb003))
* improve `isPlainObject` by adding overloads, using internal isObject, and stricter checks ([8ab1d42](https://github.com/rzl-zone/utils-js/commit/8ab1d42db944e8279c6d57b9bd3ede29af7243f3))

## 1.0.0 (2025-08-05)


### ⚠ BREAKING CHANGES

* **core:**
  * Version 1.0.0 marks the first stable release.
  * This version establishes a consistent and reliable API surface.
  * All breaking changes moving forward will adhere to semantic versioning.

### Features

* **core:** initiate stable API ([c412f48](https://github.com/rzl-zone/utils-js/commit/c412f48b12447f5f4397827e72bc5c6f8824edfd))
