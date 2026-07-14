// eslint.config.mjs
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import eslintComments from 'eslint-plugin-eslint-comments'; // 👈 import du plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'],
  },

  // Config de base d’ESLint
  js.configs.recommended,

  // Config héritée Next + TS via FlatCompat
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('plugin:eslint-comments/recommended'),

  // 👉 bloc custom en flat-config
  {
    plugins: {
      'eslint-comments': eslintComments,   // 👈 objet au lieu d’un array
    },
    rules: {
      'eslint-comments/no-unused-disable': 'error',
      'no-warning-comments': [
        'warn',
        { terms: ['TODO', 'FIXME'], location: 'start' },
      ],
    },
  },
];

export default eslintConfig;
