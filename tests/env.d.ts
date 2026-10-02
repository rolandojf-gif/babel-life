/** The blueprint is read as data by the tests that hold the catalog to it. */
declare module '*.md?raw' {
  const content: string;
  export default content;
}

/** The no-JavaScript pages are read as data by the tests that keep them in step. */
declare module '*.html?raw' {
  const content: string;
  export default content;
}
