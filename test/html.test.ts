import { expect, describe, it } from "vitest";
import { genElement } from "../src";
import { genTestTitle } from "./_utils";

const genElementTests = [
  {
    args: [],
    code: "<div></div>",
  },
  {
    args: ["foo"],
    code: "<foo></foo>",
  },
  {
    args: ["span", "hello world"],
    code: `<span>hello world</span>`,
  },
  {
    args: ["p", ["<span>foo</span>", "<span>bar</span>"]],
    code: `<p><span>foo</span><span>bar</span></p>`,
  },
  {
    args: ["div", { "data-theme": "dark" }],
    code: '<div data-theme="dark"></div>',
  },
  {
    args: ["div", { "data-theme": "dark" }, "hello world"],
    code: '<div data-theme="dark">hello world</div>',
  },
  {
    args: [
      "div",
      { "data-theme": "dark" },
      ["<span>foo</span>", "<span>bar</span>"],
    ],
    code: '<div data-theme="dark"><span>foo</span><span>bar</span></div>',
  },
  {
    args: ["br"],
    code: "<br />",
  },
  {
    args: ["img", { src: "test.png", alt: "Test" }],
    code: '<img src="test.png" alt="Test" />',
  },
  {
    args: ["button", { disabled: true }],
    code: "<button disabled></button>",
  },
  {
    args: ["input", { disabled: false, type: "text" }],
    code: '<input type="text"></input>',
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
