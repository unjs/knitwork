import { expect, describe, it } from "vitest";
import { genElement } from "../src/html";
import { genTestTitle } from "./_utils";

const genElementTests = [
  {
    args: [],
    code: '<div></div>',
  },
  {
    args: ["foo"],
    code: '<foo></foo>',
  },
  {
    args: ["span", "hello world"],
    code: `<span>hello world</span>`,
  },
  {
    args: ["p", ["<span>foo</span>","<span>bar</span>"]],
    code: `<p><span>foo</span><span>bar</span></p>`,
  },
  {
    args: ["div", {"data-theme": "dark"}],
    code: '<div data-theme="dark"></div>',
  },
  {
    args: ["div", {"data-theme": "dark"}, "hello world"],
    code: '<div data-theme="dark">hello world</div>',
  },
  {
    args: ["div", {"data-theme": "dark"}, ["<span>foo</span>","<span>bar</span>"]],
    code: '<div data-theme="dark"><span>foo</span><span>bar</span></div>',
  },
];

describe("genElement", () => {
  for (const t of genElementTests) {
    it(genTestTitle(t.code), () => {
      // @ts-expect-error args property is not strongly typed
      const code = genElement(...t.args);
      expect(code).to.equal(t.code);
    });
  }
});
