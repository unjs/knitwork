import unjs from "eslint-config-unjs";

// https://github.com/unjs/eslint-config
export default unjs({
  ignores: [],
  rules: {
    "unicorn/prefer-string-raw": "off",
  },
});
