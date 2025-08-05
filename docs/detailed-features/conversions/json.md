<h3 id="docs-sub-main--title">
  Docs Conversion `@rzl-zone/utils-js`   
</h3>
  
  #### 🚀 Json Conversion Utils Helpers

  <table>
    <thead>
      <tr>
        <th style="text-align:left;"><small>Function</small></th>
        <th style="text-align:left;"><small>Description</small></th>
        <th style="text-align:left;"><small>Parameters</small></th>
        <th style="text-align:left;"><small>Returns</small></th>
        <th style="text-align:left;"><small>Highlights</small></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><small><code>safeJsonParse</code></small></td>
        <td>
          <small>
            Safely parses a JSON string while cleaning and transforming data based on flexible options.<br>
            Handles automatic type conversions, removes empty/unwanted values, and supports custom date parsing.
          </small>
        </td>
        <td>
          <small>
            <strong>value:</strong> <code>string | null | undefined</code><br>
            JSON string to parse.<br><br>
            <strong>options:</strong> <code>CleanParsedDataOptions</code> (optional)<br>
            <ul>
              <li><code>convertNumbers</code>: Convert numeric strings to numbers</li>
              <li><code>convertBooleans</code>: Convert "true"/"false" to booleans</li>
              <li><code>convertDates</code>: Parse ISO or custom date formats</li>
              <li><code>customDateFormats</code>: e.g. ["DD/MM/YYYY"]</li>
              <li><code>removeNulls</code>, <code>removeUndefined</code>, <code>removeEmptyObjects</code>, <code>removeEmptyArrays</code></li>
              <li><code>strictMode</code>: Clean aggressively</li>
              <li><code>loggingOnFail</code>: Log parse failures</li>
              <li><code>onError</code>: Custom error callback</li>
            </ul>
          </small>
        </td>
        <td>
          <small>
            <code>T | undefined | null</code><br>
            Returns cleaned data or <code>undefined</code> if parsing fails.<br>
            If input is <code>null</code>, returns <code>null</code>.
          </small>
        </td>
        <td>
          <small>
            ✅ Converts numeric & boolean strings<br>
            ✅ Parses ISO & custom dates<br>
            ✅ Removes <code>null</code>, <code>undefined</code>, empty objects/arrays<br>
            ✅ Strict mode for aggressive cleaning<br>
            ✅ Custom error handler & logging
          </small>
        </td>
      </tr>
    </tbody>
  </table>

  #### ⚡ Quick Example (Conversion Helpers - Json)
  #### ➡️ TypeScript (with type support):

  ```ts
  import { safeJsonParse } from "@rzl-zone/utils-js";

  type User = {
    age?: number;
    isActive?: boolean;
    birthday?: Date;
    name?: string;
    nickname?: string;
  };

  // ✅ Example 1: Convert numbers and booleans automatically
  const example1 = safeJsonParse<User>(
    '{"age":"30","isActive":"true"}',
    { convertNumbers: true, convertBooleans: true }
  );
  console.log(example1);
  // Output: { age: 30, isActive: true }

  // ✅ Example 2: Parse custom date format (DD/MM/YYYY)
  const example2 = safeJsonParse<User>(
    '{"birthday":"25/12/2000"}',
    { convertDates: true, customDateFormats: ["DD/MM/YYYY"] }
  );
  console.log(example2);
  // Output: { birthday: Date("2000-12-25T00:00:00.000Z") }

  // ✅ Example 3: Remove nulls and undefined
  const example3 = safeJsonParse<User>(
    '{"name":"John","nickname":null,"status":undefined}',
    { removeNulls: true, removeUndefined: true }
  );
  console.log(example3);
  // Output: { name: "John" }

  // ✅ Example 4: Remove empty objects and arrays
  const example4 = safeJsonParse(
    '{"a":{},"b":[],"c":"non-empty"}',
    { removeEmptyObjects: true, removeEmptyArrays: true }
  );
  console.log(example4);
  // Output: { c: "non-empty" }

  // ✅ Example 5: Strict mode (removes all invalid conversions)
  const example5 = safeJsonParse(
    '{"score":"99abc","empty":"   "} ',
    { convertNumbers: true, strictMode: true }
  );
  console.log(example5);
  // Output: {} (both removed because not valid strict conversions)

  // ✅ Example 6: Logging error if JSON invalid
  const example6 = safeJsonParse(
    '{"invalid JSON...',
    { loggingOnFail: true }
  );
  console.log(example6);
  // Output: undefined, logs: JSON parsing failed from `safeJsonParse`: ...

  /**
  * Bonus: Custom onError handler
  */
  safeJsonParse('{"invalid JSON...', {
    onError: (err) => {
      console.log("Custom error handler:", (err as Error).message);
    }
  });
  // Output: Custom error handler: Unexpected end of JSON input
  ```

  #### ➡️ JavaScript (without TypeScript): 

  ```ts
    import { safeJsonParse } from "@rzl-zone/utils-js";

    // ✅ Example 1: Convert numbers and booleans automatically
    const example1 = safeJsonParse(
      '{"age":"30","isActive":"true"}',
      { convertNumbers: true, convertBooleans: true }
    );
    console.log(example1);
    // Output: { age: 30, isActive: true }


    // ✅ Example 2: Parse custom date format (DD/MM/YYYY)
    const example2 = safeJsonParse(
      '{"birthday":"25/12/2000"}',
      { convertDates: true, customDateFormats: ["DD/MM/YYYY"] }
    );
    console.log(example2);
    // Output: { birthday: Date("2000-12-25T00:00:00.000Z") }


    // ✅ Example 3: Remove nulls and undefined
    const example3 = safeJsonParse(
      '{"name":"John","nickname":null,"status":undefined}',
      { removeNulls: true, removeUndefined: true }
    );
    console.log(example3);
    // Output: { name: "John" }


    // ✅ Example 4: Remove empty objects and arrays
    const example4 = safeJsonParse(
      '{"a":{},"b":[],"c":"non-empty"}',
      { removeEmptyObjects: true, removeEmptyArrays: true }
    );
    console.log(example4);
    // Output: { c: "non-empty" }


    // ✅ Example 5: Strict mode (removes all invalid conversions)
    const example5 = safeJsonParse(
      '{"score":"99abc","empty":"   "} ',
      { convertNumbers: true, strictMode: true }
    );
    console.log(example5);
    // Output: {} (both removed because not valid strict conversions)


    // ✅ Example 6: Logging error if JSON invalid
    const example6 = safeJsonParse(
      '{"invalid JSON...',
      { loggingOnFail: true }
    );
    console.log(example6);
    // Output: undefined, logs: JSON parsing failed: ...


    /**
    * Bonus: Custom onError handler
    */
    safeJsonParse('{"invalid JSON...', {
      onError: (err) => {
        console.log("Custom error handler:", err.message);
      }
    });
    // Output: Custom error handler: Unexpected end of JSON input
  ```

---

[⬅ Back Conversion Utils Lists](https://github.com/rzl-zone/utils-js/blob/main/docs/detailed-features/conversions/index.md#conversions-lists)

[⬅ Back to All Detailed features](https://github.com/rzl-zone/utils-js?tab=readme-ov-file#detailed-features)

---
