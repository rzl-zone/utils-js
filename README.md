<div align="center">
  <h1><strong>⚡️ <code>@rzl-zone/utils-js</code> 🚀</strong></h1>
</div>

<p align="center">
🚀 <strong>Rzl Utility JavaScript</strong> 🚀<br/>
A lightweight, modern TypeScript utility library for Node.js & browser (via bundlers like Webpack/Vite).<br/>
Provides reusable helpers to simplify your JavaScript / TypeScript projects.<br/>
<strong>Built with ❤️ by <a href="https://github.com/rzl-app">@rzl-app</a>.</strong>
</p>

<div align="center">

[![Latest Version on NPM](https://img.shields.io/npm/v/@rzl-zone/utils-js?color=blue&style=flat-rounded)](https://npmjs.com/package/@rzl-zone/utils-js)
[![downloads](https://img.shields.io/npm/dt/@rzl-zone/utils-js?style=flat-rounded)](https://npmjs.com/package/@rzl-zone/utils-js)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0%20%7C%20%3E%3D18.17.0-blue.svg?logo=node.js&style=flat-rounded)](https://nodejs.org/en/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rzl-zone/utils-js/blob/main/CONTRIBUTING.md)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rzl-zone/utils-js/blob/main/LICENSE.md)
[![GitHub](https://img.shields.io/badge/GitHub-rzl--zone%2Futils--js-181717?logo=github)](https://github.com/rzl-zone/utils-js)
[![Repo on GitHub](https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github&style=flat-rounded)](https://github.com/rzl-app)

</div>

---
 
<h2 id="table-of-contents">📚 Table of Contents</h2>

- 💻 [Requirements](#requirements)
- ⚙️ [Installation](#installation)
- ✨ [Features](#features)
- 🧬 [NextJS Support](#nextjs-support)
- 💎 [Detailed Features](#detailed-features)
- 🔥 [Usage](#usage)
- ❤️ [Sponsor](#sponsor-this-package)
- 📜 [Changelog](#changelog)
- 🤝 [Contributing](#contributing)
- 🛡 [Security](#security)
- 🙌 [Credits](#credits)
- 📄 [License](#license)

---

<h2 id="requirements">💻 Requirements</h2>

- **Node.js >= 16.0.0 or >=18.17.0**  
  This package leverages modern JavaScript & TypeScript features that require Node.js version 16.0.0 if not using nextjs and 18.17.0 or higher for nextjs.

- Works with:
  - ✅ Node.js (16.0.0+) - Without NextJS
  - ✅ Node.js (18.17.0+) - With NextJS
  - ✅ Modern browsers (via bundlers like Webpack / Vite)

---

<h2 id="installation">⚙️ Installation</h2>

#### With NPM

```bash
  npm install @rzl-zone/utils-js
```

#### With Yarn

```bash
  yarn add @rzl-zone/utils-js
```

#### With PNPM

```bash
  pnpm add @rzl-zone/utils-js
```

---

<h2 id="features">✨ Features</h2>

- 🚀 Written in **TypeScript** — fully typed & safe
- ⚡ Small, tree-shakable & fast
- 📦 Works in **Node.js** & modern browsers
- ❤️ Simple API, easy to extend
- 🧬 **Next.js support**: helpers for dynamic routes, building URLs, reading env, extracting client IP
- 🛠 Additional TypeScript types: `OmitStrict`, `PartialByKeys`, etc.

---

<h2 id="nextjs-support">🧬 Next.js Support</h2>

This package also provides utilities specially built for Next.js environments, neatly separated into their own entry points:

- <h3 id="nextjs-support--globals">`@rzl-zone/utils-js/next`</h3>  
  Helpers for building URLs, generating dynamic routes, reading environment variables, etc.   

  ✅ Safe to use in both Next.js pages & API routes.

  [Read More Docs](/docs/next-js/global.md#docs-sub-main--title)

  ***

- <h3 id="nextjs-support--server-only">`@rzl-zone/utils-js/next/server`</h3>   
  Utilities meant to run in Next.js server-only contexts (like middleware or server actions) for tasks such as extracting real client IPs.  
  
  ⚠️ Will throw if used outside a Next.js server environment.

  [Read More Docs](/docs/next-js/server-only.md#docs-sub-main--title)

---

<h2 id="detailed-features">💎 Detailed Features</h2>

  ### Full documentation coming soon.  
  #### For now, explore the examples or dive into the source — all utilities are documented via **JSDoc** and typed properly.
  
  ```ts
  import { | } from "@rzl-zone/utils-js";
  import { | } from "@rzl-zone/utils-js\types";
  import { | } from "@rzl-zone/utils-js\next";
  import { | } from "@rzl-zone/utils-js\next\server";

  // Just place your cursor right inside { } like the pipe ("|") above then
  // ctrl + space, there are many functions or types and then hover to each
  // function is complete with how to use it because I have added jsDoc.
  ```

  <!-- - <h4 id="detailed-features--assertions">
      Assertions - 
      <a href="/docs/detailed-features/assertions.md#docs-sub-main--title">
        Read More Docs.
      </a> 
    </h4> 
  
  - <h4 id="detailed-features--checkers">
      Checkers - 
      <a href="/docs/detailed-features/checkers.md#docs-sub-main--title">
        Read More Docs.
      </a> 
    </h4> 

  - <h4 id="detailed-features--conversions">
      Conversions -
      <a href="/docs/detailed-features/conversions/index.md#conversions-lists">
        Read More Docs.
      </a> 
    </h4>
       -->
---

<h2 id="usage">🔥 Usage</h2>

#### Easy to use, just import on your code base.

##### Example Function Import:

```ts
import { isServer } from "@rzl-zone/utils-js";

console.log(isServer());
// true if running on Node.js, false if browser
```

##### Example TypeScript Helper Import:

```ts
import type { OmitStrict } from "@rzl-zone/utils-js/types";

type MyType = OmitStrict<OtherType, "omitedProps">;
// Fully strict TS omit that requires all keys to exist in target
```

---

<h2 id="sponsor-this-package">❤️ Sponsor this package</h2>

Help support development:  
[👉 Become a sponsor](https://github.com/sponsors/rzl-app)

---

<h2 id="changelog">📝 Changelog</h2>

See [CHANGELOG](CHANGELOG.md).

---

<h2 id="contributing">🤝 Contributing</h2>

See [CONTRIBUTING](CONTRIBUTING.md).

---

<h2 id="security">🛡 Security</h2>

Please report issues to [rizalvindwiky1998@gmail.com](mailto:rizalvindwiky1998@gmail.com).

---

<h2 id="credits">🙌 Credits</h2>

- [Rzl App](https://github.com/rzl-app)
- [All Contributors](../../contributors)

---

<h2 id="license">📜 License</h2>

The MIT License (MIT).  
Please see [License File](LICENSE.md) for more information.

---

✅ **Enjoy using `@rzl-zone/utils-js`?**  
Star this repo ⭐ and share it with other JavaScript developers!

---
