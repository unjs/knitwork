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

describe("genString (singleQoute)", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [input, _, output] of genStringTests) {
    it(genTestTitle(input), () => {
      expect(genString(input, { singleQuotes: true })).to.equal(output);
    });
  }
});
