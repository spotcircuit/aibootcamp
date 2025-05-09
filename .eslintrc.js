module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'off'
  }
}
