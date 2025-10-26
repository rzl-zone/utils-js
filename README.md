<div align="center" style="display: flex; flex-direction: column; align-items: center;gap: 0rem">
  <a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/rzl-zone/utils-js/main/logo-circle.png">
    <img src="https://raw.githubusercontent.com/rzl-zone/utils-js/main/logo-circle.png" align="middle" alt="RzlZone Logo" width="110" style="max-width: 100%;">
  </a>
</div>

<h1 align="center"><strong>UtilsJS</strong></h1>

<p align="center"> 
  <i>
    A lightweight, modern TypeScript utility library for Node.js & browser (via bundlers like <a href="https://webpack.js.org"><code>Webpack</code></a>, <a href="https://vercel.com/blog/turbopack"><code>Turbopack</code></a>, or <a href="https://vite.dev/"><code>Vite</code></a>).
  </i><br/>
  <i>Provides reusable helpers to simplify your JavaScript or TypeScript projects.</i><br/>
  <strong><i>Built with ❤️ by <a href="https://github.com/rzl-zone" target="_blank" rel="nofollow noreferrer noopener">@rzl-zone</a>.</i></strong>
</p>

<div align="center">

<p>
  <a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/npm/v/@rzl-zone/utils-js?logo=npm&label=Latest%20Version&color=4CAF50&logoColor=CB3837&style=flat-rounded" alt="Latest Version on NPM">
  </a>
  <a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/npm/dt/@rzl-zone/utils-js?logo=npm&label=Total%20Downloads&color=007EC6&logoColor=CB3837&style=flat-rounded" alt="NPM Total Downloads">
  </a>
  <a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/npm/dw/@rzl-zone/utils-js?logo=npm&label=Weekly%20Downloads&color=CB3837&logoColor=CB3837&style=flat-rounded" alt="NPM Weekly Downloads">
  </a>
  <a href="https://nodejs.org/en/" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/Node.js-18.18.0%2B-green.svg?logo=node.js&color=339933&style=flat-rounded" alt="Node.js">
  </a>
  <a href="https://github.com/rzl-zone/utils-js/blob/main/CONTRIBUTING.md" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?color=28A745" alt="PRs Welcome">
  </a>
  <a href="https://github.com/rzl-zone/utils-js/blob/main/LICENSE.md" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?color=3DA639" alt="GitHub license">
  </a>
  <a href="https://github.com/rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github" alt="GitHub">
  </a>
  <a href="https://github.com/orgs/rzl-zone/repositories" target="_blank" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/Org-rzl--zone-24292e?logo=github&style=flat-rounded" alt="Repo on GitHub">
  </a>
</p>

</div>

---
 
<h2 id="table-of-contents">📚 <strong>Table of Contents</strong></h2>

