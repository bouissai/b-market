import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
eslintConfig.push(
  ...compat.extends('eslint:recommended', 'plugin:eslint-comments/recommended'),
);

eslintConfig.push({
  plugins: ['eslint-comments'],
  rules: {
    'eslint-comments/no-unused-disable': 'error',
    'no-warning-comments': [
      'warn',
      { terms: ['TODO', 'FIXME'], location: 'start' },
    ],
  },
});
