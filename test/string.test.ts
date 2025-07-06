import { expect, describe, it } from "vitest";
import { genString } from "../src";
import { genTestTitle } from "./_utils";

const genStringTests = [
  [`foo`, `"foo"`, `'foo'`],
  [`foo\nbar`, `"foo\\nbar"`, `'foo\\\\nbar'`],
  [`foo'bar`, `"foo'bar"`, `'foo\\'bar'`],
  [`foo"bar`, `"foo\\"bar"`, `'foo\\\\"bar'`],
];

describe("genString", () => {
  for (const [input, output] of genStringTests) {
    it(genTestTitle(input), () => {
      expect(genString(input)).to.equal(output);
    });
  }
});

describe("genString (singleQuotes: true)", () => {
  for (const [input, _, output] of genStringTests) {
    it(genTestTitle(input), () => {
      expect(genString(input, { singleQuotes: true })).to.equal(output);
    });
  }
});

// Tests for extension option
const genStringExtensionTests = [
  [`foo`, `ts`, `"foo.ts"`, `'foo.ts'`],
  [`bar`, `json`, `"bar.json"`, `'bar.json'`],
  [`baz`, `json5`, `"baz.json5"`, `'baz.json5'`],
];

describe("genString (with extension)", () => {
  for (const [input, extension, output] of genStringExtensionTests) {
    it(genTestTitle(`${input} with extension ${extension}`), () => {
      expect(genString(input, { extension })).to.equal(output);
    });
  }
});

describe("genString (singleQuotes: true with extension)", () => {
  for (const [input, extension, _, output] of genStringExtensionTests) {
    it(genTestTitle(`${input} with extension ${extension}`), () => {
      expect(genString(input, { singleQuotes: true, extension })).to.equal(
        output,
      );
    });
  }
});