- 💻 [Requirements](#requirements)
- ⚙️ [Installation](#installation)
- ✨ [Features](#features)
- 🧬 [NextJS Support](#nextjs-support)
- 💎 [Detailed Features](#detailed-features)
  - [Full Documentation](#detailed-features--full-documentation)
  - [CDN Usage](#detailed-features--cdn-usage)
  - [Hint Autocomplete](#detailed-features--hint-autocomplete-setup)
- 🔥 [Usage](#usage)
- ❤️ [Sponsor](#sponsor-this-package)
- 📜 [Changelog](#changelog)
- 🤝 [Contributing](#contributing)
- 🔒 [Security](#security)
- 🙌 [Credits](#credits)
- 📄 [License](#license)

---

<h2 id="requirements">💻 <strong>Requirements</strong></h2>

- **Node.js `≥18.18.0`**  
  This package leverages modern JavaScript & TypeScript features that require Node.js version 18.18.0 if not using Next.js, and for Next.js it must follow the official minimum Node.js version requirement depending on the version you use.  
  - 🔗 See official Next.js documentation:
      <a href="https://nextjs.org/docs/getting-started/installation#system-requirements" target="_blank" rel="nofollow noreferrer noopener"><i><strong>NextJS System Requirements</strong></i></a>.

- **Works with:**
  - ✅ Node.js (18.18.0+) - ***Without NextJS***.
  - ✅ Node.js (20.9.0, or higher depending on NextJS version) - ***With NextJS***.
  - ✅ Modern browsers (via bundlers like [`Webpack`](https://webpack.js.org), [`Turbopack`](https://vercel.com/blog/turbopack), or [`Vite`](https://vite.dev)).

- **TypeScript Build Info:**
  - Target: `ES2022`
  - Module: `ES2022`
  - Module Resolution: `bundler`

  <br/>
  
  > ℹ️ Note:  
  > These TypeScript settings are used to build the package, consumers do **not** need to match these settings unless they plan to build or modify the source code.

---

<h2 id="installation">⚙️ <strong>Installation</strong></h2>

#### *With NPM*

```bash
npm install @rzl-zone/utils-js@latest
```

#### *With Yarn*

```bash
yarn add @rzl-zone/utils-js@latest
```

#### *With PNPM*

```bash
pnpm add @rzl-zone/utils-js@latest
```

---

<h2 id="features">✨ <strong>Features</strong></h2>

- 🚀 Written in **TypeScript** — fully typed & safe
- ⚡ Small, tree-shakable & fast
- 📦 Works in **Node.js** & modern browsers
- ❤️ Simple API, easy to extend
- 🧬 **Next.js support**: helpers for dynamic routes, building URLs, reading env, extracting client IP
---

<h2 id="nextjs-support">🧬 <strong>Next.js Support</strong></h2>

**This package also provides utilities specially built for Next.js environments, neatly separated into their own entry points:**

- <h4 id="nextjs-support--globals"><strong><code>@rzl-zone/utils-js/next</code></strong></h4>  
  Helpers for building URLs, generating dynamic routes, reading environment variables, etc.   

  ✅ Safe to use in both Next.js pages & API routes.

  [**Read More Docs**](/docs/next-js/global.md#docs-sub-main--title)

  ***

- <h4 id="nextjs-support--server-only"><strong><code>@rzl-zone/utils-js/next/server</code></strong></h4>  
  Utilities meant to run in Next.js server-only contexts (like middleware or server actions) for tasks such as extracting real client IPs.  
  
  > ⚠️ Will throw Error if used outside a ***Next.js* server environment**.

  [**Read More Docs**](/docs/next-js/server-only.md#docs-sub-main--title)

---

<h2 id="detailed-features">💎 <strong>Detailed Features</strong></h2>

  <h3 id="detailed-features--full-documentation">
    <strong>
      Full documentation <a href="https://rzlzone.vercel.app/docs/utils-js" target="_blank" rel="nofollow noreferrer noopener">UtilsJS</a> is 
        <strong>currently under construction 🏗️</strong>.
    </strong>
  </h3>

  #### For now, explore the examples or dive into the source — all utilities are documented via **TSDoc** and typed properly.
  
  ```ts
  import { | } from "@rzl-zone/utils-js/assertions";
  import { | } from "@rzl-zone/utils-js/conversions"; 
  import { | } from "@rzl-zone/utils-js/events";
  import { | } from "@rzl-zone/utils-js/formatters";
  import { | } from "@rzl-zone/utils-js/generators";
  import { | } from "@rzl-zone/utils-js/next";
  import { | } from "@rzl-zone/utils-js/next/server";
  import { | } from "@rzl-zone/utils-js/operations";
  import { | } from "@rzl-zone/utils-js/parsers";
  import { | } from "@rzl-zone/utils-js/predicates";
  import { | } from "@rzl-zone/utils-js/promises";
  import { | } from "@rzl-zone/utils-js/strings";
  import { | } from "@rzl-zone/utils-js/tailwind";
  import { | } from "@rzl-zone/utils-js/urls"; 
  ```
  #### Place your cursor inside { } or after "@rzl-zone/utils-js/{{ | }}" then press Ctrl+Space to see all available functions/types with full TSDoc hints.

  > ***⚠️ Note:*** Starting from version `3.4.0+`, the extra TypeScript types (e.g., `OmitStrict`, `PartialOnly`, etc), have been removed from the package, to use them, you now need to install **[`@rzl-zone/ts-types-plus`](https://www.npmjs.com/package/@rzl-zone/ts-types-plus)** separately.

  ---
  
  <h3 id="detailed-features--cdn-usage">
    <strong>
      CDN Usage.
    </strong>
  </h3>

  #### **Including via CDN**
  ```xml
  <!-- jsDelivr -->
  <script src="https://cdn.jsdelivr.net/npm/@rzl-zone/utils-js@latest"></script>

  <!-- unpkg -->
  <script src="https://unpkg.com/@rzl-zone/utils-js@latest"></script>
  ```

  > ⚠️ **Note:**  
  > When using the library via CDN in the browser:  
  > - Always include first the \<script\> tag before your own scripts when using the CDN version.
  > - Some Node.js-specific utilities may **not** be available, e.g.:  
  >   - Category utils of `tailwind`, `next`, `next/server`.  
  >   - Server-only features (like Next.js helpers) will **not** be available.  
  > - The global object provided is `RzlUtilsJs`.  
  > - The CDN bundle is **~350KB minified**, for production, consider using bundlers or npm packages for smaller size and tree-shaking.

  ---
  <h3 id="detailed-features--hint-autocomplete-setup">
    <strong>
      Hint: Autocomplete Setup (Step by Step).
    </strong>
  </h3>

  #### Make TypeScript & VSCode automatically provide autocomplete for `@rzl-zone/utils-js` without needing triple-slash references in every file:

  - 1️⃣ **Install @rzl-zone/utils-js.**

    - Make sure the package is installed:

      ```bash
      npm install @rzl-zone/utils-js@latest
      # or
      yarn add @rzl-zone/utils-js@latest
      # or
      pnpm add @rzl-zone/utils-js@latest
      ```

  - 2️⃣ **Create a types folder.**

    - Inside your project root, make a folder called `types`:

      ```pgsql
      project-root/
        ├─ src/
        ├─ types/
        │  └─ index.d.ts
        ├─ tsconfig.json
        └─ jsconfig.json
      ```

  - 3️⃣ **Add the global reference file.**

    - Create `types/index.d.ts` with this content:

      ```ts
      /// <reference types="@rzl-zone/utils-js" />
      ```

      - This tells TypeScript to include the types from `@rzl-zone/utils-js` globally.
      - You can add more references here if needed, for example:

      ```ts
      /// <reference types="@rzl-zone/utils-js" />

      // eg more references (if needed):
      /// <reference types="node" />
      /// <reference types="react" />
      ``` 

  - 4️⃣ **Update tsconfig.json.**

    - Make sure not to override "types" (or leave it empty) so TypeScript automatically picks up your types folder:

      ```jsonc
      // tsconfig.json
      {
        "compilerOptions": { 
          "strict": true,
          "typeRoots": [
            "./types", 
            "./node_modules/@types"
          ],
          // other your config...
        },
        "include": [
          "src", 
          "types"
        ],
        // other your config...
      }
      ```
      - `typeRoots` tells TS where to look for global type definitions.
      - The `types` folder comes first, so your references override or add to the default `@types` packages

  - 5️⃣ **Update jsconfig.json (for JavaScript projects).**

    - If you also work with JS, do the same:

      ```jsonc
      // jsconfig.json
      {
        "compilerOptions": {
          "checkJs": true,  // Optional, enables type checking 
          "typeRoots": [
            "./types", 
            "./node_modules/@types"
          ],
          // other your config...
        },
        "include": [
          "src", 
          "types"
        ],
        // other your config...
      }
      ```
      >ℹ️ ***Tip:*** *For JS projects, consider adding "checkJs": true for better IntelliSense.*
    
  #### **Now, all types from `@rzl-zone/utils-js` are globally available, and you don’t need `"types": ["@rzl-zone/utils-js"]` in tsconfig.json.**

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

<h2 id="usage">🔥 <strong>Usage</strong></h2>

### **Easy to use, just import on your code base.**

#### *Example Function Import:*

```ts
import { isServer } from "@rzl-zone/utils-js/predicates";

console.log(isServer());
// ➔ `true` if running on server-side, `false` if in browser.
```

---

<h2 id="sponsor-this-package">❤️ <strong>Sponsor this package</strong></h2>

**Help support development:**    
*[👉 **Become a sponsor**](https://github.com/sponsors/rzl-app).*

---

<h2 id="changelog">📝 <strong>Changelog</strong></h2>

**See [CHANGELOG](CHANGELOG.md).**

---

<h2 id="contributing">🤝 <strong>Contributing</strong></h2>

**See [CONTRIBUTING](CONTRIBUTING.md).**

---

<h2 id="security">🔒 <strong>Security</strong></h2>

**Please report issues to [rzlzone.dev@gmail.com](mailto:rzlzone.dev@gmail.com).**

---

<h2 id="credits">🙌 <strong>Credits</strong></h2>

**- [Rzl App](https://github.com/rzl-app)**  
**- [All Contributors](../../contributors)**

---

<h2 id="license">📜 <strong>License</strong></h2>

**The MIT License (MIT).**    
*Please see **[License File](LICENSE.md)** for more information.*

---

<h2>✅ <strong>Enjoy using <code>@rzl-zone/utils-js</code>?</strong></h2>

*Star this repo [⭐](https://github.com/rzl-zone/utils-js) and share it with other JavaScript developers!*

---
