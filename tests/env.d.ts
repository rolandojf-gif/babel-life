/** The blueprint is read as data by the tests that hold the catalog to it. */
declare module '*.md?raw' {
  const content: string;
  export default content;
}
