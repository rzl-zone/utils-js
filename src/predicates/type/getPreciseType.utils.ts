// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { getPreciseType } from "./getPreciseType";

/** ----------------------------------------------------------
 * * ***List of common acronyms that should remain uppercase in formatted output, extend this list if you have more acronyms to support.***
 * ----------------------------------------------------------
 *
 * - **⚠️ Internal:**
 *    - Helper constant for **{@link getPreciseType | `getPreciseType`}**.
 *    - Don't use on your code base, this internal helper of **{@link getPreciseType | `getPreciseType`}** function.
 */
export const __internalAcronyms__ = Object.freeze([
  "URI",
  "URL",
  "HTTP",
  "HTTPS",
  "HTML",
  "XML",
  "CSS",
  "JS",
  "JSON",
  "SVG",
  "DOM",
  "UTC",
  "XHR",
  "RTC",
  "ICE",
  "TLS",
  "TCP",
  "UDP",
  "IDB",
  "ID"
]);

/** ----------------------------------------------------------
 * * ***Mapping of common JavaScript built-in and environment-specific
 * type names to canonical human-readable PascalCase strings.***
 * ----------------------------------------------------------
 * ***Keys are normalized for flexible matching, values are formatted names used as type descriptions.***
 * @description
 * Add or remove entries depending on your target environment.
 * - **⚠️ Internal:**
 *    - Helper constant for **{@link getPreciseType | `getPreciseType`}**.
 *    - Don't use on your code base, this internal helper of **{@link getPreciseType | `getPreciseType`}** function.
 */
export const FIXES_RAW = {
  // primitives
  string: "String",
  number: "Number",
  boolean: "Boolean",
  bigint: "Big Int",
  symbol: "Symbol",
  undefined: "Undefined",
  null: "Null",
  regexp: "Reg Exp",

  // reflect / proxy / atomics
  reflect: "Reflect",
  proxy: "Proxy",
  atomics: "Atomics",

  // core / objects
  object: "Object",
  array: "Array",
  arguments: "Arguments",
  function: "Function",

  // functions
  asyncfunction: "Async Function",
  generatorfunction: "Generator Function",
  asyncgeneratorfunction: "Async Generator Function",
  generator: "Generator",
  promise: "Promise",

  // errors
  evalerror: "Eval Error",
  rangeerror: "Range Error",
  referenceerror: "Reference Error",
  syntaxerror: "Syntax Error",
  typeerror: "Type Error",
  urierror: "URI Error",
  aggregateerror: "Aggregate Error",
  error: "Error",

  // typed arrays & binary
  int8array: "Int 8 Array",
  uint8array: "Uint 8 Array",
  uint8clampedarray: "Uint 8 Clamped Array",
  int16array: "Int 16 Array",
  uint16array: "Uint 16 Array",
  int32array: "Int 32 Array",
  uint32array: "Uint 32 Array",
  float32array: "Float 32 Array",
  float64array: "Float 64 Array",
  bigint64array: "Big Int 64 Array",
  biguint64array: "Big Uint 64 Array",
  arraybuffer: "Array Buffer",
  sharedarraybuffer: "Shared Array Buffer",
  dataview: "Data View",
  arraybufferview: "Array Buffer View",

  // collections
  map: "Map",
  set: "Set",
  weakmap: "Weak Map",
  weakset: "Weak Set",

  // iterators (note: toString tag can be "Map Iterator" etc.)
  mapiterator: "Map Iterator",
  setiterator: "Set Iterator",
  arrayiterator: "Array Iterator",
  stringiterator: "String Iterator",

  // streams / fetch / web
  readablestream: "Readable Stream",
  writablestream: "Writable Stream",
  transformstream: "Transform Stream",
  readablestreamdefaultreader: "Readable Stream Default Reader",
  writablestreamdefaultwriter: "Writable Stream Default Writer",
  readablestreamdefaultcontroller: "Readable Stream Default Controller",
  transformstreamdefaultcontroller: "Transform Stream Default Controller",
  abortcontroller: "Abort Controller",
  abortsignal: "Abort Signal",
  fetch: "fetch",
  request: "Request",
  response: "Response",
  headers: "Headers",
  formdata: "FormData",
  blob: "Blob",
  file: "File",
  filelist: "FileList",
  filereader: "FileReader",

  // intl
  intl: "Intl",
  collator: "Intl. Collator",
  datetimeformat: "Intl. Date Time Format",
  listformat: "Intl. List Format",
  numberformat: "Intl. Number Format",
  pluralrules: "Intl. Plural Rules",
  relativetimeformat: "Intl. Relative Time Format",
  segmenter: "Intl. Segmenter",
  locale: "Intl. Locale",
  displaynames: "Intl. Display Names",

  // es2021+
  finalizationregistry: "Finalization Registry",
  weakref: "Weak Ref",
  structuredclone: "structured Clone",
  urlpattern: "URL Pattern",

  // performance / observers
  performance: "Performance",
  performanceobserver: "Performance Observer",
  performanceentry: "Performance Entry",
  performancemark: "Performance Mark",
  performancemeasure: "Performance Measure",

  // webassembly
  webassembly: "Web Assembly",
  wasmmodule: "WebAssembly .Module",
  wasminstance: "WebAssembly. Instance",
  wasmmemory: "WebAssembly. Memory",
  wasmtable: "WebAssembly. Table",

  // node-ish / common hosts
  buffer: "Buffer",
  process: "Process",
  eventemitter: "Event Emitter",
  stream: "Stream",
  fs: "fs",
  path: "path",
  url: "URL",
  urlsearchparams: "URL Search Params",

  // DOM basics
  node: "Node",
  element: "Element",
  htmlelement: "HTML Element",
  svgelement: "SVG Element",
  document: "Document",
  documentfragment: "Document Fragment",
  shadowroot: "Shadow Root",
  nodelist: "Node List",
  htmlcollection: "HTML Collection",

  // observers / misc DOM
  mutationobserver: "Mutation Observer",
  intersectionobserver: "Intersection Observer",
  resizeobserver: "Resize Observer"
} as const;
