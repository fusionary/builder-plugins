import { fileURLToPath } from 'url'

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-sort-json',
    'prettier-plugin-tailwindcss',
  ],
  tailwindConfig: fileURLToPath(
    new URL('../../tooling/tailwind/src/tailwind.ts', import.meta.url),
  ),
  tailwindFunctions: ['cn', 'clsx', 'cva', 'tw', 'twMerge', 'classNames'],
  jsonRecursiveSort: true,
  importOrder: [
    '<TYPES>',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@local',
    '^@local/(.*)$',
    '',
    '<TYPES>^[.|..|~]',
    '^~/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.5.3',
}

export default config
