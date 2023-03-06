export interface CodegenOptions {
  singleQuotes?: boolean;
  // https://github.com/tc39/proposal-import-assertions
  // https://tc39.es/proposal-import-assertions/
  assert?: {
    type: string;
  };
}
