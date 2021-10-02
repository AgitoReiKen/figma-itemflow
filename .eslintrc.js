module.exports = {
  env: {

    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'never'],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'default-case': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off',
    'no-console': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
  },
};
