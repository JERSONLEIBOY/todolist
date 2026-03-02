/** @type {import('eslint').Linter.FlatConfig[]} */
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueTsConfig from '@vue/eslint-config-typescript'
import vuePrettierConfig from '@vue/eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      '.vscode',
      '*.log',
      'coverage',
      '.prettierrc.cjs',
      'tailwind.config.js',
      'postcss.config.js',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': ts,
      prettier: prettierPlugin,
    },
    rules: {
      ...vueTsConfig.rules,
      ...vuePrettierConfig.rules,
      'prettier/prettier': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
]
