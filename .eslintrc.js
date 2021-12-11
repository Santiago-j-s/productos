// eslint-disable-next-line no-undef
module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "17",
    },
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/no-unescaped-entities": "off",
  },
};
