module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json", ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "react", "jsx-a11y", "import", "unused-imports"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".ts", ".tsx", ".json"],
      },
    },
  },
  rules: {
    "react/jsx-key": ["warn"],
    "unused-imports/no-unused-imports": ["warn"],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ["*.js", "*.cjs", "*.mjs"],
      parserOptions: { project: null },
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
    {
      files: ["next-env.d.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
    {
      files: ["vitest.config.ts", "vitest.setup.ts"],
      rules: {
        "import/no-unresolved": "off",
      },
    },
  ],
};
