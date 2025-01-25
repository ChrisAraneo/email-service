/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

const eslint = require('@eslint/js');
const eslintPluginJsonc = require('eslint-plugin-jsonc');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'jsonc/no-comments': 'error',
      'jsonc/sort-keys': 'error',
    },
  },
  {
    ignores: [
      '.git',
      '.stryker-tmp',
      'dist',
      'node_modules',
      'reports',
      'coverage',
      'package.json',
      'package-lock.json',
    ],
  },
);
