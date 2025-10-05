import { expect, describe, it } from "vitest";
import { genPropertyAccess } from "../src";
import { genTestTitle } from "./_utils";

const genPropertyAccessTests = [
  [`foo`, `.foo`],
  [`fooBar`, `.fooBar`],
  [`foo_bar`, `.foo_bar`],
  [`foo-bar`, `["foo-bar"]`],
];

describe("genPropertyAccess", () => {
  for (const [input, output] of genPropertyAccessTests) {
    it(genTestTitle(input), () => {
      expect(genPropertyAccess(input)).to.equal(output);
    });
  }
});
