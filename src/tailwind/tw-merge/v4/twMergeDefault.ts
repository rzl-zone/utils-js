import type { OptionsMergeTwClsV4, TwMergeDefaultFnV4 } from "./_private/types";

import { extendTailwindMerge, getDefaultConfig } from "tailwind-merge-v4";

import { isPlainObject } from "@/predicates/is/isPlainObject";
import { validatorPropsTwMerge } from "../_private/validate-props";

// Get default Tailwind merge configuration
const defaultConfig = getDefaultConfig();

/** -------------------------------------------------------------
 * * ***Customized Tailwind class merger Version 4 with extended rules.***
 * -------------------------------------------------------------
 * **Wraps **{@link extendTailwindMerge| `extendTailwindMerge`}** with Tailwind’s default config
 * ({@link getDefaultConfig | `getDefaultConfig()`}) to create a **project-ready `twMerge`**.**
 * - 🔑 **When to use it?**
 *    - Your project uses **Tailwind v4**.
 *    - Extend **class groups** (e.g. add `text-shadow`).
 *    - Respect your own **`tailwind.config.ts`** (colors, spacing, fontSize, etc).
 *    - Override or fine-tune **merge behavior**.
 *    - Create a **project-wide `cn` helper** that replaces raw `twMerge`.
 * @param {OptionsMergeTwClsV4} [options={}]
 *  ***Merge options:***
 *    - `config` – Your Tailwind config (from `tailwind.config.ts`).
 *    - `prefix` - Utility prefix (e.g. `tw-` or `tw`).
 *    - `extend` – Extra merge rules (classGroups, theme, etc).
 *    - `override` – Fully replace rules.
 *    - `cacheSize` – Parsed class cache size.
 *    - `experimentalParseClassName` – Custom classname parser.
 * @returns {TwMergeDefaultFnV4}
 * Customized Tailwind class merge function version 4 (same signature as `twMerge`).
 * @example
 * #### Example 1: ***Default behavior (same as tailwind-merge).***
 * ```ts
 * import { twMergeDefaultV4 } from "@rzl-zone/utils-js/tailwind";
 *
 * const twMerge = twMergeDefaultV4();
 * twMerge("p-2 p-4");
 * // ➔ "p-4"
 * ```
 * #### Example 2: ***Extend class groups.***
 * ```ts
 * import { twMergeDefaultV4 } from "@rzl-zone/utils-js/tailwind";
 *
 * const twMerge2 = twMergeDefaultV4({
 *   extend: {
 *     classGroups: {
 *       shadow: ["shadow-soft", "shadow-hard"],
 *     },
 *   },
 * });
 * twMerge2("shadow-soft shadow-hard");
 * // ➔ "shadow-hard"
 * ```
 * #### Example 3: ***Respect your Tailwind config.***
 * ```ts
 * import config from "../tailwind.config";
 * import { twMergeDefaultV4 } from "@rzl-zone/utils-js/tailwind";
 *
 * const twMerge3 = twMergeDefaultV4({ config });
 * twMerge3("text-base text-xxs");
 * // ➔ "text-xxs" (resolved from config)
 * ```
 * #### Example 4: ***Project-wide helper (recommended).***
 * ```ts
 * import configTwCss from "../tailwind.config";
 * import { customCnV4, twMergeDefaultV4, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * const customTwMerge = twMergeDefaultV4({
 *   config: configTwCss,
 *   extend: {
 *     classGroups: { shadow: ["shadow-soft", "shadow-hard"] },
 *   },
 * });
 *
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnV4(customTwMerge, ...classes);
 * };
 *
 * // ✅ Usage
 * cnApp("p-2 p-4");                 // ➔ "p-4"
 * cnApp("shadow-soft shadow-hard"); // ➔ "shadow-hard"
 * cnApp("text-base text-xxs");      // ➔ "text-xxs" (uses config)
 *
 * // ⚡ Difference with package-level `cn`
 * import { cnV3, cnV4 } from "@rzl-zone/utils-js/tailwind";
 *
 * cnV3("text-base text-xxs");
 * // or
 * cnV4("text-base text-xxs");
 * // ➔ "text-base"  (❌ doesn't know about your config)
 *
 * cnApp("text-base text-xxs");
 * // ➔ "text-xxs"  (✅ respects config)
 * ```
 */
export const twMergeDefaultV4 = (
  options: OptionsMergeTwClsV4 = {}
): TwMergeDefaultFnV4 => {
  if (!isPlainObject(options)) options = {};
  const {
    cacheSize,
    classGroups,
    config,
    conflictingClassGroupModifiers,
    conflictingClassGroups,
    orderSensitiveModifiers,
    override,
    prefix,
    theme,
    experimentalParseClassName
  } = validatorPropsTwMerge(options);

  return extendTailwindMerge<string, string>({
    prefix: prefix || config.prefix,
    cacheSize: cacheSize || defaultConfig.cacheSize,
    experimentalParseClassName,
    override,
    extend: {
      conflictingClassGroupModifiers: {
        ...defaultConfig.conflictingClassGroupModifiers,
        ...conflictingClassGroupModifiers
      },
      theme: { ...defaultConfig.theme, ...theme },
      conflictingClassGroups: {
        ...defaultConfig.conflictingClassGroups,
        ...conflictingClassGroups
      },
      orderSensitiveModifiers: [
        ...defaultConfig.orderSensitiveModifiers,
        ...orderSensitiveModifiers
      ],
      classGroups: {
        ...defaultConfig.classGroups,
        ...classGroups,

        "text-shadow": ["", "-sm", "-md", "-lg", "-xl", "-xxl", "-none", "-default"].map(
          (size) => `text-shadow${size}`
        ),
        "font-size": Object.keys({
          ...(config.theme?.fontSize || {}),
          ...(config.theme?.extend?.fontSize || {})
        }).map((size) => `text-${size}`)
      }
    }
  });
};
