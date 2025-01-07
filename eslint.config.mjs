import globals from "globals";
import pluginJs from "@eslint/js";
import js from "@eslint/js";
import jasmine from "eslint-plugin-jasmine";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    ...js.configs.recommended,
    ...pluginJs.configs.recommended,
  },
  { languageOptions: { globals: { ...globals.node } } },
  {
    files: ["**/*.spec.js", "**/*.test.js"],
    plugins: { jasmine: jasmine },
    languageOptions: { globals: { ...globals.jasmine } },
    rules: {
      ...jasmine.configs.recommended.rules,
    },
  },
];
