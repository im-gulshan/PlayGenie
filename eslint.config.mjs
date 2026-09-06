// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ESLint's recommended rules
  js.configs.recommended,

  // typescript-eslint recommended rules
  ...tseslint.configs.recommended,

  // Custom rules for framework source files
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  // Global ignores (replaces .eslintignore and ignorePatterns)
  {
    ignores: [
      'dist/',
      'node_modules/',
      'reports/',
      'logs/',
      'scratch/',
      '.playwright-mcp/',
      'cucumber.js',
    ],
  },
);
