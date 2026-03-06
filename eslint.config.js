import { ESLint } from "eslint";

export default [
  {
    root: true,
    ignores: ["dist/"], // вместо .eslintignore
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    env: {
      es2021: true,
      node: true,
    },
    plugins: {
      "@typescript-eslint": ESLint.plugins["@typescript-eslint"],
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "htmlacademy/node"
    ],
  },
];
