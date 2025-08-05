<h3 id="docs-sub-main--title">
  Docs Conversion `@rzl-zone/utils-js`   
</h3>
 
  #### 🚀 Number Conversion Utils Helpers

  <table>
    <thead>
      <tr>
        <th style="text-align: left"><small>Function</small></th>
        <th style="text-align: left"><small>Description</small></th>
        <th style="text-align: left"><small>Props / Usage</small></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <code><small>formatPhoneNumber()</small></code>
        </td>
        <td>
          <small>
            Overloaded function to format, validate, or extract numbers from phone
            strings.<br />
            Returns <code>string</code> or <code>boolean</code> based on props.
          </small>
        </td>
        <td>
          <small>
            ✅ <code>takeNumberOnly: true</code> → digits<br />
            ✅ <code>checkValidOnly: true</code> → boolean<br />
            ✅ Normal → formatted phone string
          </small>
        </td>
      </tr>
      <tr>
        <td>
          <code><small>formatNumber()</small></code>
        </td>
        <td>
          <small>
            Adds separators every 3 digits.<br />
            Works with integers, decimals, and customizable separator chars.
          </small>
        </td>
        <td>
          <small>
            <code>formatNumber(1000000)</code> → <code>"1,000,000"</code><br />
            <code>formatNumber(1234567.89, " ")</code> →
            <code>"1 234 567.89"</code>
          </small>
        </td>
      </tr>
    </tbody>
  </table>

  #### ⚡ Quick Example TypeScript/JavaScript (with type support):

  ```ts
  import { formatPhoneNumber,formatNumber } from "@rzl-zone/utils-js";

  // ✅ Example 1: Format phone number to string
  const ex1 = formatPhoneNumber({
    value: "+628123456789",
  });
  console.log(ex1);
  // Output: "(+62) 812 3456 789"

  // ✅ Example 2: Extract digits only
  const ex2 = formatPhoneNumber({
    value: "+62 812-3456-789",
    takeNumberOnly: true,
  });
  console.log(ex2);
  // Output: "628123456789"

  // ✅ Example 3: Validate phone format only (returns boolean)
  const ex3 = formatPhoneNumber({
    value: "+62 812 3456 789",
    checkValidOnly: true,
  });
  console.log(ex3);
  // Output: true or false

  // ✅ Example 4: Custom separator & country style
  const ex4 = formatPhoneNumber({
    value: "+62 8123456789",
    separator: "-",
    openingNumberCountry: "[",
    closingNumberCountry: "]",
  });
  console.log(ex4);
  // Output: "[+62] 812-3456-789"

  // ✅ Example 5: Format large number with custom separator
  const ex5 = formatNumber(987654321, " ");
  console.log(ex5);
  // Output: "987 654 321"
  ```

---

[⬅ Back Conversion Utils Lists](https://github.com/rzl-zone/utils-js/blob/main/docs/detailed-features/conversions/index.md#conversions-lists)

[⬅ Back to All Detailed features](https://github.com/rzl-zone/utils-js?tab=readme-ov-file#detailed-features)

---
