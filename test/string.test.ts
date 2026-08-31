import { expect, describe, it } from "vitest";
import { genString } from "../src";
import { genTestTitle } from "./_utils";

const genStringTests = [
  [`foo`, `"foo"`, `'foo'`],
  [`foo\nbar`, `"foo\\nbar"`, `'foo\\nbar'`],
  [`foo'bar`, `"foo'bar"`, `'foo\\'bar'`],
  [`foo"bar`, `"foo\\"bar"`, `'foo"bar'`],
  [`foo\\bar`, `"foo\\\\bar"`, `'foo\\\\bar'`],
  [`foo\tbar`, `"foo\\tbar"`, `'foo\\tbar'`],
  [`foo\\'bar`, `"foo\\\\'bar"`, `'foo\\\\\\'bar'`],
  [`foo\u2028bar`, `"foo\\u2028bar"`, `'foo\\u2028bar'`],
  [`foo\u2029bar`, `"foo\\u2029bar"`, `'foo\\u2029bar'`],
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

describe("genString (evaluates back to the input)", () => {
  for (const [input] of genStringTests) {
    it(genTestTitle(input), () => {
      const evaluate = (code: string) => new Function(`return ${code}`)();
      expect(evaluate(genString(input))).to.equal(input);
      expect(evaluate(genString(input, { singleQuotes: true }))).to.equal(
        input,
      );
    });
  }
});
