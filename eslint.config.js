import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const codeStyleRules = {
  'func-style': ['error', 'expression'],
  'no-else-return': ['error', { allowElseIf: false }],
  'no-nested-ternary': 'error',
  'max-depth': ['error', 2],
  'max-params': ['error', 3],
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...codeStyleRules,
      // The package is not compiled with the React Compiler, and TanStack
      // Table's instance can never be memoized: the note is noise here.
      'react-hooks/incompatible-library': 'off',
    },
  },
  {
    files: [
      'src/components/table/**/*.{ts,tsx}',
      'src/components/shared/*.ts',
      'src/components/shared/toolbar/toolbar-props.ts',
    ],
    rules: {
      'max-lines-per-function': [
        'error',
        { max: 20, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: codeStyleRules,
  },
])
