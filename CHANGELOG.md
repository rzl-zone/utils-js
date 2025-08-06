# Changelog

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
