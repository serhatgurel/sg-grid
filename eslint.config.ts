import { globalIgnores } from 'eslint/config'
import pluginVitest from '@vitest/eslint-plugin'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ...globalIgnores(['**/dist/**', '**/coverage/**']),
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginVitest.configs.recommended,
]
