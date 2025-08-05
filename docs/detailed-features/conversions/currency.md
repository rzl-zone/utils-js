<h3 id="docs-sub-main--title">
  Docs Conversion `@rzl-zone/utils-js`   
</h3>

  #### 🚀 Currency Conversion Utils Helpers

  <table>
    <thead>
      <tr>
        <th><small>Function / Type</small></th>
        <th><small>What it does</small></th>
        <th><small>Highlights</small></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><small><code>formatCurrency</code></small></td>
        <td><small>Formats a number or string into a currency string with customizable separators, decimals, and suffixes.</small></td>
        <td><small>✅ Custom thousands & decimal separators<br>✅ Supports suffix decimals (e.g., ".-")<br>✅ Safe type validation</small></td>
      </tr>
      <tr>
        <td><small><code>extractDigits</code></small></td>
        <td><small>Strips out all non-numeric characters from a string or number input, returning a cleaned number.</small></td>
        <td><small>✅ Handles <code>null</code> & <code>undefined</code><br>✅ Ensures numeric result<br>✅ Simple fallback to <code>0</code></small></td>
      </tr>
    </tbody>
  </table>

  #### ⚡ Quick Example (Conversion Helpers - Currency)

  ```ts
  import { formatCurrency, extractDigits } from "@rzl-zone/utils-js";

  // Example: formatCurrency
  console.log(formatCurrency({ value: 1000000 }));
  // → "1.000.000"

  console.log(formatCurrency({ value: 2500.5, decimal: true }));
  // → "2.500,00" (because totalDecimal default is 2)

  console.log(formatCurrency({ value: "98765", separator: " " }));
  // → "98 765"

  console.log(
    formatCurrency({
      value: 1999.99,
      endDecimal: true,
      suffixDecimal: ".-",
      decimal: true,
      separatorDecimals: ",",
    })
  );
  // → "1.999,00.-"

  // Example: extractDigits
  console.log(extractDigits({ value: "123abc456" }));
  // → 123456

  console.log(extractDigits({ value: "$1,234.56" }));
  // → 123456

  console.log(extractDigits({ value: "9A8B7C6" }));
  // → 9876

  console.log(extractDigits({ value: undefined }));
  // → 0

  console.log(extractDigits({ value: null }));
  // → 0
  ```
---

[⬅ Back Conversion Utils Lists](https://github.com/rzl-zone/utils-js/blob/main/docs/detailed-features/conversions/index.md#conversions-lists)

[⬅ Back to All Detailed features](https://github.com/rzl-zone/utils-js?tab=readme-ov-file#detailed-features)

---
