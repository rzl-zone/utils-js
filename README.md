<div align="center">
  <h1><strong>⚡️ <code>@rzl-zone/utils-js</code> 🚀</strong></h1>
</div>

<p align="center">
🚀 <strong><u>Rzl Utility JS</u></strong> 🚀<br/>
<i>A lightweight, modern TypeScript utility library for Node.js & browser (via bundlers like Webpack/Vite).</i><br/>
<i>Provides reusable helpers to simplify your JavaScript or TypeScript projects.</i><br/>
<strong><i>Built with ❤️ by <a href="https://github.com/rzl-app" target="_blank" rel="nofollow noreferrer noopener">@rzl-app</a>.</i></strong>
</p>

<div align="center">

<p>
<a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/npm/v/@rzl-zone/utils-js?color=blue&style=flat-rounded" alt="Latest Version on NPM" data-canonical-src="https://img.shields.io/npm/v/@rzl-zone/utils-js?color=blue&amp;style=flat-rounded">
</a>
<a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/npm/dt/@rzl-zone/utils-js?style=flat-rounded" alt="Downloads">
</a>
<a href="https://nodejs.org/en/" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/badge/node-≥16.0.0-blue.svg?logo=node.js&style=flat-rounded" alt="Node.js">
</a>
<a href="https://github.com/rzl-zone/utils-js/blob/main/CONTRIBUTING.md" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</a>
<a href="https://github.com/rzl-zone/utils-js/blob/main/LICENSE.md" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license">
</a>
<a href="https://github.com/rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/badge/GitHub-rzl--zone%2Futils--js-181717?logo=github" alt="GitHub">
</a>
<a href="https://github.com/rzl-app" target="_blank" rel="nofollow noreferrer noopener">
  <img src="https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github&style=flat-rounded" alt="Repo on GitHub">
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
  - [Full documentation](#full-documentation-rzl-utilsjs-is-currently-under-construction-%EF%B8%8F)
  - [Hint Autocomplete](#hint-autocomplete)
- 🔥 [Usage](#usage)
- ❤️ [Sponsor](#sponsor-this-package)
- 📜 [Changelog](#changelog)
- 🤝 [Contributing](#contributing)
- 🔒 [Security](#security)
- 🙌 [Credits](#credits)
- 📄 [License](#license)

---

<h2 id="requirements">💻 <strong>Requirements</strong></h2>

- **Node.js `≥16.0.0`**  
  This package leverages modern JavaScript & TypeScript features that require Node.js version 16.0.0 if not using Next.js, and for Next.js it must follow the official minimum Node.js version requirement depending on the version you use.  
  - 🔗 See official Next.js documentation: 
      <a href="https://nextjs.org/docs/getting-started/installation#system-requirements" target="_blank" rel="nofollow noreferrer noopener"><i>NextJS Installation Requirements.</i></a>

- **Works with:**
  - ✅ Node.js (16.0.0+) - Without NextJS
  - ✅ Node.js (18.17.0, or higher depending on NextJS version) - With NextJS
  - ✅ Modern browsers (via bundlers like Webpack / Vite)

---

<h2 id="installation">⚙️ <strong>Installation</strong></h2>

#### *With NPM*

```bash
  npm install @rzl-zone/utils-js
```

#### *With Yarn*

```bash
  yarn add @rzl-zone/utils-js
```

#### *With PNPM*

```bash
  pnpm add @rzl-zone/utils-js
```

---

<h2 id="features">✨ <strong>Features</strong></h2>

- 🚀 Written in **TypeScript** — fully typed & safe
- ⚡ Small, tree-shakable & fast
- 📦 Works in **Node.js** & modern browsers
- ❤️ Simple API, easy to extend
- 🧬 **Next.js support**: helpers for dynamic routes, building URLs, reading env, extracting client IP
- 🛠 Additional TypeScript types: `OmitStrict`, `PartialOnly`, etc.

---

<h2 id="nextjs-support">🧬 <strong>Next.js Support</strong></h2>

**This package also provides utilities specially built for Next.js environments, neatly separated into their own entry points:**

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

<h2 id="detailed-features">💎 <strong>Detailed Features</strong></h2>

  ### **Full documentation <a href="https://docs-rzl-utils-js.vercel.app" target="_blank" rel="nofollow noreferrer noopener">Rzl UtilsJS</a> is **currently under construction** 🏗️.**
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

  import type { | } from "@rzl-zone/utils-js/types";
  ```
  #### Place your cursor inside { } or after "@rzl-zone/utils-js/{{ | }}" then press Ctrl+Space to see all available functions/types with full TSDoc hints.
  ---
  ### **Hint: Autocomplete**

  **To get the best autocomplete hints for folders and files, add the `types` field in your configuration file:**

  #### # **_TypeScript_**:
  Add this to your `tsconfig.json`:
  ```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "types": [
        "@rzl-zone/utils-js"
      ]
    }
  }

  ```
  #### # **_JavaScript_:**
  Add this to your `jsconfig.json`:
  ```jsonc
  // jsconfig.json
  {
    "compilerOptions": {
      "types": [
        "@rzl-zone/utils-js"
      ]
    }
  }
  ```
  >ℹ️ ***Tip:*** *For JS projects, consider adding "checkJs": true for better IntelliSense.*

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

#### *Example Types Helper Import:*

```ts
import type { OmitStrict } from "@rzl-zone/utils-js/types";

type MyType = OmitStrict<OtherType, "omittingProps">;
// Fully strict TS omit that requires all keys to exist in target
```

---

<h2 id="sponsor-this-package">❤️ <strong>Sponsor this package</strong></h2>

**Help support development:**    
*[👉 Become a sponsor](https://github.com/sponsors/rzl-app)*

---

<h2 id="changelog">📝 <strong>Changelog</strong></h2>

**See [CHANGELOG](CHANGELOG.md).**

---

<h2 id="contributing">🤝 <strong>Contributing</strong></h2>

**See [CONTRIBUTING](CONTRIBUTING.md).**

---

<h2 id="security">🔒 <strong>Security</strong></h2>

**Please report issues to [rizalvindwiky1998@gmail.com](mailto:rizalvindwiky1998@gmail.com).**

---

<h2 id="credits">🙌 <strong>Credits</strong></h2>

**- [Rzl App](https://github.com/rzl-app)**  
**- [All Contributors](../../contributors)**

---

<h2 id="license">📜 <strong>License</strong></h2>

**The MIT License (MIT).**    
*Please see **[License File](LICENSE.md)** for more information.*

---

✅ **Enjoy using `@rzl-zone/utils-js`?**  
*Star this repo [⭐](https://github.com/rzl-zone/utils-js) and share it with other JavaScript developers!*

---
