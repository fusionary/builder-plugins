/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'turbo',
    'eslint:recommended',
    'plugin:storybook/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:perfectionist/recommended-natural-legacy',
    'plugin:@shopify/esnext',
    'plugin:@shopify/typescript',
    'plugin:@shopify/typescript-type-checking',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@shopify/prettier',
  ],
  ignorePatterns: [
    '**/*.config.js',
    '**/*.config.cjs',
    '**/.eslintrc.cjs',
    '.next',
    'dist',
    'pnpm-lock.yaml',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: true },
  plugins: [
    '@typescript-eslint',
    'import',
    'perfectionist',
    'unused-imports',
    'prettier',
  ],
  reportUnusedDisableDirectives: true,
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
    ],
    '@typescript-eslint/no-empty-function': ['warn'],
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-misused-promises': [
      2,
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { classes: false, functions: false },
    ],

    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/first': ['error'],
    'import/newline-after-import': ['error'],
    'import/no-duplicates': ['error'],
    'import/no-extraneous-dependencies': ['off'],
    'import/order': ['off'],
    'import/prefer-default-export': ['off'],

    'no-console': ['warn'],

    'perfectionist/sort-enums': ['off'],
    'perfectionist/sort-imports': ['off'],

    'tailwindcss/classnames-order': ['off'],
    'tailwindcss/no-custom-classname': ['off'],

    'unused-imports/no-unused-imports-ts': ['error'],
  },
}

module.exports = config
